(function () {
  "use strict";

  const MANIFEST_URL = "deployment-manifest.json";
  const UNAVAILABLE = "Data temporarily unavailable";
  const RPC_ENDPOINTS = [
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://rpc.sepolia.org"
  ];

  const SELECTORS = {
    totalSupply: "0x18160ddd",
    paused: "0x5c975abb",
    owner: "0x8da5cb5b",
    balanceOf: "0x70a08231",
    reportsCount: "0x3e0c27f0",
    safeThreshold: "0xe75235b8"
  };

  const dashboard = {
    status: document.querySelector("[data-dashboard-status]"),
    fields: Object.fromEntries(
      Array.from(document.querySelectorAll("[data-dashboard-field]")).map((node) => [
        node.dataset.dashboardField,
        node
      ])
    )
  };

  function setText(node, value, className) {
    if (!node) return;
    node.classList.remove("is-address", "is-small", "is-unavailable");
    if (className) node.classList.add(className);
    node.textContent = value;
  }

  function setStatus(message, isError) {
    if (!dashboard.status) return;
    dashboard.status.textContent = message;
    dashboard.status.classList.toggle("is-error", Boolean(isError));
  }

  function setUnavailable(field) {
    setText(dashboard.fields[field], UNAVAILABLE, "is-unavailable");
  }

  function shortNetwork(network, chainId) {
    if (!network && !chainId) return UNAVAILABLE;
    return `${network || "unknown"} · chain ${chainId || "unknown"}`;
  }

  function normalizeAuditStatus(auditStatus) {
    if (!auditStatus) return "Independent audit not started";
    const independent = auditStatus.independentAudit || "not-started";
    const internal = auditStatus.internalReview || "unknown";
    return `Internal review ${internal}; independent audit ${independent}`;
  }

  function latestReportLabel(reports) {
    if (!Array.isArray(reports) || reports.length === 0) return "No published reports in manifest";
    const latest = reports[reports.length - 1];
    const date = latest.publishedAt ? latest.publishedAt.slice(0, 10) : "date unavailable";
    return `#${latest.reportId} · ${date} · ${latest.category}`;
  }

  function setManifestFields(manifest) {
    const token = manifest.contracts && manifest.contracts.token;
    const vault = manifest.contracts && manifest.contracts.vestingVault;
    const ownership = manifest.ownership || {};
    const reports = manifest.publishedReports || [];
    const latest = reports[reports.length - 1];

    setText(dashboard.fields.network, shortNetwork(manifest.network, manifest.chainId));
    setText(dashboard.fields.tokenAddress, token && token.address ? token.address : UNAVAILABLE, "is-address");
    setText(dashboard.fields.vestingAddress, vault && vault.address ? vault.address : UNAVAILABLE, "is-address");
    setText(dashboard.fields.safeThreshold, ownership.safeThreshold || UNAVAILABLE);
    setText(dashboard.fields.latestReport, latestReportLabel(manifest.publishedReports), "is-small");
    setText(dashboard.fields.auditStatus, normalizeAuditStatus(manifest.auditStatus), "is-small");

    document.querySelectorAll("[data-manifest-field='network']").forEach((node) => {
      node.textContent = manifest.network === "sepolia" ? "Ethereum Sepolia" : shortNetwork(manifest.network, manifest.chainId);
    });
    document.querySelectorAll("[data-manifest-field='version'], [data-record-field='version']").forEach((node) => {
      node.textContent = manifest.contractVersion || "v1 legacy prototype";
    });
    document.querySelectorAll("[data-manifest-field='tokenAddress']").forEach((node) => {
      if (token && token.address) node.textContent = token.address;
    });
    document.querySelectorAll("[data-manifest-field='vestingAddress']").forEach((node) => {
      if (vault && vault.address) node.textContent = vault.address;
    });
    document.querySelectorAll("[data-record-field='network']").forEach((node) => {
      node.textContent = shortNetwork(manifest.network, manifest.chainId);
    });
    document.querySelectorAll("[data-record-field='auditStatus']").forEach((node) => {
      node.textContent = normalizeAuditStatus(manifest.auditStatus);
    });
    document.querySelectorAll("[data-record-field='latestReportDate']").forEach((node) => {
      node.textContent = latest && latest.publishedAt ? latest.publishedAt.slice(0, 10) : "No report date";
    });

    document.querySelectorAll("[data-manifest-link='tokenVerification']").forEach((node) => {
      if (token && token.verification) node.href = token.verification;
    });
    document.querySelectorAll("[data-manifest-link='vaultVerification']").forEach((node) => {
      if (vault && vault.verification) node.href = vault.verification;
    });
    document.querySelectorAll("[data-manifest-link='latestReportTx']").forEach((node) => {
      if (latest && latest.transaction) node.href = `https://sepolia.etherscan.io/tx/${latest.transaction}`;
    });
  }

  function encodeAddress(address) {
    return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  }

  function decodeUint(hex) {
    if (!hex || hex === "0x") throw new Error("Empty RPC result");
    return BigInt(hex);
  }

  function decodeBool(hex) {
    return decodeUint(hex) !== 0n;
  }

  function decodeAddress(hex) {
    if (!hex || hex.length < 66) throw new Error("Invalid address result");
    return `0x${hex.slice(-40)}`;
  }

  function formatTokenAmount(value) {
    const decimals = 18n;
    const base = 10n ** decimals;
    const whole = value / base;
    const fraction = value % base;
    const fractionText = fraction === 0n ? "" : `.${fraction.toString().padStart(Number(decimals), "0").slice(0, 4).replace(/0+$/, "")}`;
    return `${whole.toLocaleString("en-US")}${fractionText} TIDE`;
  }

  async function rpcCall(endpoint, to, data) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "eth_call",
        params: [{ to, data }, "latest"]
      })
    });
    if (!response.ok) throw new Error("RPC HTTP error");
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error.message || "RPC error");
    return payload.result;
  }

  async function withRpc(to, data) {
    let lastError;
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        return await rpcCall(endpoint, to, data);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("RPC unavailable");
  }

  async function loadOnChainData(manifest) {
    const token = manifest.contracts.token.address;
    const vault = manifest.contracts.vestingVault.address;
    const treasury = manifest.treasury.address;
    const safe = manifest.ownership.ownerSafe;

    const [
      totalSupply,
      paused,
      owner,
      treasuryBalance,
      vaultBalance,
      reportsCount,
      safeThreshold
    ] = await Promise.all([
      withRpc(token, SELECTORS.totalSupply).then(decodeUint),
      withRpc(token, SELECTORS.paused).then(decodeBool),
      withRpc(token, SELECTORS.owner).then(decodeAddress),
      withRpc(token, SELECTORS.balanceOf + encodeAddress(treasury)).then(decodeUint),
      withRpc(token, SELECTORS.balanceOf + encodeAddress(vault)).then(decodeUint),
      withRpc(token, SELECTORS.reportsCount).then(decodeUint),
      withRpc(safe, SELECTORS.safeThreshold).then(decodeUint).catch(() => null)
    ]);

    setText(dashboard.fields.totalSupply, formatTokenAmount(totalSupply));
    setText(dashboard.fields.paused, paused ? "Paused" : "Not paused");
    setText(dashboard.fields.owner, owner, "is-address");
    setText(dashboard.fields.treasuryBalance, formatTokenAmount(treasuryBalance));
    setText(dashboard.fields.vaultBalance, formatTokenAmount(vaultBalance));
    setText(dashboard.fields.reportsCount, reportsCount.toString());

    if (safeThreshold !== null) {
      const manifestThreshold = manifest.ownership.safeThreshold || "";
      setText(dashboard.fields.safeThreshold, manifestThreshold ? `${safeThreshold.toString()} signatures (${manifestThreshold})` : `${safeThreshold.toString()} signatures`);
    }
  }

  async function loadDashboard() {
    try {
      const response = await fetch(MANIFEST_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Manifest unavailable");
      const manifest = await response.json();
      setManifestFields(manifest);
      try {
        await loadOnChainData(manifest);
        setStatus("Public Sepolia data loaded. No wallet connection used.", false);
      } catch (error) {
        ["totalSupply", "paused", "owner", "treasuryBalance", "vaultBalance", "reportsCount"].forEach(setUnavailable);
        setStatus(UNAVAILABLE, true);
      }
    } catch (error) {
      Object.keys(dashboard.fields).forEach(setUnavailable);
      setStatus(UNAVAILABLE, true);
    }
  }

  function setupMenu() {
    const button = document.querySelector(".menu-toggle");
    const nav = document.getElementById("site-nav");
    if (!button || !nav) return;

    function setOpen(open) {
      button.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    }

    button.addEventListener("click", () => {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  setupMenu();
  loadDashboard();
})();

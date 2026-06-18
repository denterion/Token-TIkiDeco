(function () {
  "use strict";

  const MANIFEST_URL = "/deployment-manifest.json";
  const EXPECTED_CHAIN_ID = "0xaa36a7";
  const UNAVAILABLE = "Data temporarily unavailable";
  const CACHE_KEY = "tikideco.dashboard.cache.v1";
  const STALE_AFTER_MS = 30 * 60 * 1000;
  const RPC_ENDPOINTS = [
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://rpc.sepolia.org"
  ];
  const RPC_ALLOWLIST = new Set(RPC_ENDPOINTS);

  const SELECTORS = {
    totalSupply: "0x18160ddd",
    paused: "0x5c975abb",
    owner: "0x8da5cb5b",
    balanceOf: "0x70a08231",
    reportsCount: "0x3e0c27f0",
    safeThreshold: "0xe75235b8"
  };

  const REQUIRED_ABI_FUNCTIONS = {
    token: ["totalSupply", "paused", "owner", "balanceOf", "reportsCount"],
    safe: ["getThreshold"]
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

  function setStatus(label, message, tone) {
    if (!dashboard.status) return;
    dashboard.status.classList.remove("is-live", "is-cached", "is-stale", "is-error");
    if (tone) dashboard.status.classList.add(tone);
    dashboard.status.textContent = `${label}: ${message}`;
  }

  function setUnavailable(field) {
    setText(dashboard.fields[field], UNAVAILABLE, "is-unavailable");
  }

  function shortNetwork(network, chainId) {
    if (!network && !chainId) return UNAVAILABLE;
    return `${network || "unknown"} - chain ${chainId || "unknown"}`;
  }

  function normalizeAuditStatus(auditStatus) {
    if (!auditStatus) return "Internal review in progress; independent audit not started";
    const independent = auditStatus.independentAudit || "not-started";
    const internal = auditStatus.internalReview || "unknown";
    return `Internal review ${internal}; independent audit ${independent}`;
  }

  function latestReportLabel(reports) {
    if (!Array.isArray(reports) || reports.length === 0) return "No published reports in manifest";
    const latest = reports[reports.length - 1];
    const date = latest.publishedAt ? latest.publishedAt.slice(0, 10) : "date unavailable";
    return `#${latest.reportId} - ${date} - ${latest.category}`;
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
    setText(dashboard.fields.latestReport, latestReportLabel(reports), "is-small");
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

  function loadCache() {
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      const cached = raw ? JSON.parse(raw) : null;
      if (!cached || !cached.data) return null;
      for (const [key, value] of Object.entries(cached.data)) {
        if (typeof value === "string" && /^\d+$/.test(value) && key !== "chainId") {
          cached.data[key] = BigInt(value);
        }
      }
      return cached;
    } catch (error) {
      return null;
    }
  }

  function saveCache(data) {
    try {
      const serializable = {};
      for (const [key, value] of Object.entries(data)) {
        serializable[key] = typeof value === "bigint" ? value.toString() : value;
      }
      window.localStorage.setItem(CACHE_KEY, JSON.stringify({
        savedAt: new Date().toISOString(),
        data: serializable
      }));
    } catch (error) {
      // Local storage can be unavailable in privacy modes. The dashboard remains read-only.
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load ${url}`);
    return response.json();
  }

  function validateAbi(abi, requiredNames) {
    const names = new Set(abi.filter((entry) => entry.type === "function").map((entry) => entry.name));
    for (const name of requiredNames) {
      if (!names.has(name)) throw new Error(`ABI missing ${name}`);
    }
  }

  async function loadVersionedArtifacts() {
    const [tokenAbi, safeAbi] = await Promise.all([
      fetchJson("/artifacts/v1/TikiDecoToken/abi.json"),
      fetchJson("/artifacts/v1/Safe/abi.json")
    ]);
    validateAbi(tokenAbi, REQUIRED_ABI_FUNCTIONS.token);
    validateAbi(safeAbi, REQUIRED_ABI_FUNCTIONS.safe);
  }

  async function rpcRequest(endpoint, method, params) {
    if (!RPC_ALLOWLIST.has(endpoint)) throw new Error("RPC endpoint is not allowlisted");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params
      })
    });
    if (!response.ok) throw new Error("RPC HTTP error");
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error.message || "RPC error");
    return payload.result;
  }

  async function withRpc(method, params) {
    let lastError;
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        return await rpcRequest(endpoint, method, params);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("RPC unavailable");
  }

  function ethCall(to, data) {
    return withRpc("eth_call", [{ to, data }, "latest"]);
  }

  async function readOnChainData(manifest) {
    await loadVersionedArtifacts();
    const chainId = await withRpc("eth_chainId", []);
    if (chainId !== EXPECTED_CHAIN_ID || Number.parseInt(chainId, 16) !== manifest.chainId) {
      throw new Error("Unexpected RPC chain ID");
    }

    const token = manifest.contracts.token.address;
    const vault = manifest.contracts.vestingVault.address;
    const treasury = manifest.treasury.address;
    const safe = manifest.ownership.ownerSafe;

    const reads = {
      totalSupply: ethCall(token, SELECTORS.totalSupply).then(decodeUint),
      paused: ethCall(token, SELECTORS.paused).then(decodeBool),
      owner: ethCall(token, SELECTORS.owner).then(decodeAddress),
      treasuryBalance: ethCall(token, SELECTORS.balanceOf + encodeAddress(treasury)).then(decodeUint),
      vaultBalance: ethCall(token, SELECTORS.balanceOf + encodeAddress(vault)).then(decodeUint),
      reportsCount: ethCall(token, SELECTORS.reportsCount).then(decodeUint),
      safeThreshold: ethCall(safe, SELECTORS.safeThreshold).then(decodeUint)
    };

    const entries = Object.entries(reads);
    const settled = await Promise.allSettled(entries.map(([, promise]) => promise));
    const data = { chainId };
    entries.forEach(([key], index) => {
      if (settled[index].status === "fulfilled") data[key] = settled[index].value;
    });
    return data;
  }

  function applyOnChainData(data, manifest) {
    if (data.totalSupply !== undefined) setText(dashboard.fields.totalSupply, formatTokenAmount(BigInt(data.totalSupply)));
    else setUnavailable("totalSupply");

    if (data.paused !== undefined) setText(dashboard.fields.paused, data.paused ? "Paused" : "Not paused");
    else setUnavailable("paused");

    if (data.owner) setText(dashboard.fields.owner, data.owner, "is-address");
    else setUnavailable("owner");

    if (data.treasuryBalance !== undefined) setText(dashboard.fields.treasuryBalance, formatTokenAmount(BigInt(data.treasuryBalance)));
    else setUnavailable("treasuryBalance");

    if (data.vaultBalance !== undefined) setText(dashboard.fields.vaultBalance, formatTokenAmount(BigInt(data.vaultBalance)));
    else setUnavailable("vaultBalance");

    if (data.reportsCount !== undefined) setText(dashboard.fields.reportsCount, data.reportsCount.toString());
    else setUnavailable("reportsCount");

    if (data.safeThreshold !== undefined) {
      const manifestThreshold = manifest.ownership.safeThreshold || "";
      setText(dashboard.fields.safeThreshold, manifestThreshold ? `${data.safeThreshold.toString()} signatures (${manifestThreshold})` : `${data.safeThreshold.toString()} signatures`);
    }
  }

  async function loadDashboard() {
    if (!dashboard.status) return;
    let manifest;
    try {
      manifest = await fetchJson(MANIFEST_URL);
      setManifestFields(manifest);
    } catch (error) {
      Object.keys(dashboard.fields).forEach(setUnavailable);
      setStatus("Unavailable", `${UNAVAILABLE}. Static manifest could not be loaded.`, "is-error");
      return;
    }

    try {
      const data = await readOnChainData(manifest);
      applyOnChainData(data, manifest);
      const timestamp = new Date().toISOString();
      saveCache(data);
      setStatus("Live", `Sepolia RPC data loaded at ${timestamp}. No wallet connection used.`, "is-live");
    } catch (error) {
      const cached = loadCache();
      if (cached && cached.data) {
        applyOnChainData(cached.data, manifest);
        const age = Date.now() - Date.parse(cached.savedAt);
        const label = age > STALE_AFTER_MS ? "Stale" : "Cached";
        const tone = age > STALE_AFTER_MS ? "is-stale" : "is-cached";
        setStatus(label, `last successful RPC read ${cached.savedAt}. Live RPC is unavailable.`, tone);
      } else {
        ["totalSupply", "paused", "owner", "treasuryBalance", "vaultBalance", "reportsCount"].forEach(setUnavailable);
        setStatus("Unavailable", `${UNAVAILABLE}. Showing only static manifest fields.`, "is-error");
      }
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

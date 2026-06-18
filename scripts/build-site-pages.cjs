const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));
const headCommit = manifest.sourceCommit;
const lastUpdated = manifest.publishedReports?.[0]?.publishedAt || manifest.ownership.ownershipTransferredAt;

const baseUrl = "https://tikideco.xyz";
const pages = [
  {
    path: "audit/index.html",
    title: "Audit Status",
    description: "Internal review status, canonical V1 versus candidate V2 scope, compiler settings, known issues, and verification artifacts for TikiDeco.",
    eyebrow: "Internal review",
    heading: "Audit status and review scope",
    intro: "TikiDeco is not independently audited. This page separates the historical Sepolia V1 deployment from the non-canonical V2 candidate review target.",
    sections: [
      ["Status", [
        ["Internal review", manifest.auditStatus.internalReview],
        ["Independent audit", manifest.auditStatus.independentAudit],
        ["Canonical V1 source commit", headCommit],
        ["Last updated", lastUpdated]
      ]],
      ["Canonical V1 Versus Candidate V2", [
        ["Canonical V1", `${manifest.contracts.token.name} and ${manifest.contracts.vestingVault.name} on Ethereum Sepolia`],
        ["Candidate V2", "TikiDecoTokenV2.sol and TikiDecoVestingVaultV2.sol are non-canonical audit-target candidates"],
        ["Promotion status", "No V2 promotion is recorded in deployments/canonical.json"]
      ]],
      ["In-Scope Contracts", [
        ["V1 token", manifest.contracts.token.source],
        ["V1 vesting vault", manifest.contracts.vestingVault.source],
        ["V2 candidate token", "contracts/TikiDecoTokenV2.sol"],
        ["V2 candidate vesting vault", "contracts/TikiDecoVestingVaultV2.sol"]
      ]],
      ["Compiler And Analysis", [
        ["Compiler", `${manifest.compiler.version}, ${manifest.compiler.evmTarget}, optimizer runs ${manifest.compiler.optimizer.runs}`],
        ["Test status", "Hardhat suite and Foundry secondary invariant suite are CI gates"],
        ["Coverage status", "Hardhat coverage is the primary gate; Foundry V2 line, function, and branch thresholds are configured for the secondary invariant suite"],
        ["Static analysis", "Slither V1 informational scan and blocking V2 baseline comparison are configured"]
      ]],
      ["Known Issues And Governance", [
        ["Known issues", "See KNOWN_ISSUES.md and security/slither-baseline-v2.json"],
        ["Owner Safe", manifest.ownership.ownerSafe],
        ["Safe threshold", manifest.ownership.safeThreshold],
        ["Treasury", manifest.treasury.address]
      ]]
    ],
    links: [
      ["ABI artifacts", "/artifacts/v1/TikiDecoToken/abi.json"],
      ["Token bytecode", "/artifacts/v1/TikiDecoToken/deployed-bytecode.txt"],
      ["Vault bytecode", "/artifacts/v1/TikiDecoVestingVault/deployed-bytecode.txt"],
      ["Deployment manifest", "/deployment-manifest.json"],
      ["Reports", "/#reports"],
      ["Known issues", "https://github.com/denterion/Token-TIkiDeco/blob/main/KNOWN_ISSUES.md"]
    ],
    disclaimer: "Audit-status disclaimer: this is an internal review page only. TikiDeco has not completed an independent smart-contract audit."
  },
  {
    path: "verify/index.html",
    title: "Verify",
    description: "Reproducible commands for verifying TikiDeco Sepolia network, contracts, bytecode, supply, roles, treasury, Safe threshold, and report hashes.",
    eyebrow: "Reproducible verification",
    heading: "Verify the prototype without connecting a wallet",
    intro: "These commands use public repository files and read-only RPC/Etherscan checks. They do not sign transactions.",
    sections: [
      ["Network And Addresses", [
        ["Network", `${manifest.network}, chain ID ${manifest.chainId}`],
        ["Token", manifest.contracts.token.address],
        ["Vesting vault", manifest.contracts.vestingVault.address],
        ["Treasury", manifest.treasury.address],
        ["Owner Safe", manifest.ownership.ownerSafe]
      ]],
      ["Commands", [
        ["Manifest", "npm run manifest:check && npm run manifest:source"],
        ["Bytecode", "npm run compile && npm run bytecode:size"],
        ["Tests", "npm test"],
        ["Foundry", "npm run foundry:test"],
        ["Slither", "npm run slither:baseline after generating Slither JSON"]
      ]],
      ["What To Verify", [
        ["Deployed bytecode", "Compare Etherscan deployed bytecode with site/artifacts/v1/*/deployed-bytecode.txt"],
        ["Total supply", "Read totalSupply() and compare with MAX_SUPPLY"],
        ["Owner or roles", "V1 owner should match the Safe; V2 candidate roles are documented but non-canonical"],
        ["Safe threshold", "Read getThreshold() from the Safe address"],
        ["Report hashes", "Compare documentHash values in deployment-manifest.json and report markdown hash files"]
      ]]
    ],
    links: [
      ["Token verified source", manifest.contracts.token.verification],
      ["Vault verified source", manifest.contracts.vestingVault.verification],
      ["Manifest", "/deployment-manifest.json"],
      ["Security CI", "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY_CI.md"]
    ],
    disclaimer: "Verification disclaimer: this page provides read-only checks and does not certify economic value, sale availability, or independent audit completion."
  },
  {
    path: "status/index.html",
    title: "Project Status",
    description: "Current project status for TikiDeco Sepolia prototype, including network, contract version, audit status, and limitations.",
    eyebrow: "Status",
    heading: "Current status is testnet prototype",
    intro: "This page summarizes what is current, what is planned, and what remains conceptual.",
    sections: [
      ["Current", [
        ["Network", "Ethereum Sepolia"],
        ["Canonical version", manifest.contractVersion],
        ["Mainnet", "Not deployed"],
        ["Sale", "No token sale"],
        ["Monetary value", "No stated monetary value"]
      ]],
      ["Planned", [
        ["V2", "Candidate review and testing before any promotion"],
        ["Security", "Further Slither triage, Foundry invariants, and independent review planning"],
        ["Utility", "Hospitality loyalty/access research only"]
      ]],
      ["Conceptual", [
        ["Hospitality concept", "Not a completed property"],
        ["Benefits", "No active guest benefits are represented by this prototype"]
      ]]
    ],
    links: [["Risk disclosure", "/legal/risk-disclosure/"], ["Project status legal note", "/legal/project-status/"]],
    disclaimer: "Audit-status disclaimer: status information is project-maintained and not an independent audit report."
  },
  {
    path: "legal/no-offer/index.html",
    title: "No Offer",
    description: "No-offer notice for TikiDeco TIDE Sepolia prototype.",
    eyebrow: "Legal notice",
    heading: "No offer, no sale, no monetary value",
    intro: "TIDE is a Sepolia testnet prototype, is not deployed on mainnet, and is not offered for sale.",
    sections: [
      ["Notice", [
        ["No sale", "The project does not provide sale or transaction-signing flows."],
        ["No value statement", "TIDE has no stated monetary value."],
        ["Mainnet status", "TIDE is not deployed on mainnet."],
        ["No financial rights", "The prototype does not represent hotel ownership, revenue rights, or financial upside."]
      ]]
    ],
    links: [["Risk disclosure", "/legal/risk-disclosure/"]],
    disclaimer: "This notice is project communication, not legal advice."
  },
  {
    path: "legal/terms/index.html",
    title: "Terms",
    description: "Static website terms for the TikiDeco Sepolia prototype.",
    eyebrow: "Legal",
    heading: "Website terms",
    intro: "This static website provides project documentation and read-only public data.",
    sections: [
      ["Terms", [
        ["Read-only site", "The site does not connect wallets, sign transactions, provide sale flows, or execute contract calls."],
        ["Information", "Content may change as the prototype evolves."],
        ["No warranty", "Materials are provided for review and research without operational guarantees."]
      ]]
    ],
    links: [["Privacy", "/legal/privacy/"], ["No offer", "/legal/no-offer/"]],
    disclaimer: "These terms are a project-maintained draft and should be reviewed by counsel before public launch."
  },
  {
    path: "legal/privacy/index.html",
    title: "Privacy",
    description: "Privacy notice for the TikiDeco static website.",
    eyebrow: "Legal",
    heading: "Privacy notice",
    intro: "The static site is designed to avoid wallet collection and transaction flows.",
    sections: [
      ["Data", [
        ["Wallets", "The site does not request wallet connection."],
        ["RPC", "The dashboard performs read-only RPC calls to allowlisted public Sepolia endpoints."],
        ["Local cache", "The browser may store the last successful dashboard read timestamp and values for fallback display."]
      ]]
    ],
    links: [["Terms", "/legal/terms/"]],
    disclaimer: "This privacy notice is limited to the static site and should be reviewed before broader product use."
  },
  {
    path: "legal/risk-disclosure/index.html",
    title: "Risk Disclosure",
    description: "Risk disclosure for the TikiDeco Sepolia prototype.",
    eyebrow: "Legal",
    heading: "Prototype risk disclosure",
    intro: "TikiDeco is experimental, testnet-only, and not independently audited.",
    sections: [
      ["Risks", [
        ["Testnet", "Sepolia contracts and testnet tokens are experimental artifacts."],
        ["Security", "Internal review and automated checks do not replace an independent audit."],
        ["Operations", "Future hospitality concepts, if any, require separate legal, operational, and technical review."],
        ["Clickjacking", "A meta CSP tag is not a substitute for an HTTP Content-Security-Policy frame-ancestors header. A compatible hosting layer should provide HTTP CSP headers."]
      ]]
    ],
    links: [["Audit status", "/audit/"], ["Security policy", "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY.md"]],
    disclaimer: "Risk disclosure is informational and not a regulatory compliance statement."
  },
  {
    path: "legal/project-status/index.html",
    title: "Project Status Notice",
    description: "Project status notice distinguishing current, planned and conceptual TikiDeco work.",
    eyebrow: "Legal",
    heading: "Project status boundaries",
    intro: "This page separates current implementation from planned or conceptual work.",
    sections: [
      ["Current", [
        ["Current contracts", "Canonical Sepolia V1 legacy contracts listed in deployment-manifest.json."],
        ["Current reports", "Report hashes and links are public records."],
        ["Current governance", "Sepolia owner control is documented through Safe ownership."]
      ]],
      ["Not Current", [
        ["V2", "Candidate code only until separately reviewed and promoted."],
        ["Property", "Concept imagery is not a completed property."],
        ["Benefits", "No active hospitality benefits are represented by the current token."]
      ]]
    ],
    links: [["Status", "/status/"], ["Verify", "/verify/"]],
    disclaimer: "Audit-status disclaimer: project status is not an independent audit conclusion."
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nav() {
  return `
      <nav id="site-nav" class="nav" aria-label="Sections">
        <a href="/">Home</a>
        <a href="/audit/">Audit</a>
        <a href="/verify/">Verify</a>
        <a href="/status/">Status</a>
        <a href="/legal/risk-disclosure/">Risks</a>
      </nav>`;
}

function legalFooter() {
  return `
    <footer class="footer legal-footer" data-legal-footer>
      <picture>
        <source srcset="/assets/favicon.webp" type="image/webp">
        <img class="footer-mark" src="/assets/favicon.png" width="512" height="512" alt="TikiDeco TIDE emblem">
      </picture>
      <div>
        <p>TikiDeco / TIDE is a public Sepolia prototype. No token sale. No stated monetary value. Not independently audited.</p>
        <p class="footer-links">
          <a href="/legal/no-offer/">No offer</a>
          <a href="/legal/terms/">Terms</a>
          <a href="/legal/privacy/">Privacy</a>
          <a href="/legal/risk-disclosure/">Risk disclosure</a>
          <a href="/legal/project-status/">Project status</a>
        </p>
      </div>
    </footer>`;
}

function renderPage(page) {
  const url = `${baseUrl}/${page.path.replace(/index\.html$/, "")}`;
  const sections = page.sections.map(([title, rows]) => `
        <section class="content-card" aria-labelledby="${title.toLowerCase().replaceAll(" ", "-")}">
          <h2 id="${title.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(title)}</h2>
          <dl class="record-list">
            ${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("\n            ")}
          </dl>
        </section>`).join("\n");
  const links = page.links.map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("\n          ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' https://ethereum-sepolia-rpc.publicnode.com https://rpc.sepolia.org; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="theme-color" content="#0b1020">
    <meta property="og:type" content="website">
    <meta property="og:title" content="TikiDeco | ${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:image" content="${baseUrl}/assets/tide-logo.png">
    <meta property="og:url" content="${url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="TikiDeco | ${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${baseUrl}/assets/tide-logo.png">
    <link rel="canonical" href="${url}">
    <link rel="icon" href="/assets/favicon.png" type="image/png">
    <link rel="stylesheet" href="/styles.css">
    <script defer src="/app.js"></script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "TikiDeco ${escapeHtml(page.title)}",
        "url": "${url}",
        "isPartOf": {
          "@type": "WebSite",
          "name": "TikiDeco",
          "url": "${baseUrl}/"
        }
      }
    </script>
    <title>TikiDeco | ${escapeHtml(page.title)}</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <a class="status-badge" href="/legal/no-offer/" aria-label="Sepolia testnet status and no-offer notice">SEPOLIA TESTNET &middot; NO MONETARY VALUE</a>
    <header class="topbar" aria-label="Primary">
      <a class="brand" href="/" aria-label="TikiDeco home">
        <picture>
          <source srcset="/assets/favicon.webp" type="image/webp">
          <img class="brand-mark" src="/assets/favicon.png" width="34" height="34" alt="" aria-hidden="true">
        </picture>
        <span>TikiDeco</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="menu-toggle-lines" aria-hidden="true"></span>
        <span class="menu-toggle-label">Menu</span>
      </button>
${nav()}
    </header>
    <main id="main" class="page-main">
      <section class="page-hero" aria-labelledby="page-title">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1 id="page-title">${escapeHtml(page.heading)}</h1>
        <p class="hero-copy">${escapeHtml(page.intro)}</p>
        <p class="audit-disclaimer">${escapeHtml(page.disclaimer)}</p>
      </section>
      <div class="content-grid">
${sections}
        <section class="content-card" aria-labelledby="page-links">
          <h2 id="page-links">Reference links</h2>
          <div class="reference-links">
          ${links}
          </div>
        </section>
      </div>
    </main>
${legalFooter()}
  </body>
</html>
`;
}

for (const page of pages) {
  const target = path.join(siteDir, page.path);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, renderPage(page));
}

console.log(`Wrote ${pages.length} static pages.`);

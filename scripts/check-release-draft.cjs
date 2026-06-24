const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const manifestPath = path.join(root, "deployments", "canonical.json");
const releasePath = path.join(root, "docs", "releases", "v0.1.0-sepolia.md");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(text, expected, label) {
  assert(text.includes(expected), `Release document missing ${label}: ${expected}`);
}

function assertNotIncludesLower(text, phrase, label) {
  assert(!text.toLowerCase().includes(phrase.toLowerCase()), `Release document contains forbidden ${label}: ${phrase}`);
}

function main() {
  assert(fs.existsSync(releasePath), "Release document docs/releases/v0.1.0-sepolia.md does not exist.");

  const manifest = readJson(manifestPath);
  const release = readText(releasePath);
  const lowerRelease = release.toLowerCase();
  const token = manifest.contracts.token;
  const vault = manifest.contracts.vestingVault;

  assert(!/\bTBD\b/i.test(release), "Release document contains TBD.");
  assertIncludes(release, "Release date: 2026-06-23", "published release date");
  assertIncludes(release, "Status: published GitHub pre-release for the Ethereum Sepolia prototype.", "published pre-release status");
  assertIncludes(release, "e07471936375ffbe13c68da2708b4436931392a2", "published release source commit");
  assertIncludes(release, "Release name: `v0.1.0-sepolia`", "release name");
  assert(/\b[0-9a-f]{40}\b/.test(release), "Release document must include at least one exact 40-character commit SHA.");

  assertIncludes(release, "| Network | Ethereum Sepolia |", "network");
  assertIncludes(release, `| Chain ID | \`${manifest.chainId}\` |`, "chain ID");
  assertIncludes(release, `| Canonical version | \`${manifest.contractVersion}\` |`, "canonical version");
  assertIncludes(release, token.address, "token address");
  assertIncludes(release, vault.address, "vesting vault address");
  assertIncludes(release, manifest.ownership.ownerSafe, "owner Safe address");
  assertIncludes(release, manifest.ownership.safeThreshold, "Safe threshold");
  assertIncludes(release, manifest.treasury.address, "treasury address");
  assertIncludes(release, "100,000,000 TIDE", "human supply");
  assertIncludes(release, token.verification, "token verification link");
  assertIncludes(release, vault.verification, "vault verification link");
  assertIncludes(release, `| Solidity | \`${manifest.compiler.version}\` |`, "compiler version");
  assertIncludes(release, `| Optimizer runs | \`${manifest.compiler.optimizer.runs}\` |`, "optimizer runs");
  assertIncludes(release, `| EVM target | \`${manifest.compiler.evmTarget}\` |`, "EVM target");

  const requiredSections = [
    "## What Works",
    "## What Does Not Exist",
    "## Audit Status",
    "## Legal Status",
    "## Known Limitations",
    "## Verification Commands",
    "## Test Commands",
    "## Site Check Commands",
    "## Slither Status",
    "## No-Sale Disclaimer",
    "## Migration Policy"
  ];

  for (const section of requiredSections) {
    assertIncludes(release, section, `section ${section}`);
  }

  const requiredPhrases = [
    "Ethereum Sepolia testnet prototype",
    "not offered for sale",
    "has no stated monetary value",
    "not deployed on mainnet",
    "has not completed an independent audit",
    "Independent smart-contract audit status: not started",
    "TikiDeco is not independently audited",
    "Do not describe this release as audited, approved for production use, or approved for mainnet use",
    "No token sale",
    "No presale",
    "V2 is candidate code and is not the active deployment",
    "new canonical manifest update"
  ];

  for (const phrase of requiredPhrases) {
    assertIncludes(release, phrase, "required release boundary phrase");
  }

  const forbiddenPhrases = [
    "moon",
    "early investors",
    "last chance",
    "guaranteed profit",
    "guaranteed return",
    "price growth",
    "earn yield",
    "earn apy",
    "listed on exchange",
    "risk-free",
    "buy tide",
    "join presale"
  ];

  for (const phrase of forbiddenPhrases) {
    assertNotIncludesLower(release, phrase, "phrase");
  }

  assert(manifest.auditStatus?.independentAudit === "not-started", "Canonical manifest independent audit status must be not-started.");
  assert(manifest.auditStatus?.internalReview, "Canonical manifest missing internal review status.");

  console.log("Release document checks passed.");
}

main();

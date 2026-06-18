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
  assert(text.includes(expected), `Release draft missing ${label}: ${expected}`);
}

function main() {
  const manifest = readJson(manifestPath);
  const release = readText(releasePath);
  const token = manifest.contracts.token;
  const vault = manifest.contracts.vestingVault;

  assert(!/\bTBD\b/i.test(release), "Release draft contains TBD.");
  assertIncludes(release, "Release date: unpublished draft; set by the release manager before tag creation.", "draft release date boundary");
  assertIncludes(release, "Source commit: supplied explicitly to the release package generator.", "explicit source commit boundary");
  assertIncludes(release, `Chain ID | \`${manifest.chainId}\``, "chain ID");
  assertIncludes(release, `Canonical version | \`${manifest.contractVersion}\``, "canonical version");
  assertIncludes(release, token.address, "token address");
  assertIncludes(release, vault.address, "vesting vault address");
  assertIncludes(release, manifest.ownership.ownerSafe, "owner Safe address");
  assertIncludes(release, manifest.treasury.address, "treasury address");
  assertIncludes(release, token.verification, "token verification link");
  assertIncludes(release, vault.verification, "vault verification link");
  assertIncludes(release, `Solidity | \`${manifest.compiler.version}\``, "compiler version");
  assertIncludes(release, `Optimizer runs | \`${manifest.compiler.optimizer.runs}\``, "optimizer runs");
  assertIncludes(release, `EVM target | \`${manifest.compiler.evmTarget}\``, "EVM target");

  const requiredSections = [
    "## Network",
    "## Contracts",
    "## Compiler",
    "## Implemented Features",
    "## Tests",
    "## Known Limitations",
    "## Audit Status",
    "## Legal Status Disclaimer",
    "## Migration Policy"
  ];

  for (const section of requiredSections) {
    assertIncludes(release, section, `section ${section}`);
  }

  const requiredPhrases = [
    "69 passing",
    "not offered for sale",
    "has no stated monetary value",
    "no mainnet deployment",
    "not independently audited",
    "Independent smart-contract audit status: not started",
    "Do not describe this release as audited",
    "not a token sale",
    "not promoted",
    "new canonical manifest update"
  ];

  for (const phrase of requiredPhrases) {
    assertIncludes(release, phrase, `required release boundary phrase`);
  }

  const forbiddenPhrases = [
    "moon",
    "early investors",
    "last chance",
    "guaranteed",
    "price growth",
    "presale"
  ];
  const lowerRelease = release.toLowerCase();

  for (const phrase of forbiddenPhrases) {
    assert(!lowerRelease.includes(phrase), `Forbidden release phrase found: ${phrase}`);
  }

  assert(manifest.auditStatus?.independentAudit, "Canonical manifest missing independent audit status.");
  assert(manifest.auditStatus?.internalReview, "Canonical manifest missing internal review status.");

  console.log("Release draft checks passed.");
}

main();

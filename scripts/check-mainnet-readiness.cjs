const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const requiredDocs = [
  "docs/MAINNET_GO_NO_GO.md",
  "docs/VALUE_CLAIM_POLICY.md",
  "docs/HOSPITALITY_OPERATIONS_GATE.md",
  "docs/CLAIMS_MATRIX.md",
  "docs/PROJECT_FACTS.md",
  "docs/LEGAL_READINESS.md",
  "docs/RISK_DISCLOSURE.md",
  "SECURITY.md",
  "SECURITY_REVIEW.md",
  "KNOWN_ISSUES.md",
  "deployments/canonical.json"
];

const explicitNoGoMarkers = [
  ["mainnet is not approved", "No mainnet deployment is approved."],
  ["token sale is not approved", "No token sale is approved."],
  ["V2 promotion is not approved", "No V2 promotion is approved."],
  ["value statement is not approved", "No value statement is approved."],
  ["independent audit claim is not approved", "No independent audit claim is approved."],
  ["real-world guest utility is not live", "No real-world guest utility is live."]
];

const blockedMarkers = [
  "not approved",
  "requires review",
  "blocked",
  "draft",
  "unknown",
  "not-started",
  "not deployed on mainnet",
  "not offered for sale",
  "no stated monetary value"
];

const requiredBaseline = [
  "not approved",
  "requires review",
  "not a promise",
  "not a value statement",
  "not an offer",
  "no stated monetary value",
  "not deployed on mainnet",
  "not independently audited"
];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function normalize(value) {
  return value.toLowerCase();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function tableStatuses(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|") && !/^\|\s*-+/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim().toLowerCase()))
    .filter((cells) => cells.length >= 4)
    .flatMap((cells) => cells.filter((cell) => ["approved", "not approved", "requires review", "blocked", "draft", "unknown", "not-started"].includes(cell)));
}

function checkValuePolicy() {
  const policy = normalize(read("docs/VALUE_CLAIM_POLICY.md"));
  for (const phrase of requiredBaseline) {
    assert(policy.includes(phrase), `VALUE_CLAIM_POLICY.md missing required cautious wording: ${phrase}`);
  }
  for (const phrase of ["buy tide", "invest in tide", "tide has value", "revenue share", "hotel ownership", "mainnet live", "independently audited"]) {
    assert(policy.includes(phrase), `VALUE_CLAIM_POLICY.md must explicitly list banned or restricted phrase: ${phrase}`);
  }
}

function checkMainnetArtifacts() {
  const missing = requiredDocs.filter((relPath) => !exists(relPath));
  assert(missing.length === 0, `Missing required readiness artifacts:\n${missing.join("\n")}`);

  const mainnet = normalize(read("docs/MAINNET_GO_NO_GO.md"));
  const hospitality = normalize(read("docs/HOSPITALITY_OPERATIONS_GATE.md"));
  const value = normalize(read("docs/VALUE_CLAIM_POLICY.md"));
  const canonical = JSON.parse(read("deployments/canonical.json"));

  for (const phrase of requiredBaseline) {
    assert(`${mainnet}\n${value}`.includes(phrase), `Readiness docs missing required cautious wording: ${phrase}`);
  }
  for (const [label, phrase] of explicitNoGoMarkers) {
    assert(mainnet.includes(phrase.toLowerCase()), `MAINNET_GO_NO_GO.md missing explicit no-go marker for ${label}`);
  }

  assert(canonical.network === "sepolia", "Canonical deployment must remain Sepolia for this blocked gate");
  assert(canonical.auditStatus?.independentAudit === "not-started", "Independent audit must not be claimed complete");
  assert(canonical.auditStatus?.mainnetApproved === false, "Canonical manifest must not approve mainnet");
  assert(canonical.contractVersion === "v1-legacy", "V2 must not be promoted by this readiness gate");

  const canonicalNoGo = [
    ["mainnet", canonical.auditStatus?.mainnetApproved === false],
    ["independent audit", canonical.auditStatus?.independentAudit === "not-started"],
    ["canonical V2 promotion", canonical.contractVersion !== "v2"],
    ["canonical network", canonical.network === "sepolia"]
  ].filter(([, ok]) => !ok);
  assert(canonicalNoGo.length === 0, `Canonical manifest has unexpected readiness approvals: ${canonicalNoGo.map(([label]) => label).join(", ")}`);

  const statuses = [...tableStatuses(mainnet), ...tableStatuses(hospitality), ...tableStatuses(value)];
  assert(statuses.length > 0, "No readiness statuses found");
  const unapproved = statuses.filter((status) => status !== "approved");

  return {
    approved: unapproved.length === 0,
    statuses,
    unapproved,
    blockedMarkersFound: blockedMarkers.filter((marker) => `${mainnet}\n${hospitality}\n${value}`.includes(marker))
  };
}

function main() {
  const args = new Set(process.argv.slice(2));

  checkValuePolicy();
  if (args.has("--value-only")) {
    console.log("Value claim policy check passed: value claims remain restricted and not approved.");
    return;
  }

  const result = checkMainnetArtifacts();
  if (args.has("--expect-blocked")) {
    assert(!result.approved, "Expected mainnet readiness to be blocked, but all statuses are approved");
    assert(result.blockedMarkersFound.length > 0, "Expected blocked markers in readiness docs");
    console.log("Mainnet readiness is intentionally blocked. CI gate passed because no accidental approval was found.");
    console.log(`Unapproved statuses: ${result.unapproved.length}`);
    return;
  }

  if (!result.approved) {
    console.error("Mainnet/value readiness check failed: project is not approved for mainnet or value claims.");
    console.error(`Unapproved statuses: ${result.unapproved.length}`);
    console.error("Run `node scripts/check-mainnet-readiness.cjs --expect-blocked` only in CI to verify the blocked state.");
    process.exit(1);
  }

  console.log("Mainnet/value readiness check passed: all required artifacts are explicitly approved.");
}

main();

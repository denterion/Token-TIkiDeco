const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const parse = (file) => JSON.parse(read(file));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const drillPath = "docs/governance/SAFE_RESILIENCE_DRILL_2026.md";
const policyPath = "docs/governance/SIGNER_POLICY_TEMPLATE.md";
const resultPath = "operations/governance/safe-drill-result.json";
for (const file of [drillPath, policyPath, resultPath]) assert(fs.existsSync(path.join(root, file)), `Missing drill evidence: ${file}`);

const drill = read(drillPath).toLowerCase();
for (const scenario of [
  "one signer unavailable",
  "one signer permanently lost",
  "one signer compromised",
  "two signers disagree",
  "malicious transaction proposed",
  "incorrect report hash prepared",
  "treasury address entered incorrectly",
  "website compromised while safe remains secure",
  "all signers temporarily unavailable"
]) assert(drill.includes(scenario), `Missing scenario: ${scenario}`);

for (const field of [
  "detection", "immediate response", "who decides", "required signatures", "operational impact",
  "recovery path", "evidence retained", "public communication", "stop condition"
]) assert(drill.includes(`**${field}:**`), `Drill scenarios must record ${field}.`);

const policy = read(policyPath).toLowerCase();
for (const heading of [
  "hardware wallet expectation", "device separation", "recovery policy", "signer independence",
  "conflict disclosure", "signing review checklist", "transaction simulation", "address verification",
  "emergency communication"
]) assert(policy.includes(`## ${heading}`), `Signer policy missing section: ${heading}`);

const result = parse(resultPath);
const fixture = parse("config/governance/safe-drill-fixture.json");
const canonical = parse("deployments/canonical.json");
assert(result.passed === true, "Drill simulator result must pass.");
assert(result.proposalCreated === false && result.broadcast === false, "Drill must not create or broadcast a proposal.");
assert(result.checks.every((item) => item.passed === true), "Every simulator check must pass.");
assert(fixture.testOnly === true, "Safe drill fixture must remain test-only.");
for (const liveAddress of [
  canonical.ownership.ownerSafe,
  canonical.treasury.address,
  canonical.contracts.token.address,
  canonical.contracts.vestingVault.address
]) assert(fixture.transaction.target.toLowerCase() !== liveAddress.toLowerCase(), "Drill target must not be a canonical on-chain address.");

const simulator = read("scripts/simulate-safe-review.cjs");
for (const forbidden of ["fetch(", "http.request", "https.request", "JsonRpcProvider", "Wallet(", "sendTransaction("])
  assert(!simulator.includes(forbidden), `Simulator contains forbidden network/signing capability: ${forbidden}`);

console.log("Safe drill evidence checks passed; no proposal or broadcast capability was found.");

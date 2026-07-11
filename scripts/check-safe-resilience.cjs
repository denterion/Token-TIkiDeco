const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "config/governance/safe-resilience.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of [
  "docs/governance/SAFE_RESILIENCE_DECISION.md",
  "docs/governance/SAFE_INCIDENT_DRILL.md",
  "docs/governance/SAFE_RESILIENCE_DRILL_2026.md",
  "docs/governance/SIGNER_POLICY_TEMPLATE.md",
  "config/governance/readiness.json",
  "operations/governance/safe-drill-result.json"
]) {
  assert(fs.existsSync(path.join(root, file)), `Missing Safe resilience evidence: ${file}`);
}

assert(config.network === "Ethereum Sepolia", "Safe resilience review must remain Sepolia-scoped.");
assert(config.currentThreshold === 3 && config.currentOwnerCount === 3, "Recorded canonical Safe threshold must remain 3-of-3.");
assert(config.thresholdChanged === false && config.noAutomaticThresholdChange === true, "This review must not authorize an automatic threshold change.");
assert(config.decision === "retain-current-threshold-pending-governance-review", "Safe decision must remain pending governance review.");
assert(config.recoveryProcedureTested === false, "Do not mark recovery tested without witnessed evidence.");
assert(config.incidentDrillStatus === "tabletop-test-only-completed-2026-07-11", "Test-only drill status must identify the completed dated exercise.");

const drill = fs.readFileSync(path.join(root, "docs/governance/SAFE_INCIDENT_DRILL.md"), "utf8").toLowerCase();
for (const phrase of [
  "one signer unavailable",
  "one signer compromised",
  "incorrect allocation draft",
  "rpc outage",
  "site compromise",
  "false public claim",
  "participant data exposure"
]) {
  assert(drill.includes(phrase), `Incident drill missing scenario: ${phrase}`);
}

console.log("Safe resilience checks passed; threshold remains unchanged and recovery remains an explicit blocker.");

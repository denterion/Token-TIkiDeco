const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const configPath = path.join(root, "config/hospitality-operator/readiness-gates.json");
const blueprintPath = path.join(root, "docs/hospitality-operator/OPERATOR_PILOT_BLUEPRINT.md");
const adapterPath = path.join(root, "site-v2/src/lib/operator/operatorSandbox.ts");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of [configPath, blueprintPath, adapterPath]) assert(fs.existsSync(file), `Missing operator-pilot artifact: ${path.relative(root, file)}`);
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
assert(config.status === "blocked", "Operator pilot must remain blocked.");
assert(config.operatorStatus === "not-established" && config.propertyStatus === "not-established", "Operator or property must not be implied.");
assert(config.inventory === 0, "Public operator-pilot inventory must remain zero.");
for (const [name, gate] of Object.entries(config.gates || {})) {
  assert(gate.status === "not-approved", `${name} must remain not-approved.`);
  assert(typeof gate.owner === "string" && gate.owner, `${name} lacks an accountable review role.`);
}

const adapter = fs.readFileSync(adapterPath, "utf8");
for (const typeName of ["EligibilityRequest", "CampaignRule", "Inventory", "ReservationReferenceHash", "PerkStatus", "OperatorDecision", "AuditLogEntry"]) {
  assert(adapter.includes(typeName), `Operator adapter missing type: ${typeName}`);
}
for (const prohibited of ["email", "guestName", "payment", "privateKey", "seedPhrase", "broadcastTransaction"]) {
  const declaration = new RegExp(`\\b${prohibited}\\s*(?:[?:]|\\()`);
  assert(!declaration.test(adapter), `Operator adapter contains prohibited participant or transaction field: ${prohibited}`);
}

const result = spawnSync(process.execPath, ["scripts/run-operator-sandbox.cjs"], { cwd: root, encoding: "utf8" });
assert(result.status === 0, `Operator sandbox failed:\n${result.stdout}${result.stderr}`);
const invariants = spawnSync(process.execPath, ["scripts/test-operator-sandbox-invariants.cjs"], { cwd: root, encoding: "utf8" });
assert(invariants.status === 0, `Operator sandbox invariants failed:\n${invariants.stdout}${invariants.stderr}`);
console.log("Operator pilot checks passed; sandbox uses fake data and all launch gates remain blocked.");

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "config/governance/readiness.json"), "utf8"));
const expectBlocked = process.argv.includes("--expect-blocked");
const approved = config.gates.filter((gate) => gate.status === "approved");
const blocked = config.gates.filter((gate) => gate.status !== "approved");
const requiredGateIds = ["signer-roles", "signer-independence", "hardware-policy", "recovery-review", "incident-owners"];

for (const id of requiredGateIds) {
  if (!config.gates.some((gate) => gate.id === id)) throw new Error(`Missing required governance gate: ${id}`);
}
if (new Set(config.gates.map((gate) => gate.id)).size !== config.gates.length) throw new Error("Governance gate IDs must be unique.");

if (config.status === "ready" && blocked.length > 0) throw new Error("Governance cannot be ready while required gates are blocked.");
if (config.status !== "ready" && blocked.length === 0) throw new Error("Governance status is stale: every gate is approved.");

console.log(`Governance readiness: ${config.status}`);
console.log(`Approved gates: ${approved.length}/${config.gates.length}`);
for (const gate of blocked) console.log(`- BLOCKED: ${gate.label} (${gate.status})`);

if (blocked.length > 0 && !expectBlocked) {
  console.error("Governance readiness remains blocked. This is the required fail-closed state.");
  process.exitCode = 1;
} else if (expectBlocked) {
  if (blocked.length === 0) throw new Error("Expected governance to remain blocked, but all gates are approved.");
  console.log("Expected blocked governance state verified.");
}

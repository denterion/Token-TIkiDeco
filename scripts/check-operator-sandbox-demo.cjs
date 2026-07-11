const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const json = (file) => JSON.parse(read(file));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const requiredFiles = [
  "site-v2/src/components/OperatorSandbox.tsx",
  "site-v2/src/lib/operator/operatorSandbox.ts",
  "docs/hospitality-operator/OPERATOR_SANDBOX_DEMO.md",
  "docs/hospitality-operator/WHY_HOSPITALITY_OPERATORS.md",
  "operations/hospitality-operator/operator-sandbox-report.json",
  "site/operator-sandbox/index.html",
  "site/operator-sandbox/why/index.html"
];
for (const file of requiredFiles) assert(fs.existsSync(path.join(root, file)), `Missing operator sandbox artifact: ${file}`);

const test = spawnSync(process.execPath, ["scripts/run-operator-sandbox.cjs"], { cwd: root, encoding: "utf8" });
assert(test.status === 0, `Operator sandbox tests failed:\n${test.stdout}${test.stderr}`);

const reportEnvelope = json("operations/hospitality-operator/operator-sandbox-report.json");
const report = reportEnvelope.report;
assert(/^[0-9a-f]{64}$/.test(reportEnvelope.sha256), "Operator report SHA-256 is missing.");
const expectedSha256 = crypto.createHash("sha256").update(`${JSON.stringify(report, null, 2)}\n`).digest("hex");
assert(reportEnvelope.sha256 === expectedSha256, "Operator report SHA-256 does not match its aggregate payload.");
assert(report.inventoryUsed >= 0 && report.inventoryUsed <= report.inventoryLimit, "Report inventory is invalid.");
assert(report.containsPersonalData === false && report.containsRawWalletAddresses === false && report.containsGuestData === false, "Report is not aggregate-only.");
assert(report.transactionBroadcast === false, "Sandbox report must record no transaction broadcast.");

const publicText = [
  read("site-v2/src/components/OperatorSandbox.tsx"),
  read("docs/hospitality-operator/OPERATOR_SANDBOX_DEMO.md"),
  read("docs/hospitality-operator/WHY_HOSPITALITY_OPERATORS.md")
].join("\n");
for (const phrase of ["local demonstration", "fake data", "no active hospitality service", "no real benefit", "no transaction broadcasting"])
  assert(publicText.toLowerCase().includes(phrase), `Missing operator sandbox boundary: ${phrase}`);
for (const prohibited of ["connect wallet", "send transaction", "payment button", "book now"])
  assert(!publicText.toLowerCase().includes(prohibited), `Operator sandbox contains prohibited action: ${prohibited}`);

const adapter = read("site-v2/src/lib/operator/operatorSandbox.ts");
for (const state of ["draft", "review", "approved-for-simulation", "active-simulation", "paused", "closed", "archived"])
  assert(adapter.includes(`\"${state}\"`), `Missing lifecycle state: ${state}`);

console.log("Operator sandbox demo checks passed; workflow remains fake-data-only and non-transactional.");

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "site-v2/src/lib/operator/operatorSandbox.ts");
const reportPath = path.join(root, "operations/hospitality-operator/operator-sandbox-report.json");

function loadSandbox() {
  const source = fs.readFileSync(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true }
  }).outputText;
  const sandboxModule = new Module(sourcePath, module);
  sandboxModule.filename = sourcePath;
  sandboxModule.paths = module.paths;
  sandboxModule._compile(output, sourcePath);
  return sandboxModule.exports;
}

function expectThrow(action, message) {
  try {
    action();
  } catch {
    return;
  }
  throw new Error(message);
}

const { OperatorSandbox, fakeCampaignTemplates } = loadSandbox();
const template = fakeCampaignTemplates[0];
const requestTime = "2030-01-01T01:00:00.000Z";
const eligibleWallet = "0x0000000000000000000000000000000000000001";
const ineligibleWallet = "0x0000000000000000000000000000000000000002";

const negativeInventory = new OperatorSandbox();
negativeInventory.createCampaign(template);
expectThrow(() => negativeInventory.setInventory(-1), "Negative inventory was accepted.");

const unapproved = new OperatorSandbox();
unapproved.createCampaign(template);
unapproved.setInventory(1);
expectThrow(() => unapproved.activateSimulation(), "An unapproved campaign activated.");

for (const gate of ["operatorAssigned", "privacyReviewed", "supportOwnerAssigned"]) {
  const missingGate = new OperatorSandbox();
  missingGate.createCampaign({
    ...template,
    campaignId: `fake-missing-${gate}-001`,
    simulationGates: { ...template.simulationGates, [gate]: false }
  });
  missingGate.setInventory(1);
  missingGate.submitForReview();
  expectThrow(() => missingGate.approveForSimulation(), `A campaign activated without ${gate}.`);
}

const sandbox = new OperatorSandbox();
sandbox.createCampaign(template);
sandbox.setInventory(2);
sandbox.submitForReview();
sandbox.approveForSimulation();
sandbox.activateSimulation();
sandbox.reviewEligibility({
  requestId: "fake-request-eligible",
  campaignId: template.campaignId,
  walletAddress: eligibleWallet,
  chainId: 11155111,
  balanceBaseUnits: 100n,
  requestedAt: requestTime
});
sandbox.reviewEligibility({
  requestId: "fake-request-ineligible",
  campaignId: template.campaignId,
  walletAddress: ineligibleWallet,
  chainId: 11155111,
  balanceBaseUnits: 0n,
  requestedAt: requestTime
});
expectThrow(() => sandbox.reviewEligibility({
  requestId: "fake-request-duplicate-wallet",
  campaignId: template.campaignId,
  walletAddress: eligibleWallet,
  chainId: 11155111,
  balanceBaseUnits: 100n,
  requestedAt: requestTime
}), "A duplicate mock wallet request was accepted.");
sandbox.decide("fake-request-eligible", "approve", "fake-eligible");
sandbox.decide("fake-request-ineligible", "reject", "fake-threshold-not-met");
sandbox.recordDispute("fake-review-requested");
sandbox.closeCampaign();
expectThrow(() => sandbox.decide("fake-request-eligible", "reject", "closed-campaign"), "A closed campaign changed a decision.");

const report = sandbox.aggregateReport();
if (report.inventoryUsed < 0 || report.inventoryUsed > report.inventoryLimit) throw new Error("Inventory accounting is invalid.");
if (report.requests !== 2 || report.eligible !== 1 || report.approved !== 1 || report.rejected !== 1) throw new Error("Aggregate report totals are wrong.");
if (report.containsPersonalData || report.containsRawWalletAddresses || report.containsGuestData || report.transactionBroadcast) {
  throw new Error("Aggregate report crossed a privacy or transaction boundary.");
}
const reportText = JSON.stringify(report);
if (reportText.includes(eligibleWallet) || reportText.includes(ineligibleWallet)) throw new Error("Aggregate report contains a raw wallet address.");

const sha256 = crypto.createHash("sha256").update(`${JSON.stringify(report, null, 2)}\n`).digest("hex");
const output = {
  schemaVersion: "1.0.0",
  generatedAt: "2026-07-11T00:00:00.000Z",
  mode: "local-fake-data-only",
  report,
  sha256
};

if (process.argv.includes("--report")) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(output, null, 2)}\n`);
}

console.log(JSON.stringify({
  result: "pass",
  tests: [
    "inventory cannot become negative",
    "duplicate mock request rejected",
    "closed campaign cannot approve requests",
    "unapproved campaign cannot activate",
    "missing operator/privacy/support gates block activation",
    "reports contain aggregate data only",
    "no transaction broadcast"
  ],
  output
}, null, 2));

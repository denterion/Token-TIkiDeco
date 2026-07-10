const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "site-v2/src/lib/operator/operatorSandbox.ts");

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

const { OperatorSandbox } = loadSandbox();
const sandbox = new OperatorSandbox();
const campaignId = "operator-sandbox-fixture-001";

sandbox.createCampaign({
  campaignId,
  chainId: 11155111,
  minimumBalanceBaseUnits: 100n,
  startsAt: "2030-01-01T00:00:00.000Z",
  endsAt: "2030-01-02T00:00:00.000Z",
  status: "draft"
});
sandbox.setInventory(1);
sandbox.reviewEligibility({
  requestId: "fixture-request-eligible",
  campaignId,
  walletAddress: "0x0000000000000000000000000000000000000001",
  chainId: 11155111,
  balanceBaseUnits: 100n,
  requestedAt: "2030-01-01T01:00:00.000Z"
});
sandbox.reviewEligibility({
  requestId: "fixture-request-ineligible",
  campaignId,
  walletAddress: "0x0000000000000000000000000000000000000002",
  chainId: 11155111,
  balanceBaseUnits: 0n,
  requestedAt: "2030-01-01T01:01:00.000Z"
});
let duplicateRejected = false;
try {
  sandbox.reviewEligibility({
    requestId: "fixture-request-eligible",
    campaignId,
    walletAddress: "0x0000000000000000000000000000000000000001",
    chainId: 11155111,
    balanceBaseUnits: 100n,
    requestedAt: "2030-01-01T01:00:00.000Z"
  });
} catch {
  duplicateRejected = true;
}
if (!duplicateRejected) throw new Error("Sandbox accepted a duplicate request ID.");
sandbox.decide("fixture-request-eligible", "approve", "fixture-eligible");
sandbox.decide("fixture-request-ineligible", "reject", "fixture-threshold-not-met");
sandbox.closeCampaign();

const report = sandbox.aggregateReport();
if (report.totalReviewed !== 2 || report.approved !== 1 || report.rejected !== 1) throw new Error("Unexpected aggregate sandbox result.");
if (report.containsPersonalData || report.transactionBroadcast) throw new Error("Sandbox crossed a privacy or transaction boundary.");

console.log(JSON.stringify({ report, auditEvents: sandbox.getAuditLog().length }, null, 2));

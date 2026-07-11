const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");

const root = path.join(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const json = (relativePath) => JSON.parse(read(relativePath));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const campaign = json("config/utility-pilot/tide-community-preview-001.json");
const lifecycleSchema = json("config/utility-pilot/campaign-lifecycle.schema.json");
const metrics = json("config/utility-pilot/public-preview-metrics-baseline.json");
const gates = json(campaign.lifecycle.approvalEvidenceSource);
const canonical = json("deployments/canonical.json");

assert.equal(campaign.status, "draft-not-live", "Public preview campaign must remain draft-not-live");
assert.equal(campaign.lifecycle.currentStage, "draft", "Public preview lifecycle must remain at draft");
assert.deepEqual(campaign.lifecycle.allowedTransitions, lifecycleSchema.properties.allowedTransitions.const);
assert(lifecycleSchema.properties.currentStage.enum.includes(campaign.lifecycle.currentStage));

const gateEntries = Object.entries(gates.requiredBeforeLiveCampaign || {});
assert(gateEntries.length > 0, "Reviewer gate configuration is missing");
const approvedStageReached = ["approved-testnet-preview", "paused", "closed", "archived"].includes(campaign.lifecycle.currentStage);
if (approvedStageReached) {
  for (const [name, gate] of gateEntries) {
    assert.equal(gate.status, "approved", `${name} lacks approved status`);
    assert.equal(gate.approvalStatus, "approved", `${name} lacks reviewer approval`);
    assert(exists(gate.evidence), `${name} evidence file is missing`);
    assert(typeof gate.approvedBy === "string" && gate.approvedBy.trim(), `${name} lacks approvedBy`);
    assert(!Number.isNaN(Date.parse(gate.approvedAt)), `${name} lacks approvedAt`);
  }
}
assert(gateEntries.every(([, gate]) => gate.approvalStatus !== "approved"), "No reviewer gate may be accidentally approved in the draft preview");

const allowedMetricKeys = [
  "pageSessions", "balanceCheckAttempts", "successfulChecks", "rpcFailures",
  "eligibleResults", "ineligibleResults", "languageSelected", "feedbackLinkClicks"
];
assert.deepEqual(Object.keys(metrics.metrics), allowedMetricKeys);
assert.equal(JSON.stringify(metrics).toLowerCase().includes("walletaddress"), false);
assert.equal(JSON.stringify(metrics).toLowerCase().includes("email"), false);

const metricsSourcePath = path.join(root, "site-v2/src/lib/previewMetrics.ts");
const metricsSource = fs.readFileSync(metricsSourcePath, "utf8");
const output = ts.transpileModule(metricsSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, strict: true },
  fileName: metricsSourcePath
}).outputText;
const loadedModule = { exports: {} };
vm.runInNewContext(output, { module: loadedModule, exports: loadedModule.exports, navigator: { doNotTrack: "0" } }, { filename: metricsSourcePath });
const { createPreviewMetrics } = loadedModule.exports;
const disabled = createPreviewMetrics(false);
disabled.recordPageSession();
disabled.record("balanceCheckAttempts");
assert.equal(disabled.snapshot().pageSessions, 0, "Disabled analytics must not count sessions");
assert.equal(disabled.snapshot().balanceCheckAttempts, 0, "Disabled analytics must not count attempts");
const enabled = createPreviewMetrics(true);
enabled.recordPageSession();
enabled.recordPageSession();
enabled.record("balanceCheckAttempts");
enabled.recordLanguage("es");
assert.equal(enabled.snapshot().pageSessions, 1, "Page session must be counted once per in-memory instance");
assert.equal(enabled.snapshot().balanceCheckAttempts, 1);
assert.equal(enabled.snapshot().languageSelected.es, 1);

const reportPath = campaign.reports.publicPreviewProofReport;
const hashPath = reportPath.replace(/\.md$/, "_HASH.md");
assert(exists(reportPath), "Public preview proof report is missing; run npm run preview:report");
assert(exists(hashPath), "Public preview proof report hash is missing");
const reportHash = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, reportPath))).digest("hex");
assert(read(hashPath).includes(reportHash), "Public preview report hash does not match");
const proposal = json("ops/safe/public-preview-report-proposal.json");
assert.equal(proposal.broadcast, false, "Safe report proposal must never broadcast");
assert.equal(proposal.calldata, null, "Safe report proposal must remain unencoded until manual review");
assert.equal(proposal.target, canonical.contracts.token.address, "Safe report proposal target must be canonical V1 token");
assert.equal(proposal.arguments.documentHash, `0x${reportHash}`, "Safe report proposal hash must match the proof report");
const report = read(reportPath);
for (const phrase of [
  "Sample size", "Completion rate", "Failure rate", "Comprehension Results", "Feedback Themes",
  "Known Limitations", "not offered for sale", "no stated monetary value", "not deployed on mainnet",
  "has not completed an independent audit", "zero-sample baseline"
]) assert(report.toLowerCase().includes(phrase.toLowerCase()), `Preview report missing: ${phrase}`);

const browserTests = read("site-v2/tests/site-regression.spec.ts");
for (const phrase of ["mobile layout", "RPC unavailable", "one RPC endpoint fails", "stale cached", "English-only", "no transaction"]) {
  const combinedTests = `${browserTests}\n${read("scripts/test-eligibility-engine.cjs")}`;
  assert(combinedTests.toLowerCase().includes(phrase.toLowerCase()), `Preview regression coverage missing: ${phrase}`);
}

console.log("Public preview checks passed. Campaign remains blocked at draft.");

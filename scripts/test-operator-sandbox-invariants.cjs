const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "site-v2/src/lib/operator/operatorSandbox.ts");
const fixturePath = path.join(root, "test/fixtures/operator-sandbox-states.json");

function loadSandbox() {
  const output = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true }
  }).outputText;
  const sandboxModule = new Module(sourcePath, module);
  sandboxModule.filename = sourcePath;
  sandboxModule.paths = module.paths;
  sandboxModule._compile(output, sourcePath);
  return sandboxModule.exports;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectThrow(action, expected) {
  try {
    action();
  } catch (error) {
    assert(String(error.message).includes(expected), `Expected "${expected}", received "${error.message}".`);
    return;
  }
  throw new Error(`Expected failure containing "${expected}".`);
}

const { OperatorSandbox, fakeCampaignTemplates, operatorDecisionReasonCodes, validateOperatorSandboxEvidence } = loadSandbox();
const template = fakeCampaignTemplates[0];
const requestTime = "2030-01-01T01:00:00.000Z";

function activeSandbox(capacity = 2) {
  const sandbox = new OperatorSandbox();
  sandbox.createCampaign({ ...template, inventoryLimit: capacity });
  sandbox.setInventory(capacity);
  sandbox.submitForReview();
  sandbox.approveForSimulation();
  sandbox.activateSimulation();
  return sandbox;
}

function request(requestId, walletSuffix, balanceBaseUnits = 100n) {
  return {
    requestId,
    campaignId: template.campaignId,
    walletAddress: `0x${walletSuffix.toString(16).padStart(40, "0")}`,
    chainId: 11155111,
    balanceBaseUnits,
    requestedAt: requestTime
  };
}

function outcomeCounters(report) {
  return [report.requests, report.eligible, report.approved, report.rejected, report.inventoryUsed];
}

function assertRejectedMutationPreservesOutcomes(sandbox, action, expected) {
  const before = sandbox.aggregateReport();
  expectThrow(action, expected);
  const after = sandbox.aggregateReport();
  assert(JSON.stringify(outcomeCounters(after)) === JSON.stringify(outcomeCounters(before)), "Rejected mutation changed aggregate outcomes.");
  assert(after.errors === before.errors + 1, "Rejected mutation was not recorded as one aggregate error.");
}

function runTransitionInvariants() {
  const duplicate = activeSandbox();
  duplicate.reviewEligibility(request("request-a", 1));
  assertRejectedMutationPreservesOutcomes(duplicate, () => duplicate.reviewEligibility(request("request-b", 1)), "Duplicate mock request");
  assertRejectedMutationPreservesOutcomes(duplicate, () => duplicate.reviewEligibility({ ...request("request-invalid", 2), walletAddress: "invalid" }), "Wallet address is invalid");

  const exhausted = activeSandbox(1);
  exhausted.reviewEligibility(request("request-first", 3));
  exhausted.reviewEligibility(request("request-second", 4));
  exhausted.decide("request-first", "approve", "fake-eligible");
  assertRejectedMutationPreservesOutcomes(exhausted, () => exhausted.decide("request-second", "approve", "fake-eligible"), "No sandbox inventory remains");
  assert(exhausted.snapshot().inventory.approved === 1, "Inventory changed after exhaustion.");
  exhausted.decide("request-second", "reject", "fake-not-selected");
  assert(exhausted.aggregateReport().inventoryUsed === 1, "Inventory became inconsistent after rejecting an unallocated request.");

  const decisions = activeSandbox();
  decisions.reviewEligibility(request("request-approved", 5));
  decisions.reviewEligibility(request("request-rejected", 6));
  decisions.reviewEligibility(request("request-reason-code", 11));
  assertRejectedMutationPreservesOutcomes(decisions, () => decisions.decide("request-reason-code", "approve", "external-approval"), "reason code is unsupported");
  assertRejectedMutationPreservesOutcomes(decisions, () => decisions.decide("request-reason-code", "approve", "fake-not-selected"), "does not match the decision");
  decisions.decide("request-reason-code", "reject", "fake-not-selected");
  decisions.decide("request-approved", "approve", "fake-eligible");
  decisions.decide("request-rejected", "reject", "fake-not-selected");
  assertRejectedMutationPreservesOutcomes(decisions, () => decisions.decide("request-approved", "reject", "fake-not-selected"), "already decided");
  assertRejectedMutationPreservesOutcomes(decisions, () => decisions.decide("request-rejected", "approve", "fake-eligible"), "already decided");
  expectThrow(() => decisions.decide("missing", "reject", "fake-not-selected"), "missing or already decided");
  expectThrow(() => decisions.decide("missing", "reject", "unsupported-code"), "missing or already decided");

  const paused = activeSandbox();
  paused.reviewEligibility(request("paused-request", 7));
  paused.pauseSimulation("fake-maintenance");
  const pausedMutations = [
    [() => paused.reviewEligibility(request("paused-new", 8)), "Campaign must be active-simulation"],
    [() => paused.setInventory(1), "Campaign must be draft"],
    [() => paused.decide("paused-request", "reject", "fake-not-selected"), "Campaign must be active-simulation"],
    [() => paused.activateSimulation(), "Campaign must be approved-for-simulation"]
  ];
  for (const [action, expected] of pausedMutations) assertRejectedMutationPreservesOutcomes(paused, action, expected);
  paused.recordDispute("fake-review-requested");
  paused.closeCampaign();
  paused.archiveCampaign();
  assert(paused.snapshot().campaign.state === "archived", "Paused simulation did not follow paused -> closed -> archived.");

  const closed = activeSandbox();
  closed.reviewEligibility(request("closed-request", 9));
  closed.closeCampaign();
  const closedMutations = [
    [() => closed.reviewEligibility(request("closed-new", 10)), "Campaign must be active-simulation"],
    [() => closed.setInventory(1), "Campaign must be draft"],
    [() => closed.decide("closed-request", "reject", "fake-not-selected"), "Campaign must be active-simulation"]
  ];
  for (const [action, expected] of closedMutations) assertRejectedMutationPreservesOutcomes(closed, action, expected);
  closed.recordDispute("fake-post-close-review");

  const finalReport = decisions.aggregateReport();
  const auditLog = decisions.getAuditLog();
  validateOperatorSandboxEvidence(finalReport, auditLog);
  assert(auditLog.every((entry, index) => entry.sequence === index + 1), "Audit sequence is not monotonic.");
  assert(auditLog.filter((entry) => entry.action === "request-decided").every((entry) => operatorDecisionReasonCodes.includes(entry.reasonCode)), "Decision audit entry has an unsupported reason code.");
  assert(finalReport.inventoryUsed >= 0, "Inventory became negative.");

  const reportText = JSON.stringify(finalReport);
  assert(!/0x[0-9a-f]{40}/i.test(reportText), "Aggregate report contains a raw wallet address.");
  assert(!/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(reportText), "Aggregate report contains an email address.");
  for (const field of ["guestName", "bookingDetails", "privateKey", "seedPhrase", "walletAddresses"]) {
    assert(!reportText.includes(field), `Aggregate report contains prohibited field ${field}.`);
  }
  console.log("Operator sandbox transition invariants passed.");
}

function runMalformedFixtures() {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  validateOperatorSandboxEvidence(fixture.baseReport, fixture.baseAuditLog);
  for (const testCase of fixture.invalidCases) {
    const report = { ...fixture.baseReport, ...(testCase.reportPatch || {}) };
    const auditLog = fixture.baseAuditLog.map((entry, index) => ({
      ...entry,
      sequence: testCase.auditSequences?.[index] ?? entry.sequence,
      reasonCode: entry.action === "request-decided" && testCase.decisionReasonCode ? testCase.decisionReasonCode : entry.reasonCode
    }));
    expectThrow(() => validateOperatorSandboxEvidence(report, auditLog), testCase.expected);
    console.log(`ok - ${testCase.name}`);
  }
  console.log(`${fixture.invalidCases.length} malformed sandbox fixtures passed.`);
}

if (!process.argv.includes("--fixtures")) runTransitionInvariants();
if (!process.argv.includes("--invariants")) runMalformedFixtures();

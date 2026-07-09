const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const blockedStatuses = new Set(["blocked", "not-approved", "not-published", "not-started", "requires-review", "draft", "unknown", "missing"]);
const evidenceOnlyStatuses = new Set(["evidence-only"]);
const allowedApprovalStatuses = new Set(["not-approved", "requires-review", "approved"]);
const requiredBoundaries = [
  "noSale",
  "noStatedMonetaryValue",
  "noMainnetDeployment",
  "noActiveGuestBenefits",
  "independentAuditNotStarted",
  "noPrivateGuestDataCollection",
  "noSafeTransactionBroadcast"
];
const requiredDraftEvidenceGates = new Set([
  "governanceReview",
  "legalReview",
  "operationsReview",
  "privacyReview",
  "securityReview",
  "campaignSpecificRules",
  "snapshotOrApprovedLiveCheckWindow",
  "requestWindow",
  "inventoryLimits",
  "allocationReportPath",
  "staffProcess",
  "disputeProcess",
  "communityFeedbackSummary",
  "transparencyUpdate"
]);
const liveCampaignApprovalKeys = ["legal", "privacy", "security", "operations", "governance"];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const gates = readJson("config/utility-pilot/live-readiness-gates.json");
  const campaign = readJson("config/utility-pilot/tide-community-preview-001.json");

  assert(gates.campaignId === campaign.campaignId, "Live-readiness campaignId must match campaign manifest");
  assert(gates.status === "blocked", "Live-readiness gate register must remain blocked until a separate approval PR changes it");
  assert(campaign.status === "draft-not-live", "Campaign must remain draft-not-live until every live blocker is approved");
  assert(campaign.requestWindow?.status !== "published", "Request window must not be published while campaign approvals are blocked");
  assert(!campaign.requestWindow?.opensAt && !campaign.requestWindow?.closesAt, "Request window dates must stay empty while campaign approvals are blocked");
  assert(Number(campaign.inventory?.publishedCapacity || 0) === 0, "Inventory capacity must stay zero while campaign approvals are blocked");
  assert(campaign.inventory?.status !== "published", "Inventory must not be published while campaign approvals are blocked");
  assert(!campaign.reports?.publishedAllocationReport, "Published allocation report must stay empty until review approval exists");
  for (const key of liveCampaignApprovalKeys) {
    assert(campaign.requiredApprovalsBeforePublication?.[key] !== "approved", `Campaign approval ${key} must not be approved in draft-not-live state`);
  }

  for (const boundary of requiredBoundaries) {
    assert(gates.hardBoundaries?.[boundary] === true, `Missing required hard boundary: ${boundary}`);
  }
  for (const [name, gate] of Object.entries(gates.requiredBeforeLiveCampaign || {})) {
    assert(typeof gate.status === "string" && gate.status.length > 0, `${name} must include status`);
    assert(typeof gate.owner === "string" && gate.owner.length > 0, `${name} must include owner`);
    assert(
      typeof gate.approvalStatus === "string" && allowedApprovalStatuses.has(gate.approvalStatus),
      `${name} must include approvalStatus: ${Array.from(allowedApprovalStatuses).join(", ")}`
    );
    assert(Number.isInteger(gate.issue), `${name} must link to a GitHub issue number`);
    if (requiredDraftEvidenceGates.has(name)) assert(gate.evidence !== null, `${name} must include draft evidence`);
    if (gate.evidence !== null) assert(exists(gate.evidence), `${name} evidence path does not exist: ${gate.evidence}`);
    if (gate.status === "approved" || gate.approvalStatus === "approved") {
      assert(gate.status === "approved", `${name} approvalStatus cannot be approved while status is ${gate.status}`);
      assert(gate.approvalStatus === "approved", `${name} status cannot be approved while approvalStatus is ${gate.approvalStatus}`);
      assert(gate.evidence !== null, `${name} must include evidence before approval`);
      assert(typeof gate.approvedBy === "string" && gate.approvedBy.trim().length > 0, `${name} approved gate must include approvedBy`);
      assert(typeof gate.approvedAt === "string" && !Number.isNaN(Date.parse(gate.approvedAt)), `${name} approved gate must include approvedAt timestamp`);
    }
  }

  const blocked = Object.entries(gates.requiredBeforeLiveCampaign || {}).filter(([, gate]) => blockedStatuses.has(gate.status));
  const evidenceOnly = Object.entries(gates.requiredBeforeLiveCampaign || {}).filter(([, gate]) => evidenceOnlyStatuses.has(gate.status));
  const approved = Object.entries(gates.requiredBeforeLiveCampaign || {}).filter(([, gate]) => gate.status === "approved");
  const notApproved = Object.entries(gates.requiredBeforeLiveCampaign || {}).filter(([, gate]) => gate.approvalStatus !== "approved");

  if (args.has("--expect-blocked")) {
    assert(blocked.length > 0 || notApproved.length > 0, "Expected pilot live readiness to remain blocked");
    console.log("Pilot live readiness is intentionally blocked. No live campaign is approved.");
    console.log(`Blocked gates: ${blocked.length}`);
    console.log(`Evidence-only gates: ${evidenceOnly.length}`);
    console.log(`Approved gates: ${approved.length}`);
    return;
  }

  if (blocked.length > 0 || notApproved.length > 0) {
    console.error("Pilot live readiness check failed: campaign is not approved to go live.");
    console.error(`Blocked gates: ${blocked.length}`);
    console.error(`Evidence-only gates: ${evidenceOnly.length}`);
    console.error(`Approved gates: ${approved.length}`);
    for (const [name, gate] of blocked) {
      console.error(`- ${name}: ${gate.status}, owner ${gate.owner}, approval ${gate.approvalStatus} (#${gate.issue})`);
    }
    console.error("Run `npm run pilot:live:blocked` to verify the intentionally blocked state.");
    process.exit(1);
  }

  console.log("Pilot live readiness check passed: all live-campaign blockers are approved.");
}

main();

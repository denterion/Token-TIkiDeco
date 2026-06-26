const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const blockedStatuses = new Set(["blocked", "not-approved", "not-published", "not-started", "requires-review", "draft", "unknown", "missing"]);
const requiredBoundaries = [
  "noSale",
  "noStatedMonetaryValue",
  "noMainnetDeployment",
  "noActiveGuestBenefits",
  "independentAuditNotStarted",
  "noPrivateGuestDataCollection",
  "noSafeTransactionBroadcast"
];

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
  assert(campaign.status === "draft-not-live", "Campaign must remain draft-not-live until every live blocker is approved");

  for (const boundary of requiredBoundaries) {
    assert(gates.hardBoundaries?.[boundary] === true, `Missing required hard boundary: ${boundary}`);
  }
  for (const [name, gate] of Object.entries(gates.requiredBeforeLiveCampaign || {})) {
    assert(typeof gate.status === "string" && gate.status.length > 0, `${name} must include status`);
    assert(Number.isInteger(gate.issue), `${name} must link to a GitHub issue number`);
    if (gate.evidence !== null) assert(exists(gate.evidence), `${name} evidence path does not exist: ${gate.evidence}`);
  }

  const blocked = Object.entries(gates.requiredBeforeLiveCampaign || {}).filter(([, gate]) => blockedStatuses.has(gate.status));
  const approved = Object.entries(gates.requiredBeforeLiveCampaign || {}).filter(([, gate]) => gate.status === "approved");

  if (args.has("--expect-blocked")) {
    assert(blocked.length > 0, "Expected pilot live readiness to remain blocked");
    console.log("Pilot live readiness is intentionally blocked. No live campaign is approved.");
    console.log(`Blocked gates: ${blocked.length}`);
    console.log(`Approved gates: ${approved.length}`);
    return;
  }

  if (blocked.length > 0) {
    console.error("Pilot live readiness check failed: campaign is not approved to go live.");
    console.error(`Blocked gates: ${blocked.length}`);
    for (const [name, gate] of blocked) {
      console.error(`- ${name}: ${gate.status} (#${gate.issue})`);
    }
    console.error("Run `npm run pilot:live:blocked` to verify the intentionally blocked state.");
    process.exit(1);
  }

  console.log("Pilot live readiness check passed: all live-campaign blockers are approved.");
}

main();

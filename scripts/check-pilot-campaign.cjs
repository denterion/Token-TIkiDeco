const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const campaignDir = path.join(root, "config", "utility-pilot");
const canonical = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));

const allowedStatuses = new Set(["draft-not-live", "published-testnet", "closed"]);
const requiredApprovals = ["legal", "privacy", "security", "operations", "governance"];
const forbiddenFlowKeys = [
  "saleFlow",
  "presaleFlow",
  "transactionSigning",
  "tokenApproval",
  "tokenTransfer",
  "feeCollection",
  "bookingConfirmation",
  "privateKeyCollection",
  "mainnetFlow"
];
const requiredDisclaimerKeys = [
  "sepoliaTestnetPrototype",
  "notOfferedForSale",
  "noStatedMonetaryValue",
  "notDeployedOnMainnet",
  "independentAuditNotStarted",
  "noGuaranteedBenefit",
  "noHotelOwnership",
  "noRevenueRights",
  "noEquityDebtOrReturnRights"
];
const bannedPhrases = [
  "buy TIDE",
  "presale",
  "investment",
  "profit",
  "return",
  "hotel ownership",
  "revenue share",
  "exchange listing",
  "guaranteed benefit",
  "mainnet live",
  "independently audited"
];
const allowedContextMarkers = [
  "not ",
  "no ",
  "must not",
  "without",
  "forbidden",
  "prohibited",
  "not allowed",
  "not deployed on mainnet",
  "independent audit not started",
  "independently audited."
];

function fail(message) {
  throw new Error(message);
}

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function assertNoUnsupportedClaims(relativePath, text) {
  const lines = text.split(/\r?\n/);
  const conflicts = [];
  lines.forEach((line, index) => {
    for (const phrase of bannedPhrases) {
      if (!phraseRegex(phrase).test(line)) continue;
      const windowText = `${lines[index - 1] || ""}\n${line}\n${lines[index + 1] || ""}`.toLowerCase();
      if (!allowedContextMarkers.some((marker) => windowText.includes(marker))) {
        conflicts.push(`${relativePath}:${index + 1} contains unsupported phrase "${phrase}"`);
      }
    }
  });
  if (conflicts.length > 0) fail(conflicts.join("\n"));
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) fail(`${label} must be a non-empty string`);
}

function assertBool(value, label, expected) {
  if (value !== expected) fail(`${label} must be ${expected}`);
}

function validateCampaign(relativePath, campaign) {
  assertString(campaign.schemaVersion, `${relativePath}.schemaVersion`);
  assertString(campaign.campaignId, `${relativePath}.campaignId`);
  assertString(campaign.campaignName, `${relativePath}.campaignName`);
  if (!allowedStatuses.has(campaign.status)) fail(`${relativePath}.status is not allowed: ${campaign.status}`);
  if (campaign.network !== canonical.network) fail(`${relativePath}.network must match canonical manifest`);
  if (Number(campaign.chainId) !== Number(canonical.chainId)) fail(`${relativePath}.chainId must match canonical manifest`);
  if ((campaign.tokenAddress || "").toLowerCase() !== canonical.contracts.token.address.toLowerCase()) {
    fail(`${relativePath}.tokenAddress must match canonical token address`);
  }
  if (campaign.canonicalVersion !== canonical.contractVersion) {
    fail(`${relativePath}.canonicalVersion must match canonical contractVersion`);
  }

  for (const key of forbiddenFlowKeys) {
    assertBool(campaign.forbiddenFlows?.[key], `${relativePath}.forbiddenFlows.${key}`, false);
  }
  for (const key of requiredDisclaimerKeys) {
    assertBool(campaign.disclaimers?.[key], `${relativePath}.disclaimers.${key}`, true);
  }

  if (campaign.status !== "draft-not-live") {
    for (const key of requiredApprovals) {
      if (campaign.requiredApprovalsBeforePublication?.[key] !== "approved") {
        fail(`${relativePath} cannot be ${campaign.status} until ${key} approval is marked approved`);
      }
    }
    if (!Number.isInteger(campaign.snapshot?.block) || campaign.snapshot.block <= 0) {
      fail(`${relativePath} published campaigns require a positive snapshot block`);
    }
    assertString(campaign.requestWindow?.opensAt, `${relativePath}.requestWindow.opensAt`);
    assertString(campaign.requestWindow?.closesAt, `${relativePath}.requestWindow.closesAt`);
    if (!Number.isInteger(campaign.inventory?.publishedCapacity) || campaign.inventory.publishedCapacity <= 0) {
      fail(`${relativePath} published campaigns require positive publishedCapacity`);
    }
    assertString(campaign.reports?.publishedAllocationReport, `${relativePath}.reports.publishedAllocationReport`);
  }
}

if (!fs.existsSync(campaignDir)) fail("Missing config/utility-pilot campaign directory");

const files = fs.readdirSync(campaignDir).filter((file) => file.endsWith(".json")).sort();
if (files.length === 0) fail("No utility pilot campaign manifests found");

for (const file of files) {
  const relativePath = path.join("config", "utility-pilot", file).replace(/\\/g, "/");
  const fullPath = path.join(campaignDir, file);
  const text = fs.readFileSync(fullPath, "utf8");
  assertNoUnsupportedClaims(relativePath, text);
  validateCampaign(relativePath, JSON.parse(text));
}

console.log(`Pilot campaign checks passed for ${files.length} manifest(s).`);

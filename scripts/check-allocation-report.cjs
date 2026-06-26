const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const defaultTargets = [
  "docs/utility-pilot/TESTNET_ALLOCATION_POLICY.md",
  "docs/utility-pilot/ALLOCATION_REPORT_TEMPLATE.md"
];
const reportDir = path.join(root, "operations", "utility-pilot");
const reportFiles = fs.existsSync(reportDir)
  ? fs.readdirSync(reportDir)
    .filter((file) => file.endsWith(".json") && !file.includes("safe-transaction-builder"))
    .map((file) => path.join("operations", "utility-pilot", file))
  : [];

const banned = [
  "buy TIDE",
  "presale",
  "investment",
  "profit",
  "revenue share",
  "hotel ownership",
  "APY",
  "yield",
  "staking rewards",
  "exchange listing",
  "guaranteed benefit",
  "mainnet live",
  "independently audited"
];

const allowedMarkers = [
  "no ",
  "not ",
  "does not",
  "must not",
  "without",
  "disclaimer",
  "template",
  "prohibited",
  "not deployed on mainnet",
  "independent audit has not started",
  "independent audit not started"
];

const required = [
  "Sepolia",
  "not offered for sale",
  "no stated monetary value",
  "not deployed on mainnet",
  "independent audit",
  "No private keys",
  "No transaction signing"
];
const requiredReportKeys = [
  "campaignId",
  "network",
  "chainId",
  "tokenAddress",
  "snapshotBlock",
  "saleStatus",
  "monetaryValueStatus",
  "mainnetStatus",
  "auditStatus",
  "allocationStatus",
  "status",
  "totalWallets",
  "totalTestnetTideAllocated",
  "documentSha256",
  "noPrivateData",
  "noGuaranteedBenefit",
  "noHotelOwnership"
];

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function isAllowed(lines, index) {
  const windowText = `${lines[index - 1] || ""}\n${lines[index] || ""}\n${lines[index + 1] || ""}`.toLowerCase();
  return allowedMarkers.some((marker) => windowText.includes(marker));
}

function checkFile(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Missing allocation file: ${relativePath}`);
  const text = fs.readFileSync(filePath, "utf8");
  const lower = text.toLowerCase();
  const missing = required.filter((phrase) => !lower.includes(phrase.toLowerCase()));
  if (missing.length > 0) throw new Error(`${relativePath} missing required wording: ${missing.join(", ")}`);
  const conflicts = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const phrase of banned) {
      if (phraseRegex(phrase).test(line) && !isAllowed(lines, index)) {
        conflicts.push(`${relativePath}:${index + 1} contains unsupported phrase "${phrase}"`);
      }
    }
  });
  if (conflicts.length > 0) throw new Error(conflicts.join("\n"));
}

for (const target of defaultTargets) checkFile(target);
for (const report of reportFiles) {
  const filePath = path.join(root, report);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const missing = requiredReportKeys.filter((key) => !(key in json));
  if (missing.length > 0) throw new Error(`${report} missing required allocation report fields: ${missing.join(", ")}`);
  const text = JSON.stringify(json, null, 2).toLowerCase();
  const requiredPhrases = [
    "sepolia",
    "no sale",
    "no stated monetary value",
    "no mainnet deployment",
    "independent audit not started"
  ];
  const missingPhrases = requiredPhrases.filter((phrase) => !text.includes(phrase));
  if (missingPhrases.length > 0) throw new Error(`${report} missing required allocation disclaimers: ${missingPhrases.join(", ")}`);
  if (json.noPrivateData !== true) throw new Error(`${report} must confirm noPrivateData=true`);
  if (json.noGuaranteedBenefit !== true) throw new Error(`${report} must confirm noGuaranteedBenefit=true`);
  if (json.noHotelOwnership !== true) throw new Error(`${report} must confirm noHotelOwnership=true`);
  if (!String(json.documentSha256 || "").match(/^[a-f0-9]{64}$/)) throw new Error(`${report} must include a SHA-256 document hash`);
  if (json.status !== "draft-not-live") {
    for (const key of ["totalWallets", "totalTestnetTideAllocated", "noPrivateData"]) {
      if (!(key in json)) throw new Error(`${report} missing published report field: ${key}`);
    }
  }
}
console.log("Allocation policy/report checks passed.");

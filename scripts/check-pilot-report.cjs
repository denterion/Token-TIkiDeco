const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const defaultTargets = [
  "docs/utility-pilot/PILOT_REPORT_TEMPLATE.md",
  "docs/reports/REPORT_YYYY_MM_DD_LIMITED_PREVIEW_DRY_RUN_TEMPLATE.md"
];
const reportDir = path.join(root, "docs", "utility-pilot", "reports");

const bannedClaims = [
  "active guest benefit",
  "active guest benefits",
  "token sale",
  "presale",
  "monetary value",
  "investment",
  "APY",
  "yield",
  "guaranteed benefit",
  "mainnet live",
  "independently audited",
  "hotel ownership",
  "revenue share",
  "profit"
];

const allowedContext = [
  "not ",
  "no ",
  "does not",
  "must not",
  "without",
  "required disclaimer",
  "privacy statement",
  "prohibited",
  "has not completed an independent audit",
  "not deployed on mainnet",
  "not offered for sale",
  "no stated monetary value"
];

const requiredPhrases = [
  "Campaign ID",
  "Status",
  "TIDE is a Sepolia testnet prototype",
  "not offered for sale",
  "no stated monetary value",
  "not deployed on mainnet",
  "has not completed an independent audit",
  "SHA-256",
  "On-Chain Publication Status"
];

const privateDataPatterns = [
  { name: "email address", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { name: "private key wording", regex: /\b(private key|seed phrase|recovery phrase|password)\b/i },
  { name: "full wallet address", regex: /\b0x[a-fA-F0-9]{40}\b/ },
  { name: "guest data wording", regex: /\b(guest name|booking reference|passport|driver'?s license|identity document)\b/i }
];

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function isAllowed(lines, index) {
  const windowText = Array.from({ length: 9 }, (_, offset) => lines[index - 4 + offset] || "").join("\n").toLowerCase();
  return allowedContext.some((marker) => windowText.includes(marker));
}

function listReports() {
  if (!fs.existsSync(reportDir)) return [];
  return fs.readdirSync(reportDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join("docs", "utility-pilot", "reports", file).replaceAll(path.sep, "/"));
}

function checkFile(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Missing pilot report file: ${relativePath}`);
  const text = fs.readFileSync(filePath, "utf8");
  const lower = text.toLowerCase();
  const missing = requiredPhrases.filter((phrase) => !lower.includes(phrase.toLowerCase()));
  if (missing.length > 0) throw new Error(`${relativePath} missing required report fields: ${missing.join(", ")}`);

  if (!/(<sha256-placeholder>|[a-f0-9]{64})/i.test(text)) {
    throw new Error(`${relativePath} must include a SHA-256 placeholder or 64-character hash`);
  }

  const lines = text.split(/\r?\n/);
  const conflicts = [];
  lines.forEach((line, index) => {
    for (const pattern of privateDataPatterns) {
      if (pattern.regex.test(line) && !isAllowed(lines, index)) {
        conflicts.push(`${relativePath}:${index + 1} contains possible private participant data: ${pattern.name}`);
      }
    }
    for (const phrase of bannedClaims) {
      if (phraseRegex(phrase).test(line) && !isAllowed(lines, index)) {
        conflicts.push(`${relativePath}:${index + 1} contains unsupported claim phrase "${phrase}"`);
      }
    }
  });
  if (conflicts.length > 0) throw new Error(conflicts.join("\n"));
}

const targets = [...defaultTargets, ...listReports()];
for (const target of targets) checkFile(target);

console.log(`Pilot report checks passed for ${targets.length} file(s).`);

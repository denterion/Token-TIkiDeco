const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const rcDoc = "docs/releases/v0.2.0-utility-pilot-rc.1.md";
const rcPath = path.join(root, rcDoc);
const campaignPath = path.join(root, "config", "utility-pilot", "tide-community-preview-001.json");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const bannedPhrases = [
  "live campaign",
  "mainnet live",
  "token sale",
  "presale",
  "monetary value",
  "active guest benefit",
  "active guest benefits",
  "independent audit complete",
  "independently audited",
  "buy TIDE",
  "investment",
  "profit",
  "revenue share",
  "hotel ownership",
  "APY",
  "yield",
  "staking rewards",
  "exchange listing",
  "price chart"
];

const allowedContextMarkers = [
  "not ",
  "no ",
  "does not",
  "do not",
  "without",
  "blocked",
  "before",
  "remaining blockers",
  "known limitations",
  "required disclaimer",
  "not deployed on mainnet",
  "not offered for sale",
  "no stated monetary value",
  "independent audit has not started",
  "has not completed an independent audit",
  "not completed",
  "not live",
  "not published",
  "unknown",
  "not publicly claimable",
  "no confirming",
  "do not use as a public claim"
];

const requiredDisclaimers = [
  "not offered for sale",
  "no stated monetary value",
  "not deployed on mainnet",
  "independent audit"
];

function fail(message) {
  throw new Error(message);
}

function read(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) fail(`Missing file: ${relativePath}`);
  return fs.readFileSync(full, "utf8");
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
      const windowText = Array.from({ length: 16 }, (_, offset) => lines[index - 10 + offset] || "").join("\n").toLowerCase();
      if (!allowedContextMarkers.some((marker) => windowText.includes(marker))) {
        conflicts.push(`${relativePath}:${index + 1} contains unsupported phrase "${phrase}"`);
      }
    }
  });
  if (conflicts.length > 0) fail(conflicts.join("\n"));
}

function assertContains(relativePath, text, phrases) {
  const lower = text.toLowerCase();
  const missing = phrases.filter((phrase) => !lower.includes(phrase.toLowerCase()));
  if (missing.length > 0) fail(`${relativePath} missing required wording: ${missing.join(", ")}`);
}

function extractValidationCommands(text) {
  const codeBlocks = [...text.matchAll(/```(?:bash)?\r?\n([\s\S]*?)```/g)].map((match) => match[1]);
  return codeBlocks
    .flatMap((block) => block.split(/\r?\n/))
    .map((line) => line.trim())
    .filter((line) => line.startsWith("npm run "))
    .map((line) => line.replace(/\s+#.*$/, ""));
}

function assertCommandsExist(commands) {
  const scripts = packageJson.scripts || {};
  const missing = commands
    .map((command) => command.replace(/^npm run\s+/, "").trim())
    .filter((scriptName) => !(scriptName in scripts));
  if (missing.length > 0) fail(`RC doc references missing package scripts: ${missing.join(", ")}`);
}

function listHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(full);
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

const rcText = read(rcDoc);
assertContains(rcDoc, rcText, [
  "Status: release candidate, not published",
  "Network: Ethereum Sepolia",
  "Canonical version: v1-legacy",
  "V2 status: candidate only, not canonical",
  "Campaign status: draft-not-live",
  "TIDE is a Sepolia testnet prototype",
  "not offered for sale",
  "no stated monetary value",
  "not deployed on mainnet",
  "has not completed an independent audit"
]);
assertNoUnsupportedClaims(rcDoc, rcText);
assertCommandsExist(extractValidationCommands(rcText));

const campaign = JSON.parse(read("config/utility-pilot/tide-community-preview-001.json"));
if (campaign.status !== "draft-not-live") fail("Campaign manifest must remain draft-not-live for rc.1");
for (const key of ["legal", "privacy", "security", "operations", "governance"]) {
  const value = campaign.requiredApprovalsBeforePublication?.[key];
  if (!["not-approved", "blocked", "requires-review"].includes(value)) {
    fail(`Campaign approval ${key} must remain blocked/not-approved/requires-review, got ${value}`);
  }
}

const siteDir = path.join(root, "site");
const htmlFiles = listHtmlFiles(siteDir);
if (htmlFiles.length === 0) fail("No built site HTML files found. Run npm run site before npm run v02:rc.");
for (const file of htmlFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf8");
  assertContains(relative, text, requiredDisclaimers);
  assertNoUnsupportedClaims(relative, text);
}

const publicTargets = [
  "README.md",
  "docs/PROJECT_FACTS.md",
  "docs/NEXT_RELEASE_GATES.md",
  "docs/ROADMAP.md",
  "docs/releases/v0.2.0-utility-pilot.md",
  rcDoc
];
for (const target of publicTargets) assertNoUnsupportedClaims(target, read(target));

console.log("v0.2.0-utility-pilot-rc.1 checks passed.");

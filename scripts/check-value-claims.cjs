const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const reportPath = path.join(root, "PUBLIC_CLAIMS_CONSISTENCY_REPORT.md");

const unsupportedClaims = [
  "TIDE has value",
  "buy TIDE",
  "invest",
  "token price",
  "profit",
  "APY",
  "yield",
  "staking rewards",
  "hotel ownership",
  "revenue share",
  "guaranteed benefit",
  "active hotel benefit",
  "mainnet live",
  "audited"
];

const allowContextMarkers = [
  "not ",
  "no ",
  "does not",
  "must not",
  "without",
  "prohibited",
  "banned",
  "forbidden",
  "risk",
  "no-offer",
  "no offer",
  "policy",
  "disclaimer",
  "do not",
  "avoid",
  "not claim",
  "not current",
  "not live",
  "not a",
  "future financial rights",
  "token sale",
  "no active",
  "not independently audited",
  "independent audit not started",
  "not deployed on mainnet",
  "no mainnet",
  "not offered for sale",
  "no stated monetary value"
];

const policyContextFiles = new Set([
  "docs/CLAIMS_MATRIX.md",
  "docs/COMMUNITY_PREVIEW.md",
  "docs/COMMUNICATION_PLAYBOOK.md",
  "docs/COMMUNICATION_POLICY.md",
  "docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md",
  "docs/FAQ.md",
  "docs/FAQ_EN.md",
  "docs/FAQ_ES.md",
  "docs/FAQ_RU.md",
  "docs/FEEDBACK_GUIDE.md",
  "docs/GITHUB_ISSUE_TRIAGE.md",
  "docs/HARDHAT3_MIGRATION.md",
  "docs/LEGAL_READINESS.md",
  "docs/MAINNET_GO_NO_GO.md",
  "docs/PROJECT_FACTS.md",
  "docs/REPORTING_CADENCE.md",
  "docs/REVIEW_COMMAND_OUTPUTS.md",
  "docs/RISK_DISCLOSURE.md",
  "docs/SHOWCASE.md",
  "docs/TREASURY_POLICY.md",
  "docs/V2_AUDIT_TARGET_FREEZE.md",
  "docs/VALUE_AND_UTILITY_BOUNDARY.md",
  "docs/VALUE_CLAIM_POLICY.md",
  "docs/WHITEPAPER_EN.md",
  "docs/WHITEPAPER_RU.md",
  "docs/WHITEPAPER_ZH.md",
  "docs/releases/RELEASE_CHECKLIST.md"
]);

const explicitTargets = [
  "README.md",
  "package.json",
  "docs/PUBLIC_MATERIALS.md"
];

function normalize(filePath) {
  return filePath.replaceAll("\\", "/");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function targetFiles() {
  const docs = walk(path.join(root, "docs")).filter((filePath) => filePath.endsWith(".md"));
  const site = walk(path.join(root, "site")).filter((filePath) => filePath.endsWith(".html"));
  const social = walk(path.join(root, "social")).filter((filePath) => /\.(md|txt|json)$/i.test(filePath));
  return [...new Set([...explicitTargets.map((rel) => path.join(root, rel)), ...docs, ...site, ...social])]
    .filter((filePath) => fs.existsSync(filePath));
}

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function isAllowedContext(rel, lines, index) {
  if (rel.startsWith("docs/reports/")) return true;
  if (policyContextFiles.has(rel)) return true;
  if (/audited\s+\d+\s+packages/i.test(lines[index] || "")) return true;
  const windowText = `${lines[index - 2] || ""}\n${lines[index - 1] || ""}\n${lines[index] || ""}\n${lines[index + 1] || ""}\n${lines[index + 2] || ""}`.toLowerCase();
  return allowContextMarkers.some((marker) => windowText.includes(marker));
}

function main() {
  const conflicts = [];
  for (const filePath of targetFiles()) {
    const rel = normalize(path.relative(root, filePath));
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const phrase of unsupportedClaims) {
        if (phraseRegex(phrase).test(line) && !isAllowedContext(rel, lines, index)) {
          conflicts.push(`${rel}:${index + 1} unsupported value/mainnet/audit claim "${phrase}": ${line.trim()}`);
        }
      }
    });
  }

  if (conflicts.length > 0) {
    fs.writeFileSync(reportPath, `# Value Claims Check\n\nFAIL\n\n${conflicts.map((item) => `- ${item}`).join("\n")}\n`);
    console.error(`Value claims check failed with ${conflicts.length} conflict(s). See PUBLIC_CLAIMS_CONSISTENCY_REPORT.md.`);
    process.exit(1);
  }

  console.log("Value claims check passed: no unsupported value, sale, mainnet, active-benefit, or audit claims found.");
}

main();

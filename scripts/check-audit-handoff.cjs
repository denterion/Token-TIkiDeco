const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = path.join(__dirname, "..");
const packageRoot = path.join(root, "release-artifacts", "v2-audit-package");

const requiredDocs = [
  "docs/EXTERNAL_AUDIT_READINESS.md",
  "docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md",
  "docs/AUDITOR_QUESTIONS.md",
  "docs/AUDIT_RESPONSE_PROCESS.md",
  "docs/V2_AUDIT_TARGET_FREEZE.md",
  "KNOWN_ISSUES.md",
  "security/slither-baseline-v2.json"
];

const bannedClaims = [
  "V2 is canonical",
  "mainnet live",
  "token sale",
  "monetary value",
  "independently audited",
  "investment",
  "revenue share",
  "hotel ownership",
  "profit"
];

const allowedContext = [
  "not ",
  "no ",
  "out of scope",
  "candidate",
  "non-canonical",
  "not independently audited",
  "not deployed on mainnet",
  "not offered",
  "not an independent audit",
  "not a value statement",
  "do not send",
  "if:",
  "imply"
];

function fail(message) {
  throw new Error(message);
}

function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) fail(`Missing required file: ${relativePath}`);
  return fs.readFileSync(file, "utf8");
}

function currentCommit() {
  return childProcess.execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
}

function latestPackageDir() {
  if (!fs.existsSync(packageRoot)) fail("Missing release-artifacts/v2-audit-package. Run npm run audit first.");
  const dirs = fs.readdirSync(packageRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (dirs.length === 0) fail("No V2 audit package directory found. Run npm run audit first.");
  return dirs.includes(currentCommit()) ? path.join(packageRoot, currentCommit()) : path.join(packageRoot, dirs.at(-1));
}

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function isAllowed(lines, index) {
  const windowText = Array.from({ length: 9 }, (_, offset) => lines[index - 4 + offset] || "").join("\n").toLowerCase();
  return allowedContext.some((marker) => windowText.includes(marker));
}

function assertNoUnsupportedClaims(relativePath, text) {
  const lines = text.split(/\r?\n/);
  const conflicts = [];
  lines.forEach((line, index) => {
    for (const phrase of bannedClaims) {
      if (phraseRegex(phrase).test(line) && !isAllowed(lines, index)) {
        conflicts.push(`${relativePath}:${index + 1} contains unsupported handoff claim "${phrase}"`);
      }
    }
  });
  if (conflicts.length > 0) fail(conflicts.join("\n"));
}

for (const doc of requiredDocs) assertNoUnsupportedClaims(doc, read(doc));

const freezeDoc = read("docs/V2_AUDIT_TARGET_FREEZE.md");
const indexDoc = read("docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md");
const readinessDoc = read("docs/EXTERNAL_AUDIT_READINESS.md");
if (!/[a-f0-9]{40}/i.test(freezeDoc)) fail("V2 freeze commit missing from docs/V2_AUDIT_TARGET_FREEZE.md");
if (!/V2 freeze commit\s*\|\s*`?[a-f0-9]{40}`?/i.test(indexDoc)) fail("V2 freeze commit missing from EXTERNAL_AUDIT_PACKAGE_INDEX.md");
if (!/Current evidence commit\s*\|\s*`?[a-f0-9]{40}`?/i.test(indexDoc)) fail("Current evidence commit missing from EXTERNAL_AUDIT_PACKAGE_INDEX.md");
if (!readinessDoc.includes("npm run foundry:test") || !readinessDoc.includes("npm run foundry:coverage")) {
  fail("EXTERNAL_AUDIT_READINESS.md must reference Foundry tests and coverage");
}

const packageDir = latestPackageDir();
const packageCommit = path.basename(packageDir);
if (packageCommit !== currentCommit()) {
  fail(`Latest V2 audit package is not generated from current commit: ${packageCommit} != ${currentCommit()}`);
}

const requiredPackageFiles = [
  "contracts/TikiDecoTokenV2.sol",
  "contracts/TikiDecoVestingVaultV2.sol",
  "KNOWN_ISSUES.md",
  "docs/V2_AUDIT_TARGET_FREEZE.md",
  "security/slither-baseline-v2.json",
  "SHA256SUMS.txt"
];
for (const rel of requiredPackageFiles) {
  if (!fs.existsSync(path.join(packageDir, rel))) fail(`Audit package missing required artifact: ${rel}`);
}

console.log(`Audit handoff checks passed for package ${path.relative(root, packageDir).replaceAll(path.sep, "/")}.`);

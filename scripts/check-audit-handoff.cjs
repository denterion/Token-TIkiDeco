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
  "docs/V2_AUDIT_OWNER_DECISIONS.md",
  "docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md",
  "docs/FRESH_CHECKOUT_RELEASE_PROOF.md",
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
const knownIssueIds = ["KI-01", "KI-02", "KI-03", "KI-04", "KI-05", "KI-06", "KI-07", "KI-08", "KI-09"];
const roleChecklistRequired = [
  "default admin",
  "pauser",
  "reporter",
  "vesting admin",
  "treasury",
  "deployer",
  "zero addresses",
  "safe threshold",
  "emergency pause owner",
  "role-transfer evidence",
  "public-network config fails closed"
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
const ownerDecisionsDoc = read("docs/V2_AUDIT_OWNER_DECISIONS.md");
const roleChecklistDoc = read("docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md").toLowerCase();
const freshProofDoc = read("docs/FRESH_CHECKOUT_RELEASE_PROOF.md");
const knownIssuesDoc = read("KNOWN_ISSUES.md");
if (!/[a-f0-9]{40}/i.test(freezeDoc)) fail("V2 freeze commit missing from docs/V2_AUDIT_TARGET_FREEZE.md");
if (!/V2 freeze commit\s*\|\s*`?[a-f0-9]{40}`?/i.test(indexDoc)) fail("V2 freeze commit missing from EXTERNAL_AUDIT_PACKAGE_INDEX.md");
if (!/Current evidence commit\s*\|\s*`?[a-f0-9]{40}`?/i.test(indexDoc)) fail("Current evidence commit missing from EXTERNAL_AUDIT_PACKAGE_INDEX.md");
if (!readinessDoc.includes("npm run foundry:test") || !readinessDoc.includes("npm run foundry:coverage")) {
  fail("EXTERNAL_AUDIT_READINESS.md must reference Foundry tests and coverage");
}
if (ownerDecisionsDoc.includes("needs-owner-decision")) fail("V2 owner decisions still contain needs-owner-decision");
for (const id of knownIssueIds) {
  if (!knownIssuesDoc.includes(id)) fail(`KNOWN_ISSUES.md missing expected finding ${id}`);
  if (!ownerDecisionsDoc.includes(id)) fail(`V2_AUDIT_OWNER_DECISIONS.md missing decision for ${id}`);
}
for (const phrase of ["decision", "rationale", "accepted risk", "planned remediation", "auditor should review", "linked test"]) {
  if (!ownerDecisionsDoc.toLowerCase().includes(phrase)) fail(`V2 owner decisions missing required field wording: ${phrase}`);
}
for (const phrase of roleChecklistRequired) {
  if (!roleChecklistDoc.includes(phrase)) fail(`V2 role manifest checklist missing required item: ${phrase}`);
}
for (const phrase of ["clean clone", "npm ci", "npm run compile", "npm test", "npm run foundry:test", "npm run foundry:coverage", "npm run slither", "npm run site", "npm run site:browser", "checksum", "expected blocked gates"]) {
  if (!freshProofDoc.toLowerCase().includes(phrase.toLowerCase())) fail(`Fresh checkout proof doc missing: ${phrase}`);
}

const packageDir = latestPackageDir();
const packageCommit = path.basename(packageDir);
if (packageCommit !== currentCommit()) {
  fail(`Latest V2 audit package is not generated from current commit: ${packageCommit} != ${currentCommit()}`);
}
const auditPackageManifestPath = path.join(packageDir, "audit-package-manifest.json");
if (!fs.existsSync(auditPackageManifestPath)) fail("Audit package missing audit-package-manifest.json");
const auditPackageManifest = JSON.parse(fs.readFileSync(auditPackageManifestPath, "utf8"));
if (auditPackageManifest.headCommit !== currentCommit()) {
  fail(`Audit package manifest headCommit is stale: ${auditPackageManifest.headCommit} != ${currentCommit()}`);
}
if (auditPackageManifest.nonCanonical !== true) fail("Audit package manifest must mark V2 as non-canonical");
if (auditPackageManifest.independentAuditStatus !== "not-started") fail("Audit package manifest must keep independent audit status not-started");

const requiredPackageFiles = [
  "contracts/TikiDecoTokenV2.sol",
  "contracts/TikiDecoVestingVaultV2.sol",
  "KNOWN_ISSUES.md",
  "docs/V2_AUDIT_TARGET_FREEZE.md",
  "docs/V2_AUDIT_OWNER_DECISIONS.md",
  "docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md",
  "docs/FRESH_CHECKOUT_RELEASE_PROOF.md",
  "security/slither-baseline-v2.json",
  "lcov.info",
  "security-artifacts/slither/slither.json",
  "SHA256SUMS.txt"
];
for (const rel of requiredPackageFiles) {
  if (!fs.existsSync(path.join(packageDir, rel))) fail(`Audit package missing required artifact: ${rel}`);
}

console.log(`Audit handoff checks passed for package ${path.relative(root, packageDir).replaceAll(path.sep, "/")}.`);

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const gatesPath = "config/utility-pilot/live-readiness-gates.json";
const campaignPath = "config/utility-pilot/tide-community-preview-001.json";
const evidencePath = "docs/utility-pilot/LIMITED_SEPOLIA_PREVIEW_EVIDENCE.md";
const ownerMatrixPath = "docs/utility-pilot/LIVE_GATE_OWNER_MATRIX.md";

const publicTextTargets = [
  "README.md",
  "docs",
  "site",
  "site-v2/src"
];

const requiredEvidenceItems = [
  "campaign rules",
  "snapshot block or approved live-check mode",
  "request window",
  "inventory limit",
  "eligibility threshold",
  "manual review process",
  "duplicate wallet handling",
  "dispute handling",
  "privacy review",
  "legal review",
  "security review",
  "operations review",
  "governance review",
  "allocation report path",
  "transparency update path",
  "stop condition"
];

const liveBenefitPhrases = [
  "active guest benefits are live",
  "live guest benefits",
  "benefits are live",
  "active hotel benefits",
  "campaign is live",
  "live campaign is approved"
];

const allowedLiveContext = [
  "not ",
  "no ",
  "without",
  "must not",
  "does not",
  "do not",
  "blocked",
  "not approved",
  "not currently",
  "draft-not-live",
  "until",
  "prohibited",
  "reject",
  "implies sale",
  "stop condition"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function walk(target) {
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(absolute, entry.name);
    if (entry.isDirectory()) return walk(path.relative(root, fullPath));
    return [fullPath];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function hasAllowedContext(lines, index) {
  const windowText = Array.from({ length: 11 }, (_, offset) => lines[index - 5 + offset] || "").join("\n").toLowerCase();
  return allowedLiveContext.some((marker) => windowText.includes(marker));
}

function assertNoLiveBenefitClaims() {
  const conflicts = [];
  const files = publicTextTargets
    .flatMap(walk)
    .filter((filePath) => /\.(md|html|tsx?|jsx?|json)$/i.test(filePath))
    .filter((filePath) => !relative(filePath).includes("node_modules/"));

  for (const filePath of files) {
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const phrase of liveBenefitPhrases) {
        if (phraseRegex(phrase).test(line) && !hasAllowedContext(lines, index)) {
          conflicts.push(`${relative(filePath)}:${index + 1} contains live-benefit wording: ${line.trim()}`);
        }
      }
    });
  }
  assert(conflicts.length === 0, `Public text contains unsupported live-benefit wording:\n${conflicts.join("\n")}`);
}

function assertEvidenceDocs() {
  assert(exists(evidencePath), `Missing ${evidencePath}`);
  assert(exists(ownerMatrixPath), `Missing ${ownerMatrixPath}`);
  const evidenceText = read(evidencePath).toLowerCase();
  const matrixText = read(ownerMatrixPath).toLowerCase();

  const missingEvidence = requiredEvidenceItems.filter((item) => !evidenceText.includes(item));
  assert(missingEvidence.length === 0, `${evidencePath} missing evidence items: ${missingEvidence.join(", ")}`);

  for (const item of ["owner", "status", "evidence file", "blocking reason", "reviewer required", "approval format", "command that checks it"]) {
    assert(matrixText.includes(item), `${ownerMatrixPath} missing matrix column/section: ${item}`);
  }
}

function assertGateMatrix() {
  const gates = readJson(gatesPath);
  const campaign = readJson(campaignPath);
  const entries = Object.entries(gates.requiredBeforeLiveCampaign || {});
  assert(entries.length > 0, "No live-readiness gates found");
  assert(gates.status === "blocked", "Live-readiness gate file must remain blocked");
  assert(campaign.status === "draft-not-live", "Campaign must remain draft-not-live");
  assert(campaign.requestWindow?.status !== "published", "Request window must not be published while approvals are blocked");
  assert(Number(campaign.inventory?.publishedCapacity || 0) === 0, "Inventory must stay zero while approvals are blocked");
  assert(!campaign.reports?.publishedAllocationReport, "Published allocation report must remain empty until reviewed");

  for (const [name, gate] of entries) {
    assert(typeof gate.owner === "string" && gate.owner.trim(), `${name} lacks owner`);
    assert(typeof gate.evidence === "string" && gate.evidence.trim(), `${name} lacks evidence file`);
    assert(exists(gate.evidence), `${name} evidence file does not exist: ${gate.evidence}`);
    assert(typeof gate.approvalStatus === "string" && gate.approvalStatus.trim(), `${name} lacks approvalStatus`);
    if (gate.status === "approved" || gate.approvalStatus === "approved") {
      assert(typeof gate.approvedBy === "string" && gate.approvedBy.trim(), `${name} approved gate lacks approvedBy reviewer`);
      assert(typeof gate.approvedAt === "string" && !Number.isNaN(Date.parse(gate.approvedAt)), `${name} approved gate lacks valid approvedAt timestamp`);
    }
  }
}

function main() {
  assertEvidenceDocs();
  assertGateMatrix();
  assertNoLiveBenefitClaims();
  console.log("Pilot evidence checks passed. Campaign remains blocked and evidence-owned.");
}

main();

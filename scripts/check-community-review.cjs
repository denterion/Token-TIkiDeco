const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const json = (relativePath) => JSON.parse(read(relativePath));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const status = json("config/community-review/status.json");
const candidate = json("config/audit/v2-review-candidate.json");
const schema = json("config/community-review/finding.schema.json");
const guide = read("docs/community-review/COMMUNITY_REVIEW_GUIDE.md");
const lifecycle = read("docs/community-review/FINDING_LIFECYCLE.md");
const readme = read("README.md");
const page = read("site/community-review/index.html");
const security = read("SECURITY.md");

const templatePaths = [
  ".github/ISSUE_TEMPLATE/community_security_finding.yml",
  ".github/ISSUE_TEMPLATE/community_reproducibility_issue.yml",
  ".github/ISSUE_TEMPLATE/community_test_coverage_suggestion.yml",
  ".github/ISSUE_TEMPLATE/community_review_question.yml"
];
const templates = templatePaths.map(read).join("\n");
const publicText = [guide, lifecycle, readme, page].join("\n");

assert(/^[0-9a-f]{40}$/.test(status.candidateCommit || ""), "Community review candidate commit is missing or invalid");
assert(/^[0-9a-f]{40}$/.test(status.freezeCommit || ""), "Community review freeze commit is missing or invalid");
assert(/^[0-9a-f]{40}$/.test(status.definitionCommit || ""), "Community review definition commit is missing or invalid");
assert(/^[0-9a-f]{64}$/.test(status.packageSha256 || ""), "Community review package SHA-256 is missing or invalid");
assert(status.candidateCommit === candidate.evidenceCommit, "Community review candidate commit disagrees with the immutable candidate definition");
assert(status.freezeCommit === candidate.v2FreezeCommit, "Community review freeze commit disagrees with the immutable candidate definition");
assert(status.packageSha256 === candidate.packageSha256, "Community review package checksum disagrees with the immutable candidate definition");
assert(status.status === "open-for-community-peer-review", "Community review status must be open-for-community-peer-review");
assert(status.formalAuditStatus === "not-started", "Formal audit status must remain not-started");
assert(!Number.isNaN(Date.parse(status.openedAt)), "Community review openedAt must be an ISO date");
assert(!Number.isNaN(Date.parse(status.lastEvidenceRefresh)), "Community review lastEvidenceRefresh must be an ISO date");

for (const field of ["publicFindingsCount", "privateFindingsCountPubliclyDisclosedAsAggregate"]) {
  assert(Number.isInteger(status[field]) && status[field] >= 0, `${field} must be a non-negative integer`);
}
assert(Array.isArray(status.reviewersAcknowledged), "reviewersAcknowledged must be an array");
assert(status.reviewersAcknowledged.every((reviewer) => typeof reviewer === "string" && reviewer.trim()), "Acknowledged reviewer names must be non-empty strings");
assert(new Set(status.reviewersAcknowledged).size === status.reviewersAcknowledged.length, "Acknowledged reviewer names must be unique");

const requiredFindingFields = [
  "findingId", "reviewer", "candidateCommit", "title", "affectedFiles", "severity", "status",
  "description", "impact", "reproduction", "remediation", "regressionTest", "retestStatus", "disclosureStatus"
];
assert(requiredFindingFields.every((field) => schema.required.includes(field) && schema.properties[field]), "Finding schema is missing required fields");

for (const value of [status.candidateCommit, status.freezeCommit, status.packageSha256]) {
  assert(guide.includes(value) && page.includes(value), `Public review surfaces are missing ${value}`);
}
assert(guide.includes(`tree/${status.candidateCommit}`), "Guide lacks an immutable candidate tree link");
assert(guide.includes(`blob/${status.candidateCommit}/`), "Guide lacks immutable candidate file links");
assert(page.includes(`tree/${status.candidateCommit}`), "Community Review page lacks an immutable candidate tree link");
assert(page.includes(`blob/${status.freezeCommit}/`), "Community Review page lacks immutable frozen V2 source links");
assert(!/github\.com\/denterion\/Token-TIkiDeco\/(?:blob|tree)\/main\/(?:contracts\/TikiDeco(?:Token|VestingVault)V2\.sol|scripts\/deploy-v2\.cjs)/i.test(publicText), "Review source link points to mutable main");

for (const phrase of [
  "Community peer review is not a formal audit",
  "V2 remains non-canonical",
  "Independent professional audit is not completed"
]) assert(publicText.toLowerCase().includes(phrase.toLowerCase()), `Community review boundary is missing: ${phrase}`);

for (const pattern of [
  /community (?:peer )?review (?:is|was|has been) (?:a )?(?:completed )?(?:formal )?(?:independent )?(?:smart-contract )?audit/i,
  /\bV2 is canonical\b/i,
  /\baudit passed\b/i
]) assert(!pattern.test(publicText), `Unsupported community review claim found: ${pattern}`);

for (const phrase of [
  "security/advisories/new",
  "do not publish exploitable unresolved critical or high",
  "private keys",
  "seed phrases"
]) assert(`${guide}\n${templates}`.toLowerCase().includes(phrase), `Sensitive-reporting instruction is missing: ${phrase}`);
assert(security.includes("GitHub private vulnerability reporting"), "SECURITY.md lacks private vulnerability reporting instructions");

if (status.reviewersAcknowledged.length === 0) {
  assert(page.includes("No reviewers have been acknowledged yet"), "Empty acknowledgements state is not visible");
} else {
  for (const reviewer of status.reviewersAcknowledged) assert(page.includes(reviewer), `Acknowledged reviewer is missing from page: ${reviewer}`);
}

for (const templatePath of templatePaths) assert(fs.existsSync(path.join(root, templatePath)), `Missing issue form: ${templatePath}`);
assert(!/<button[^>]*>\s*(?:Buy|Connect wallet|Approve|Transfer)/i.test(page), "Community Review page contains a transaction or wallet-connect button");

console.log(`Community review checks passed for candidate ${status.candidateCommit}.`);
console.log(`Package SHA-256: ${status.packageSha256}`);
console.log(`Acknowledged reviewers: ${status.reviewersAcknowledged.length}`);

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validReference(value) {
  return /^https:\/\/[^\s]+$/.test(String(value || "")) || /^private-reference:sha256:[0-9a-f]{64}$/.test(String(value || ""));
}

function validDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function placeholder(value) {
  const text = String(value || "").trim();
  return !text || /^(?:fake|test|example|placeholder|tbd|unknown)(?:[-_ ]|$)/i.test(text) || /(?:example\.com|localhost)/i.test(text);
}

const candidate = json("config/audit/v2-review-candidate.json");
const community = json("config/community-review/status.json");
const tracker = json("operations/community-review/outreach.json");
const kit = read("docs/community-review/REVIEWER_OUTREACH_KIT.md");
const session = read("docs/community-review/FIRST_REVIEW_SESSION.md");
const policy = read("docs/community-review/ACKNOWLEDGEMENT_POLICY.md");
const security = read("SECURITY.md");
const handoff = read("docs/REVIEWER_HANDOFF_CHECKLIST.md");
const maintainerBoard = read("docs/CONTRIBUTOR_TASK_BOARD.md");
const mode = process.argv.includes("--intake") ? "intake" : "outreach";
const expectedStatuses = ["not-contacted", "contacted", "replied", "interested", "declined", "reviewing", "submitted-finding", "completed"];

assert(tracker.candidateCommit === candidate.evidenceCommit, "Outreach candidate commit disagrees with the immutable candidate.");
assert(tracker.packageSha256 === candidate.packageSha256, "Outreach package checksum disagrees with the immutable candidate.");
assert(community.candidateCommit === tracker.candidateCommit && community.packageSha256 === tracker.packageSha256, "Community review and outreach identities disagree.");
assert(JSON.stringify(tracker.allowedStatuses) === JSON.stringify(expectedStatuses), "Outreach statuses differ from the approved lifecycle.");
assert(Array.isArray(tracker.records) && Array.isArray(tracker.acknowledgements), "Outreach records or acknowledgements are missing.");

for (const document of [kit, session]) {
  assert(document.includes(tracker.candidateCommit), "Reviewer material is missing the exact candidate commit.");
  assert(document.includes(tracker.packageSha256), "Reviewer material is missing the package checksum.");
  assert(document.includes("security/advisories/new") && document.includes("SECURITY.md"), "Private vulnerability reporting instructions are missing.");
}

const draftMatch = kit.match(/<!-- outreach-drafts:start -->([\s\S]*?)<!-- outreach-drafts:end -->/);
assert(draftMatch, "Outreach drafts are missing their checkable boundary.");
const drafts = draftMatch[1];
for (const heading of ["X", "LinkedIn", "Direct Message", "University Blockchain Or Security Community", "Open-Source Solidity Community", "GitHub Discussion Draft"]) {
  assert(drafts.includes(`### ${heading}`), `Outreach draft is missing: ${heading}`);
}
for (const pattern of [
  /\bcommunity audit\b/i,
  /\baudit reviewers?\b/i,
  /\baudit passed\b/i,
  /\bcommunity peer review (?:is|was|has been) (?:an? )?(?:formal )?(?:independent )?(?:smart-contract )?audit\b/i,
  /\b(?:we|TikiDeco) will (?:pay|compensate)\b/i,
  /\bbounty (?:is )?available\b/i
]) assert(!pattern.test(drafts), `Unsupported outreach claim found: ${pattern}`);

assert(security.includes("GitHub private vulnerability reporting"), "SECURITY.md lacks private vulnerability reporting.");
assert(policy.includes("explicit consent") && policy.includes("real, referenceable contribution"), "Acknowledgement policy lacks consent or contribution requirements.");
assert(handoff.includes("community-review/REVIEWER_OUTREACH_KIT.md") && maintainerBoard.includes("community-review/REVIEWER_OUTREACH_KIT.md"), "Maintainer-only outreach links are missing.");

const records = new Map();
for (const record of tracker.records) {
  assert(!placeholder(record.reviewerId), "Outreach contains a placeholder or fake reviewer identifier.");
  assert(!placeholder(record.publicProfileUrl) && /^https:\/\/[^\s]+$/.test(record.publicProfileUrl), `Reviewer ${record.reviewerId} lacks public identity evidence.`);
  assert(record.candidateCommit === tracker.candidateCommit, `Reviewer ${record.reviewerId} is tied to the wrong candidate.`);
  assert(expectedStatuses.includes(record.status), `Reviewer ${record.reviewerId} has an unsupported status.`);
  assert(validReference(record.evidenceReference), `Reviewer ${record.reviewerId} lacks a public or hashed private evidence reference.`);
  assert(validDate(record.updatedAt), `Reviewer ${record.reviewerId} lacks a valid update timestamp.`);
  assert(!records.has(record.reviewerId), `Duplicate reviewer record: ${record.reviewerId}`);
  assert(!/(?:@[^\s]+\.[^\s]+|privateKey|seedPhrase|phoneNumber)/i.test(JSON.stringify(record)), `Reviewer ${record.reviewerId} record contains prohibited private data.`);
  records.set(record.reviewerId, record);
}

const acknowledgementNames = [];
for (const acknowledgement of tracker.acknowledgements) {
  const record = records.get(acknowledgement.reviewerId);
  assert(record, `Acknowledgement ${acknowledgement.reviewerId} has no outreach record.`);
  assert(acknowledgement.consent === true && validDate(acknowledgement.consentAt), `Acknowledgement ${acknowledgement.reviewerId} lacks explicit dated consent.`);
  assert(!placeholder(acknowledgement.displayName), `Acknowledgement ${acknowledgement.reviewerId} has a placeholder display name.`);
  assert(validReference(acknowledgement.contributionReference), `Acknowledgement ${acknowledgement.reviewerId} lacks contribution evidence.`);
  assert(["submitted-finding", "completed"].includes(record.status), `Acknowledgement ${acknowledgement.reviewerId} has no completed contribution state.`);
  acknowledgementNames.push(acknowledgement.displayName);
}

assert(new Set(acknowledgementNames).size === acknowledgementNames.length, "Acknowledgement display names are duplicated.");
assert(JSON.stringify([...acknowledgementNames].sort()) === JSON.stringify([...community.reviewersAcknowledged].sort()), "Public acknowledgements disagree with consent-backed outreach records.");

console.log(`Reviewer ${mode} checks passed: ${tracker.records.length} outreach records, ${tracker.acknowledgements.length} consent-backed acknowledgements.`);
console.log(`Candidate: ${tracker.candidateCommit}`);
console.log(`Package SHA-256: ${tracker.packageSha256}`);

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const json = (relativePath) => JSON.parse(read(relativePath));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function gitIsAncestor(ancestor, descendant) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function currentMainCommit() {
  if (process.env.GITHUB_REF === "refs/heads/main" && /^[0-9a-f]{40}$/i.test(process.env.GITHUB_SHA || "")) {
    return process.env.GITHUB_SHA;
  }
  try {
    return git("rev-parse", "origin/main");
  } catch {
    return git("rev-parse", "HEAD");
  }
}

function sha256(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex");
}

const versions = json("config/public-versions.json");
const evidence = json("config/release-evidence.json");
const manifest = json("deployments/canonical.json");
const campaign = json("config/utility-pilot/tide-community-preview-001.json");
const packageJson = json("package.json");
const trustHtml = read("site/trust/index.html");
const initialHtml = read("site-v2/index.html");
const sourceMap = read("docs/TRUST_CENTER_SOURCE_MAP.md");
const operatorStatus = read("docs/OPERATOR_AND_ENTITY_STATUS.md");
const participation = read("docs/PUBLIC_PARTICIPATION.md");
const mainCommit = currentMainCommit();

assert(Array.isArray(versions.publishedReleases) && versions.publishedReleases.length > 0, "No public releases are registered");
for (const release of versions.publishedReleases) {
  assert(/^[0-9a-f]{40}$/i.test(release.sourceCommit), `${release.version} is missing an exact source commit`);
  assert(release.status === "published-pre-release", `${release.version} must be labeled published-pre-release`);
  assert(fs.existsSync(path.join(root, release.releaseDocument)), `${release.version} release document is missing`);
  assert(git("rev-list", "-n", "1", release.tag) === release.sourceCommit, `${release.tag} does not resolve to its registered source commit`);
  assert(read(release.releaseDocument).includes(release.sourceCommit), `${release.releaseDocument} does not contain its source commit`);
  assert(trustHtml.includes(release.sourceCommit), `${release.version} source commit is missing from /trust/`);
}

assert(/^[0-9a-f]{40}$/i.test(mainCommit), "Current main commit is unavailable");
assert(trustHtml.includes(mainCommit), "Trust Center does not show the current main commit used by this build");
assert(trustHtml.includes("mutable development line"), "Current main is not distinguished from immutable release tags");
assert(trustHtml.includes("published-pre-release"), "Published pre-release status is missing from the version matrix");
assert(trustHtml.includes("planned-not-published"), "Next release candidate is not clearly marked as planned");

for (const field of ["sourceArchiveSha256", "releaseManifestSha256", "checksumsSha256", "transparencyReportSha256"]) {
  assert(/^[0-9a-f]{64}$/i.test(evidence[field] || ""), `Evidence field ${field} must contain a SHA-256 hash`);
}
assert(fs.existsSync(path.join(root, evidence.transparencyReport)), "Evidence report is missing");
assert(sha256(evidence.transparencyReport) === evidence.transparencyReportSha256, "Evidence report SHA-256 does not match config/release-evidence.json");
assert(trustHtml.includes(evidence.sourceCommit), "Evidence commit is missing from /trust/");
assert(trustHtml.includes(evidence.transparencyReportSha256), "Evidence report hash is missing from /trust/");
assert(gitIsAncestor(evidence.sourceCommit, mainCommit), "Evidence source commit must remain in current main history");

assert(packageJson.scripts["deps:audit"] === "npm audit --audit-level=moderate", "deps:audit must be the explicit npm advisory scan");
assert(packageJson.scripts["audit:deps"] === "npm run deps:audit", "audit:deps compatibility alias is missing");
assert(trustHtml.includes("npm advisory scan only; not an independent smart-contract audit"), "Dependency audit terminology is ambiguous on /trust/");

assert(operatorStatus.includes("No commercial hospitality service operating"), "Hospitality-business status is missing");
assert(operatorStatus.includes("Not publicly verified"), "Operator/entity status must expose unverified facts");
assert(trustHtml.includes("No commercial hospitality service operating"), "Hospitality-business boundary is missing from /trust/");
assert(trustHtml.includes("Legal entity") && trustHtml.includes("Not publicly verified"), "Legal-entity status is missing from /trust/");

assert(campaign.status === "draft-not-live", "Pilot campaign must remain draft-not-live");
assert(manifest.contractVersion === "v1-legacy", "Canonical version changed from v1-legacy");
assert(manifest.auditStatus.independentAudit === "not-started", "Independent audit status must remain not-started");
for (const value of [manifest.contracts.token.address, manifest.contracts.vestingVault.address, manifest.ownership.safeThreshold]) {
  assert(trustHtml.includes(value), `Critical canonical fact missing from /trust/: ${value}`);
}

const criticalLabels = [
  "Current main commit",
  "Current evidence commit",
  "Token",
  "Vesting vault",
  "Safe threshold",
  "Legal entity",
  "Hospitality business",
  "Security reporting",
  "Public feedback"
];
for (const label of criticalLabels) {
  const pattern = new RegExp(`data-source-linked-fact[^>]*>\\s*<dt>${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</dt>\\s*<dd><a `, "i");
  assert(pattern.test(trustHtml), `Critical Trust Center fact is not source-linked: ${label}`);
}

const displayedFactLabels = [...trustHtml.matchAll(/data-source-linked-fact[^>]*>\s*<dt>([^<]+)<\/dt>/g)].map((match) => match[1]);
assert(displayedFactLabels.length > 0, "No source-linked Trust Center facts were found");
for (const label of displayedFactLabels) {
  assert(sourceMap.includes(`| ${label} |`), `Source map is missing displayed fact: ${label}`);
}

for (const required of ["GitHub Issues", "GitHub Discussions", "Security Disclosure", "Documentation Feedback", "Translation Feedback"]) {
  assert(participation.includes(required), `Public participation path is missing: ${required}`);
}

for (const phrase of [
  "what TikiDeco is",
  "What currently works",
  "What is not live",
  "Current version",
  "Pilot status",
  "Independent audit not started",
  "href=\"/trust/\"",
  "href=\"/status/\"",
  "href=\"/pilot/\"",
  "href=\"/audit/\"",
  "github.com/denterion/Token-TIkiDeco/issues"
]) {
  assert(initialHtml.toLowerCase().includes(phrase.toLowerCase()), `Initial HTML fallback is missing: ${phrase}`);
}

const unsupportedPositiveClaims = [
  /confirmed hospitality partner/i,
  /our (?:hotel|property|hospitality partner|commercial hospitality service)/i,
  /registered (?:company|business entity)/i,
  /independently audited smart-contracts?/i
];
for (const pattern of unsupportedPositiveClaims) {
  assert(!pattern.test(trustHtml), `Unsupported public claim found on /trust/: ${pattern}`);
}

console.log("Trust Center checks passed.");
console.log(`Current main: ${mainCommit}`);
console.log(`Evidence commit: ${evidence.sourceCommit} (${evidence.sourceCommit === mainCommit ? "current" : "recorded ancestor"})`);

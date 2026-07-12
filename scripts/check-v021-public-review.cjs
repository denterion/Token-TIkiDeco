const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const release = "v0.2.1-public-review";

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function json(relative) {
  return JSON.parse(read(relative));
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const config = json(`config/releases/${release}.json`);
const versions = json("config/public-versions.json");
const evidence = json("config/release-evidence.json");
const candidate = json("config/audit/v2-review-candidate.json");
const community = json("config/community-review/status.json");
const releaseDoc = read(`docs/releases/${release}.md`);
const monthly = json("docs/reports/MONTHLY_REPORT_2026_07.json");

assert(config.status === "draft-not-published", "v0.2.1 must remain a non-published draft.");
assert(config.sourceCommit === evidence.sourceCommit && config.sourceCommit === monthly.sourceCommit, "Source commit disagrees across release evidence.");
assert(versions.nextReleaseCandidate.version === release && versions.nextReleaseCandidate.sourceCommit === config.sourceCommit, "Public version matrix is stale.");
assert(execFileSync("git", ["rev-parse", "v0.1.0-sepolia"], { cwd: root, encoding: "utf8" }).trim() === "e07471936375ffbe13c68da2708b4436931392a2", "v0.1 tag changed.");
assert(execFileSync("git", ["rev-parse", "v0.2.0-utility-pilot"], { cwd: root, encoding: "utf8" }).trim() === "5ed20415b569779f8b00245af8b98b9599f77044", "v0.2 tag changed.");
execFileSync("git", ["merge-base", "--is-ancestor", config.sourceCommit, "HEAD"], { cwd: root, stdio: "ignore" });

assert(candidate.evidenceCommit === community.candidateCommit, "Community review no longer references the immutable candidate.");
assert(candidate.packageSha256 === community.packageSha256, "Community review candidate checksum mismatch.");
assert(candidate.independentAuditStatus === "not-started" && community.formalAuditStatus === "not-started", "Independent audit status changed without external evidence.");

const packageDir = path.join(root, config.packagePath);
for (const file of ["release-manifest.json", "SHA256SUMS.txt", "PACKAGE_SHA256.txt", `source-${config.sourceCommit}.zip`]) {
  assert(fs.existsSync(path.join(packageDir, file)), `Missing release package artifact: ${file}`);
}
assert(sha256(path.join(packageDir, "release-manifest.json")) === config.packageSha256, "Package SHA-256 mismatch.");
const packageManifest = JSON.parse(fs.readFileSync(path.join(packageDir, "release-manifest.json"), "utf8"));
assert(packageManifest.sourceCommit === config.sourceCommit && packageManifest.evidenceCommit === config.evidenceCommit, "Package source/evidence commits disagree with release config.");
execFileSync("git", ["merge-base", "--is-ancestor", config.evidenceCommit, "HEAD"], { cwd: root, stdio: "ignore" });
assert(sha256(path.join(packageDir, `source-${config.sourceCommit}.zip`)) === config.sourceArchiveSha256, "Source archive SHA-256 mismatch.");
assert(sha256(path.join(packageDir, "SHA256SUMS.txt")) === config.checksumsSha256, "Checksums file SHA-256 mismatch.");
for (const line of read(path.relative(root, path.join(packageDir, "SHA256SUMS.txt"))).trim().split(/\r?\n/)) {
  const [expected, relative] = line.split(/\s{2}/);
  assert(sha256(path.join(packageDir, relative)) === expected, `Checksum mismatch: ${relative}`);
}

for (const phrase of [
  "Community Review Hub",
  "Safe test-only drill",
  "fake-data operator sandbox",
  "monthly transparency automation",
  "not offered for sale",
  "no stated monetary value",
  "not deployed on mainnet",
  "not independently audited"
]) assert(releaseDoc.toLowerCase().includes(phrase.toLowerCase()), `Release draft is missing: ${phrase}`);
for (const exact of [config.sourceCommit, config.evidenceCommit, config.packageSha256, candidate.evidenceCommit]) {
  assert(releaseDoc.includes(exact), `Release draft is missing exact evidence: ${exact}`);
}

for (const phrase of ["published release", "formal audit completed", "V2 is canonical", "mainnet-ready", "active hotel benefit"]) {
  assert(!releaseDoc.toLowerCase().includes(phrase.toLowerCase()), `Unsupported release wording: ${phrase}`);
}
assert(!/\bTBD\b/i.test(releaseDoc), "Release draft contains TBD.");
assert(config.publication.automatic === false, "Automatic publication must remain disabled.");

console.log(`v0.2.1 draft package checks passed for ${config.sourceCommit}.`);
console.log(`Package SHA-256: ${config.packageSha256}`);
console.log("Published v0.1/v0.2 tags remain immutable; no release was published.");

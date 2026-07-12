const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const today = new Date().toISOString().slice(0, 10);
const month = process.env.REPORT_MONTH || today.slice(0, 7);
const token = month.replace("-", "_");
const base = `MONTHLY_REPORT_${token}`;
const paths = {
  report: `docs/reports/${base}.md`,
  summary: `docs/reports/${base}.json`,
  checksum: `docs/reports/${base}.sha256`,
  latest: "docs/reports/MONTHLY_REPORT_LATEST.md",
  x: `docs/social/monthly/${base}_X.md`,
  telegram: `docs/social/monthly/${base}_TELEGRAM.md`
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function json(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseStatusChecks(markdown) {
  const section = markdown.split("## Check Results")[1]?.split("\n## ")[0] || "";
  return section.split(/\r?\n/)
    .filter((line) => /^\|[^-].*\|$/.test(line) && !line.includes("| Check |"))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length === 4 && !cells.every((cell) => /^:?-+:?$/.test(cell)))
    .map(([name, status, duration, checkCommand]) => ({ name, status, duration, command: checkCommand.replaceAll("`", "") }));
}

for (const file of Object.values(paths)) assert(fs.existsSync(path.join(root, file)), `Missing monthly transparency artifact: ${file}`);

const report = read(paths.report);
const summary = json(paths.summary);
const checksum = read(paths.checksum).trim();
const latest = read(paths.latest);
const social = `${read(paths.x)}\n${read(paths.telegram)}`;
const canonical = json("deployments/canonical.json");
const versions = json("config/public-versions.json");
const releaseEvidence = json("config/release-evidence.json");
const candidate = json("config/audit/v2-review-candidate.json");
const community = json("config/community-review/status.json");
const findings = json("config/community-review/findings.json");
const pilot = json("config/utility-pilot/tide-community-preview-001.json");

assert(summary.month === month, `Monthly summary is stale: expected ${month}, received ${summary.month}`);
assert(summary.generatedAt.startsWith(`${month}-`), "Monthly report is presented as current but has an old generation date.");
assert(latest.includes(`[${month}](${base}.md)`), "Latest monthly pointer does not identify the current report.");
assert(latest.includes(summary.reportSha256), "Latest monthly pointer has a mismatched report hash.");

const [body, integrity] = report.split("\n## Report Integrity\n");
assert(body && integrity, "Report integrity section is missing.");
const expectedHash = crypto.createHash("sha256").update(body).digest("hex");
assert(summary.reportSha256 === expectedHash, "JSON report hash does not match the report body.");
assert(integrity.includes(expectedHash), "Markdown report is missing its body hash.");
assert(checksum === `${expectedHash}  ${base}.md.body`, "Checksum file does not match the report body.");

assert(candidate.evidenceCommit === community.candidateCommit, "Community review candidate commit is stale.");
assert(candidate.evidenceCommit === findings.candidateCommit, "Findings registry candidate commit is stale.");
assert(candidate.packageSha256 === community.packageSha256 && candidate.packageSha256 === findings.packageSha256, "Candidate package checksums disagree.");
assert(summary.v2Candidate.evidenceCommit === candidate.evidenceCommit, "Monthly summary references a stale candidate commit.");
execFileSync("git", ["cat-file", "-e", `${candidate.evidenceCommit}^{commit}`], { cwd: root, stdio: "ignore" });
execFileSync("git", ["merge-base", "--is-ancestor", summary.sourceCommit, "HEAD"], { cwd: root, stdio: "ignore" });

assert(summary.releases.length === versions.publishedReleases.length, "Release count mismatch.");
assert(summary.blockers.releaseEvidenceSourceCommit === releaseEvidence.sourceCommit, "Release evidence source commit mismatch.");
assert(summary.blockers.releaseEvidenceMatchesMainAtGeneration === (releaseEvidence.sourceCommit === summary.sourceCommit), "Release evidence freshness flag mismatch.");
assert(!summary.checks.results.some((item) => item.name === "---" || item.status === "---"), "Status-table separator was parsed as a check result.");
assert(summary.findings.total === findings.findings.length, "Finding count mismatch.");
assert(summary.openIssues.total === summary.openIssues.issueNumbers.length, "Open issue count mismatch.");
const currentIssueNumbers = JSON.parse(execFileSync("gh", ["issue", "list", "--state", "open", "--limit", "200", "--json", "number"], { cwd: root, encoding: "utf8" }))
  .map((issue) => issue.number).sort((a, b) => a - b);
const recordedIssueNumbers = [...summary.openIssues.issueNumbers].sort((a, b) => a - b);
assert(JSON.stringify(recordedIssueNumbers) === JSON.stringify(currentIssueNumbers), "Open issue snapshot is stale or mismatched.");
const recordedChecks = parseStatusChecks(read(summary.checks.source));
assert(recordedChecks.length === summary.checks.results.length, "Status check count mismatch.");
for (const [index, item] of recordedChecks.entries()) {
  const recorded = summary.checks.results[index];
  assert(item.name === recorded.name && item.status === recorded.status && item.command === recorded.command, `Status check mismatch: ${item.name}`);
}
assert(report.includes(`| **Total** | **${summary.openIssues.total}** |`), "Markdown open issue count does not match JSON.");
assert(report.includes(`| Total recorded | ${summary.findings.total} |`), "Markdown finding count does not match JSON.");
assert(report.includes(`| Campaign | ${pilot.status}; lifecycle stage ${pilot.lifecycle.currentStage} |`), "Pilot status is stale.");

const mainnetOutput = execFileSync(process.execPath, ["scripts/check-mainnet-readiness.cjs", "--expect-blocked"], { cwd: root, encoding: "utf8" });
const mainnetCount = Number(mainnetOutput.match(/Unapproved statuses:\s*(\d+)/)?.[1]);
assert(summary.blockers.mainnetUnapprovedStatuses === mainnetCount, "Mainnet blocker count mismatch.");

for (const heading of [
  "Current Main Commit", "Canonical Deployment", "Current Releases", "V2 Candidate Status", "Community Review Status",
  "Findings Summary", "Open Issue Summary", "Test And Security Checks", "Pilot Status", "Safe Drill Status",
  "Operator Sandbox Status", "Legal And External-Review Blockers", "Mainnet Status", "Roadmap Progress", "Next-Month Goals"
]) assert(report.includes(`## ${heading}`), `Monthly report missing section: ${heading}`);

for (const line of body.split(/\r?\n/).filter((value) => value.startsWith("|"))) {
  if (/^\|\s*(?:---|Fact\s*\||Release\s*\||Milestone\s*\||Check\s*\||Status\s*\||Blocker\s*\|)/.test(line)) continue;
  assert(line.includes("](") || /`(?:git|node|npm)\s/.test(line), `Factual table row lacks a source link or verification command: ${line}`);
}

const publicText = `${report}\n${social}`;
assert(!publicText.includes("В·"), "Monthly public artifacts contain a text-encoding artifact.");
for (const [pattern, label] of [
  [/\baudit (?:is )?completed\b/i, "completed audit"],
  [/\bconfirmed (?:hotel |hospitality )?partner\b/i, "confirmed partner"],
  [/\blegal approval (?:was |is )?(?:received|granted|complete)\b/i, "legal approval"],
  [/\bactive (?:hotel|hospitality|guest) benefits? (?:are |is )?live\b/i, "active benefit"],
  [/\bmainnet[- ]ready\b/i, "mainnet readiness"],
  [/\bTIDE has monetary value\b/i, "monetary value"],
  [/\bexchange[- ]ready\b/i, "exchange readiness"],
  [/\bV2 is canonical\b/i, "canonical V2"]
]) assert(!pattern.test(publicText), `Unsupported public claim found: ${label}`);

const allowedAddresses = new Set([
  canonical.contracts.token.address,
  canonical.contracts.vestingVault.address,
  canonical.ownership.ownerSafe,
  canonical.treasury.address
].map((address) => address.toLowerCase()));
const serializedSummary = JSON.stringify(summary);
for (const address of `${publicText}\n${serializedSummary}`.match(/0x[0-9a-fA-F]{40}/g) || [])
  assert(allowedAddresses.has(address.toLowerCase()), `Unexpected wallet or participant address in public report: ${address}`);
assert(!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(serializedSummary), "Monthly JSON contains an email-like value.");
for (const key of ["walletAddress", "guestName", "emailAddress", "bookingData", "participantData", "privateKey", "seedPhrase"])
  assert(!serializedSummary.includes(`\"${key}\"`), `Monthly JSON contains prohibited private-data field: ${key}`);

for (const state of ["Completed", "In progress", "Blocked", "Planned"])
  assert(social.includes(state), `Social drafts do not distinguish status: ${state}`);

for (const file of ["README.md", "docs/PUBLIC_EVIDENCE_DASHBOARD.md", "docs/TRUST_CENTER_SOURCE_MAP.md"])
  assert(read(file).includes("MONTHLY_REPORT_LATEST.md"), `Latest monthly report is not linked from ${file}`);
const siteBuilder = read("scripts/build-site-pages.cjs");
assert(siteBuilder.includes("MONTHLY_REPORT_\\d{4}_\\d{2}\\.json") && siteBuilder.includes("monthlyReportUrl"), "Site builder does not resolve the latest monthly JSON summary.");
assert(read("site/status/index.html").includes(paths.report), "Generated website status page does not link the current monthly report.");
assert(read("site/trust/index.html").includes(paths.report), "Generated Trust Center does not link the current monthly report.");

console.log(`Monthly transparency report checks passed for ${month}.`);
console.log(`Report body SHA-256: ${expectedHash}`);
console.log(`Open issues: ${summary.openIssues.total}; findings: ${summary.findings.total}; mainnet blockers: ${mainnetCount}`);

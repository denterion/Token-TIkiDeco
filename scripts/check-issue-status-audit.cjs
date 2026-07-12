const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "operations", "github", "issue-actions.json"), "utf8"));
const auditDoc = fs.readFileSync(path.join(root, "docs", "ISSUE_STATUS_AUDIT.md"), "utf8");
const packageScripts = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).scripts;
const statuses = new Set(["not started", "partially implemented", "implemented but not verified", "completed", "blocked externally", "superseded", "duplicate"]);
const requiredLabels = ["priority:P0", "priority:P1", "priority:P2", "security", "review", "frontend", "accessibility", "documentation", "privacy", "operations", "externally-blocked", "ready-for-contributor", "good-first-issue"];
const expectedMilestoneQuarter = new Map([
  ["Community Review Intake", "Q1 2026-07 to 2026-09"],
  ["Public Preview Hardening", "Q1 2026-07 to 2026-09"],
  ["External Validation", "Q1 2026-07 to 2026-09"],
  ["Operator Sandbox", "Q2 2026-10 to 2026-12"],
  ["Future Production Decision", "Q4 2027-04 to 2027-06"]
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function npmScript(command) {
  const match = command.match(/^npm run ([^\s]+)/);
  return match?.[1];
}

assert(data.repository === "denterion/Token-TIkiDeco", "Issue audit repository is incorrect");
assert(/^[0-9a-f]{40}$/.test(data.sourceCommit || ""), "Issue audit source commit is missing");
execFileSync("git", ["merge-base", "--is-ancestor", data.sourceCommit, "HEAD"], { cwd: root, stdio: "ignore" });
assert(auditDoc.includes(`Audit date: ${data.auditedAt}`), "Issue audit date differs between JSON and Markdown");
assert(auditDoc.includes(`Repository snapshot: \`${data.sourceCommit}\``), "Issue audit source commit differs between JSON and Markdown");
for (const label of requiredLabels) assert(data.labels.includes(label), `Required label missing from audit catalog: ${label}`);

const milestoneQuarter = new Map(data.milestones.map((item) => [item.title, item.roadmapQuarter]));
for (const [milestone, quarter] of expectedMilestoneQuarter) {
  assert(milestoneQuarter.get(milestone) === quarter, `Milestone ${milestone} conflicts with ONE_YEAR_DEVELOPMENT_PLAN.md`);
}
const ids = data.issues.map((issue) => issue.number);
assert(new Set(ids).size === ids.length, "Issue audit contains duplicate issue numbers");

for (const issue of data.issues) {
  assert(statuses.has(issue.status), `Issue #${issue.number} has invalid status: ${issue.status}`);
  assert(Array.isArray(issue.acceptanceCriteria) && issue.acceptanceCriteria.length > 0, `Issue #${issue.number} lacks acceptance criteria`);
  assert(issue.evidenceFiles.length > 0 && issue.verificationCommands.length > 0, `Issue #${issue.number} lacks evidence or verification commands`);
  assert(issue.reason && issue.suggestedComment && issue.action, `Issue #${issue.number} lacks a complete proposed action`);
  assert(issue.labels.some((label) => /^priority:P[0-2]$/.test(label)), `Issue #${issue.number} lacks a priority label`);
  assert(milestoneQuarter.get(issue.milestone) === issue.roadmapQuarter, `Issue #${issue.number} conflicts with milestone roadmap quarter`);
  assert(auditDoc.includes(`[#${issue.number}]`) || auditDoc.includes(`| #${issue.number} |`), `Issue #${issue.number} is missing from ISSUE_STATUS_AUDIT.md`);

  for (const file of issue.evidenceFiles) assert(fs.existsSync(path.join(root, file)), `Issue #${issue.number} evidence file is missing: ${file}`);
  for (const criterion of issue.acceptanceCriteria) {
    assert(typeof criterion.verified === "boolean" && criterion.evidence.length > 0, `Issue #${issue.number} has an unevidenced criterion`);
    for (const file of criterion.evidence) assert(fs.existsSync(path.join(root, file)), `Issue #${issue.number} criterion evidence is missing: ${file}`);
  }
  for (const command of issue.verificationCommands) {
    const script = npmScript(command);
    if (script) assert(packageScripts[script], `Issue #${issue.number} references missing npm script: ${script}`);
  }
  if (issue.status === "completed") {
    assert(issue.acceptanceCriteria.every((criterion) => criterion.verified), `Completed issue #${issue.number} has an unverified acceptance criterion`);
  }
  if (issue.action === "recommend-close") {
    assert(issue.status === "completed", `Issue #${issue.number} is recommended for closure without completed status`);
    assert(issue.acceptanceCriteria.every((criterion) => criterion.verified), `Issue #${issue.number} is recommended for closure without full evidence`);
  }
  if (issue.status === "blocked externally") assert(issue.labels.includes("externally-blocked"), `Externally blocked issue #${issue.number} lacks label`);
  if (/mainnet/i.test(issue.title)) {
    assert(issue.milestone === "Future Production Decision", `Mainnet issue #${issue.number} is outside Future Production Decision`);
    assert(!issue.labels.includes("ready-for-contributor"), `Mainnet issue #${issue.number} cannot be contributor-ready`);
  }
  if ((issue.status === "blocked externally" || issue.milestone === "External Validation") && issue.labels.includes("ready-for-contributor")) {
    throw new Error(`Blocked legal/audit issue #${issue.number} is presented as a coding task`);
  }
}

console.log(`Issue status audit passed for ${data.issues.length} tracked issues at ${data.sourceCommit}.`);

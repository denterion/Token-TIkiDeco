const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));
const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const roadmap = json("config/roadmap/roadmap.json");
const packageScripts = json("package.json").scripts;
const completed = new Set(["internally-complete", "externally-verified"]);
const externalTypes = new Set(["external-reviewer", "legal", "operator", "user", "production-approval"]);
const quarters = ["Q1", "Q2", "Q3", "Q4"];

function isAncestor(commit) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", commit, "HEAD"], { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function validateCommand(command) {
  const npm = command.match(/^npm run ([^\s]+)/);
  if (npm) return Boolean(packageScripts[npm[1]]);
  const node = command.match(/^node ([^\s]+)/);
  return Boolean(node && fs.existsSync(path.join(root, node[1])));
}

function stats(items) {
  const active = items.filter((item) => item.status !== "superseded");
  const verified = active.filter((item) => completed.has(item.status)).length;
  return { verified, total: active.length, percent: active.length ? Math.round((verified / active.length) * 1000) / 10 : 0 };
}

function validateRoadmap() {
  assert(roadmap.schemaVersion === "1.0.0", "Roadmap schema version is unsupported.");
  assert(Array.isArray(roadmap.items) && roadmap.items.length > 0, "Roadmap has no items.");
  assert(new Set(roadmap.items.map((item) => item.id)).size === roadmap.items.length, "Roadmap item IDs are not unique.");
  const required = ["id", "quarter", "category", "ownerType", "evidenceType", "status", "dueWindow", "evidenceFiles", "verificationCommands", "externalDependency", "sourceCommit", "lastVerifiedAt", "blocker", "nextAction"];

  for (const item of roadmap.items) {
    for (const field of required) assert(Object.hasOwn(item, field), `${item.id || "Roadmap item"} is missing ${field}.`);
    assert(quarters.includes(item.quarter), `${item.id} has an unsupported quarter.`);
    assert(roadmap.allowedStatuses.includes(item.status), `${item.id} has an unsupported status.`);
    assert(roadmap.allowedStatuses.includes(item.baselineStatus), `${item.id} has an unsupported baseline status.`);
    assert(roadmap.evidenceTypes.includes(item.evidenceType), `${item.id} has an unsupported evidence type.`);
    assert(Array.isArray(item.evidenceFiles) && item.evidenceFiles.length > 0, `${item.id} lacks evidence files.`);
    assert(Array.isArray(item.verificationCommands) && item.verificationCommands.length > 0, `${item.id} lacks verification commands.`);
    assert(typeof item.externalDependency === "boolean", `${item.id} externalDependency must be boolean.`);
    assert(/^[0-9a-f]{40}$/.test(item.sourceCommit), `${item.id} source commit is invalid.`);
    assert(isAncestor(item.sourceCommit), `${item.id} source commit is not in current history: ${item.sourceCommit}`);
    assert(!Number.isNaN(Date.parse(item.lastVerifiedAt)), `${item.id} lastVerifiedAt is invalid.`);
    assert(typeof item.nextAction === "string" && item.nextAction.trim(), `${item.id} lacks next action.`);
    for (const file of item.evidenceFiles) assert(fs.existsSync(path.join(root, file)), `${item.id} evidence file is missing: ${file}`);
    for (const command of item.verificationCommands) assert(validateCommand(command), `${item.id} references an unavailable command: ${command}`);

    if (externalTypes.has(item.evidenceType)) {
      assert(item.status !== "internally-complete", `${item.id} uses internal completion for an external evidence class.`);
      assert(item.externalDependency, `${item.id} external evidence class must retain externalDependency.`);
    }
    if (item.evidenceType === "internal-engineering") {
      assert(item.status !== "externally-verified", `${item.id} uses external verification for internal engineering evidence.`);
      assert(!item.externalDependency, `${item.id} internal engineering item cannot require external evidence.`);
    }
    if (["not-started", "externally-blocked", "no-go"].includes(item.status)) assert(typeof item.blocker === "string" && item.blocker.trim(), `${item.id} blocked state lacks a blocker.`);
  }

  const outreach = json("operations/community-review/outreach.json");
  const reviewerEngagement = roadmap.items.find((item) => item.id === "Q1-EXT-REVIEWER-ENGAGEMENT");
  assert(outreach.records.length > 0 || reviewerEngagement.status === "not-started", "Reviewer engagement advanced without a real outreach record.");
  const community = json("config/community-review/status.json");
  const independentReview = roadmap.items.find((item) => item.id === "Q2-EXT-INDEPENDENT-REVIEW");
  assert(community.reviewersAcknowledged.length > 0 || independentReview.status === "not-started", "Independent review advanced without reviewer evidence.");
  assert(!fs.existsSync(path.join(root, "operations/legal/counsel-engagement.json")) || roadmap.items.find((item) => item.id === "Q1-LEGAL-COUNSEL-ENGAGEMENT").status !== "not-started", "Counsel evidence exists but roadmap remains not-started.");

  for (const file of ["docs/ROADMAP_CURRENT.md", "docs/MAINTAINER_ACTIONS.md", `docs/reports/ROADMAP_DELTA_${roadmap.monthlyBaseline.period.replace("-", "_")}.md`, `docs/reports/ROADMAP_DELTA_${roadmap.monthlyBaseline.period.replace("-", "_")}.json`]) {
    assert(fs.existsSync(path.join(root, file)), `Generated roadmap artifact is missing: ${file}`);
  }
  const generated = `${read("docs/ROADMAP_CURRENT.md")}\n${read("docs/MAINTAINER_ACTIONS.md")}`;
  for (const item of roadmap.items) assert(generated.includes(item.id), `Generated roadmap omits ${item.id}.`);
}

function validateFreshness() {
  const versions = json("config/public-versions.json");
  for (const release of versions.publishedReleases) {
    assert(git(["rev-list", "-n", "1", release.tag]) === release.sourceCommit, `Immutable tag ${release.tag} disagrees with its recorded source commit.`);
  }

  const issueActions = json("operations/github/issue-actions.json");
  assert(isAncestor(issueActions.sourceCommit), "Issue audit source commit is not in current history.");
  const issueByNumber = new Map(issueActions.issues.map((issue) => [issue.number, issue]));
  for (const item of roadmap.items.filter((entry) => entry.mergedPr && entry.githubIssue)) {
    assert(isAncestor(item.mergeCommit), `${item.id} merged PR evidence is not in current history.`);
    assert(item.sourceCommit === item.mergeCommit, `${item.id} source commit differs from its merge evidence.`);
    assert(issueByNumber.get(item.githubIssue)?.status === "completed", `Issue #${item.githubIssue} conflicts with merged PR #${item.mergedPr} evidence.`);
  }

  const dashboard = read("docs/PUBLIC_EVIDENCE_DASHBOARD.md");
  assert(!/\| Current main snapshot \|/i.test(dashboard), "Public Evidence Dashboard describes an old immutable snapshot as current main.");
  const releaseEvidence = json("config/release-evidence.json");
  const currentMain = git(["rev-parse", "origin/main"]);
  const roadmapDoc = read("docs/ROADMAP_CURRENT.md");
  assert(roadmapDoc.includes("Repository commit at generation") && roadmapDoc.includes("Latest immutable review/release evidence snapshot"), "Generated roadmap conflates current work and immutable evidence.");
  if (releaseEvidence.sourceCommit !== currentMain) console.warn(`WARNING: immutable release evidence ${releaseEvidence.sourceCommit} predates current main ${currentMain}; historical files were not rewritten.`);
  console.log(`Current main: ${currentMain}`);
  console.log(`Latest immutable evidence snapshot: ${releaseEvidence.sourceCommit}`);
}

try {
  validateRoadmap();
  if (process.argv.includes("--freshness")) validateFreshness();
  const summary = Object.fromEntries(quarters.map((quarter) => [quarter, stats(roadmap.items.filter((item) => item.quarter === quarter))]));
  if (process.argv.includes("--status")) {
    for (const quarter of quarters) console.log(`${quarter}: ${summary[quarter].verified}/${summary[quarter].total} (${summary[quarter].percent}%)`);
    const external = stats(roadmap.items.filter((item) => externalTypes.has(item.evidenceType)));
    const internal = stats(roadmap.items.filter((item) => item.evidenceType === "internal-engineering"));
    console.log(`Internal engineering: ${internal.verified}/${internal.total} (${internal.percent}%)`);
    console.log(`External evidence: ${external.verified}/${external.total} (${external.percent}%)`);
  } else {
    console.log(`Roadmap checks passed for ${roadmap.items.length} evidence-linked items.`);
  }
} catch (error) {
  console.error(`Roadmap check failed: ${error.message}`);
  process.exit(1);
}

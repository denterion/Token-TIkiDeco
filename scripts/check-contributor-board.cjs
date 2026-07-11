const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "operations", "github", "issue-actions.json"), "utf8"));
const board = fs.readFileSync(path.join(root, "docs", "CONTRIBUTOR_TASK_BOARD.md"), "utf8");
const packageScripts = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).scripts;
const issueByNumber = new Map(data.issues.map((issue) => [issue.number, issue]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(data.contributorTasks.length >= 3, "At least three contributor-friendly issues are required");
for (const task of data.contributorTasks) {
  const issue = issueByNumber.get(task.issueNumber);
  assert(issue, `Contributor task #${task.issueNumber} is missing from issue audit`);
  assert(issue.labels.includes("ready-for-contributor"), `Contributor task #${task.issueNumber} lacks ready-for-contributor label`);
  assert(!["completed", "blocked externally", "superseded", "duplicate"].includes(issue.status), `Contributor task #${task.issueNumber} is not actionable`);
  assert(!task.requiresSecrets && !task.requiresPrivateInfrastructure && !task.requiresMainnet && !task.changesTokenEconomics, `Contributor task #${task.issueNumber} crosses a protected boundary`);
  assert(board.includes(`[#${task.issueNumber}]`), `Contributor board is missing #${task.issueNumber}`);
  for (const command of task.commands) {
    const match = command.match(/^npm run ([^\s]+)/);
    assert(match && packageScripts[match[1]], `Contributor task #${task.issueNumber} has invalid local command: ${command}`);
  }
  const taskText = `${issue.title}\n${issue.missingWork}\n${issue.dependency}`;
  assert(!/(requires? (?:a )?(?:secret|private key|seed phrase|mainnet deployment|token economics)|must deploy mainnet)/i.test(taskText), `Contributor task #${task.issueNumber} requires protected infrastructure or scope`);
}

for (const heading of ["Beginner Tasks", "Intermediate Tasks", "Security-Review Tasks", "Externally Blocked Tasks", "Maintainer-Only Tasks"]) {
  assert(board.includes(`## ${heading}`), `Contributor board is missing section: ${heading}`);
}

console.log(`Contributor board passed with ${data.contributorTasks.length} public, reproducible tasks.`);

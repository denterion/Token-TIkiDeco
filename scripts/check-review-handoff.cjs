const fs = require("fs");
const path = require("path");
const { spawnSync, execFileSync } = require("child_process");

const root = path.join(__dirname, "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runNode(script) {
  const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
  assert(result.status === 0, `${script} failed:\n${result.stdout || ""}${result.stderr || ""}`);
}

function main() {
  const status = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim();
  assert(!status, `Reviewer handoff requires a clean Git tree:\n${status}`);
  for (const file of [
    "docs/reviews/V2_REVIEW_CANDIDATE.md",
    "docs/PUBLIC_REVIEW_PROCUREMENT_BRIEF.md",
    "docs/REVIEWER_SELECTION_CHECKLIST.md",
    "docs/REVIEWER_CONFLICT_POLICY.md",
    "docs/REVIEWER_HANDOFF_CHECKLIST.md",
    "config/audit/v2-review-candidate.json"
  ]) assert(fs.existsSync(path.join(root, file)), `Missing handoff artifact: ${file}`);

  runNode("scripts/check-v2-review-candidate.cjs");
  console.log("Reviewer handoff gate passed. V2 remains non-canonical and independent audit status remains not-started.");
}

try {
  main();
} catch (error) {
  console.error(`Reviewer handoff check failed: ${error.message}`);
  process.exit(1);
}

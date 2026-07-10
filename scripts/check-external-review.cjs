const fs = require("fs");
const path = require("path");
const { spawnSync, execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const manifestPath = path.join(root, "config/audit/v2-independent-review.json");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(fs.existsSync(manifestPath), "Missing V2 independent-review manifest.");
const review = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const roleManifest = JSON.parse(fs.readFileSync(path.join(root, "config/audit/v2-role-manifest.json"), "utf8"));
assert(review.canonicalStatus === "non-canonical-candidate", "V2 must remain a non-canonical candidate.");
assert(review.independentAuditStatus === "not-started", "External independent audit must remain not-started.");
assert(/^[0-9a-f]{40}$/.test(review.v2FreezeCommit), "V2 freeze commit is invalid.");
assert(roleManifest.status === "review-template-not-deployed", "V2 role manifest must remain a non-deployed review template.");
assert(roleManifest.tokenAddress === null && roleManifest.vaultAddress === null, "V2 role manifest must not imply deployed contracts.");
assert(Object.values(roleManifest.roles).every((role) => role.address === null), "V2 role addresses must remain unset before a reviewed deployment proposal.");

const changed = execFileSync("git", [
  "diff", "--name-only", review.v2FreezeCommit, "HEAD", "--",
  ...review.contracts,
  ...review.deploymentScripts
], { cwd: root, encoding: "utf8" }).trim();
assert(!changed, `Frozen V2 review scope changed:\n${changed}`);

for (const file of [
  "docs/AUDIT_TERMINOLOGY.md",
  "docs/INDEPENDENT_REVIEWER_GUIDE.md",
  "docs/AUDIT_PROCUREMENT_BRIEF.md",
  "docs/POST_AUDIT_WORKFLOW.md",
  "config/audit/v2-role-manifest.json"
]) {
  assert(fs.existsSync(path.join(root, file)), `Missing independent-review artifact: ${file}`);
}

const handoff = spawnSync(process.execPath, ["scripts/check-audit-handoff.cjs"], { cwd: root, encoding: "utf8" });
assert(handoff.status === 0, `Audit handoff gate failed:\n${handoff.stdout}${handoff.stderr}`);
console.log("External-review checks passed for the frozen non-canonical V2 candidate.");

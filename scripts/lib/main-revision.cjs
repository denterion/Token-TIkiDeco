const { spawnSync } = require("node:child_process");

module.exports = function mainRevision(cwd) {
  for (const [isMain, sha] of [
    [process.env.GITHUB_REF === "refs/heads/main", process.env.GITHUB_SHA],
    [process.env.WORKERS_CI_BRANCH === "main", process.env.WORKERS_CI_COMMIT_SHA]
  ]) {
    if (isMain && /^[0-9a-f]{40}$/i.test(sha || "")) return sha;
  }
  const result = spawnSync("git", ["rev-parse", "--verify", "--quiet", "refs/remotes/origin/main^{commit}"], { cwd, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
};

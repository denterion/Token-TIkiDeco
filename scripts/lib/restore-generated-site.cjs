const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function restoreGeneratedSite(root) {
  const modifiedPaths = git(root, ["diff", "--name-only", "--", "site"]).split(/\r?\n/).filter(Boolean);
  if (modifiedPaths.length > 0) git(root, ["restore", "--", ...modifiedPaths]);

  const siteRoot = path.resolve(root, "site");
  const untrackedPaths = git(root, ["ls-files", "--others", "--exclude-standard", "--", "site"]).split(/\r?\n/).filter(Boolean);
  for (const relativePath of untrackedPaths) {
    const absolutePath = path.resolve(root, relativePath);
    if (!absolutePath.startsWith(`${siteRoot}${path.sep}`)) throw new Error(`Refusing to remove generated path outside site/: ${relativePath}`);
    fs.rmSync(absolutePath, { recursive: true, force: true });
  }
}

module.exports = { restoreGeneratedSite };

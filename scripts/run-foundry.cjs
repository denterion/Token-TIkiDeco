const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const foundryPaths = [
  path.join(root, ".tools", "foundry"),
  path.join(root, ".tools", "foundry", "v1.4.0")
];

const executable = process.platform === "win32" ? "forge.exe" : "forge";

function hasLocalForge(directory) {
  return fs.existsSync(path.join(directory, executable));
}

const localFoundryPath = foundryPaths.find(hasLocalForge);
const env = { ...process.env };

if (localFoundryPath) {
  env.PATH = `${localFoundryPath}${path.delimiter}${env.PATH ?? ""}`;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run-foundry.cjs <forge-args...>");
  process.exit(1);
}

const result = spawnSync("forge", args, {
  cwd: root,
  env,
  stdio: "inherit",
  shell: process.platform === "win32"
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);

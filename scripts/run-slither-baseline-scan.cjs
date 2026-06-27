const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "security-artifacts", "slither");
const jsonPath = path.join(outDir, "slither.json");

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: root,
    stdio: options.stdio || "inherit",
    shell: options.shell ?? false,
    encoding: "utf8"
  });
  return result;
}

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(jsonPath)) fs.rmSync(jsonPath);

const slitherArgs = [
  "contracts",
  "--config-file",
  "slither.config.json",
  "--solc-remaps",
  "@openzeppelin/=node_modules/@openzeppelin/",
  "--json",
  jsonPath
];

console.log("Running Slither JSON scan. Known findings are evaluated by the V2 baseline gate.");
const scan = run("slither", slitherArgs);

if (!fs.existsSync(jsonPath)) {
  const install = "pipx install slither-analyzer==0.11.3";
  throw new Error(`Slither did not produce ${path.relative(root, jsonPath)}. Ensure Slither is installed: ${install}`);
}

if (scan.status !== 0) {
  console.log(`Slither scan exited with ${scan.status}; continuing to baseline triage.`);
}

const baseline = run(process.execPath, [path.join(root, "scripts", "check-slither-baseline.cjs")]);
if (baseline.status !== 0) {
  process.exit(baseline.status || 1);
}

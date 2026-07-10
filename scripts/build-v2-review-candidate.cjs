const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync, execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const npmExecPath = process.env.npm_execpath;
const outputRoot = path.join(root, "release-artifacts", "v2-review-candidate");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 100 * 1024 * 1024 }).trim();
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    maxBuffer: 100 * 1024 * 1024
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed:\n${result.stdout || ""}${result.stderr || ""}`);
}

function runNpm(args) {
  if (npmExecPath) return run(process.execPath, [npmExecPath, ...args]);
  return run(npmBin, args);
}

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function sha256File(filePath) {
  return sha256(fs.readFileSync(filePath));
}

function copy(relativePath, packageDir) {
  const source = path.join(root, relativePath);
  assert(fs.existsSync(source), `Missing review payload input: ${relativePath}`);
  const destination = path.join(packageDir, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function parseCommit(argv) {
  const index = argv.indexOf("--commit");
  const commit = index >= 0 ? argv[index + 1] : undefined;
  assert(/^[0-9a-f]{40}$/.test(commit || ""), "Usage: npm run review:candidate:build -- --commit <40-character-sha>");
  return commit;
}

function main() {
  const commit = parseCommit(process.argv.slice(2));
  assert(git(["status", "--porcelain"]) === "", "Review candidate build requires a clean Git tree.");
  assert(git(["rev-parse", "HEAD"]) === commit, "--commit must equal current HEAD.");

  const review = readJson("config/audit/v2-independent-review.json");
  const roleTemplate = readJson("config/audit/v2-role-manifest.json");
  assert(review.canonicalStatus === "non-canonical-candidate", "V2 review status must remain non-canonical.");
  assert(review.independentAuditStatus === "not-started", "Independent audit status must remain not-started.");
  assert(roleTemplate.status === "review-template-not-deployed", "Role manifest must remain a non-deployed template.");

  const frozenPaths = [...review.contracts, ...review.deploymentScripts];
  const changedFrozenFiles = git(["diff", "--name-only", review.v2FreezeCommit, commit, "--", ...frozenPaths]);
  assert(!changedFrozenFiles, `Frozen V2 files differ from ${review.v2FreezeCommit}:\n${changedFrozenFiles}`);

  runNpm(["run", "compile"]);
  runNpm(["run", "artifacts:contracts"]);

  const packageDir = path.join(outputRoot, commit);
  fs.rmSync(packageDir, { recursive: true, force: true });
  fs.mkdirSync(packageDir, { recursive: true });

  const payloadFiles = [
    ...review.contracts,
    ...review.deploymentScripts,
    ...review.tests,
    ...review.reviewDocuments,
    "config/audit/v2-independent-review.json",
    "config/audit/v2-role-manifest.json",
    "security/slither-baseline-v2.json",
    "hardhat.config.js",
    "foundry.toml",
    "package.json",
    "package-lock.json"
  ];
  for (const relativePath of [...new Set(payloadFiles)]) copy(relativePath, packageDir);

  const artifactFiles = [
    "security-artifacts/contracts/TikiDecoTokenV2/abi.json",
    "security-artifacts/contracts/TikiDecoTokenV2/bytecode.txt",
    "security-artifacts/contracts/TikiDecoTokenV2/deployed-bytecode.txt",
    "security-artifacts/contracts/TikiDecoVestingVaultV2/abi.json",
    "security-artifacts/contracts/TikiDecoVestingVaultV2/bytecode.txt",
    "security-artifacts/contracts/TikiDecoVestingVaultV2/deployed-bytecode.txt"
  ];
  for (const relativePath of artifactFiles) copy(relativePath, packageDir);

  const sourceArchive = path.join(packageDir, `source-${commit}.zip`);
  execFileSync("git", ["archive", "--format=zip", "--output", sourceArchive, commit], { cwd: root });

  const dependencyLockHash = sha256File(path.join(root, "package-lock.json"));
  const manifest = {
    schemaVersion: "1.0.0",
    status: "immutable-independent-review-payload",
    v2FreezeCommit: review.v2FreezeCommit,
    evidenceCommit: commit,
    packageGenerationDate: git(["show", "-s", "--format=%cI", commit]),
    compiler: review.compiler,
    dependencyLockSha256: dependencyLockHash,
    contracts: review.contracts,
    deploymentScripts: review.deploymentScripts,
    tests: review.tests,
    knownIssues: review.knownIssues,
    auditorQuestions: review.auditorQuestions,
    roleManifest: review.roleManifest,
    explicitExclusions: review.outOfScope,
    independentAuditStatus: "not-started",
    sourceArchive: path.basename(sourceArchive),
    verificationCommands: [
      "npm ci",
      "npm run compile",
      "npm test",
      "npm run foundry:test",
      "npm run foundry:coverage",
      "npm run slither",
      "npm run bytecode",
      "npm run deps",
      "npm run claims",
      "npm run value"
    ]
  };
  fs.writeFileSync(path.join(packageDir, "review-package-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  const checksumPath = path.join(packageDir, "SHA256SUMS.txt");
  const checksumLines = walk(packageDir)
    .filter((filePath) => filePath !== checksumPath && path.basename(filePath) !== "PACKAGE_SHA256.txt")
    .map((filePath) => `${sha256File(filePath)}  ${path.relative(packageDir, filePath).replaceAll(path.sep, "/")}`)
    .sort();
  fs.writeFileSync(checksumPath, `${checksumLines.join("\n")}\n`);
  const packageSha256 = sha256File(checksumPath);
  fs.writeFileSync(path.join(packageDir, "PACKAGE_SHA256.txt"), `${packageSha256}\n`);

  console.log(`Review candidate payload: ${path.relative(root, packageDir).replaceAll(path.sep, "/")}`);
  console.log(`Evidence commit: ${commit}`);
  console.log(`Package SHA-256: ${packageSha256}`);
}

try {
  main();
} catch (error) {
  console.error(`Review candidate build failed: ${error.message}`);
  process.exit(1);
}

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const outputRoot = path.join(root, "release-artifacts", "v2-audit-package");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const nodeBin = process.execPath;
const npmExecPath = process.env.npm_execpath;

const requiredFiles = [
  "contracts/TikiDecoTokenV2.sol",
  "contracts/TikiDecoVestingVaultV2.sol",
  "scripts/deploy-v2.cjs",
  "scripts/check-slither-baseline.cjs",
  "scripts/check-bytecode-size.cjs",
  "scripts/check-coverage-thresholds.cjs",
  "scripts/export-contract-artifacts.cjs",
  "test/TikiDecoTokenV2.js",
  "test/TikiDecoVestingVaultV2.js",
  "test/TikiDecoInvariants.js",
  "test/V2DeploymentConfig.js",
  "foundry/TikiDecoTokenV2Invariant.t.sol",
  "foundry/TikiDecoVestingVaultV2Invariant.t.sol",
  "foundry/FoundryTestBase.sol",
  "AUDIT_SCOPE.md",
  "KNOWN_ISSUES.md",
  "SECURITY_REVIEW.md",
  "docs/V2_AUDIT_TARGET_FREEZE.md",
  "docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md",
  "docs/AUDITOR_QUESTIONS.md",
  "docs/AUDIT_RESPONSE_PROCESS.md",
  "docs/ACCESS_CONTROL.md",
  "docs/V2_DEPLOYMENT_CHECKLIST.md",
  "docs/V2_MIGRATION_NOTES.md",
  "docs/V2_ROLE_MANIFEST_SCHEMA.md",
  "docs/EXTERNAL_AUDIT_READINESS.md",
  "security/slither-baseline-v2.json",
  "deployments/canonical.json",
  "package.json",
  "package-lock.json",
  "hardhat.config.js",
  "foundry.toml"
];

const optionalPaths = [
  "coverage",
  "lcov.info",
  "security-artifacts/slither",
  "security-artifacts/test",
  "security-artifacts/coverage",
  "security-artifacts/gas",
  "out-foundry",
  "cache-foundry"
];

function rel(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    env: process.env
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  if (options.captureFile) {
    fs.mkdirSync(path.dirname(options.captureFile), { recursive: true });
    fs.writeFileSync(options.captureFile, output);
  }
  if (result.error && !options.allowFailure) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}\n${output}`);
  }
  return { status: result.status, output };
}

function runNpm(args, options = {}) {
  if (npmExecPath) return run(nodeBin, [npmExecPath, ...args], options);
  return run(npmBin, args, options);
}

function copyPath(relPath, destinationRoot) {
  const source = path.join(root, relPath);
  if (!fs.existsSync(source)) return false;
  const destination = path.join(destinationRoot, relPath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
  return true;
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return [fullPath];
  });
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertGuards() {
  const canonical = readJson("deployments/canonical.json");
  assert(canonical.contractVersion === "v1-legacy", "V2 appears promoted by canonical contractVersion.");
  assert(canonical.status === "legacy-canonical-testnet-prototype", "Canonical deployment status changed from legacy Sepolia prototype.");
  assert(canonical.auditStatus?.independentAudit === "not-started", "Independent audit completion is claimed in canonical manifest.");
  assert(canonical.auditStatus?.mainnetApproved === false, "Mainnet approval is unexpectedly true.");
  const candidates = JSON.stringify(canonical.nonCanonicalCandidates || []);
  assert(candidates.includes("v2-openzeppelin-candidate"), "Canonical manifest missing explicit V2 non-canonical candidate status.");

  const publicText = requiredFiles
    .filter((relPath) => /\.(md|json|js|cjs|sol)$/.test(relPath))
    .map((relPath) => readText(relPath).toLowerCase())
    .join("\n");
  const forbidden = [
    "independent audit complete",
    "mainnet ready",
    "production ready",
    "buy tide",
    "investment opportunity",
    "guaranteed profit",
    "revenue share"
  ];
  for (const phrase of forbidden) {
    assert(!publicText.includes(phrase), `Forbidden audit/value/mainnet claim found: ${phrase}`);
  }
}

function main() {
  assertGuards();
  runNpm(["run", "claims:check"]);
  runNpm(["run", "compile"]);
  runNpm(["run", "artifacts:contracts"]);

  const head = run("git", ["rev-parse", "HEAD"]).output.trim();
  const packageDir = path.join(outputRoot, head);
  fs.rmSync(packageDir, { recursive: true, force: true });
  fs.mkdirSync(packageDir, { recursive: true });

  const missing = requiredFiles.filter((relPath) => !copyPath(relPath, packageDir));
  assert(missing.length === 0, `Missing required audit package files:\n${missing.join("\n")}`);

  const optionalIncluded = [];
  const optionalMissing = [];
  for (const relPath of optionalPaths) {
    if (copyPath(relPath, packageDir)) optionalIncluded.push(relPath);
    else optionalMissing.push(relPath);
  }

  const artifactFiles = [
    "security-artifacts/contracts/TikiDecoTokenV2/abi.json",
    "security-artifacts/contracts/TikiDecoTokenV2/bytecode.txt",
    "security-artifacts/contracts/TikiDecoTokenV2/deployed-bytecode.txt",
    "security-artifacts/contracts/TikiDecoVestingVaultV2/abi.json",
    "security-artifacts/contracts/TikiDecoVestingVaultV2/bytecode.txt",
    "security-artifacts/contracts/TikiDecoVestingVaultV2/deployed-bytecode.txt"
  ];
  for (const relPath of artifactFiles) {
    assert(copyPath(relPath, packageDir), `Missing V2 ABI/bytecode artifact: ${relPath}`);
  }

  const files = walkFiles(packageDir);
  const checksums = files
    .filter((filePath) => !filePath.endsWith("SHA256SUMS.txt"))
    .map((filePath) => `${sha256File(filePath)}  ${path.relative(packageDir, filePath).replaceAll(path.sep, "/")}`)
    .sort()
    .join("\n");
  fs.writeFileSync(path.join(packageDir, "SHA256SUMS.txt"), `${checksums}\n`);

  const manifest = {
    schema: "tikideco.v2-audit-package/1",
    generatedAt: new Date().toISOString(),
    headCommit: head,
    v2FreezeCommit: "58806906a273a95c58944d892eb368fc1b758620",
    evidenceCommit: "e74c85612e745f14aa92260bf8b3633f9fd9fa4a",
    nonCanonical: true,
    independentAuditStatus: "not-started",
    requiredFiles,
    optionalIncluded,
    optionalMissing,
    checksums: "SHA256SUMS.txt"
  };
  writeJson(path.join(packageDir, "audit-package-manifest.json"), manifest);

  console.log(`V2 audit package generated: ${rel(packageDir)}`);
  if (optionalMissing.length > 0) {
    console.log(`Optional artifacts not present: ${optionalMissing.join(", ")}`);
  }
}

main();

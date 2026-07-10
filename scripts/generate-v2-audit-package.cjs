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
  "config/audit/v2-independent-review.json",
  "config/audit/v2-role-manifest.json",
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
  "docs/V2_AUDIT_OWNER_DECISIONS.md",
  "docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md",
  "docs/FRESH_CHECKOUT_RELEASE_PROOF.md",
  "docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md",
  "docs/AUDITOR_QUESTIONS.md",
  "docs/AUDIT_RESPONSE_PROCESS.md",
  "docs/ACCESS_CONTROL.md",
  "docs/V2_DEPLOYMENT_CHECKLIST.md",
  "docs/V2_MIGRATION_NOTES.md",
  "docs/V2_ROLE_MANIFEST_SCHEMA.md",
  "docs/EXTERNAL_AUDIT_READINESS.md",
  "docs/AUDIT_TERMINOLOGY.md",
  "docs/INDEPENDENT_REVIEWER_GUIDE.md",
  "docs/AUDIT_PROCUREMENT_BRIEF.md",
  "docs/POST_AUDIT_WORKFLOW.md",
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
  const review = readJson("config/audit/v2-independent-review.json");
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
    "hotel ownership token",
    "guaranteed profit",
    "revenue share"
  ];
  for (const phrase of forbidden) {
    assert(!publicText.includes(phrase), `Forbidden audit/value/mainnet claim found: ${phrase}`);
  }
  assert(readText("docs/V2_AUDIT_TARGET_FREEZE.md").match(/[0-9a-f]{40}/), "V2 freeze commit is missing.");
  assert(fs.existsSync(path.join(root, "security", "slither-baseline-v2.json")), "Slither baseline is missing.");
  assert(fs.existsSync(path.join(root, "KNOWN_ISSUES.md")), "KNOWN_ISSUES.md is missing.");
  assert(/^[0-9a-f]{40}$/.test(review.v2FreezeCommit), "Independent-review manifest has an invalid freeze commit.");
  assert(review.canonicalStatus === "non-canonical-candidate", "V2 review manifest must remain non-canonical.");
  assert(review.independentAuditStatus === "not-started", "V2 review manifest must keep independent audit status not-started.");

  const changedScope = run("git", [
    "diff", "--name-only", review.v2FreezeCommit, "HEAD", "--",
    ...review.contracts,
    ...review.deploymentScripts
  ]).output.trim();
  assert(!changedScope, `Frozen V2 source differs from ${review.v2FreezeCommit}:\n${changedScope}`);
}

function main() {
  assertGuards();
  runNpm(["run", "claims:check"]);
  runNpm(["run", "compile"]);
  runNpm(["run", "artifacts:contracts"]);

  const head = run("git", ["rev-parse", "HEAD"]).output.trim();
  const review = readJson("config/audit/v2-independent-review.json");
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

  const frozenArchive = path.join(packageDir, "v2-frozen-source.zip");
  run("git", [
    "archive", "--format=zip", `--output=${frozenArchive}`,
    review.v2FreezeCommit, "--",
    ...review.contracts,
    ...review.deploymentScripts,
    "hardhat.config.js",
    "foundry.toml",
    "package.json",
    "package-lock.json"
  ]);

  const manifest = {
    schema: "tikideco.v2-independent-review-package/2",
    generatedAt: new Date().toISOString(),
    headCommit: head,
    v2FreezeCommit: review.v2FreezeCommit,
    evidenceCommit: head,
    nonCanonical: true,
    independentAuditStatus: "not-started",
    compiler: review.compiler,
    dependencies: review.dependencies,
    frozenSourceArchive: "v2-frozen-source.zip",
    requiredFiles,
    optionalIncluded,
    optionalMissing,
    checksums: "SHA256SUMS.txt"
  };
  writeJson(path.join(packageDir, "audit-package-manifest.json"), manifest);

  const files = walkFiles(packageDir);
  const checksums = files
    .filter((filePath) => !filePath.endsWith("SHA256SUMS.txt"))
    .map((filePath) => `${sha256File(filePath)}  ${path.relative(packageDir, filePath).replaceAll(path.sep, "/")}`)
    .sort()
    .join("\n");
  fs.writeFileSync(path.join(packageDir, "SHA256SUMS.txt"), `${checksums}\n`);

  console.log(`V2 audit package generated: ${rel(packageDir)}`);
  if (optionalMissing.length > 0) {
    console.log(`Optional artifacts not present: ${optionalMissing.join(", ")}`);
  }
}

main();

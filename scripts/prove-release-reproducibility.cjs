const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const { restoreGeneratedSite } = require("./lib/restore-generated-site.cjs");

const root = path.join(__dirname, "..");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const nodeBin = process.execPath;
const npmExecPath = process.env.npm_execpath;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--commit") {
      args.commit = argv[++index];
    } else if (arg === "--release") {
      args.release = argv[++index];
    } else if (arg === "--expected-checksum") {
      args.expectedChecksum = String(argv[++index] || "").toLowerCase();
    } else if (arg === "--skip-install") {
      args.skipInstall = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function usage() {
  console.error("Usage: npm run release -- --commit <40-character-sha> --release <release-name> [--expected-checksum <sha256>] [--skip-install]");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    env: process.env,
    maxBuffer: 1024 * 1024 * 100
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  if (options.captureFile) {
    fs.mkdirSync(path.dirname(options.captureFile), { recursive: true });
    fs.writeFileSync(options.captureFile, output);
  }
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}\n${output}`);
  }
  return output;
}

function runNpm(args) {
  if (npmExecPath) return run(nodeBin, [npmExecPath, ...args]);
  return run(npmBin, args);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function git(args) {
  return run("git", args).trim();
}

function assertCleanTree(label) {
  const status = git(["status", "--porcelain"]);
  assert(status.length === 0, `${label}: git tree is dirty:\n${status}`);
}

function assertCommit(commit) {
  assert(/^[0-9a-f]{40}$/.test(commit || ""), "Proof requires --commit <40-character lowercase SHA>.");
  const head = git(["rev-parse", "HEAD"]);
  const resolved = git(["rev-parse", `${commit}^{commit}`]);
  assert(resolved === commit, `Supplied commit did not resolve exactly: ${resolved}`);
  assert(head === commit, `Supplied commit must match current HEAD. HEAD is ${head}.`);
}

function assertReleaseName(releaseName) {
  assert(/^[a-z0-9][a-z0-9._-]*$/i.test(releaseName || ""), "Proof requires --release <safe-release-name>.");
  assert(fs.existsSync(path.join(root, "docs", "releases", `${releaseName}.md`)), `Missing release draft: docs/releases/${releaseName}.md`);
}

function assertNoV2PromotionOrAuditClaim() {
  const canonical = readJson("deployments/canonical.json");
  assert(canonical.contractVersion === "v1-legacy", "Canonical manifest no longer points to v1-legacy.");
  assert(canonical.auditStatus?.independentAudit === "not-started", "Canonical manifest claims independent audit completion.");
  assert(canonical.auditStatus?.mainnetApproved === false, "Canonical manifest claims mainnet approval.");
  const candidates = JSON.stringify(canonical.nonCanonicalCandidates || []).toLowerCase();
  assert(candidates.includes("v2-openzeppelin-candidate"), "Canonical manifest does not identify V2 as non-canonical candidate.");

  const docsToScan = [
    "README.md",
    "AUDIT_SCOPE.md",
    "KNOWN_ISSUES.md",
    "docs/EXTERNAL_AUDIT_READINESS.md",
    "docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md",
    "docs/V2_AUDIT_TARGET_FREEZE.md",
    "docs/V2_AUDIT_OWNER_DECISIONS.md",
    "docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md",
    "docs/FRESH_CHECKOUT_RELEASE_PROOF.md"
  ];
  const forbidden = [
    /(^|[^a-z0-9])v2\s+is\s+canonical([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])v2\s+canonical\s+deployment([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])mainnet\s+ready([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])independent\s+audit\s+complete([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])buy\s+tide([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])investment\s+opportunity([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])revenue\s+share([^a-z0-9]|$)/i,
    /(^|[^a-z0-9])hotel\s+ownership([^a-z0-9]|$)/i
  ];
  const conflicts = [];
  for (const relativePath of docsToScan) {
    const lines = read(relativePath).split(/\r?\n/);
    lines.forEach((line, index) => {
      const contextStart = Math.max(0, index - 8);
      const contextEnd = Math.min(lines.length, index + 3);
      const lowerWindow = lines.slice(contextStart, contextEnd).join("\n").toLowerCase();
      const allowed = lowerWindow.includes("not ") || lowerWindow.includes("no ") || lowerWindow.includes("non-canonical")
        || lowerWindow.includes("out of scope") || lowerWindow.includes("do not") || lowerWindow.includes("forbidden")
        || lowerWindow.includes("explicit exclusions") || lowerWindow.includes("exclusions")
        || lowerWindow.includes("prohibited") || lowerWindow.includes("must not")
        || lowerWindow.includes("any claim that");
      for (const pattern of forbidden) {
        if (pattern.test(line) && !allowed) conflicts.push(`${relativePath}:${index + 1}: ${line.trim()}`);
      }
    });
  }
  assert(conflicts.length === 0, `Public/audit docs contain unsupported V2/value/mainnet claims:\n${conflicts.join("\n")}`);
}

function assertChecksum(commit, releaseName, expectedChecksum) {
  if (!expectedChecksum) return;
  assert(/^[a-f0-9]{64}$/.test(expectedChecksum), "--expected-checksum must be a 64-character SHA-256 hash.");
  const checksumPath = path.join(root, "release-artifacts", releaseName, commit, "SHA256SUMS.txt");
  assert(fs.existsSync(checksumPath), `Missing release checksum file: ${path.relative(root, checksumPath)}`);
  const actual = sha256File(checksumPath);
  assert(actual === expectedChecksum, `Checksum mismatch for SHA256SUMS.txt: expected ${expectedChecksum}, got ${actual}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  assertCommit(args.commit);
  assertReleaseName(args.release);
  assertCleanTree("preflight");
  assertNoV2PromotionOrAuditClaim();

  const commands = [];
  if (!args.skipInstall) commands.push(["npm", ["ci"]]);
  commands.push(
    ["npm", ["run", "compile"]],
    ["npm", ["test"]],
    ["npm", ["run", "foundry:test"]],
    ["npm", ["run", "foundry:coverage"]],
    ["npm", ["run", "slither"]],
    ["npm", ["run", "site"]],
    ["npm", ["run", "site:browser"]],
    ["npm", ["run", "claims"]],
    ["npm", ["run", "value"]],
    ["npm", ["run", "audit"]],
    ["npm", ["run", "audit:handoff"]],
    ["npm", ["run", "release:package", "--", "--commit", args.commit, "--release", args.release]]
  );

  for (const [command, commandArgs] of commands) {
    const printable = [command, ...commandArgs].join(" ");
    console.log(`\n> ${printable}`);
    if (command === "npm") runNpm(commandArgs);
    else run(command, commandArgs);
    if (commandArgs[0] === "run" && commandArgs[1] === "site") restoreGeneratedSite(root);
  }

  assertChecksum(args.commit, args.release, args.expectedChecksum);
  assertCleanTree("postflight");

  console.log(`Release reproducibility proof passed for ${args.release} at ${args.commit}.`);
  console.log("No deployment, tag, transaction broadcast, V2 promotion, mainnet approval, or independent audit claim was performed.");
}

try {
  main();
} catch (error) {
  usage();
  console.error(`\nRelease reproducibility proof failed: ${error.message}`);
  process.exit(1);
}

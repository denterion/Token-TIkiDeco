const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const allowedStates = new Set(["accepted-for-review", "planned-remediation-before-deployment", "ask-reviewer", "blocked-before-deployment", "resolved"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  assert(fs.existsSync(filePath), `Missing required file: ${relativePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 100 * 1024 * 1024 }).trim();
}

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function verifyOwnerDecisions() {
  const text = read("docs/V2_AUDIT_OWNER_DECISIONS.md");
  const decisionRows = [...text.matchAll(/^\| (KI-\d{2}):[^|]+\| `([^`]+)` \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)];
  const impacts = new Map([...text.matchAll(/^\| (KI-\d{2}) \| ([^|]+) \|$/gm)].map((match) => [match[1], match[2].trim()]));
  assert(decisionRows.length === 9, `Expected 9 owner decision rows, found ${decisionRows.length}.`);
  const seen = new Set();
  for (const row of decisionRows) {
    const [, id, state, rationale, , , linkedTest] = row;
    assert(!seen.has(id), `Duplicate owner decision: ${id}`);
    seen.add(id);
    assert(allowedStates.has(state), `${id} has unsupported state: ${state}`);
    assert(rationale.trim().length > 20, `${id} lacks rationale.`);
    assert(/test|existing|missing|proof/i.test(linkedTest), `${id} lacks linked test or explicit missing-test statement.`);
    assert((impacts.get(id) || "").length > 20, `${id} lacks deployment impact.`);
  }
}

function verifyChecksums(packageDir) {
  const checksumPath = path.join(packageDir, "SHA256SUMS.txt");
  assert(fs.existsSync(checksumPath), "Review package is missing SHA256SUMS.txt.");
  const lines = fs.readFileSync(checksumPath, "utf8").trim().split(/\r?\n/).filter(Boolean);
  assert(lines.length > 0, "Review package checksum file is empty.");
  for (const line of lines) {
    const match = line.match(/^([0-9a-f]{64})\s{2}(.+)$/);
    assert(match, `Malformed checksum line: ${line}`);
    const filePath = path.join(packageDir, ...match[2].split("/"));
    assert(fs.existsSync(filePath), `Checksum references missing file: ${match[2]}`);
    assert(sha256(fs.readFileSync(filePath)) === match[1], `Checksum mismatch: ${match[2]}`);
  }
  return sha256(fs.readFileSync(checksumPath));
}

function main() {
  const candidate = readJson("config/audit/v2-review-candidate.json");
  const review = readJson("config/audit/v2-independent-review.json");
  const roleTemplate = readJson("config/audit/v2-role-manifest.json");

  assert(candidate.status === "immutable-review-candidate", "Candidate status is not immutable-review-candidate.");
  assert(/^[0-9a-f]{40}$/.test(candidate.evidenceCommit || ""), "Candidate evidence commit is missing.");
  assert(candidate.v2FreezeCommit === review.v2FreezeCommit, "Candidate freeze commit disagrees with review scope.");
  assert(candidate.independentAuditStatus === "not-started", "Independent audit status must remain not-started.");
  assert(candidate.contracts.join("\n") === review.contracts.join("\n"), "Candidate contract scope disagrees with frozen scope.");
  assert(candidate.deploymentScripts.join("\n") === review.deploymentScripts.join("\n"), "Candidate deployment-script scope disagrees with frozen scope.");
  assert(candidate.tests.join("\n") === review.tests.join("\n"), "Candidate test scope disagrees with frozen scope.");

  const changedFrozenFiles = git(["diff", "--name-only", candidate.v2FreezeCommit, candidate.evidenceCommit, "--", ...review.contracts, ...review.deploymentScripts]);
  assert(!changedFrozenFiles, `Frozen files differ from freeze commit:\n${changedFrozenFiles}`);

  const lockAtEvidence = execFileSync("git", ["show", `${candidate.evidenceCommit}:package-lock.json`], { cwd: root });
  assert(sha256(lockAtEvidence) === candidate.dependencyLockSha256, "Dependency lock hash differs from candidate definition.");

  assert(roleTemplate.status === "review-template-not-deployed", "Role manifest is not a non-deployed template.");
  assert(roleTemplate.tokenAddress === null && roleTemplate.vaultAddress === null, "Role template represents deployed V2 addresses.");
  assert(roleTemplate.onChainAssertionsCompleted === false, "Role template incorrectly marks on-chain assertions complete.");
  assert(Object.values(roleTemplate.roles).every((role) => role.address === null), "Role template contains assigned addresses.");

  verifyOwnerDecisions();

  const packageDir = path.join(root, candidate.packagePath);
  assert(fs.existsSync(packageDir), `Review package missing: ${candidate.packagePath}`);
  const packageManifest = JSON.parse(fs.readFileSync(path.join(packageDir, "review-package-manifest.json"), "utf8"));
  assert(packageManifest.evidenceCommit === candidate.evidenceCommit, "Package evidence commit disagrees with candidate definition.");
  assert(packageManifest.v2FreezeCommit === candidate.v2FreezeCommit, "Package freeze commit disagrees with candidate definition.");
  assert(packageManifest.dependencyLockSha256 === candidate.dependencyLockSha256, "Package dependency hash disagrees with candidate definition.");
  assert(packageManifest.independentAuditStatus === "not-started", "Package claims independent audit completion.");

  for (const relativePath of [...review.tests, "security/slither-baseline-v2.json", ...review.contracts, ...review.deploymentScripts]) {
    assert(fs.existsSync(path.join(packageDir, relativePath)), `Review package missing scope file: ${relativePath}`);
  }
  const packageSha256 = verifyChecksums(packageDir);
  assert(packageSha256 === candidate.packageSha256, `Package SHA-256 mismatch: ${packageSha256}`);
  assert(read("docs/AUDIT_TERMINOLOGY.md").includes("formal independent smart-contract audit"), "Audit terminology is incomplete.");

  const publicText = ["AUDIT_SCOPE.md", "SECURITY_REVIEW.md", "docs/reviews/V2_REVIEW_CANDIDATE.md", "docs/PUBLIC_REVIEW_PROCUREMENT_BRIEF.md"]
    .filter((file) => fs.existsSync(path.join(root, file)))
    .map(read)
    .join("\n");
  assert(!/\baudit passed\b/i.test(publicText), "Unqualified audit-passed wording found.");
  assert(!/\bV2 is canonical\b/i.test(publicText), "V2 is described as canonical.");

  console.log(`Immutable V2 review candidate passed: ${candidate.evidenceCommit}`);
  console.log(`Package SHA-256: ${candidate.packageSha256}`);
}

try {
  main();
} catch (error) {
  console.error(`Review candidate check failed: ${error.message}`);
  process.exit(1);
}

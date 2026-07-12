const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const release = "v0.2.1-public-review";
const configPath = path.join(root, "config", "releases", `${release}.json`);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function copyFromCommit(relative, commit, targetRoot) {
  const target = path.join(targetRoot, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  try {
    fs.writeFileSync(target, execFileSync("git", ["show", `${commit}:${relative}`], { cwd: root, maxBuffer: 50 * 1024 * 1024 }));
  } catch {
    throw new Error(`Missing package evidence at ${commit}: ${relative}`);
  }
}

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const evidenceFiles = [
  "deployments/canonical.json",
  "config/audit/v2-review-candidate.json",
  "config/community-review/status.json",
  "config/community-review/findings.json",
  "config/governance/safe-resilience.json",
  "operations/governance/safe-drill-result.json",
  "config/hospitality-operator/readiness-gates.json",
  "operations/hospitality-operator/operator-sandbox-report.json",
  "docs/reports/MONTHLY_REPORT_2026_07.md",
  "docs/reports/MONTHLY_REPORT_2026_07.json",
  "docs/reports/MONTHLY_REPORT_2026_07.sha256",
  "docs/ISSUE_STATUS_AUDIT.md",
  "operations/github/issue-actions.json",
  "docs/PROJECT_FACTS.md",
  "docs/RELEASE_CONTROL_CENTER.md",
  "docs/community-review/FINDING_LIFECYCLE.md",
  "package-lock.json"
];

function main() {
  const configured = fs.existsSync(configPath) ? readJson(configPath) : {};
  const commit = argument("--commit", configured.sourceCommit);
  const evidenceCommit = argument("--evidence-commit", configured.evidenceCommit || commit);
  assert(/^[0-9a-f]{40}$/.test(commit || ""), "Use --commit with an exact 40-character lowercase SHA.");
  assert(/^[0-9a-f]{40}$/.test(evidenceCommit || ""), "Use --evidence-commit with an exact 40-character lowercase SHA.");
  const resolved = execFileSync("git", ["rev-parse", `${commit}^{commit}`], { cwd: root, encoding: "utf8" }).trim();
  assert(resolved === commit, "The requested source commit did not resolve exactly.");
  const resolvedEvidence = execFileSync("git", ["rev-parse", `${evidenceCommit}^{commit}`], { cwd: root, encoding: "utf8" }).trim();
  assert(resolvedEvidence === evidenceCommit, "The requested evidence commit did not resolve exactly.");
  execFileSync("git", ["merge-base", "--is-ancestor", commit, "HEAD"], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["merge-base", "--is-ancestor", evidenceCommit, "HEAD"], { cwd: root, stdio: "ignore" });

  const out = path.resolve(root, "release-artifacts", release, commit);
  const allowed = path.resolve(root, "release-artifacts", release) + path.sep;
  assert(out.startsWith(allowed), "Refusing to write outside the release artifact directory.");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const sourceArchive = path.join(out, `source-${commit}.zip`);
  execFileSync("git", ["archive", "--format=zip", "--output", sourceArchive, commit], { cwd: root });
  for (const file of evidenceFiles) copyFromCommit(file, evidenceCommit, path.join(out, "evidence"));

  const payload = [sourceArchive, ...evidenceFiles.map((file) => path.join(out, "evidence", file))];
  const manifest = {
    schemaVersion: "1.0.0",
    release,
    status: "draft-pre-release-package",
    sourceCommit: commit,
    evidenceCommit,
    preparedDate: "2026-07-12",
    sourceArchive: path.basename(sourceArchive),
    immutableV2Candidate: readJson(path.join(root, "config", "audit", "v2-review-candidate.json")),
    boundaries: {
      canonical: "v1-legacy-sepolia",
      v2: "frozen-non-canonical-candidate",
      communityReview: "open-peer-review-not-formal-audit",
      independentReview: "not-started",
      independentAudit: "not-started",
      pilot: "draft-not-live",
      mainnet: "not-approved",
      sale: "not-offered",
      monetaryValue: "no-stated-value",
      activeHospitalityBenefit: "not-live"
    },
    files: payload.sort().map((file) => ({
      path: path.relative(out, file).replaceAll(path.sep, "/"),
      sha256: sha256(file)
    }))
  };
  const manifestPath = path.join(out, "release-manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const packageSha256 = sha256(manifestPath);

  const checksumFiles = [...payload, manifestPath].sort();
  const checksums = checksumFiles.map((file) => `${sha256(file)}  ${path.relative(out, file).replaceAll(path.sep, "/")}`).join("\n") + "\n";
  const checksumsPath = path.join(out, "SHA256SUMS.txt");
  fs.writeFileSync(checksumsPath, checksums);
  fs.writeFileSync(path.join(out, "PACKAGE_SHA256.txt"), `${packageSha256}  release-manifest.json\n`);

  console.log(JSON.stringify({
    release,
    sourceCommit: commit,
    evidenceCommit,
    packagePath: path.relative(root, out).replaceAll(path.sep, "/"),
    packageSha256,
    sourceArchiveSha256: sha256(sourceArchive),
    checksumsSha256: sha256(checksumsPath)
  }, null, 2));
  console.log("No tag, deployment, Safe proposal, or transaction was created.");
}

try {
  main();
} catch (error) {
  console.error(`v0.2.1 package build failed: ${error.message}`);
  process.exit(1);
}

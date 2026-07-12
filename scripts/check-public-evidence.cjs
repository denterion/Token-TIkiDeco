const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  const evidence = readJson("config/release-evidence.json");
  const releaseDraft = read(`docs/releases/${evidence.release}.md`);
  const facts = read("docs/PROJECT_FACTS.md");
  const dashboard = read("docs/PUBLIC_EVIDENCE_DASHBOARD.md");
  const report = read(evidence.transparencyReport);
  const reportLower = report.toLowerCase();
  const legacyHashPath = evidence.transparencyReport.replace(/\.md$/, "_HASH.md");
  const checksumPath = evidence.transparencyReport.replace(/\.md$/, ".sha256");
  const integrity = fs.existsSync(path.join(root, legacyHashPath))
    ? read(legacyHashPath)
    : fs.existsSync(path.join(root, checksumPath)) ? read(checksumPath) : "";
  const siteFiles = [
    "site/index.html",
    "site/status/index.html",
    "site/audit/index.html",
    "site/proof/index.html"
  ].map(read).join("\n");

  const requiredDocumentedValues = [
    evidence.sourceCommit,
    evidence.reviewBundlePath,
    evidence.sourceArchiveSha256,
    evidence.releaseManifestSha256,
    evidence.checksumsSha256,
    evidence.transparencyReportSha256
  ];

  for (const value of requiredDocumentedValues) {
    assert(releaseDraft.includes(value) || dashboard.includes(value) || report.includes(value) || integrity.includes(value), `Evidence value is not documented: ${value}`);
  }

  const actualReportSha256 = crypto.createHash("sha256").update(report).digest("hex");
  assert(actualReportSha256 === evidence.transparencyReportSha256, "Transparency report SHA-256 does not match release evidence.");

  for (const value of [evidence.sourceCommit, evidence.transparencyReport]) {
    assert(facts.includes(value), `PROJECT_FACTS.md missing evidence value: ${value}`);
    assert(siteFiles.includes(value), `Generated site missing evidence value: ${value}`);
  }

  assert(siteFiles.includes(evidence.releaseManifestSha256), "Generated site missing release manifest hash");
  const publicEvidence = `${releaseDraft}\n${report}`.toLowerCase();
  assert(publicEvidence.includes("no tag") && publicEvidence.includes("deployment") && publicEvidence.includes("transaction"), "Evidence missing non-publication boundary");
  assert(publicEvidence.includes("not offered for sale") || publicEvidence.includes("no sale"), "Evidence missing no-sale boundary");
  assert(publicEvidence.includes("no stated monetary value"), "Evidence missing no-value boundary");
  assert(publicEvidence.includes("not deployed on mainnet") || publicEvidence.includes("no mainnet deployment"), "Evidence missing no-mainnet boundary");
  assert(publicEvidence.includes("independent audit") && publicEvidence.includes("not started"), "Evidence missing audit-status boundary");

  console.log(`Public evidence checks passed for ${evidence.release} at ${evidence.sourceCommit}.`);
}

main();

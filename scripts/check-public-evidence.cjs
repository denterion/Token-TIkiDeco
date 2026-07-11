const fs = require("fs");
const path = require("path");

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
  const releaseDraft = read("docs/releases/v0.2.0-utility-pilot-rc.1.md");
  const facts = read("docs/PROJECT_FACTS.md");
  const report = read(evidence.transparencyReport);
  const reportLower = report.toLowerCase();
  const hashReport = read(evidence.transparencyReport.replace(/\.md$/, "_HASH.md"));
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
    assert(releaseDraft.includes(value) || report.includes(value) || hashReport.includes(value), `Evidence value is not documented: ${value}`);
  }

  for (const value of [evidence.sourceCommit, evidence.transparencyReport]) {
    assert(facts.includes(value), `PROJECT_FACTS.md missing evidence value: ${value}`);
    assert(siteFiles.includes(value), `Generated site missing evidence value: ${value}`);
  }

  assert(siteFiles.includes(evidence.releaseManifestSha256), "Generated site missing release manifest hash");
  assert(report.includes("No tag was created. No deployment was performed. No transaction was broadcast."), "Evidence report missing non-deployment boundary");
  assert(reportLower.includes("tide is not offered for sale"), "Evidence report missing no-sale boundary");
  assert(reportLower.includes("tide has no stated monetary value"), "Evidence report missing no-value boundary");
  assert(reportLower.includes("tide is not deployed on mainnet"), "Evidence report missing no-mainnet boundary");
  assert(reportLower.includes("independent audit has not started"), "Evidence report missing audit-status boundary");

  console.log(`Public evidence checks passed for ${evidence.release} at ${evidence.sourceCommit}.`);
}

main();

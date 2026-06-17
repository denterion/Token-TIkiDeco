const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const canonicalPath = path.join(root, "deployments", "canonical.json");
const outputPath = path.join(root, "site", "deployment-manifest.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function publicContract(contract) {
  return {
    name: contract.name,
    address: contract.address,
    source: contract.source,
    verification: contract.verification
  };
}

function main() {
  const canonical = readJson(canonicalPath);
  const publicManifest = {
    network: canonical.network,
    chainId: canonical.chainId,
    status: canonical.status,
    contractVersion: canonical.contractVersion,
    sourceCommit: canonical.sourceCommit,
    compiler: canonical.compiler,
    contracts: {
      token: publicContract(canonical.contracts.token),
      vestingVault: publicContract(canonical.contracts.vestingVault)
    },
    ownership: canonical.ownership,
    treasury: canonical.treasury,
    publishedReports: canonical.publishedReports,
    auditStatus: canonical.auditStatus
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(publicManifest, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)} from deployments/canonical.json`);
}

main();

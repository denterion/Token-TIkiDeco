const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const canonicalPath = path.join(root, "deployments", "canonical.json");
const outputPath = path.join(root, "site", "deployment-manifest.json");
const siteArtifactsDir = path.join(root, "site", "artifacts", "v1");

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
    mutableMetadataUpdates: canonical.mutableMetadataUpdates || [],
    treasury: canonical.treasury,
    publishedReports: canonical.publishedReports,
    auditStatus: canonical.auditStatus
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(publicManifest, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)} from deployments/canonical.json`);

  for (const [key, contract] of Object.entries(canonical.contracts)) {
    const artifactPath = path.join(root, "artifacts", "contracts", `${contract.name}.sol`, `${contract.name}.json`);
    if (!fs.existsSync(artifactPath)) {
      console.log(`Skipped ABI export for ${contract.name}; artifact missing`);
      continue;
    }
    const artifact = readJson(artifactPath);
    const contractDir = path.join(siteArtifactsDir, contract.name);
    const deployedBytecodePath = path.join(contractDir, "deployed-bytecode.txt");
    fs.mkdirSync(contractDir, { recursive: true });
    fs.writeFileSync(path.join(contractDir, "abi.json"), `${JSON.stringify(artifact.abi, null, 2)}\n`);
    if (fs.existsSync(deployedBytecodePath)) {
      console.log(`Preserved versioned deployed bytecode for ${contract.name}`);
    } else {
      fs.writeFileSync(deployedBytecodePath, `${artifact.deployedBytecode || "0x"}\n`);
      console.log(`Wrote initial deployed bytecode artifact for ${contract.name}`);
    }
    console.log(`Wrote site artifact for ${key}: ${contract.name}`);
  }
}

main();

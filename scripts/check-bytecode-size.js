const fs = require("fs");
const path = require("path");

const MAX_DEPLOYED_BYTES = 24_576;
const WARNING_THRESHOLD = 22_000;
const CONTRACTS = [
  "TikiDecoToken",
  "TikiDecoVestingVault",
  "TikiDecoTokenV2",
  "TikiDecoVestingVaultV2"
];

function artifactPath(contractName) {
  return path.join(__dirname, "..", "artifacts", "contracts", `${contractName}.sol`, `${contractName}.json`);
}

function deployedBytecodeBytes(deployedBytecode) {
  if (!deployedBytecode || deployedBytecode === "0x") return 0;
  return (deployedBytecode.length - 2) / 2;
}

function main() {
  for (const contractName of CONTRACTS) {
    const filePath = artifactPath(contractName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing artifact for ${contractName}. Run npm run compile first.`);
    }

    const artifact = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const size = deployedBytecodeBytes(artifact.deployedBytecode);
    const status = size > WARNING_THRESHOLD ? "WARN" : "OK";
    console.log(`${status} ${contractName}: ${size} deployed bytes`);

    if (size > MAX_DEPLOYED_BYTES) {
      throw new Error(`${contractName} deployed bytecode exceeds EIP-170 limit`);
    }
  }
}

main();

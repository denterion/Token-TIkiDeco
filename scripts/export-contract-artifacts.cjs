const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "security-artifacts", "contracts");
const contracts = [
  "TikiDecoToken",
  "TikiDecoVestingVault",
  "TikiDecoTokenV2",
  "TikiDecoVestingVaultV2"
];

fs.mkdirSync(outDir, { recursive: true });

for (const contractName of contracts) {
  const artifactPath = path.join(root, "artifacts", "contracts", `${contractName}.sol`, `${contractName}.json`);
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Missing artifact for ${contractName}. Run npm run compile first.`);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const targetDir = path.join(outDir, contractName);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "abi.json"), `${JSON.stringify(artifact.abi, null, 2)}\n`);
  fs.writeFileSync(path.join(targetDir, "bytecode.txt"), `${artifact.bytecode || "0x"}\n`);
  fs.writeFileSync(path.join(targetDir, "deployed-bytecode.txt"), `${artifact.deployedBytecode || "0x"}\n`);
}

console.log(`Exported ABI and bytecode artifacts to ${path.relative(root, outDir)}`);

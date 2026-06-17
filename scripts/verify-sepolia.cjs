const fs = require("node:fs");
const path = require("node:path");

function main() {
  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  console.log("Hardhat 3 verification notice");
  console.log("============================");
  console.log("");
  console.log("The Hardhat verify plugin is intentionally not installed in this branch.");
  console.log("Reason: @nomicfoundation/hardhat-verify currently pulls ethers v5");
  console.log("dependencies that keep npm audit non-clean for this project.");
  console.log("");
  console.log("Canonical Sepolia V1 is already verified:");
  console.log(`Token: ${deployment.token}`);
  console.log(`Vault: ${deployment.vestingVault}`);
  console.log("");
  console.log("For a future V2 candidate deployment, use Etherscan manual verification");
  console.log("or re-enable a Hardhat 3 verify plugin once its dependency tree is clean.");
}

main();



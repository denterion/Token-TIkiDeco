const fs = require("node:fs");
const path = require("node:path");
const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing deployment record: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const token = await ethers.getContractAt("TikiDecoToken", deployment.token);
  const vault = await ethers.getContractAt("TikiDecoVestingVault", deployment.vestingVault);

  const tokenOwner = await token.owner();
  const tokenPendingOwner = await token.pendingOwner();
  const vaultOwner = await vault.owner();
  const vaultPendingOwner = await vault.pendingOwner();

  console.log("TikiDeco ownership state");
  console.log("-----------------------");
  console.log("Network:", networkName);
  console.log("Token:", deployment.token);
  console.log("Token owner:", tokenOwner);
  console.log("Token pending owner:", tokenPendingOwner);
  console.log("Vesting vault:", deployment.vestingVault);
  console.log("Vault owner:", vaultOwner);
  console.log("Vault pending owner:", vaultPendingOwner);

  if (tokenOwner.toLowerCase() !== vaultOwner.toLowerCase()) {
    throw new Error("Token owner and vault owner are different. Review governance before proceeding.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




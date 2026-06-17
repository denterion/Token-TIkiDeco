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
  const [signer] = await ethers.getSigners();
  const token = await ethers.getContractAt("TikiDecoToken", deployment.token, signer);
  const vault = await ethers.getContractAt("TikiDecoVestingVault", deployment.vestingVault, signer);

  const tokenPendingOwner = await token.pendingOwner();
  const vaultPendingOwner = await vault.pendingOwner();

  if (signer.address.toLowerCase() !== tokenPendingOwner.toLowerCase()) {
    throw new Error(`Signer ${signer.address} is not token pending owner ${tokenPendingOwner}.`);
  }

  if (signer.address.toLowerCase() !== vaultPendingOwner.toLowerCase()) {
    throw new Error(`Signer ${signer.address} is not vault pending owner ${vaultPendingOwner}.`);
  }

  console.log("Accepting ownership transfer");
  console.log("----------------------------");
  console.log("Network:", networkName);
  console.log("New owner:", signer.address);

  const tokenTx = await token.acceptOwnership();
  const tokenReceipt = await tokenTx.wait();
  console.log("Token acceptOwnership tx:", tokenReceipt.hash);

  const vaultTx = await vault.acceptOwnership();
  const vaultReceipt = await vaultTx.wait();
  console.log("Vault acceptOwnership tx:", vaultReceipt.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




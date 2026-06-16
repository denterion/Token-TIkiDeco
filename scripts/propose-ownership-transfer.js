const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

function requireAddress(name, value) {
  if (!value || !hre.ethers.isAddress(value)) {
    throw new Error(`${name} must be a valid Ethereum address`);
  }
}

async function main() {
  const newOwner = process.env.NEW_OWNER_ADDRESS;
  requireAddress("NEW_OWNER_ADDRESS", newOwner);

  const deploymentPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing deployment record: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const [signer] = await hre.ethers.getSigners();
  const token = await hre.ethers.getContractAt("TikiDecoToken", deployment.token, signer);
  const vault = await hre.ethers.getContractAt("TikiDecoVestingVault", deployment.vestingVault, signer);
  const tokenOwner = await token.owner();
  const vaultOwner = await vault.owner();

  if (signer.address.toLowerCase() !== tokenOwner.toLowerCase()) {
    throw new Error(`Signer ${signer.address} is not token owner ${tokenOwner}.`);
  }

  if (signer.address.toLowerCase() !== vaultOwner.toLowerCase()) {
    throw new Error(`Signer ${signer.address} is not vault owner ${vaultOwner}.`);
  }

  console.log("Proposing ownership transfer");
  console.log("-----------------------------");
  console.log("Network:", hre.network.name);
  console.log("Current owner:", signer.address);
  console.log("New pending owner:", newOwner);

  const tokenTx = await token.transferOwnership(newOwner);
  const tokenReceipt = await tokenTx.wait();
  console.log("Token transferOwnership tx:", tokenReceipt.hash);

  const vaultTx = await vault.transferOwnership(newOwner);
  const vaultReceipt = await vaultTx.wait();
  console.log("Vault transferOwnership tx:", vaultReceipt.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

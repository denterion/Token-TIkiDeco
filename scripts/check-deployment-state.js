const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

async function main() {
  const deploymentPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing deployment record: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const token = await hre.ethers.getContractAt("TikiDecoToken", deployment.token);
  const vault = await hre.ethers.getContractAt("TikiDecoVestingVault", deployment.vestingVault);

  const totalSupply = await token.totalSupply();
  const treasuryBalance = await token.balanceOf(deployment.treasury);
  const tokenOwner = await token.owner();
  const vaultOwner = await vault.owner();
  const vaultToken = await vault.token();

  console.log("TikiDeco deployment state");
  console.log("-------------------------");
  console.log("Network:", hre.network.name);
  console.log("Token:", deployment.token);
  console.log("Vesting vault:", deployment.vestingVault);
  console.log("Token owner:", tokenOwner);
  console.log("Vault owner:", vaultOwner);
  console.log("Treasury:", deployment.treasury);
  console.log("Treasury balance:", hre.ethers.formatUnits(treasuryBalance, 18), "TIDE");
  console.log("Total supply:", hre.ethers.formatUnits(totalSupply, 18), "TIDE");

  if (tokenOwner.toLowerCase() !== deployment.owner.toLowerCase()) {
    throw new Error("Token owner does not match deployment record");
  }

  if (vaultOwner.toLowerCase() !== deployment.owner.toLowerCase()) {
    throw new Error("Vault owner does not match deployment record");
  }

  if (vaultToken.toLowerCase() !== deployment.token.toLowerCase()) {
    throw new Error("Vault token address does not match deployment record");
  }

  if (treasuryBalance !== totalSupply) {
    throw new Error("Treasury does not hold the full TIDE supply");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

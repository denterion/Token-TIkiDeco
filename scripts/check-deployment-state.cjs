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

  const totalSupply = await token.totalSupply();
  const treasuryBalance = await token.balanceOf(deployment.treasury);
  const tokenOwner = await token.owner();
  const vaultOwner = await vault.owner();
  const vaultToken = await vault.token();

  console.log("TikiDeco deployment state");
  console.log("-------------------------");
  console.log("Network:", networkName);
  console.log("Token:", deployment.token);
  console.log("Vesting vault:", deployment.vestingVault);
  console.log("Token owner:", tokenOwner);
  console.log("Vault owner:", vaultOwner);
  console.log("Treasury:", deployment.treasury);
  console.log("Treasury balance:", ethers.formatUnits(treasuryBalance, 18), "TIDE");
  console.log("Total supply:", ethers.formatUnits(totalSupply, 18), "TIDE");

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




const hre = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");
const { projectConfig } = require("../config/project");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const treasury = process.env.TREASURY_ADDRESS || owner;

  if (!hre.ethers.isAddress(owner)) {
    throw new Error("OWNER_ADDRESS must be a valid Ethereum address");
  }

  if (!hre.ethers.isAddress(treasury)) {
    throw new Error("TREASURY_ADDRESS must be a valid Ethereum address");
  }

  const Token = await hre.ethers.getContractFactory("TikiDecoToken");
  const token = await Token.deploy(
    owner,
    treasury,
    projectConfig.businessEntity,
    projectConfig.jurisdiction,
    projectConfig.projectURI
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  const VestingVault = await hre.ethers.getContractFactory("TikiDecoVestingVault");
  const vestingVault = await VestingVault.deploy(tokenAddress, owner);
  await vestingVault.waitForDeployment();

  const vestingVaultAddress = await vestingVault.getAddress();
  const deployment = {
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    owner,
    treasury,
    token: tokenAddress,
    vestingVault: vestingVaultAddress,
    businessEntity: projectConfig.businessEntity,
    jurisdiction: projectConfig.jurisdiction,
    projectURI: projectConfig.projectURI
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  const fileSuffix = hre.network.name === "localhost" || hre.network.name === "hardhat"
    ? "local"
    : hre.network.name;
  const deploymentPath = path.join(deploymentsDir, `${fileSuffix}.json`);
  fs.writeFileSync(deploymentPath, `${JSON.stringify(deployment, null, 2)}\n`);

  console.log("TikiDeco token deployed to:", tokenAddress);
  console.log("Vesting vault deployed to:", vestingVaultAddress);
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);
  console.log("Deployment record:", deploymentPath);
  console.log("Symbol:", await token.symbol());
  console.log("Max supply:", hre.ethers.formatUnits(await token.totalSupply(), 18), "TIDE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

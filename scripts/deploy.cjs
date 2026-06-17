const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;
const fs = require("node:fs");
const path = require("node:path");
const { projectConfig } = require("../config/project.cjs");

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const [deployer] = await ethers.getSigners();
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const treasury = process.env.TREASURY_ADDRESS || owner;

  if (!ethers.isAddress(owner)) {
    throw new Error("OWNER_ADDRESS must be a valid Ethereum address");
  }

  if (!ethers.isAddress(treasury)) {
    throw new Error("TREASURY_ADDRESS must be a valid Ethereum address");
  }

  const Token = await ethers.getContractFactory("TikiDecoToken");
  const token = await Token.deploy(
    owner,
    treasury,
    projectConfig.businessEntity,
    projectConfig.jurisdiction,
    projectConfig.projectURI
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  const VestingVault = await ethers.getContractFactory("TikiDecoVestingVault");
  const vestingVault = await VestingVault.deploy(tokenAddress, owner);
  await vestingVault.waitForDeployment();

  const vestingVaultAddress = await vestingVault.getAddress();
  const deployment = {
    network: networkName,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
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
  const fileSuffix = networkName === "localhost" || networkName === "hardhat"
    ? "local"
    : networkName;
  const deploymentPath = path.join(deploymentsDir, `${fileSuffix}.json`);
  fs.writeFileSync(deploymentPath, `${JSON.stringify(deployment, null, 2)}\n`);

  console.log("TikiDeco token deployed to:", tokenAddress);
  console.log("Vesting vault deployed to:", vestingVaultAddress);
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);
  console.log("Deployment record:", deploymentPath);
  console.log("Symbol:", await token.symbol());
  console.log("Max supply:", ethers.formatUnits(await token.totalSupply(), 18), "TIDE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




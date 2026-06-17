const hre = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");
const { projectConfig } = require("../config/project");

function requireAddress(name, value) {
  if (!value || !hre.ethers.isAddress(value)) {
    throw new Error(`${name} must be a valid Ethereum address`);
  }
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const treasury = process.env.TREASURY_ADDRESS || owner;
  const isLocalNetwork = hre.network.name === "hardhat" || hre.network.name === "localhost";

  requireAddress("OWNER_ADDRESS", owner);
  requireAddress("TREASURY_ADDRESS", treasury);

  if (!isLocalNetwork && process.env.CONFIRM_NON_CANONICAL_V2_DEPLOY !== "true") {
    throw new Error(
      "TikiDeco V2 is a non-canonical candidate. Set CONFIRM_NON_CANONICAL_V2_DEPLOY=true to deploy it on a public network."
    );
  }

  const Token = await hre.ethers.getContractFactory("TikiDecoTokenV2");
  const token = await Token.deploy(
    owner,
    treasury,
    projectConfig.businessEntity,
    projectConfig.jurisdiction,
    projectConfig.projectURI
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  const VestingVault = await hre.ethers.getContractFactory("TikiDecoVestingVaultV2");
  const vestingVault = await VestingVault.deploy(tokenAddress, owner, treasury);
  await vestingVault.waitForDeployment();

  const vestingVaultAddress = await vestingVault.getAddress();
  const deployment = {
    version: "v2-openzeppelin",
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
    ? "local-v2"
    : `${hre.network.name}-v2`;
  const deploymentPath = path.join(deploymentsDir, `${fileSuffix}.json`);
  fs.writeFileSync(deploymentPath, `${JSON.stringify(deployment, null, 2)}\n`);

  console.log("TikiDeco OpenZeppelin V2 token deployed to:", tokenAddress);
  console.log("V2 vesting vault deployed to:", vestingVaultAddress);
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

const hre = require("hardhat");

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
    "TikiDeco project company / SPV to be formed",
    "Florida, USA",
    "https://tikideco.example/project"
  );

  await token.waitForDeployment();

  console.log("TikiDeco token deployed to:", await token.getAddress());
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);
  console.log("Symbol:", await token.symbol());
  console.log("Max supply:", hre.ethers.formatUnits(await token.totalSupply(), 18), "TIDE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

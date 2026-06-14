const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const treasury = process.env.TREASURY_ADDRESS || owner;

  console.log("TikiDeco wallet configuration");
  console.log("--------------------------------");
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);

  if (!hre.ethers.isAddress(owner)) {
    throw new Error("OWNER_ADDRESS is not a valid Ethereum address");
  }

  if (!hre.ethers.isAddress(treasury)) {
    throw new Error("TREASURY_ADDRESS is not a valid Ethereum address");
  }

  if (owner === treasury) {
    console.log("Mode: one-wallet launch. The same wallet controls and receives TIDE.");
  } else {
    console.log("Mode: separated owner/treasury launch.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

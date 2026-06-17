const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const [deployer] = await ethers.getSigners();
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const treasury = process.env.TREASURY_ADDRESS || owner;

  console.log("TikiDeco wallet configuration");
  console.log("--------------------------------");
  console.log("Network:", networkName);
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);

  if (!ethers.isAddress(owner)) {
    throw new Error("OWNER_ADDRESS is not a valid Ethereum address");
  }

  if (!ethers.isAddress(treasury)) {
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




const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;
const { validateTokenomics } = require("../config/tokenomics.cjs");

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const totalSupply = ethers.parseUnits("100000000", 18);

  console.log("TikiDeco tokenomics");
  console.log("-------------------");

  for (const bucket of validateTokenomics()) {
    const amount = (totalSupply * BigInt(bucket.bps)) / 10000n;
    console.log(`${bucket.label}: ${bucket.bps / 100}%`);
    console.log(`  Amount: ${ethers.formatUnits(amount, 18)} TIDE`);
    console.log(`  Vesting: ${bucket.vesting}`);
    console.log(`  Purpose: ${bucket.purpose}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




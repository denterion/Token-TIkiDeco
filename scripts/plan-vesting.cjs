const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;
const { validateTokenomics } = require("../config/tokenomics.cjs");

const beneficiaryEnvByKey = {
  team: "TEAM_BENEFICIARY",
  partners: "PARTNERS_BENEFICIARY",
  community: "COMMUNITY_BENEFICIARY",
  hotel_perks: "HOTEL_PERKS_BENEFICIARY"
};

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const totalSupply = ethers.parseUnits("100000000", 18);
  const vestingBuckets = validateTokenomics().filter((bucket) => bucket.vestingDuration);

  console.log("TikiDeco vesting plan");
  console.log("--------------------");

  let totalVested = 0n;
  for (const bucket of vestingBuckets) {
    const amount = (totalSupply * BigInt(bucket.bps)) / 10000n;
    totalVested += amount;
    const envName = beneficiaryEnvByKey[bucket.key];
    const beneficiary = process.env[envName] || "<missing>";

    console.log(`${bucket.label}`);
    console.log(`  Amount: ${ethers.formatUnits(amount, 18)} TIDE`);
    console.log(`  Beneficiary env: ${envName}=${beneficiary}`);
    console.log(`  Cliff duration seconds: ${bucket.cliffDuration}`);
    console.log(`  Vesting duration seconds: ${bucket.vestingDuration}`);
    console.log(`  Full unlock seconds from start: ${bucket.cliffDuration + bucket.vestingDuration}`);
    console.log(`  Revocable: ${bucket.revocable}`);
  }

  console.log("Total planned vesting:", ethers.formatUnits(totalVested, 18), "TIDE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




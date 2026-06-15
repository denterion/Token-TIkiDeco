const hre = require("hardhat");
const { validateTokenomics } = require("../config/tokenomics");

const beneficiaryEnvByKey = {
  team: "TEAM_BENEFICIARY",
  partners: "PARTNERS_BENEFICIARY",
  community: "COMMUNITY_BENEFICIARY",
  hotel_perks: "HOTEL_PERKS_BENEFICIARY"
};

async function main() {
  const totalSupply = hre.ethers.parseUnits("100000000", 18);
  const vestingBuckets = validateTokenomics().filter((bucket) => bucket.duration);

  console.log("TikiDeco vesting plan");
  console.log("--------------------");

  let totalVested = 0n;
  for (const bucket of vestingBuckets) {
    const amount = (totalSupply * BigInt(bucket.bps)) / 10000n;
    totalVested += amount;
    const envName = beneficiaryEnvByKey[bucket.key];
    const beneficiary = process.env[envName] || "<missing>";

    console.log(`${bucket.label}`);
    console.log(`  Amount: ${hre.ethers.formatUnits(amount, 18)} TIDE`);
    console.log(`  Beneficiary env: ${envName}=${beneficiary}`);
    console.log(`  Cliff seconds: ${bucket.cliff}`);
    console.log(`  Duration seconds: ${bucket.duration}`);
    console.log(`  Revocable: ${bucket.revocable}`);
  }

  console.log("Total planned vesting:", hre.ethers.formatUnits(totalVested, 18), "TIDE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

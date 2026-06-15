const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

async function verify(address, constructorArguments, contract) {
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments,
      contract
    });
    console.log("Verified:", address);
  } catch (error) {
    const message = String(error.message || error);
    if (message.toLowerCase().includes("already verified")) {
      console.log("Already verified:", address);
      return;
    }

    throw error;
  }
}

async function main() {
  if (!process.env.ETHERSCAN_API_KEY) {
    throw new Error("ETHERSCAN_API_KEY is missing. Add it to .env before verification.");
  }

  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  await verify(
    deployment.token,
    [
      deployment.owner,
      deployment.treasury,
      deployment.businessEntity,
      deployment.jurisdiction,
      deployment.projectURI
    ],
    "contracts/TikiDecoToken.sol:TikiDecoToken"
  );

  await verify(
    deployment.vestingVault,
    [
      deployment.token,
      deployment.owner
    ],
    "contracts/TikiDecoVestingVault.sol:TikiDecoVestingVault"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

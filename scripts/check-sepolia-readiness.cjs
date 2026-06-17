const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;
const { projectConfig } = require("../config/project.cjs");

function requireAddress(name, value) {
  if (!value || !ethers.isAddress(value)) {
    throw new Error(`${name} must be a valid Ethereum address`);
  }
}

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!rpcUrl) {
    throw new Error("SEPOLIA_RPC_URL is missing. Add a Sepolia RPC endpoint to .env.");
  }

  if (!privateKey) {
    throw new Error("DEPLOYER_PRIVATE_KEY is missing. Use a test wallet private key only.");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);
  const owner = process.env.OWNER_ADDRESS || deployer.address;
  const treasury = process.env.TREASURY_ADDRESS || owner;
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(deployer.address);

  requireAddress("OWNER_ADDRESS", owner);
  requireAddress("TREASURY_ADDRESS", treasury);

  if (network.chainId !== 11155111n) {
    throw new Error(`Expected Sepolia chainId 11155111, got ${network.chainId}`);
  }

  console.log("Sepolia deployment readiness");
  console.log("----------------------------");
  console.log("Network:", "sepolia");
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "Sepolia ETH");
  console.log("Owner:", owner);
  console.log("Treasury:", treasury);
  console.log("Business entity:", projectConfig.businessEntity);
  console.log("Jurisdiction:", projectConfig.jurisdiction);
  console.log("Project URI:", projectConfig.projectURI);

  if (balance === 0n) {
    throw new Error("Deployer has 0 Sepolia ETH. Fund it from a Sepolia faucet before deploy.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




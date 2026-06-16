const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

function requireAddress(name, value) {
  if (!value || !hre.ethers.isAddress(value)) {
    throw new Error(`${name} must be a valid Ethereum address`);
  }
}

function transactionBuilderFile(chainId, transactions, name, description) {
  return {
    version: "1.0",
    chainId: String(chainId),
    createdAt: Date.now(),
    meta: {
      name,
      description,
      txBuilderVersion: "1.18.0",
      createdFromSafeAddress: "",
      createdFromOwnerAddress: "",
      checksum: "0x"
    },
    transactions
  };
}

function safeTx(to, value, data, contractMethod, contractInputsValues) {
  return {
    to,
    value: String(value),
    data,
    contractMethod,
    contractInputsValues
  };
}

async function main() {
  const safeAddress = process.env.SAFE_ADDRESS || process.env.NEW_OWNER_ADDRESS;
  requireAddress("SAFE_ADDRESS or NEW_OWNER_ADDRESS", safeAddress);

  const deploymentPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing deployment record: ${deploymentPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  requireAddress("deployment.token", deployment.token);
  requireAddress("deployment.vestingVault", deployment.vestingVault);

  const outputDir = path.join(__dirname, "..", "operations");
  fs.mkdirSync(outputDir, { recursive: true });

  const ownableAbi = [
    "function transferOwnership(address newOwner)",
    "function acceptOwnership()"
  ];
  const iface = new hre.ethers.Interface(ownableAbi);

  const proposeMethod = {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    payable: false
  };

  const acceptMethod = {
    inputs: [],
    name: "acceptOwnership",
    payable: false
  };

  const tokenProposeData = iface.encodeFunctionData("transferOwnership", [safeAddress]);
  const vaultProposeData = iface.encodeFunctionData("transferOwnership", [safeAddress]);
  const acceptData = iface.encodeFunctionData("acceptOwnership", []);

  const ownerProposal = {
    network: hre.network.name,
    chainId: deployment.chainId,
    generatedAt: new Date().toISOString(),
    currentOwner: deployment.owner,
    safeAddress,
    note: "These two transactions must be sent by the current owner wallet before the Safe can accept ownership.",
    transactions: [
      {
        label: "TikiDecoToken.transferOwnership(Safe)",
        to: deployment.token,
        value: "0",
        data: tokenProposeData,
        function: "transferOwnership(address newOwner)",
        args: {
          newOwner: safeAddress
        }
      },
      {
        label: "TikiDecoVestingVault.transferOwnership(Safe)",
        to: deployment.vestingVault,
        value: "0",
        data: vaultProposeData,
        function: "transferOwnership(address newOwner)",
        args: {
          newOwner: safeAddress
        }
      }
    ]
  };

  const safeAccept = transactionBuilderFile(
    deployment.chainId,
    [
      safeTx(deployment.token, 0, acceptData, acceptMethod, {}),
      safeTx(deployment.vestingVault, 0, acceptData, acceptMethod, {})
    ],
    "TikiDeco Sepolia ownership acceptance",
    "Accept two-step ownership for TikiDecoToken and TikiDecoVestingVault from the Sepolia Safe."
  );

  const ownerProposalPath = path.join(outputDir, `${hre.network.name}-owner-propose-safe-ownership.json`);
  const safeAcceptPath = path.join(outputDir, `${hre.network.name}-safe-accept-ownership.json`);

  fs.writeFileSync(ownerProposalPath, `${JSON.stringify(ownerProposal, null, 2)}\n`);
  fs.writeFileSync(safeAcceptPath, `${JSON.stringify(safeAccept, null, 2)}\n`);

  console.log("Prepared Safe ownership handover files");
  console.log("--------------------------------------");
  console.log("Network:", hre.network.name);
  console.log("Safe:", safeAddress);
  console.log("Owner proposal:", ownerProposalPath);
  console.log("Safe acceptance:", safeAcceptPath);
  console.log("");
  console.log("Owner proposal tx data:");
  for (const tx of ownerProposal.transactions) {
    console.log(`- ${tx.label}`);
    console.log(`  to:   ${tx.to}`);
    console.log(`  data: ${tx.data}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

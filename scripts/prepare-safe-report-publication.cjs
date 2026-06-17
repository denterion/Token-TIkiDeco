const fs = require("node:fs");
const path = require("node:path");
const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;

function requireAddress(name, value) {
  if (!value || !ethers.isAddress(value)) {
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

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing deployment record: ${deploymentPath}`);
  }

  const reportPath = process.env.REPORT_PATH || "docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md";
  const category = process.env.REPORT_CATEGORY || "safe-ownership-openzeppelin-v2";
  const uri = process.env.REPORT_URI
    || "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md";

  if (!fs.existsSync(path.resolve(reportPath))) {
    throw new Error(`Report not found: ${reportPath}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  requireAddress("deployment.token", deployment.token);
  requireAddress("deployment.owner", deployment.owner);

  const reportBytes = fs.readFileSync(path.resolve(reportPath));
  const reportHash = ethers.keccak256(reportBytes);

  const abi = [
    "function publishReport(bytes32 documentHash, string category, string uri) returns (uint256 reportId)"
  ];
  const iface = new ethers.Interface(abi);
  const data = iface.encodeFunctionData("publishReport", [reportHash, category, uri]);

  const contractMethod = {
    inputs: [
      {
        internalType: "bytes32",
        name: "documentHash",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "category",
        type: "string"
      },
      {
        internalType: "string",
        name: "uri",
        type: "string"
      }
    ],
    name: "publishReport",
    payable: false
  };

  const safeBatch = transactionBuilderFile(
    deployment.chainId,
    [
      {
        to: deployment.token,
        value: "0",
        data,
        contractMethod,
        contractInputsValues: {
          documentHash: reportHash,
          category,
          uri
        }
      }
    ],
    "TikiDeco publish transparency report",
    "Publish the latest TikiDeco transparency report hash through the owner Safe."
  );

  const outputDir = path.join(__dirname, "..", "operations");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${networkName}-safe-publish-report-2026-06-17.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(safeBatch, null, 2)}\n`);

  const manifestPath = path.join(__dirname, "..", "docs", "reports", "REPORT_2026_06_17_SAFE_AND_V2_HASH.md");
  const manifest = [
    "# TikiDeco Transparency Report Hash",
    "",
    "Report:",
    "",
    "`docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`",
    "",
    "Category:",
    "",
    `\`${category}\``,
    "",
    "URI:",
    "",
    `<${uri}>`,
    "",
    "Keccak256:",
    "",
    `\`${reportHash}\``,
    "",
    "Safe Transaction Builder file:",
    "",
    "`operations/sepolia-safe-publish-report-2026-06-17.json`",
    ""
  ].join("\n");
  fs.writeFileSync(manifestPath, manifest);

  console.log("Prepared Safe report publication");
  console.log("--------------------------------");
  console.log("Network:", networkName);
  console.log("Owner Safe:", deployment.owner);
  console.log("Token:", deployment.token);
  console.log("Report:", reportPath);
  console.log("Category:", category);
  console.log("URI:", uri);
  console.log("Hash:", reportHash);
  console.log("Safe batch:", outputPath);
  console.log("Hash manifest:", manifestPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




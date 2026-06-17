const fs = require("node:fs");
const path = require("node:path");
const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const reportPath = process.argv[2] || "docs/reports/GENESIS_REPORT.md";
  const absolutePath = path.resolve(reportPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Report not found: ${absolutePath}`);
  }

  const bytes = fs.readFileSync(absolutePath);
  const hash = ethers.keccak256(bytes);

  console.log("Report:", reportPath);
  console.log("Bytes:", bytes.length);
  console.log("Keccak256:", hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

async function main() {
  const deploymentPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Missing deployment record: ${deploymentPath}`);
  }

  const reportPath = process.env.REPORT_PATH || "docs/reports/GENESIS_REPORT.md";
  const reportCategory = process.env.REPORT_CATEGORY || "genesis-report";
  const reportURI = process.env.REPORT_URI || "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/GENESIS_REPORT.md";

  const reportBytes = fs.readFileSync(path.resolve(reportPath));
  const reportHash = hre.ethers.keccak256(reportBytes);
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const [signer] = await hre.ethers.getSigners();
  const token = await hre.ethers.getContractAt("TikiDecoToken", deployment.token, signer);
  const owner = await token.owner();

  if (signer.address.toLowerCase() !== owner.toLowerCase()) {
    throw new Error(`Signer ${signer.address} is not token owner ${owner}. Use the owner wallet to publish reports.`);
  }

  const tx = await token.publishReport(reportHash, reportCategory, reportURI);
  const receipt = await tx.wait();

  console.log("Published report");
  console.log("Network:", hre.network.name);
  console.log("Token:", deployment.token);
  console.log("Category:", reportCategory);
  console.log("URI:", reportURI);
  console.log("Hash:", reportHash);
  console.log("Transaction:", receipt.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

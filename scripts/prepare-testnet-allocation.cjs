const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const canonical = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));
const campaign = JSON.parse(
  fs.readFileSync(path.join(root, "config", "utility-pilot", "tide-community-preview-001.json"), "utf8")
);
const outputDir = path.join(root, "operations", "utility-pilot");
const outputPath = path.join(outputDir, "testnet-allocation-draft.json");

const draft = {
  status: campaign.status,
  campaignId: campaign.campaignId,
  campaignName: campaign.campaignName,
  network: canonical.network,
  chainId: canonical.chainId,
  tokenAddress: canonical.contracts.token.address,
  snapshotBlock: campaign.snapshot?.block || null,
  minimumTideBalance: `${campaign.eligibility.minimumTideBalance} ${campaign.eligibility.minimumTideBalanceUnits}`,
  saleStatus: "no sale",
  monetaryValueStatus: "no stated monetary value",
  mainnetStatus: "no mainnet deployment",
  auditStatus: "independent audit not started",
  allocationStatus: "planned only until a campaign notice is published",
  requestWindowStatus: campaign.requestWindow.status,
  inventoryStatus: campaign.inventory.status,
  publishedCapacity: campaign.inventory.publishedCapacity,
  requiredReportTemplate: campaign.reports.allocationReportTemplate
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(draft, null, 2)}\n`);
console.log(`Prepared testnet allocation draft: ${path.relative(root, outputPath)}`);

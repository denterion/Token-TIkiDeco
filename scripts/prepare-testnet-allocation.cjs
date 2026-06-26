const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const canonical = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));
const campaign = JSON.parse(fs.readFileSync(path.join(root, "config", "utility-pilot", "tide-community-preview-001.json"), "utf8"));
const outputDir = path.join(root, "operations", "utility-pilot");
const defaultReportPath = path.join(outputDir, "testnet-allocation-draft.json");
const defaultSafePath = path.join(outputDir, "safe-transaction-builder-draft.json");
const TRANSFER_SELECTOR = "0xa9059cbb";

function parseArgs(argv) {
  const args = {
    perWalletCap: Number(campaign.allocation?.perWalletCap || 100),
    campaignCap: Number(campaign.allocation?.campaignCap || 1000),
    report: defaultReportPath,
    safe: defaultSafePath
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") args.input = path.resolve(argv[++i]);
    else if (arg === "--per-wallet-cap") args.perWalletCap = Number(argv[++i]);
    else if (arg === "--campaign-cap") args.campaignCap = Number(argv[++i]);
    else if (arg === "--report") args.report = path.resolve(argv[++i]);
    else if (arg === "--safe") args.safe = path.resolve(argv[++i]);
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  console.log("Usage: node scripts/prepare-testnet-allocation.cjs [--input allocations.csv|allocations.json] [--per-wallet-cap 100] [--campaign-cap 1000]");
}

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(String(value || "").trim());
}

function normalizeAddress(value) {
  return String(value).trim().toLowerCase();
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((cell) => cell.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
  });
}

function readInput(filePath) {
  if (!filePath) return [];
  const text = fs.readFileSync(filePath, "utf8");
  if (filePath.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : parsed.allocations || [];
  }
  if (filePath.toLowerCase().endsWith(".csv")) return parseCsv(text);
  throw new Error("Allocation input must be CSV or JSON");
}

function normalizeRows(rows) {
  return rows.map((row, index) => ({
    index: index + 1,
    address: normalizeAddress(row.address || row.wallet || row.walletAddress),
    amountTide: Number(row.amountTide || row.amount || row.tide || 0),
    note: row.note || ""
  }));
}

function assertAllocations(rows, { perWalletCap, campaignCap }) {
  const seen = new Set();
  let total = 0;
  for (const row of rows) {
    if (!isAddress(row.address)) throw new Error(`Invalid address at row ${row.index}: ${row.address}`);
    if (seen.has(row.address)) throw new Error(`Duplicate wallet address: ${row.address}`);
    seen.add(row.address);
    if (!Number.isFinite(row.amountTide) || row.amountTide <= 0) throw new Error(`Invalid amount at row ${row.index}`);
    if (row.amountTide > perWalletCap) throw new Error(`Per-wallet cap exceeded at row ${row.index}: ${row.amountTide} > ${perWalletCap}`);
    total += row.amountTide;
    if (total > campaignCap) throw new Error(`Campaign cap exceeded: ${total} > ${campaignCap}`);
  }
  return total;
}

function tokenUnits(amountTide) {
  return BigInt(Math.trunc(amountTide * 1_000_000)) * 10n ** 12n;
}

function encodeTransfer(address, amountTide) {
  const addressWord = address.replace(/^0x/, "").padStart(64, "0");
  const amountWord = tokenUnits(amountTide).toString(16).padStart(64, "0");
  return `${TRANSFER_SELECTOR}${addressWord}${amountWord}`;
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function buildSafeDraft(rows) {
  return {
    version: "1.0",
    chainId: String(canonical.chainId),
    createdAt: new Date().toISOString(),
    meta: {
      name: `${campaign.campaignId} Sepolia allocation draft`,
      description: "Draft only. Review manually in Safe Transaction Builder. Do not broadcast without approvals.",
      txBuilderVersion: "1.18.0",
      createdFromSafeAddress: canonical.ownership.ownerSafe,
      createdFromOwnerAddress: "",
      checksum: ""
    },
    transactions: rows.map((row) => ({
      to: canonical.contracts.token.address,
      value: "0",
      data: encodeTransfer(row.address, row.amountTide),
      contractMethod: {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "transfer",
        payable: false
      },
      contractInputsValues: {
        to: row.address,
        amount: tokenUnits(row.amountTide).toString()
      }
    }))
  };
}

function buildReport(rows, total, args, safeRel) {
  const report = {
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
    allocationStatus: rows.length === 0 ? "draft only; no allocation input provided" : "draft only; not approved and not broadcast",
    requestWindowStatus: campaign.requestWindow.status,
    inventoryStatus: campaign.inventory.status,
    publishedCapacity: campaign.inventory.publishedCapacity,
    perWalletCap: args.perWalletCap,
    campaignCap: args.campaignCap,
    totalWallets: rows.length,
    totalTestnetTideAllocated: `${total} TIDE`,
    noPrivateData: true,
    noGuaranteedBenefit: true,
    noHotelOwnership: true,
    requiredReportTemplate: campaign.reports.allocationReportTemplate,
    safeTransactionBuilderDraft: safeRel,
    allocations: rows.map((row) => ({ address: row.address, amountTide: row.amountTide })),
    documentSha256: null
  };
  const withoutHash = JSON.stringify(report, null, 2);
  report.documentSha256 = sha256Text(withoutHash);
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const rows = normalizeRows(readInput(args.input));
  const total = assertAllocations(rows, args);
  fs.mkdirSync(outputDir, { recursive: true });

  const safeDraft = buildSafeDraft(rows);
  fs.writeFileSync(args.safe, `${JSON.stringify(safeDraft, null, 2)}\n`);
  const safeRel = path.relative(root, args.safe).replaceAll(path.sep, "/");
  const report = buildReport(rows, total, args, safeRel);
  fs.writeFileSync(args.report, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Prepared allocation report draft: ${path.relative(root, args.report)}`);
  console.log(`Prepared Safe Transaction Builder draft: ${path.relative(root, args.safe)}`);
  console.log("No transaction was broadcast. Manual Safe signer review is required before any execution.");
}

main();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const metricsPath = "config/utility-pilot/public-preview-metrics-baseline.json";
const reportPath = "docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md";
const hashPath = "docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF_HASH.md";
const proposalPath = "ops/safe/public-preview-report-proposal.json";
const metrics = JSON.parse(fs.readFileSync(path.join(root, metricsPath), "utf8"));
const canonical = JSON.parse(fs.readFileSync(path.join(root, "deployments/canonical.json"), "utf8"));

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const metricsBytes = fs.readFileSync(path.join(root, metricsPath));
const metricsHash = sha256(metricsBytes);
const sampleSize = metrics.metrics.pageSessions;
const attempts = metrics.metrics.balanceCheckAttempts;
const completionRate = sampleSize > 0 ? `${((metrics.metrics.successfulChecks / sampleSize) * 100).toFixed(1)}%` : "not measured (zero public sample)";
const failureRate = attempts > 0 ? `${((metrics.metrics.rpcFailures / attempts) * 100).toFixed(1)}%` : "not measured (zero attempts)";
const feedbackThemes = metrics.feedbackThemes.length > 0 ? metrics.feedbackThemes.map((theme) => `- ${theme}`).join("\n") : "- No public feedback has been collected.";

const report = `# Public Preview Pilot Proof Report

Status: baseline report; campaign remains \`draft-not-live\`. No public preview responses are represented by this file.

## Campaign

- Campaign ID: \`${metrics.campaignId}\`
- Network: Ethereum Sepolia
- Lifecycle stage: \`draft\`
- Public sample status: \`${metrics.status}\`

## Aggregate Workflow Metrics

| Metric | Result |
| --- | --- |
| Sample size / page sessions | ${sampleSize} |
| Balance-check attempts | ${attempts} |
| Successful checks | ${metrics.metrics.successfulChecks} |
| RPC failures | ${metrics.metrics.rpcFailures} |
| Eligible threshold results | ${metrics.metrics.eligibleResults} |
| Ineligible threshold results | ${metrics.metrics.ineligibleResults} |
| Feedback link clicks | ${metrics.metrics.feedbackLinkClicks} |
| Completion rate | ${completionRate} |
| Failure rate | ${failureRate} |

Language selections: EN ${metrics.metrics.languageSelected.en}; ES ${metrics.metrics.languageSelected.es}; RU ${metrics.metrics.languageSelected.ru}.

## Comprehension Results

No public comprehension sample has been collected. Current aggregate counts are intentionally zero.

| Statement understood | Yes count |
| --- | --- |
| Sepolia-only status | ${metrics.comprehension.sepoliaOnly} |
| No sale | ${metrics.comprehension.noSale} |
| No mainnet | ${metrics.comprehension.noMainnet} |
| No active hotel benefit | ${metrics.comprehension.noActiveHotelBenefit} |
| Independent audit not started | ${metrics.comprehension.independentAuditNotStarted} |
| V2 candidate only | ${metrics.comprehension.v2CandidateOnly} |

Total comprehension responses: ${metrics.comprehension.responses}.

## Feedback Themes

${feedbackThemes}

## Privacy Statement

The preview instrumentation uses in-memory aggregate counters only. This report contains no raw wallet addresses, names, emails, booking data, guest records, private keys, seed phrases, persistent identifiers, or wallet-to-person mappings.

## Known Limitations

- The campaign is not live and has no request window or inventory.
- This is a zero-sample baseline, not evidence of user adoption or comprehension.
- In-memory browser counters are not centrally collected.
- Public issue-form responses require manual aggregate review.
- RPC providers may observe queried public addresses and network metadata.
- Legal, privacy, security, operations, and governance approvals remain blocked.

## SHA-256

Metrics snapshot \`${metricsPath}\`: \`${metricsHash}\`.

The report file hash is published in \`docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF_HASH.md\`.

## Optional Safe-Controlled Report-Hash Proposal

A non-broadcast proposal draft is stored at \`${proposalPath}\`. It targets the canonical V1 report-publication function with value \`0\`, but must not be submitted until the report is reviewed and separately approved.

## On-Chain Publication Status

\`not-published-on-chain\`. The proposal is a non-broadcast draft only.

## Required Disclaimer

TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. The preview creates no active hotel benefit, ownership right, revenue right, cash redemption, resale right, or guaranteed real-world benefit.
`;

fs.mkdirSync(path.dirname(path.join(root, reportPath)), { recursive: true });
fs.writeFileSync(path.join(root, reportPath), report.replace(/\r\n?/g, "\n"), "utf8");
const reportHash = sha256(fs.readFileSync(path.join(root, reportPath)));
const hashDocument = `# Public Preview Pilot Proof Report Hash

Document: \`REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md\`

Algorithm: SHA-256

Hash: \`${reportHash}\`

Publication status: repository draft; not published on-chain.

Boundary: this hash does not approve a live campaign, token sale, mainnet deployment, active hotel benefit, V2 promotion, or independent audit claim.
`;
fs.writeFileSync(path.join(root, hashPath), hashDocument.replace(/\r\n?/g, "\n"), "utf8");

const proposal = {
  schemaVersion: "1.0.0",
  status: "draft-not-broadcast",
  chainId: canonical.chainId,
  target: canonical.contracts.token.address,
  value: "0",
  functionSignature: "publishReport(bytes32,string,string)",
  arguments: {
    documentHash: `0x${reportHash}`,
    category: "public-preview-proof",
    uri: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md"
  },
  calldata: null,
  broadcast: false,
  note: "Encode and simulate only after report review. Manual Safe approval is required; this draft does not submit a transaction."
};
fs.mkdirSync(path.dirname(path.join(root, proposalPath)), { recursive: true });
fs.writeFileSync(path.join(root, proposalPath), `${JSON.stringify(proposal, null, 2)}\n`, "utf8");

console.log(`Public preview proof report written: ${reportPath}`);
console.log(`Report SHA-256: ${reportHash}`);

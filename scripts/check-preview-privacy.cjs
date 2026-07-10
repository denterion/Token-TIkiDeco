const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const metricsSource = read("site-v2/src/lib/previewMetrics.ts");
const metricsSchema = read("config/utility-pilot/public-preview-metrics.schema.json");
const metricsBaseline = read("config/utility-pilot/public-preview-metrics-baseline.json");
const threatModel = read("docs/utility-pilot/PUBLIC_PREVIEW_PRIVACY_THREAT_MODEL.md");
const feedbackForm = read(".github/ISSUE_TEMPLATE/utility_pilot_feedback.yml");
const report = read("docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md");

for (const forbidden of ["localStorage", "sessionStorage", "indexedDB", "document.cookie", "sendBeacon", "fetch("]) {
  assert.equal(metricsSource.includes(forbidden), false, `Preview metrics must not use ${forbidden}`);
}
for (const forbidden of ["walletAddress", "rawWallet", "email", "guestName", "bookingData", "userId", "sessionId"]) {
  assert.equal(metricsSchema.includes(forbidden), false, `Metrics schema contains identifying field ${forbidden}`);
  assert.equal(metricsBaseline.includes(forbidden), false, `Metrics baseline contains identifying field ${forbidden}`);
}
for (const topic of [
  "Wallet-address correlation", "RPC provider exposure", "Analytics exposure", "Browser storage",
  "Logs", "Screenshots", "Accidental personal-data submission", "Abuse and spam"
]) assert(threatModel.includes(topic), `Privacy threat model missing ${topic}`);
for (const phrase of ["Do not submit wallet addresses", "private keys", "seed phrases", "names", "emails", "booking data"]) {
  assert(feedbackForm.includes(phrase), `Feedback form privacy boundary missing ${phrase}`);
}
assert(!/\b0x[a-fA-F0-9]{40}\b/.test(report), "Public preview proof report contains a raw wallet address");
assert(report.includes("no raw wallet addresses"), "Proof report must state the aggregate-only boundary");

console.log("Public preview privacy checks passed: no persistent analytics or raw wallet dataset.");

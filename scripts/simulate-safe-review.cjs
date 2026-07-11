const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fixturePath = path.join(root, "config/governance/safe-drill-fixture.json");
const outputPath = path.join(root, "operations/governance/safe-drill-result.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

function check(name, condition) {
  return { name, passed: Boolean(condition) };
}

const tx = fixture.transaction;
const review = fixture.review;
const addressPattern = /^0x[0-9a-fA-F]{40}$/;
const selectorPattern = /^0x[0-9a-fA-F]{8}$/;
const checks = [
  check("fixture is test-only", fixture.testOnly === true),
  check("target address is valid and expected", addressPattern.test(tx.target) && tx.target === tx.expectedTarget),
  check("chain ID is Sepolia", tx.chainId === 11155111),
  check("method selector matches expected selector", selectorPattern.test(tx.methodSelector) && tx.methodSelector === tx.expectedMethodSelector),
  check("amount is zero", tx.valueWei === "0"),
  check("nonce is a non-negative safe integer", Number.isSafeInteger(tx.nonce) && tx.nonce >= 0),
  check("operation is the expected CALL", tx.operation === "CALL" && tx.operation === tx.expectedOperation),
  check("summary names the network, target, method, value, and nonce", ["Sepolia", tx.target, tx.methodName, "value 0 wei", `nonce ${tx.nonce}`].every((part) => review.summary.includes(part))),
  check("second-person review is explicit", review.secondPersonConfirmation === true && review.firstReviewer !== review.secondReviewer),
  check("no proposal or broadcast is possible", fixture.safety.proposalCreated === false && fixture.safety.broadcast === false),
  check("no keys or live RPC are used", fixture.safety.usesPrivateKeys === false && fixture.safety.usesLiveRpc === false)
];

const passed = checks.every((item) => item.passed);
const result = {
  schemaVersion: "1.0.0",
  drillId: "safe-resilience-2026-tabletop",
  executedAt: "2026-07-11T00:00:00.000Z",
  mode: "local-test-only",
  passed,
  transactionReview: {
    target: tx.target,
    chainId: tx.chainId,
    methodSelector: tx.methodSelector,
    amountWei: tx.valueWei,
    nonce: tx.nonce,
    operation: tx.operation,
    summary: review.summary,
    secondPersonConfirmation: review.secondPersonConfirmation
  },
  checks,
  proposalCreated: false,
  broadcast: false
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

console.log(`${passed ? "PASS" : "FAIL"}: local Safe review drill`);
for (const item of checks) console.log(`- ${item.passed ? "PASS" : "FAIL"}: ${item.name}`);
console.log(`Result: ${path.relative(root, outputPath)}`);

if (!passed) process.exitCode = 1;

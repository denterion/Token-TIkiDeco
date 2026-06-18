const fs = require("fs");

const filePath = process.argv[2] || "lcov.info";
const minLines = Number(process.argv[3] || 80);
const minFunctions = Number(process.argv[4] || 80);
const minBranches = Number(process.argv[5] || 70);

if (!fs.existsSync(filePath)) {
  throw new Error(`Coverage file not found: ${filePath}`);
}

const text = fs.readFileSync(filePath, "utf8");
const totals = {
  linesFound: 0,
  linesHit: 0,
  functionsFound: 0,
  functionsHit: 0,
  branchesFound: 0,
  branchesHit: 0
};

for (const line of text.split(/\r?\n/)) {
  const [key, value] = line.split(":");
  const number = Number(value);
  if (key === "LF") totals.linesFound += number;
  if (key === "LH") totals.linesHit += number;
  if (key === "FNF") totals.functionsFound += number;
  if (key === "FNH") totals.functionsHit += number;
  if (key === "BRF") totals.branchesFound += number;
  if (key === "BRH") totals.branchesHit += number;
}

function pct(hit, found) {
  if (found === 0) return null;
  return (hit / found) * 100;
}

function assertThreshold(label, actual, minimum) {
  if (actual === null) {
    throw new Error(`${label} coverage metrics are missing from ${filePath}`);
  }
  console.log(`${label} coverage: ${actual.toFixed(2)}% (minimum ${minimum}%)`);
  if (actual < minimum) {
    throw new Error(`${label} coverage below threshold`);
  }
}

assertThreshold("Line", pct(totals.linesHit, totals.linesFound), minLines);
assertThreshold("Function", pct(totals.functionsHit, totals.functionsFound), minFunctions);
assertThreshold("Branch", pct(totals.branchesHit, totals.branchesFound), minBranches);

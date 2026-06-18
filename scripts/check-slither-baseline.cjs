const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const jsonPath = process.argv[2] || path.join(root, "security-artifacts", "slither", "slither.json");
const baselinePath = process.argv[3] || path.join(root, "security", "slither-baseline-v2.json");
const outDir = path.join(root, "security-artifacts", "slither");

const V1_FILES = new Set([
  "contracts/TikiDecoToken.sol",
  "contracts/TikiDecoVestingVault.sol"
]);
const V2_FILES = new Set([
  "contracts/TikiDecoTokenV2.sol",
  "contracts/TikiDecoVestingVaultV2.sol"
]);

function normalizeFile(filename) {
  return filename.replaceAll("\\", "/");
}

function filesForFinding(finding) {
  const files = new Set();
  for (const element of finding.elements || []) {
    if (element.source_mapping?.filename_relative) {
      files.add(normalizeFile(element.source_mapping.filename_relative));
    }
  }
  if (finding.source_mapping?.filename_relative) {
    files.add(normalizeFile(finding.source_mapping.filename_relative));
  }
  return [...files];
}

function hasIntersection(files, set) {
  return files.some((file) => set.has(file));
}

function isAccepted(finding, files, accepted) {
  return accepted.some((entry) => {
    if (entry.detector !== finding.check) return false;
    return files.some((file) => entry.files.includes(file));
  });
}

if (!fs.existsSync(jsonPath)) {
  throw new Error(`Missing Slither JSON at ${jsonPath}`);
}
if (!fs.existsSync(baselinePath)) {
  throw new Error(`Missing Slither baseline at ${baselinePath}`);
}

const slither = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const findings = slither.results?.detectors || [];
const accepted = baseline.acceptedFindings || [];

const legacy = [];
const acceptedV2 = [];
const newV2 = [];

for (const finding of findings) {
  const files = filesForFinding(finding);
  const summary = {
    detector: finding.check,
    impact: finding.impact,
    confidence: finding.confidence,
    description: finding.description,
    files
  };

  if (hasIntersection(files, V1_FILES)) legacy.push(summary);
  if (hasIntersection(files, V2_FILES)) {
    if (isAccepted(finding, files, accepted)) {
      acceptedV2.push(summary);
    } else {
      newV2.push(summary);
    }
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "legacy-v1-informational.json"), `${JSON.stringify(legacy, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "v2-accepted.json"), `${JSON.stringify(acceptedV2, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "v2-new-untriaged.json"), `${JSON.stringify(newV2, null, 2)}\n`);

console.log(`Slither legacy V1 informational findings: ${legacy.length}`);
console.log(`Slither accepted V2 findings: ${acceptedV2.length}`);
console.log(`Slither new untriaged V2 findings: ${newV2.length}`);

if (newV2.length > 0) {
  throw new Error("New untriaged V2 Slither findings detected. Update code or add a reviewed baseline entry with explanation.");
}

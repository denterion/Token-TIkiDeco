const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const canonicalPath = path.join(root, "deployments", "canonical.json");
const sepoliaPath = path.join(root, "deployments", "sepolia.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} mismatch: expected ${expected}, got ${actual}`);
  }
}

function main() {
  const canonical = readJson(canonicalPath);
  const sepolia = readJson(sepoliaPath);

  assertEqual("network", canonical.network, "sepolia");
  assertEqual("chainId", canonical.chainId, 11155111);
  assertEqual("contractVersion", canonical.contractVersion, "v1-legacy");
  assertEqual("token address", canonical.contracts.token.address, sepolia.token);
  assertEqual("vesting vault address", canonical.contracts.vestingVault.address, sepolia.vestingVault);
  assertEqual("owner Safe", canonical.ownership.ownerSafe, sepolia.owner);
  assertEqual("treasury", canonical.treasury.address, sepolia.treasury);
  assertEqual("compiler version", canonical.compiler.version, "0.8.28");
  assertEqual("optimizer enabled", canonical.compiler.optimizer.enabled, true);
  assertEqual("optimizer runs", canonical.compiler.optimizer.runs, 200);

  if (!canonical.auditStatus || canonical.auditStatus.independentAudit !== "not-started") {
    throw new Error("canonical audit status must not imply an independent audit");
  }

  console.log("Deployment manifest consistency check passed.");
}

main();



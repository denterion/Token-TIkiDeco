const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const hardhatConfig = fs.readFileSync(path.join(root, "hardhat.config.js"), "utf8");
const canonical = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));

function expectIncludes(label, haystack, needle) {
  if (!haystack.includes(needle)) {
    throw new Error(`${label} does not include ${needle}`);
  }
}

function expectEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} mismatch: expected ${expected}, got ${actual}`);
  }
}

expectIncludes("hardhat config", hardhatConfig, "version: \"0.8.28\"");
expectIncludes("hardhat config", hardhatConfig, "evmVersion: \"paris\"");
expectIncludes("hardhat config", hardhatConfig, "enabled: true");
expectIncludes("hardhat config", hardhatConfig, "runs: 200");

expectEqual("canonical compiler version", canonical.compiler.version, "0.8.28");
expectEqual("canonical optimizer enabled", canonical.compiler.optimizer.enabled, true);
expectEqual("canonical optimizer runs", canonical.compiler.optimizer.runs, 200);
expectEqual("canonical chainId", canonical.chainId, 11155111);
expectEqual("canonical version", canonical.contractVersion, "v1-legacy");

console.log("Deployment manifest matches source compiler configuration.");

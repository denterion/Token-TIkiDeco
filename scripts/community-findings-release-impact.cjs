const { loadState, validateState, releaseImpact } = require("./lib/community-findings.cjs");

const baseIndex = process.argv.indexOf("--base");
const baseRef = baseIndex >= 0 ? process.argv[baseIndex + 1] : undefined;

try {
  const state = loadState();
  validateState(state);
  console.log(JSON.stringify(releaseImpact(state, baseRef), null, 2));
} catch (error) {
  console.error(`Community findings release impact failed: ${error.message}`);
  process.exit(1);
}

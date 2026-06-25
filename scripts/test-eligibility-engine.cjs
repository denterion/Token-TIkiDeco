const assert = require("assert");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");

const root = path.join(__dirname, "..");
const eligibilityDir = path.join(root, "site-v2", "src", "lib", "eligibility");
const moduleCache = new Map();

function resolveModule(fromFile, specifier) {
  if (!specifier.startsWith(".")) return require.resolve(specifier);
  const resolved = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [`${resolved}.ts`, path.join(resolved, "index.ts")];
  const match = candidates.find((candidate) => fs.existsSync(candidate));
  if (!match) throw new Error(`Cannot resolve ${specifier} from ${fromFile}`);
  return match;
}

function loadTsModule(filePath) {
  const absolute = path.resolve(filePath);
  if (moduleCache.has(absolute)) return moduleCache.get(absolute).exports;

  const source = fs.readFileSync(absolute, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true
    },
    fileName: absolute
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(absolute, module);
  const localRequire = (specifier) => {
    if (specifier.startsWith(".")) return loadTsModule(resolveModule(absolute, specifier));
    return require(specifier);
  };
  vm.runInNewContext(output, { require: localRequire, exports: module.exports, module, console }, { filename: absolute });
  return module.exports;
}

const {
  SEPOLIA_CHAIN_ID,
  createMockSignatureMessage,
  createMockSnapshotBalance,
  evaluateEligibility,
  mockPilotCampaign
} = loadTsModule(path.join(eligibilityDir, "index.ts"));

const eligibleWallet = "0x1111111111111111111111111111111111111111";
const duplicateWallet = "0x2222222222222222222222222222222222222222";
const now = new Date("2026-07-01T12:01:00.000Z");

function signed(wallet, issuedAt = "2026-07-01T12:00:00.000Z") {
  return createMockSignatureMessage(wallet, mockPilotCampaign, issuedAt);
}

function balance(wallet, amount) {
  return createMockSnapshotBalance(wallet, mockPilotCampaign, amount, "mock", "2026-07-01T12:00:00.000Z");
}

function check(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

check("wrong chain", () => {
  const result = evaluateEligibility({ walletAddress: eligibleWallet, chainId: 1, now });
  assert.equal(result.code, "wrong-chain");
  assert.equal(result.eligible, false);
});

check("empty wallet", () => {
  const result = evaluateEligibility({ walletAddress: " ", chainId: SEPOLIA_CHAIN_ID, now });
  assert.equal(result.code, "empty-wallet");
});

check("invalid address", () => {
  const result = evaluateEligibility({ walletAddress: "0x123", chainId: SEPOLIA_CHAIN_ID, now });
  assert.equal(result.code, "invalid-address");
});

check("insufficient balance", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance - 1),
    now
  });
  assert.equal(result.code, "insufficient-balance");
});

check("eligible mock address", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now
  });
  assert.equal(result.code, "eligible-mock");
  assert.equal(result.eligible, true);
});

check("expired campaign", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now: new Date("2027-01-01T00:00:00.000Z")
  });
  assert.equal(result.code, "expired-campaign");
});

check("duplicate wallet", () => {
  const result = evaluateEligibility({
    walletAddress: duplicateWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(duplicateWallet),
    snapshotBalance: balance(duplicateWallet, mockPilotCampaign.minimumTideBalance),
    previouslySubmittedWallets: new Set([duplicateWallet]),
    now
  });
  assert.equal(result.code, "duplicate-wallet");
});

check("no active benefits", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now
  });
  assert.equal(result.activeBenefits, false);
});

check("no transaction flow", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now
  });
  assert.equal(result.requiresTransaction, false);
  assert.equal(result.transactionFlow, false);
});

console.log("Eligibility engine unit tests passed.");

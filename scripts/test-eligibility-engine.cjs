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
  const candidates = [resolved, `${resolved}.ts`, `${resolved}.json`, path.join(resolved, "index.ts")];
  const match = candidates.find((candidate) => fs.existsSync(candidate));
  if (!match) throw new Error(`Cannot resolve ${specifier} from ${fromFile}`);
  return match;
}

function loadTsModule(filePath) {
  const absolute = path.resolve(filePath);
  if (moduleCache.has(absolute)) return moduleCache.get(absolute).exports;

  if (absolute.endsWith(".json")) {
    const module = { exports: JSON.parse(fs.readFileSync(absolute, "utf8")) };
    moduleCache.set(absolute, module);
    return module.exports;
  }

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
  const fetchProxy = (...args) => global.fetch(...args);
  vm.runInNewContext(output, { require: localRequire, exports: module.exports, module, console, fetch: fetchProxy }, { filename: absolute });
  return module.exports;
}

const {
  RPC_ALLOWLIST,
  SEPOLIA_CHAIN_ID,
  createMockSignatureMessage,
  createSnapshotBalance,
  evaluateEligibility,
  mockPilotCampaign,
  readTideBalance
} = loadTsModule(path.join(eligibilityDir, "index.ts"));

const eligibleWallet = "0x1111111111111111111111111111111111111111";
const duplicateWallet = "0x2222222222222222222222222222222222222222";
const now = new Date("2026-07-01T12:01:00.000Z");
const originalFetch = global.fetch;

function signed(wallet, issuedAt = "2026-07-01T12:00:00.000Z") {
  return createMockSignatureMessage(wallet, mockPilotCampaign, issuedAt);
}

function balance(wallet, amount) {
  return createSnapshotBalance(wallet, mockPilotCampaign, amount, "live", "2026-07-01T12:00:00.000Z");
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

async function main() {
await check("wrong chain", () => {
  const result = evaluateEligibility({ walletAddress: eligibleWallet, chainId: 1, now });
  assert.equal(result.code, "wrong-chain");
  assert.equal(result.eligible, false);
});

await check("empty wallet", () => {
  const result = evaluateEligibility({ walletAddress: " ", chainId: SEPOLIA_CHAIN_ID, now });
  assert.equal(result.code, "empty-wallet");
});

await check("invalid address", () => {
  const result = evaluateEligibility({ walletAddress: "0x123", chainId: SEPOLIA_CHAIN_ID, now });
  assert.equal(result.code, "invalid-address");
});

await check("zero balance", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, 0),
    now
  });
  assert.equal(result.code, "insufficient-balance");
});

await check("sufficient balance", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now
  });
  assert.equal(result.code, "eligible-testnet");
  assert.equal(result.eligible, true);
});

await check("expired campaign", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now: new Date("2027-01-01T00:00:00.000Z")
  });
  assert.equal(result.code, "expired-campaign");
});

await check("duplicate wallet", () => {
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

await check("no active benefits", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now
  });
  assert.equal(result.activeBenefits, false);
});

await check("no transaction flow", () => {
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

function rawAmountHex(amountTide) {
  return `0x${(BigInt(amountTide) * 10n ** 18n).toString(16)}`;
}

function installRpcMock({ chainId = SEPOLIA_CHAIN_ID, balanceTide = 0, fail = false } = {}) {
  global.fetch = async (_endpoint, request) => {
    if (fail) throw new Error("RPC unavailable");
    const body = JSON.parse(request.body);
    let result = "0x0";
    if (body.method === "eth_chainId") result = `0x${chainId.toString(16)}`;
    if (body.method === "eth_call" && body.params?.[0]?.data === "0x313ce567") result = "0x12";
    if (body.method === "eth_call" && body.params?.[0]?.data?.startsWith("0x70a08231")) result = rawAmountHex(balanceTide);
    return {
      ok: true,
      json: async () => ({ jsonrpc: "2.0", id: 1, result })
    };
  };
}

await check("RPC unavailable", async () => {
  installRpcMock({ fail: true });
  const result = await readTideBalance(eligibleWallet, [RPC_ALLOWLIST[0]]);
  assert.equal(result.status, "unavailable");
});

await check("wrong chain RPC", async () => {
  installRpcMock({ chainId: 1, balanceTide: 250 });
  const result = await readTideBalance(eligibleWallet, [RPC_ALLOWLIST[0]]);
  assert.equal(result.status, "wrong-chain");
  assert.equal(result.chainId, 1);
});

await check("read-only Sepolia balanceOf", async () => {
  installRpcMock({ balanceTide: 250 });
  const result = await readTideBalance(eligibleWallet, [RPC_ALLOWLIST[0]]);
  assert.equal(result.status, "live");
  assert.equal(result.balanceTide, 250);
});

global.fetch = originalFetch;

console.log("Eligibility engine unit tests passed.");
}

main().catch((error) => {
  global.fetch = originalFetch;
  console.error(error);
  process.exit(1);
});

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");
const { createReadOnlyRpcFixture } = require("./fixtures/read-only-rpc-fixture.cjs");

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
  campaignDisclaimers,
  createMockSignatureMessage,
  createSnapshotBalance,
  cachedBalanceFor,
  evaluateEligibility,
  mockPilotCampaign,
  pilotCampaignRules,
  readTideBalance
} = loadTsModule(path.join(eligibilityDir, "index.ts"));

const eligibleWallet = "0x1111111111111111111111111111111111111111";
const checksumNeutralWallet = "0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD";
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

await check("malformed checksum-neutral address", () => {
  const result = evaluateEligibility({ walletAddress: checksumNeutralWallet, chainId: SEPOLIA_CHAIN_ID, now });
  assert.notEqual(result.code, "invalid-address");
});

await check("zero balance", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, 0),
    now,
    rules: mockPilotCampaign
  });
  assert.equal(result.code, "insufficient-balance");
});

await check("sufficient balance", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now,
    rules: mockPilotCampaign
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
    now: new Date("2027-01-01T00:00:00.000Z"),
    rules: mockPilotCampaign
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
    now,
    rules: mockPilotCampaign
  });
  assert.equal(result.code, "duplicate-wallet");
});

await check("no active benefits", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now,
    rules: mockPilotCampaign
  });
  assert.equal(result.activeBenefits, false);
});

await check("no transaction flow", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now,
    rules: mockPilotCampaign
  });
  assert.equal(result.requiresTransaction, false);
  assert.equal(result.transactionFlow, false);
});

await check("no sale language", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: signed(eligibleWallet),
    snapshotBalance: balance(eligibleWallet, mockPilotCampaign.minimumTideBalance),
    now,
    rules: mockPilotCampaign
  });
  const publicText = `${result.title} ${result.explanation} ${campaignDisclaimers(mockPilotCampaign).join(" ")}`.toLowerCase();
  assert.equal(publicText.includes("buy tide"), false);
  assert.equal(publicText.includes("presale"), false);
  assert.equal(publicText.includes("token price"), false);
  assert.equal(publicText.includes("transaction signing"), false);
});

await check("campaign draft-not-live", () => {
  const result = evaluateEligibility({
    walletAddress: eligibleWallet,
    chainId: SEPOLIA_CHAIN_ID,
    signatureSession: createMockSignatureMessage(eligibleWallet, pilotCampaignRules, "2026-07-01T12:00:00.000Z"),
    snapshotBalance: createSnapshotBalance(eligibleWallet, pilotCampaignRules, pilotCampaignRules.minimumTideBalance),
    now,
    rules: pilotCampaignRules
  });
  assert.equal(result.code, "campaign-not-live");
  assert.equal(result.eligible, false);
  assert.equal(result.activeBenefits, false);
});

function installRpcMock({ chainId = SEPOLIA_CHAIN_ID, balanceTide = 0, fail = false } = {}) {
  const fixture = createReadOnlyRpcFixture({ chainId, balanceTide, fail });
  global.fetch = fixture.handler;
  return fixture;
}

await check("RPC unavailable", async () => {
  installRpcMock({ fail: true });
  const result = await readTideBalance(eligibleWallet, [RPC_ALLOWLIST[0]]);
  assert.equal(result.status, "unavailable");
});

await check("both RPC endpoints unavailable", async () => {
  const fixture = createReadOnlyRpcFixture({
    byEndpoint: {
      [RPC_ALLOWLIST[0]]: { chainId: SEPOLIA_CHAIN_ID, fail: true },
      [RPC_ALLOWLIST[1]]: { chainId: SEPOLIA_CHAIN_ID, fail: true }
    }
  });
  global.fetch = fixture.handler;
  const result = await readTideBalance("0x3333333333333333333333333333333333333333", [RPC_ALLOWLIST[0], RPC_ALLOWLIST[1]]);
  assert.equal(result.status, "unavailable");
  assert.deepEqual(new Set(fixture.calls.map((call) => call.endpoint)), new Set([RPC_ALLOWLIST[0], RPC_ALLOWLIST[1]]));
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

await check("one RPC endpoint fails and one succeeds", async () => {
  const fixture = createReadOnlyRpcFixture({
    byEndpoint: {
      [RPC_ALLOWLIST[0]]: { chainId: SEPOLIA_CHAIN_ID, fail: true },
      [RPC_ALLOWLIST[1]]: { chainId: SEPOLIA_CHAIN_ID, balanceTide: 375 }
    }
  });
  global.fetch = fixture.handler;
  const result = await readTideBalance("0x4444444444444444444444444444444444444444", [RPC_ALLOWLIST[0], RPC_ALLOWLIST[1]]);
  assert.equal(result.status, "live");
  assert.equal(result.balanceTide, 375);
});

await check("stale cached value", async () => {
  const stale = cachedBalanceFor(eligibleWallet, Date.parse("2026-07-01T12:10:01.000Z"));
  assert.equal(stale.status, "stale");
  assert.equal(stale.balanceTide, 250);
});

await check("no transaction or sale buttons in production card", () => {
  const componentSource = fs.readFileSync(path.join(root, "site-v2", "src", "components", "PilotEligibilityCard.tsx"), "utf8");
  const lower = componentSource.toLowerCase();
  for (const forbidden of ["buy tide", "invest", "stake", "token price", "approve", "transfer tide"]) {
    assert.equal(lower.includes(forbidden), false, `production card contains forbidden copy: ${forbidden}`);
  }
  const buttons = componentSource.match(/<button[\s\S]*?<\/button>/gi) || [];
  assert.equal(buttons.some((button) => /transaction|buy|invest|stake|price/i.test(button)), false);
});

global.fetch = originalFetch;

console.log("Eligibility engine unit tests passed.");
}

main().catch((error) => {
  global.fetch = originalFetch;
  console.error(error);
  process.exit(1);
});

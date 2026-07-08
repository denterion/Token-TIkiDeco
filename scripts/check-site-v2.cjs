const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const siteV2Dir = path.join(root, "site-v2");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));

const requiredLinks = [
  "https://github.com/denterion/Token-TIkiDeco",
  manifest.contracts.token.verification,
  manifest.contracts.vestingVault.verification,
  "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md",
  "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/RELEASE_CONTROL_CENTER.md",
  "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/THREE_PHASE_ROADMAP.md",
  "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/CLAIMS_MATRIX.md",
  "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY.md",
  "https://github.com/denterion/Token-TIkiDeco/issues"
];

const requiredDisclaimers = [
  "Sepolia testnet prototype",
  "not offered for sale",
  "no stated monetary value",
  "not deployed on mainnet",
  "independent audit not started",
  "not independently audited"
];

const requiredFirstScreenText = [
  "Sepolia",
  "No Sale",
  "no stated monetary value",
  "not independently audited"
];

const banned = [
  "buy TIDE",
  "token sale",
  "presale",
  "guaranteed",
  "guaranteed benefit",
  "profit",
  "APY",
  "yield",
  "staking rewards",
  "mainnet live",
  "hotel ownership",
  "revenue share",
  "exchange listing",
  "private key",
  "private keys",
  "seed phrase",
  "seed phrases",
  "sign transaction",
  "transaction signing",
  "audited"
];

const allowedContextMarkers = [
  "not",
  "no ",
  "never",
  "without",
  "do not",
  "does not",
  "must not",
  "forbidden",
  "prohibited",
  "disclaimer",
  "no-offer",
  "not offered for sale",
  "not deployed on mainnet",
  "independent audit not started",
  "not independently audited",
  "nothing on this site is financial"
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

const sourceFiles = walk(path.join(siteV2Dir, "src")).filter((file) => /\.(ts|tsx|css)$/.test(file));
const builtFiles = walk(siteDir).filter((file) => /site[\\/]assets[\\/]v2[\\/].*\.(js|css)$/.test(file));
const builtIndex = read(path.join(siteDir, "index.html"));
const source = sourceFiles.map(read).join("\n");
const builtAssets = builtFiles.map(read).join("\n");
const searchable = `${builtIndex}\n${builtAssets}\n${source}`;
const lower = searchable.toLowerCase();

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function assertNoUnsupportedClaimText(label, text) {
  const lines = text.split(/\r?\n/);
  const conflicts = [];
  lines.forEach((line, index) => {
    for (const phrase of banned) {
      if (!phraseRegex(phrase).test(line)) continue;
      const windowText = `${lines[index - 1] || ""}\n${line}\n${lines[index + 1] || ""}`.toLowerCase();
      const allowed = allowedContextMarkers.some((marker) => windowText.includes(marker));
      if (!allowed) conflicts.push(`${label}:${index + 1} contains unsupported phrase "${phrase}": ${line.trim()}`);
    }
  });
  assert(conflicts.length === 0, `Banned public claim phrase found outside allowed prohibited/no-offer context:\n${conflicts.join("\n")}`);
}

assertNoUnsupportedClaimText("site-v2", searchable);
assert(!lower.includes("secure"), "Do not use secure/security-as-outcome wording in V2 site");

const allowedInvestmentContext = "financial, investment, legal or tax advice";
const investmentStripped = lower.replaceAll(allowedInvestmentContext, "");
assert(!investmentStripped.includes("investment"), "Investment wording is allowed only inside the required no-advice footer");

for (const disclaimer of requiredDisclaimers) {
  assert(lower.includes(disclaimer.toLowerCase()), `Missing required disclaimer: ${disclaimer}`);
}

for (const phrase of requiredFirstScreenText) {
  assert(searchable.toLowerCase().includes(phrase.toLowerCase()), `Missing first-screen safety phrase: ${phrase}`);
}

for (const link of requiredLinks) {
  assert(searchable.includes(link), `Missing required link: ${link}`);
}

assert(source.includes("../../../deployments/canonical.json"), "V2 project facts must import canonical deployment manifest");
assert(searchable.includes(manifest.contracts.token.address), "V2 site must expose canonical token address");
assert(searchable.includes(manifest.contracts.vestingVault.address), "V2 site must expose canonical vault address");
assert(source.includes("React Three Fiber") || source.includes("@react-three/fiber"), "V2 README/source must document React Three Fiber usage");
assert(source.includes("prefers-reduced-motion"), "V2 CSS must include reduced-motion handling");
assert(!source.includes("dangerouslySetInnerHTML"), "V2 site must not use dangerous HTML insertion");
assert(source.includes('rel: "noopener noreferrer"'), "External links must use noopener noreferrer helper");

console.log("Site V2 checks passed.");

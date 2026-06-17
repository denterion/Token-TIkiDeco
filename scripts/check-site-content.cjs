const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const htmlPath = path.join(siteDir, "index.html");
const manifestPath = path.join(siteDir, "deployment-manifest.json");

const forbiddenPhrases = [
  "investment",
  "presale",
  "profit",
  "price growth",
  "guaranteed utility",
  "buy token",
  "purchase token"
];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  const html = read(htmlPath);
  const css = read(path.join(siteDir, "styles.css"));
  const js = read(path.join(siteDir, "app.js"));
  const searchable = `${html}\n${css}\n${js}`.toLowerCase();

  for (const phrase of forbiddenPhrases) {
    assert(!searchable.includes(phrase), `Forbidden phrase found in site assets: ${phrase}`);
  }

  assert(fs.existsSync(manifestPath), "site/deployment-manifest.json must be generated before site checks");
  const manifest = JSON.parse(read(manifestPath));
  assert(manifest.contracts.token.address, "public manifest missing token address");
  assert(manifest.contracts.vestingVault.address, "public manifest missing vesting address");
  assert(manifest.ownership.ownerSafe, "public manifest missing owner Safe");
  assert(manifest.treasury.address, "public manifest missing treasury");
  assert(html.includes("SEPOLIA TESTNET · NO MONETARY VALUE"), "persistent Sepolia/no value badge missing");
  assert(html.includes("Content-Security-Policy"), "CSP meta tag missing");
  assert(html.includes("application/ld+json"), "JSON-LD missing");
  assert(html.includes("aria-expanded"), "mobile menu accessibility state missing");

  console.log("Site content checks passed.");
}

main();

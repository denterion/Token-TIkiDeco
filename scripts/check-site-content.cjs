const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const htmlPath = path.join(siteDir, "index.html");
const manifestPath = path.join(siteDir, "deployment-manifest.json");
const cnamePath = path.join(siteDir, "CNAME");
const robotsPath = path.join(siteDir, "robots.txt");
const sitemapPath = path.join(siteDir, "sitemap.xml");

const forbiddenPhrases = [
  "investment",
  "presale",
  "profit",
  "price growth",
  "guaranteed utility",
  "buy token",
  "purchase token"
];
const oldGitHubPagesPath = ["denterion.github.io", "Token-TIkiDeco"].join("/");

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
  const robots = read(robotsPath);
  const sitemap = read(sitemapPath);
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
  assert(!manifest.contracts.token.constructorArguments, "public manifest should not expose token constructor arguments");
  assert(!manifest.contracts.vestingVault.constructorArguments, "public manifest should not expose vault constructor arguments");
  assert(fs.existsSync(cnamePath), "site/CNAME missing for custom domain tracking");
  assert(read(cnamePath).trim() === "tikideco.xyz", "site/CNAME must contain tikideco.xyz");
  assert(html.includes("https://tikideco.xyz/"), "site canonical domain missing from HTML");
  assert(!html.includes(oldGitHubPagesPath), "old GitHub Pages URL found in HTML");
  assert(robots.includes("https://tikideco.xyz/sitemap.xml"), "robots.txt must point to tikideco.xyz sitemap");
  assert(sitemap.includes("https://tikideco.xyz/"), "sitemap.xml must point to tikideco.xyz");
  assert(html.includes("SEPOLIA TESTNET &middot; NO MONETARY VALUE"), "persistent Sepolia/no value badge missing");
  assert(html.includes("Content-Security-Policy"), "CSP meta tag missing");
  assert(html.includes("application/ld+json"), "JSON-LD missing");
  assert(html.includes("aria-expanded"), "mobile menu accessibility state missing");

  console.log("Site content checks passed.");
}

main();

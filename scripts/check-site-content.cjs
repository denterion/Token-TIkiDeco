const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const manifestPath = path.join(siteDir, "deployment-manifest.json");
const cnamePath = path.join(siteDir, "CNAME");
const robotsPath = path.join(siteDir, "robots.txt");
const sitemapPath = path.join(siteDir, "sitemap.xml");

const forbiddenPhrases = [
  "investment",
  "presale",
  "profit",
  "price chart",
  "price growth",
  "guaranteed utility",
  "buy token",
  "purchase token",
  "token purchasing",
  "staking yield",
  "passive income",
  "revenue share"
];
const oldGitHubPagesPath = ["denterion.github.io", "Token-TIkiDeco"].join("/");
const requiredPages = [
  "index.html",
  "audit/index.html",
  "verify/index.html",
  "status/index.html",
  "legal/no-offer/index.html",
  "legal/terms/index.html",
  "legal/privacy/index.html",
  "legal/risk-disclosure/index.html",
  "legal/project-status/index.html"
];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function sitePath(filePath) {
  return path.relative(siteDir, filePath).replaceAll(path.sep, "/");
}

function htmlFiles() {
  return walk(siteDir).filter((filePath) => filePath.endsWith(".html"));
}

function pageUrlForFile(filePath) {
  const relative = sitePath(filePath);
  if (relative === "index.html") return "https://tikideco.xyz/";
  return `https://tikideco.xyz/${relative.replace(/index\.html$/, "")}`;
}

function extractLinks(html) {
  const links = [];
  const regex = /\s(?:href|src)=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.push(match[1]);
  }
  return links;
}

function internalPathFromLink(link) {
  if (link.startsWith("#") || link.startsWith("mailto:") || link.startsWith("https://sepolia.etherscan.io") || link.startsWith("https://github.com")) {
    return null;
  }
  if (link.startsWith("https://tikideco.xyz/")) {
    return new URL(link).pathname;
  }
  if (link.startsWith("http://") || link.startsWith("https://")) return null;
  return link.split("#")[0];
}

function assertInternalLinkExists(link, fromFile) {
  const internal = internalPathFromLink(link);
  if (!internal) return;
  const clean = internal.startsWith("/") ? internal.slice(1) : path.posix.join(path.posix.dirname(sitePath(fromFile)), internal);
  if (clean === "") return;
  const target = clean.endsWith("/") ? `${clean}index.html` : clean;
  const candidates = [
    path.join(siteDir, target),
    path.join(siteDir, `${target}.html`),
    path.join(siteDir, target, "index.html")
  ];
  assert(candidates.some((candidate) => fs.existsSync(candidate)), `Broken internal link ${link} in ${sitePath(fromFile)}`);
}

function main() {
  assert(fs.existsSync(manifestPath), "site/deployment-manifest.json must be generated before site checks");
  const manifest = JSON.parse(read(manifestPath));
  const css = read(path.join(siteDir, "styles.css"));
  const js = read(path.join(siteDir, "app.js"));
  const robots = read(robotsPath);
  const sitemap = read(sitemapPath);
  const htmlPaths = htmlFiles();
  const allHtml = htmlPaths.map(read).join("\n");
  const searchable = `${allHtml}\n${css}\n${js}`.toLowerCase();

  for (const required of requiredPages) {
    assert(fs.existsSync(path.join(siteDir, required)), `Missing required page: ${required}`);
  }

  for (const phrase of forbiddenPhrases) {
    assert(!searchable.includes(phrase), `Forbidden financial phrase found in site assets: ${phrase}`);
  }

  assert(manifest.contracts.token.address, "public manifest missing token address");
  assert(manifest.contracts.vestingVault.address, "public manifest missing vesting address");
  assert(manifest.ownership.ownerSafe, "public manifest missing owner Safe");
  assert(manifest.treasury.address, "public manifest missing treasury");
  assert(!manifest.contracts.token.constructorArguments, "public manifest should not expose token constructor arguments");
  assert(!manifest.contracts.vestingVault.constructorArguments, "public manifest should not expose vault constructor arguments");
  assert(fs.existsSync(cnamePath), "site/CNAME missing for custom domain tracking");
  assert(read(cnamePath).trim() === "tikideco.xyz", "site/CNAME must contain tikideco.xyz");
  assert(robots.includes("https://tikideco.xyz/sitemap.xml"), "robots.txt must point to tikideco.xyz sitemap");
  assert(sitemap.includes("https://tikideco.xyz/audit/"), "sitemap missing audit page");
  assert(sitemap.includes("https://tikideco.xyz/legal/risk-disclosure/"), "sitemap missing risk disclosure");
  assert(fs.existsSync(path.join(siteDir, ".well-known", "security.txt")), "security.txt missing");
  assert(!allHtml.includes(oldGitHubPagesPath), "old GitHub Pages URL found in HTML");

  for (const filePath of htmlPaths) {
    const html = read(filePath);
    const expectedCanonical = pageUrlForFile(filePath);
    assert(html.includes(`<link rel="canonical" href="${expectedCanonical}">`), `Missing canonical metadata in ${sitePath(filePath)}`);
    assert(html.includes("application/ld+json"), `Structured data missing in ${sitePath(filePath)}`);
    assert(html.includes("data-legal-footer"), `Legal footer missing in ${sitePath(filePath)}`);
    assert(html.includes("skip-link"), `Skip link missing in ${sitePath(filePath)}`);
    assert(html.includes("NO MONETARY VALUE"), `Sepolia/no-value badge missing in ${sitePath(filePath)}`);
    assert(html.includes("independent audit") || html.includes("independently audited"), `Audit-status disclaimer missing in ${sitePath(filePath)}`);
    for (const link of extractLinks(html)) assertInternalLinkExists(link, filePath);
  }

  assert(allHtml.includes(manifest.contracts.token.address), "Token address missing from public HTML");
  assert(allHtml.includes(manifest.contracts.vestingVault.address), "Vesting address missing from public HTML");
  assert(!/<meta[^>]+Content-Security-Policy[^>]+frame-ancestors/i.test(allHtml), "Do not claim meta-based frame-ancestors protection");
  assert(allHtml.includes("HTTP Content-Security-Policy frame-ancestors header"), "HTTP CSP frame-ancestors hosting-layer note missing");
  assert(js.includes("Promise.allSettled"), "Dashboard must use Promise.allSettled");
  assert(js.includes("RPC_ALLOWLIST"), "Dashboard RPC allowlist missing");
  assert(js.includes("eth_chainId"), "Dashboard chain ID verification missing");
  assert(!js.includes(".innerHTML"), "Dashboard must not use unsafe innerHTML");
  assert(js.includes("/artifacts/v1/TikiDecoToken/abi.json"), "Dashboard must load versioned token ABI artifact");
  assert(css.includes(":focus-visible"), "Visible focus style missing");
  assert(css.includes("prefers-reduced-motion"), "Reduced-motion CSS missing");
  assert(htmlPaths.some((filePath) => read(filePath).includes("aria-expanded")), "Mobile menu accessibility state missing");

  console.log("Site content checks passed.");
}

main();

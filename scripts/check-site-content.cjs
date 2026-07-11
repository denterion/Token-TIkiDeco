const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const manifestPath = path.join(siteDir, "deployment-manifest.json");
const releaseEvidencePath = path.join(root, "config", "release-evidence.json");
const cnamePath = path.join(siteDir, "CNAME");
const robotsPath = path.join(siteDir, "robots.txt");
const sitemapPath = path.join(siteDir, "sitemap.xml");

const forbiddenPhrases = [
  "buy TIDE",
  "invest",
  "profit",
  "revenue share",
  "hotel ownership",
  "APY",
  "yield",
  "staking rewards",
  "exchange listing",
  "guaranteed benefit",
  "mainnet live",
  "audited",
  "presale",
  "price chart",
  "price growth",
  "buy token",
  "purchase token",
  "token purchasing",
  "staking yield",
  "passive income"
];
const allowedClaimContextMarkers = [
  "not",
  "no ",
  "without",
  "do not",
  "does not",
  "must not",
  "prohibited",
  "forbidden",
  "out-of-scope",
  "out of scope",
  "disclaimer",
  "no-offer",
  "no offer",
  "not independently audited",
  "independent audit not started",
  "not deployed on mainnet",
  "not offered for sale"
];
const oldGitHubPagesPath = ["denterion.github.io", "Token-TIkiDeco"].join("/");
const requiredPages = [
  "index.html",
  "trust/index.html",
  "community-review/index.html",
  "community-review/findings/index.html",
  "audit/index.html",
  "verify/index.html",
  "status/index.html",
  "proof/index.html",
  "utility/index.html",
  "pilot/index.html",
  "business/index.html",
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

function normalizedAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function absoluteLinkSet(links) {
  return new Set(links.map(normalizedAbsoluteUrl).filter(Boolean));
}

function sitemapLocSet(xml) {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim()));
}

function lineSet(value) {
  return new Set(value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
}

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ");
}

function assertNoUnsupportedClaims(files) {
  const conflicts = [];
  for (const filePath of files) {
    const lines = stripTags(read(filePath)).split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const phrase of forbiddenPhrases) {
        if (!phraseRegex(phrase).test(line)) continue;
        const windowText = `${lines[index - 1] || ""}\n${line}\n${lines[index + 1] || ""}`.toLowerCase();
        const allowed = allowedClaimContextMarkers.some((marker) => windowText.includes(marker));
        if (!allowed) conflicts.push(`${sitePath(filePath)}:${index + 1} contains unsupported phrase "${phrase}": ${line.trim()}`);
      }
    });
  }
  assert(conflicts.length === 0, `Forbidden public claim phrase found outside allowed prohibited/no-offer context:\n${conflicts.join("\n")}`);
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
  const releaseEvidence = JSON.parse(read(releaseEvidencePath));
  const css = read(path.join(siteDir, "styles.css"));
  const js = read(path.join(siteDir, "app.js"));
  const robots = read(robotsPath);
  const sitemap = read(sitemapPath);
  const htmlPaths = htmlFiles();
  const allHtml = htmlPaths.map(read).join("\n");
  const allLinks = htmlPaths.flatMap((filePath) => extractLinks(read(filePath)));
  const absoluteLinks = absoluteLinkSet(allLinks);
  const sitemapLocs = sitemapLocSet(sitemap);
  const robotsLines = lineSet(robots);
  const searchable = `${allHtml}\n${css}\n${js}`.toLowerCase();

  for (const required of requiredPages) {
    assert(fs.existsSync(path.join(siteDir, required)), `Missing required page: ${required}`);
  }

  assertNoUnsupportedClaims(htmlPaths);

  assert(manifest.contracts.token.address, "public manifest missing token address");
  assert(manifest.contracts.vestingVault.address, "public manifest missing vesting address");
  assert(manifest.ownership.ownerSafe, "public manifest missing owner Safe");
  assert(manifest.treasury.address, "public manifest missing treasury");
  assert(!manifest.contracts.token.constructorArguments, "public manifest should not expose token constructor arguments");
  assert(!manifest.contracts.vestingVault.constructorArguments, "public manifest should not expose vault constructor arguments");
  assert(fs.existsSync(cnamePath), "site/CNAME missing for custom domain tracking");
  assert(read(cnamePath).trim() === "tikideco.xyz", "site/CNAME must contain tikideco.xyz");
  assert(robotsLines.has("Sitemap: https://tikideco.xyz/sitemap.xml"), "robots.txt must point to tikideco.xyz sitemap");
  assert(sitemapLocs.has("https://tikideco.xyz/audit/"), "sitemap missing audit page");
  assert(sitemapLocs.has("https://tikideco.xyz/community-review/"), "sitemap missing Community Review page");
  assert(sitemapLocs.has("https://tikideco.xyz/community-review/findings/"), "sitemap missing aggregate Community Review findings page");
  assert(sitemapLocs.has("https://tikideco.xyz/trust/"), "sitemap missing Trust Center");
  assert(sitemapLocs.has("https://tikideco.xyz/proof/"), "sitemap missing proof page");
  assert(sitemapLocs.has("https://tikideco.xyz/utility/"), "sitemap missing utility page");
  assert(sitemapLocs.has("https://tikideco.xyz/pilot/"), "sitemap missing pilot page");
  assert(sitemapLocs.has("https://tikideco.xyz/business/"), "sitemap missing business page");
  assert(sitemapLocs.has("https://tikideco.xyz/legal/risk-disclosure/"), "sitemap missing risk disclosure");
  assert(absoluteLinks.has("https://github.com/denterion/Token-TIkiDeco/issues"), "Site must link to GitHub Issues for feedback");
  assert(absoluteLinks.has("https://github.com/denterion/Token-TIkiDeco/blob/main/docs/TRUST_CENTER_SOURCE_MAP.md"), "Site must link to the Trust Center source map");
  assert(absoluteLinks.has("https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PILOT_PROOF_PACK.md"), "Site must link to Pilot Proof Pack");
  assert(absoluteLinks.has(`https://github.com/denterion/Token-TIkiDeco/blob/main/${releaseEvidence.transparencyReport}`), "Site must link to final evidence report");
  assert(absoluteLinks.has("https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md"), "Site must link to Project Facts");
  assert(absoluteLinks.has("https://github.com/denterion/Token-TIkiDeco/blob/main/docs/RELEASE_CONTROL_CENTER.md"), "Site must link to Release Control Center");
  assert(absoluteLinks.has("https://github.com/denterion/Token-TIkiDeco/blob/main/docs/THREE_PHASE_ROADMAP.md"), "Site must link to Roadmap");
  assert(fs.existsSync(path.join(siteDir, ".well-known", "security.txt")), "security.txt missing");
  assert(!allHtml.includes(oldGitHubPagesPath), "old GitHub Pages URL found in HTML");

  for (const filePath of htmlPaths) {
    const html = read(filePath);
    const expectedCanonical = pageUrlForFile(filePath);
    assert(
      new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']\\s*/?>`).test(html),
      `Missing canonical metadata in ${sitePath(filePath)}`
    );
    assert(html.includes("application/ld+json"), `Structured data missing in ${sitePath(filePath)}`);
    assert(html.includes("data-legal-footer"), `Legal footer missing in ${sitePath(filePath)}`);
    assert(html.includes("skip-link"), `Skip link missing in ${sitePath(filePath)}`);
    assert(html.includes("NO MONETARY VALUE"), `Sepolia/no-value badge missing in ${sitePath(filePath)}`);
    assert(html.includes("independent audit") || html.includes("independently audited"), `Audit-status disclaimer missing in ${sitePath(filePath)}`);
    for (const link of extractLinks(html)) assertInternalLinkExists(link, filePath);
  }

  assert(allHtml.includes(manifest.contracts.token.address), "Token address missing from public HTML");
  assert(allHtml.includes(manifest.contracts.vestingVault.address), "Vesting address missing from public HTML");
  assert(allHtml.includes(releaseEvidence.sourceCommit), "Release evidence commit missing from public HTML");
  assert(allHtml.includes(releaseEvidence.releaseManifestSha256), "Release manifest hash missing from public HTML");
  assert(allHtml.includes(releaseEvidence.transparencyReport), "Release evidence report path missing from public HTML");
  assert(!/<meta[^>]+Content-Security-Policy[^>]+frame-ancestors/i.test(allHtml), "Do not claim meta-based frame-ancestors protection");
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

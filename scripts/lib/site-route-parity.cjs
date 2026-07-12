const fs = require("fs");
const path = require("path");

const DEFAULT_BASE_URL = "https://tikideco.xyz";
const EXCLUDED_SEGMENTS = new Set(["assets", "errors", "error", "404", "node_modules", "test-results", "playwright-report", "local", "dev"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function isPublicPage(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  if (!normalized.endsWith("/index.html") && normalized !== "index.html") return false;
  const segments = normalized.split("/");
  return !segments.some((segment) => segment.startsWith(".") || EXCLUDED_SEGMENTS.has(segment.toLowerCase()));
}

function routeForPage(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  const route = normalized === "index.html" ? "/" : `/${normalized.replace(/index\.html$/, "")}`;
  assert(route === route.toLowerCase(), `Generated route must be lowercase: ${route}`);
  assert(!route.includes("//"), `Generated route contains duplicate separators: ${route}`);
  assert(route.endsWith("/"), `Generated route must end with a trailing slash: ${route}`);
  return route;
}

function publicPageInventory(siteDir) {
  const pages = walk(siteDir)
    .map((file) => ({ file, relative: path.relative(siteDir, file).replaceAll(path.sep, "/") }))
    .filter(({ relative }) => isPublicPage(relative))
    .map(({ file, relative }) => ({ file, relative, route: routeForPage(relative) }))
    .sort((a, b) => a.route.localeCompare(b.route));
  const routes = pages.map(({ route }) => route);
  assert(new Set(routes).size === routes.length, "Generated public routes contain a duplicate after normalization.");
  return pages;
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function normalizedPublicUrl(raw, baseUrl, label) {
  assert(raw === raw.trim(), `${label} contains surrounding whitespace: ${raw}`);
  const origin = new URL(baseUrl).origin;
  assert(raw.startsWith(`${origin}/`), `${label} must use ${origin} with lowercase host and scheme: ${raw}`);
  const url = new URL(raw);
  assert(url.origin === origin, `${label} uses the wrong origin: ${raw}`);
  assert(!url.search && !url.hash, `${label} must not contain query or fragment data: ${raw}`);
  const rawPath = raw.slice(origin.length);
  assert(!rawPath.includes("//"), `${label} contains duplicate separators: ${raw}`);
  assert(rawPath === rawPath.toLowerCase(), `${label} path must be lowercase: ${raw}`);
  assert(rawPath.endsWith("/"), `${label} must end with a trailing slash: ${raw}`);
  assert(url.toString() === `${origin}${rawPath}`, `${label} is not normalized: ${raw}`);
  return url.toString();
}

function canonicalUrls(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .filter((match) => /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(match[0]))
    .map((match) => match[0].match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean);
}

function validateRouteParity({
  siteDir,
  sitemapXml,
  baseUrl = DEFAULT_BASE_URL,
  checkSitemap = true,
  checkCanonical = true,
  importantRoutes = [],
  feedbackUrl
}) {
  const pages = publicPageInventory(siteDir);
  const generatedRoutes = new Set(pages.map(({ route }) => route));

  for (const route of importantRoutes) assert(generatedRoutes.has(route), `Important public route was not generated: ${route}`);

  if (checkSitemap) {
    const rawUrls = sitemapUrls(sitemapXml);
    const normalizedUrls = rawUrls.map((url) => normalizedPublicUrl(url, baseUrl, "Sitemap URL"));
    assert(new Set(normalizedUrls).size === normalizedUrls.length, "Sitemap contains a duplicate route.");
    const sitemapRoutes = new Set(normalizedUrls.map((url) => new URL(url).pathname));
    const missing = [...generatedRoutes].filter((route) => !sitemapRoutes.has(route));
    const extra = [...sitemapRoutes].filter((route) => !generatedRoutes.has(route));
    assert(missing.length === 0, `Generated public route missing from sitemap: ${missing.join(", ")}`);
    assert(extra.length === 0, `Sitemap contains a route that was not generated: ${extra.join(", ")}`);
  }

  if (checkCanonical) {
    for (const page of pages) {
      const canonicals = canonicalUrls(fs.readFileSync(page.file, "utf8"));
      assert(canonicals.length > 0, `Page has no canonical URL: ${page.relative}`);
      assert(canonicals.length === 1, `Page has more than one canonical URL: ${page.relative}`);
      const canonical = normalizedPublicUrl(canonicals[0], baseUrl, `Canonical URL in ${page.relative}`);
      const expected = `${new URL(baseUrl).origin}${page.route}`;
      assert(canonical === expected, `Page canonical URL disagrees with route ${page.route}: ${canonical}`);
    }
  }

  if (feedbackUrl) {
    const allHtml = pages.map(({ file }) => fs.readFileSync(file, "utf8")).join("\n");
    assert(allHtml.includes(`href="${feedbackUrl}"`), `Public feedback destination is missing: ${feedbackUrl}`);
  }

  return pages.map(({ route }) => route);
}

module.exports = { DEFAULT_BASE_URL, publicPageInventory, validateRouteParity };

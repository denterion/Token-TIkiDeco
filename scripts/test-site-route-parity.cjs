const fs = require("fs");
const os = require("os");
const path = require("path");
const { validateRouteParity } = require("./lib/site-route-parity.cjs");

const root = path.join(__dirname, "..");
const fixture = JSON.parse(fs.readFileSync(path.join(root, "test", "fixtures", "site-route-parity.json"), "utf8"));
const baseUrl = "https://tikideco.xyz";

function writePage(siteDir, route, canonical) {
  const target = route === "/" ? path.join(siteDir, "index.html") : path.join(siteDir, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const link = canonical === null ? "" : `<link rel="canonical" href="${baseUrl}${canonical || route}">`;
  fs.writeFileSync(target, `<!doctype html><html><head>${link}</head><body></body></html>`);
}

function sitemap(urls) {
  return `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
}

{
  const siteDir = fs.mkdtempSync(path.join(os.tmpdir(), "tikideco-route-parity-"));
  try {
    for (const route of fixture.validRoutes) writePage(siteDir, route);
    for (const relative of ["assets/index.html", "errors/index.html", "local/index.html", "standalone.html"]) {
      const target = path.join(siteDir, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, "<!doctype html><title>Excluded fixture</title>");
    }
    const routes = validateRouteParity({
      siteDir,
      sitemapXml: sitemap(fixture.validRoutes.map((route) => `${baseUrl}${route}`))
    });
    if (JSON.stringify(routes) !== JSON.stringify(fixture.validRoutes)) throw new Error(`Excluded output became public routes: ${routes.join(", ")}`);
    console.log("ok - non-page output is excluded");
  } finally {
    if (!siteDir.startsWith(os.tmpdir())) throw new Error("Refusing to remove fixture outside the system temp directory.");
    fs.rmSync(siteDir, { recursive: true, force: true });
  }
}

for (const testCase of fixture.cases) {
  const siteDir = fs.mkdtempSync(path.join(os.tmpdir(), "tikideco-route-parity-"));
  try {
    for (const route of fixture.validRoutes) writePage(siteDir, route, testCase.canonical?.[route]);
    const urls = testCase.sitemapUrls || testCase.sitemap.map((route) => `${baseUrl}${route}`);
    let error;
    try {
      validateRouteParity({ siteDir, sitemapXml: sitemap(urls) });
    } catch (caught) {
      error = caught;
    }
    if (!error || !error.message.toLowerCase().includes(testCase.expected.toLowerCase())) {
      throw new Error(`${testCase.name}: expected failure containing "${testCase.expected}", received "${error?.message || "no error"}"`);
    }
    console.log(`ok - ${testCase.name}`);
  } finally {
    if (!siteDir.startsWith(os.tmpdir())) throw new Error("Refusing to remove fixture outside the system temp directory.");
    fs.rmSync(siteDir, { recursive: true, force: true });
  }
}

console.log(`${fixture.cases.length} negative route-parity fixtures passed.`);

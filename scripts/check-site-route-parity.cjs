const fs = require("fs");
const path = require("path");
const { validateRouteParity } = require("./lib/site-route-parity.cjs");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const modeIndex = process.argv.indexOf("--mode");
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : "routes";

if (!new Set(["routes", "sitemap", "canonical"]).has(mode)) throw new Error(`Unknown route-check mode: ${mode}`);

const routes = validateRouteParity({
  siteDir,
  sitemapXml: fs.readFileSync(path.join(siteDir, "sitemap.xml"), "utf8"),
  checkSitemap: mode !== "canonical",
  checkCanonical: mode !== "sitemap",
  importantRoutes: ["/", "/trust/", "/status/", "/pilot/", "/audit/", "/community-review/", "/operator-sandbox/"],
  feedbackUrl: mode === "routes" ? "https://github.com/denterion/Token-TIkiDeco/issues" : undefined
});

console.log(`${mode} check passed for ${routes.length} generated public routes.`);
console.log(routes.join("\n"));

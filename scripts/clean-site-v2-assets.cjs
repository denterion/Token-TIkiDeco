const fs = require("node:fs");
const path = require("node:path");

const assetsDir = path.join(__dirname, "..", "site", "assets", "v2");

fs.rmSync(assetsDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });

console.log("Cleaned site/assets/v2 before Vite build.");

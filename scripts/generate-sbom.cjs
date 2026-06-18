const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "security-artifacts", "sbom");
fs.mkdirSync(outDir, { recursive: true });

const sbom = execSync("npm sbom --sbom-format spdx --json", {
  cwd: root,
  encoding: "utf8"
});

fs.writeFileSync(path.join(outDir, "npm.spdx.json"), sbom);
console.log("Generated SPDX SBOM at security-artifacts/sbom/npm.spdx.json");

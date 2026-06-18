const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "security-artifacts");
const checksumPath = path.join(outDir, "SHA256SUMS.txt");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (fullPath === checksumPath) return [];
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

fs.mkdirSync(outDir, { recursive: true });

const files = [
  path.join(root, "deployments", "canonical.json"),
  path.join(root, "deployments", "sepolia.json"),
  path.join(root, "docs", "releases", "v0.1.0-sepolia.md"),
  ...walk(path.join(outDir, "contracts")),
  ...walk(path.join(outDir, "sbom")),
  ...walk(path.join(outDir, "slither"))
].filter((filePath) => fs.existsSync(filePath));

const lines = files.sort().map((filePath) => {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  return `${hash}  ${path.relative(root, filePath).replaceAll(path.sep, "/")}`;
});

fs.writeFileSync(checksumPath, `${lines.join("\n")}\n`);
console.log(`Generated ${path.relative(root, checksumPath)} with ${lines.length} entries.`);

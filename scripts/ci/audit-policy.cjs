const assert = require("node:assert/strict");
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");

const advisory = "https://github.com/advisories/GHSA-mrhx-c7xc-m3w5";
const expires = Date.parse("2026-11-22T00:00:00Z");
const approved = new Set(["zod", "hardhat", ...["ethers", "ethers-chai-matchers", "mocha", "zod-utils"].map(s => "@nomicfoundation/hardhat-" + s)]);

function validate(report, packages, now) {
  assert(report.auditReportVersion === 2 && !report.error && report.vulnerabilities && !Array.isArray(report.vulnerabilities), "Invalid npm audit report");
  const entries = Object.entries(report.vulnerabilities);
  assert.equal(report.metadata?.vulnerabilities?.total, entries.length, "Audit count mismatch");
  for (const [path, pkg] of Object.entries(packages)) {
    if (path.endsWith("/node_modules/zod") || path === "node_modules/zod") assert.equal(pkg.dev, true, "Zod must not enter production");
  }
  if (!entries.length) return;
  assert(now < expires, "Temporary Zod exception expired");
  assert.equal(packages["node_modules/zod"]?.version, "3.25.76");
  assert(report.vulnerabilities.zod, "Missing root advisory");
  for (const [name, v] of entries) {
    assert(approved.has(name) && v.name === name && v.severity === "high", "Unapproved advisory package: " + name);
    assert.deepEqual(v.nodes, ["node_modules/" + name]);
    assert.equal(packages[v.nodes[0]]?.dev, true);
    assert(v.via?.length);
    for (const via of v.via) {
      if (typeof via === "string") assert(name !== "zod" && approved.has(via) && report.vulnerabilities[via], "Unexpected dependency finding");
      else assert(name === "zod" && via.url === advisory && via.dependency === name && via.severity === "high", "New advisory");
    }
  }
  console.warn("Temporary dev-only Zod exception applies through 2026-11-21 UTC:", advisory);
}

if (require.main === module) {
  const scan = spawnSync(process.execPath, [process.env.npm_execpath, "audit", "--json", "--include=dev", "--audit-level=low"], { encoding: "utf8" });
  assert(!scan.error && [0, 1].includes(scan.status), "npm audit could not complete");
  fs.mkdirSync("security-artifacts/dependencies", { recursive: true });
  fs.writeFileSync("security-artifacts/dependencies/npm-audit.json", scan.stdout);
  const report = JSON.parse(scan.stdout);
  validate(report, require("../../package-lock.json").packages, Date.now());
  assert.equal(scan.status, report.metadata.vulnerabilities.total ? 1 : 0);
}
module.exports = validate;

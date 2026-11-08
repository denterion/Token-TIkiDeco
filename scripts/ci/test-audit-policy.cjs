const assert = require("node:assert/strict");
const validate = require("./audit-policy.cjs");
const packages = { "node_modules/zod": { version: "3.25.76", dev: true } };
const issue = { dependency: "zod", severity: "high", url: "https://github.com/advisories/GHSA-mrhx-c7xc-m3w5" };
const report = { auditReportVersion: 2, metadata: { vulnerabilities: { total: 1 } }, vulnerabilities: {
  zod: { name: "zod", severity: "high", nodes: ["node_modules/zod"], via: [issue] }
} };
const now = Date.parse("2026-11-08");
validate(report, packages, now);
assert.throws(() => validate(report, packages, Date.parse("2026-11-22")));
assert.throws(() => validate(report, { "node_modules/zod": { dev: false, version: "3.25.76" } }, now));
assert.throws(() => validate(report, { "node_modules/zod": { dev: true, version: "3.25.75" } }, now));
assert.throws(() => validate({ error: "registry unavailable" }, packages, now));
report.vulnerabilities.zod.via.push({ ...issue, url: "another-advisory" });
assert.throws(() => validate(report, packages, now));

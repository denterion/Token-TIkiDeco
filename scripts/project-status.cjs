#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const reportsDir = path.join(root, "docs", "reports", "automation");
const projectFactsPath = path.join(root, "docs", "PROJECT_FACTS.md");
const nextReleaseGatesPath = path.join(root, "docs", "NEXT_RELEASE_GATES.md");
const knownIssuesPath = path.join(root, "KNOWN_ISSUES.md");

const checks = [
  {
    id: "claims",
    label: "Public claims",
    command: "npm",
    args: ["run", "claims:check"],
    publicGate: true
  },
  {
    id: "release",
    label: "Release document",
    command: "npm",
    args: ["run", "release:check"]
  },
  {
    id: "pilot",
    label: "Utility pilot campaign",
    command: "npm",
    args: ["run", "pilot:campaign:check"]
  },
  {
    id: "site",
    label: "Public site",
    command: "npm",
    args: ["run", "site:check"]
  },
  {
    id: "tests",
    label: "Contract and repository tests",
    command: "npm",
    args: ["test"]
  },
  {
    id: "mainnet-blocked",
    label: "Mainnet/value gate remains blocked",
    command: "node",
    args: ["scripts/check-mainnet-readiness.cjs", "--expect-blocked"],
    publicGate: true
  }
];

function run(command, args, options = {}) {
  let executable = command;
  let finalArgs = args;

  if (command === "node") {
    executable = process.execPath;
  } else if (process.platform === "win32" && command === "npm") {
    executable = "cmd.exe";
    finalArgs = ["/d", "/s", "/c", "npm", ...args];
  }

  const startedAt = Date.now();
  const result = spawnSync(executable, finalArgs, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    timeout: options.timeoutMs || 180000
  });

  const durationMs = Date.now() - startedAt;
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";

  return {
    command: `${command} ${args.join(" ")}`,
    exitCode: typeof result.status === "number" ? result.status : 1,
    durationMs,
    stdout,
    stderr,
    error: result.error ? result.error.message : null
  };
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function gitOutput(args) {
  const result = run("git", args, { timeoutMs: 30000 });
  return result.exitCode === 0 ? result.stdout.trim() : `git ${args.join(" ")} failed`;
}

function truncate(text, max = 1800) {
  const normalized = (text || "").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max)}\n... truncated ...`;
}

function markdownCode(text) {
  return `\`\`\`text\n${text || "(empty)"}\n\`\`\``;
}

function statusLabel(result) {
  return result.exitCode === 0 ? "PASS" : "FAIL";
}

function extractGateSnapshot() {
  const gates = readIfExists(nextReleaseGatesPath);
  const knownIssues = readIfExists(knownIssuesPath);
  const gateLines = gates
    .split(/\r?\n/)
    .filter((line) => /^## Gate \d+:/.test(line) || /^Status:/.test(line))
    .slice(0, 10);
  const issueLines = knownIssues
    .split(/\r?\n/)
    .filter((line) => /^## Finding /.test(line))
    .slice(0, 12);

  return {
    gates: gateLines.length ? gateLines : ["No gate headings found."],
    issues: issueLines.length ? issueLines : ["No known-issue headings found."]
  };
}

function buildReport({ beforeStatus, afterStatus, branch, head, results, factsPresent, gateSnapshot }) {
  const now = new Date();
  const failed = results.filter((item) => item.exitCode !== 0);
  const claimsPassed = results.find((item) => item.id === "claims")?.exitCode === 0;
  const mainnetBlocked = results.find((item) => item.id === "mainnet-blocked")?.exitCode === 0;
  const publicAllowed = factsPresent && claimsPassed && mainnetBlocked;
  const nextAction =
    failed.length > 0
      ? `Fix the first failing gate: ${failed[0].label}. Do not publish positive progress claims until it is green.`
      : "All project status gates passed. It is acceptable to prepare a routine Telegram update using PROJECT_FACTS.md as the source of truth.";

  const lines = [];
  lines.push(`# TikiDeco Automation Status - ${now.toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(`Generated at: ${now.toISOString()}`);
  lines.push("");
  lines.push("This is an internal automation report. It is not a public announcement, financial disclosure, sale material, audit certificate, or mainnet approval.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Overall status: ${failed.length === 0 ? "GREEN" : "ACTION NEEDED"}`);
  lines.push(`- Public posting allowed: ${publicAllowed ? "yes, only with PROJECT_FACTS.md-backed wording" : "no"}`);
  lines.push(`- PROJECT_FACTS.md present: ${factsPresent ? "yes" : "no"}`);
  lines.push(`- Branch: ${branch || "unknown"}`);
  lines.push(`- HEAD: ${head || "unknown"}`);
  lines.push(`- Next action: ${nextAction}`);
  lines.push("");
  lines.push("## Check Results");
  lines.push("");
  lines.push("| Check | Status | Duration | Command |");
  lines.push("| --- | --- | ---: | --- |");
  for (const result of results) {
    lines.push(`| ${result.label} | ${statusLabel(result)} | ${(result.durationMs / 1000).toFixed(1)}s | \`${result.command}\` |`);
  }
  lines.push("");
  lines.push("## Failed Check Output");
  lines.push("");
  if (failed.length === 0) {
    lines.push("No failed checks.");
  } else {
    for (const result of failed) {
      lines.push(`### ${result.label}`);
      const output = [result.error, result.stdout, result.stderr].filter(Boolean).join("\n");
      lines.push(markdownCode(truncate(output)));
      lines.push("");
    }
  }
  lines.push("");
  lines.push("## Release And Pilot Snapshot");
  lines.push("");
  lines.push("Release gates source: `docs/NEXT_RELEASE_GATES.md`");
  lines.push("");
  for (const line of gateSnapshot.gates) lines.push(`- ${line}`);
  lines.push("");
  lines.push("Known issues source: `KNOWN_ISSUES.md`");
  lines.push("");
  for (const line of gateSnapshot.issues) lines.push(`- ${line.replace(/^## /, "")}`);
  lines.push("");
  lines.push("## Public Claims Control");
  lines.push("");
  lines.push("Public copy must be backed by `docs/PROJECT_FACTS.md` and the claims gate. Do not use this report to introduce new public claims.");
  lines.push("");
  lines.push("Blocked unless PROJECT_FACTS.md is updated with verified support: sale, presale, token value, exchange listing, investment return, mainnet approval, independent audit completion, hotel partnership, active guest benefit, completed property, equity, debt, revenue share, or hotel ownership.");
  lines.push("");
  lines.push("Mainnet/value readiness must remain blocked until all legal, security, governance, treasury, utility, and risk-disclosure gates are explicitly approved.");
  lines.push("");
  lines.push("## Git Status Before Checks");
  lines.push("");
  lines.push(markdownCode(beforeStatus || "clean"));
  lines.push("");
  lines.push("## Git Status After Checks");
  lines.push("");
  lines.push(markdownCode(afterStatus || "clean"));
  lines.push("");
  lines.push("## Next Automation Step");
  lines.push("");
  lines.push(failed.length === 0
    ? "- Run `npm run telegram:update` for a guarded routine Telegram update."
    : "- Keep Telegram/public updates in conservative status mode until the failing gate is fixed.");
  lines.push("- Review this report before using any status language in public channels.");
  lines.push("");

  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(projectFactsPath)) {
    console.warn("PROJECT_FACTS.md is missing. Public posting will be blocked in the status report.");
  }

  fs.mkdirSync(reportsDir, { recursive: true });

  const beforeStatus = gitOutput(["status", "--short"]);
  const branch = gitOutput(["branch", "--show-current"]);
  const head = gitOutput(["rev-parse", "--short", "HEAD"]);
  const results = checks.map((check) => ({
    ...check,
    ...run(check.command, check.args, { timeoutMs: check.id === "site" ? 240000 : 180000 })
  }));
  const afterStatus = gitOutput(["status", "--short"]);
  const gateSnapshot = extractGateSnapshot();

  const report = buildReport({
    beforeStatus,
    afterStatus,
    branch,
    head,
    results,
    factsPresent: fs.existsSync(projectFactsPath),
    gateSnapshot
  });

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
  const reportPath = path.join(reportsDir, `STATUS_${date}.md`);
  fs.writeFileSync(reportPath, report, "utf8");

  const failedCount = results.filter((item) => item.exitCode !== 0).length;
  console.log(`Wrote ${path.relative(root, reportPath).replace(/\\/g, "/")}`);
  console.log(`Project status: ${failedCount === 0 ? "GREEN" : `${failedCount} failing check(s)`}`);
}

main();

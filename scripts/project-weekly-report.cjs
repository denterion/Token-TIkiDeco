#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const automationDir = path.join(root, "docs", "reports", "automation");
const factsPath = path.join(root, "docs", "PROJECT_FACTS.md");
const gatesPath = path.join(root, "docs", "NEXT_RELEASE_GATES.md");
const issuesPath = path.join(root, "KNOWN_ISSUES.md");
const communityPath = path.join(root, "docs", "community", "TELEGRAM_LAUNCH_CAMPAIGN.md");

function run(command, args, timeoutMs = 30000) {
  let executable = command;
  let finalArgs = args;

  if (process.platform === "win32" && command === "npm") {
    executable = "cmd.exe";
    finalArgs = ["/d", "/s", "/c", "npm", ...args];
  }

  const result = spawnSync(executable, finalArgs, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    timeout: timeoutMs
  });

  return {
    exitCode: typeof result.status === "number" ? result.status : 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    error: result.error ? result.error.message : null
  };
}

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function latestStatusReport() {
  if (!fs.existsSync(automationDir)) return null;
  const files = fs
    .readdirSync(automationDir)
    .filter((file) => /^STATUS_\d{4}_\d{2}_\d{2}\.md$/.test(file))
    .map((file) => ({
      file,
      fullPath: path.join(automationDir, file),
      mtime: fs.statSync(path.join(automationDir, file)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);
  return files[0] || null;
}

function extractLines(text, predicate, limit = 12) {
  return text.split(/\r?\n/).filter(predicate).slice(0, limit);
}

function extractStatusSummary(statusText) {
  const summary = extractLines(statusText, (line) =>
    /^- (Overall status|Public posting allowed|PROJECT_FACTS\.md present|Branch|HEAD|Next action):/.test(line)
  );
  const checks = extractLines(statusText, (line) => /^\| .+ \| (PASS|FAIL) \|/.test(line), 20);
  return { summary, checks };
}

function extractRoadmapSnapshot() {
  const gates = readText(gatesPath);
  const issues = readText(issuesPath);
  return {
    gates: extractLines(gates, (line) => /^## Gate \d+:/.test(line) || /^Status:/.test(line), 10),
    issues: extractLines(issues, (line) => /^## Finding /.test(line), 12).map((line) => line.replace(/^## /, ""))
  };
}

function markdownCode(text) {
  return `\`\`\`text\n${text || "(empty)"}\n\`\`\``;
}

function buildReport({ latest, statusSummary, roadmap, gitStatus, factsPresent, communityPresent }) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const statusGreen = statusSummary.summary.some((line) => line.includes("Overall status: GREEN"));
  const publicAllowed = statusSummary.summary.some((line) => line.includes("Public posting allowed: yes"));

  const priorities = [
    "Keep daily project status automation green and investigate any failing gate before public updates.",
    "Use Telegram updates only for PROJECT_FACTS.md-backed current facts or clearly labeled planned/experimental work.",
    "Close release-readiness friction by keeping the tree clean before release-package runs.",
    "Continue Gate 1 public preview stabilization, then move toward counsel intake and V2 audit-package readiness.",
    "Keep utility-pilot language as draft/not-live until approvals, window, snapshot, inventory, and reporting fields are complete."
  ];

  const lines = [];
  lines.push(`# TikiDeco Weekly Steering Report - ${date}`);
  lines.push("");
  lines.push(`Generated at: ${now.toISOString()}`);
  lines.push("");
  lines.push("This is an internal steering report. It is not a public announcement, investment material, audit certificate, or mainnet approval.");
  lines.push("");
  lines.push("## Executive Summary");
  lines.push("");
  lines.push(`- Latest daily status report: ${latest ? `\`docs/reports/automation/${latest.file}\`` : "not found"}`);
  lines.push(`- Current automation posture: ${statusGreen ? "green" : "needs review"}`);
  lines.push(`- Public posting posture: ${publicAllowed ? "allowed only with PROJECT_FACTS.md-backed wording" : "blocked"}`);
  lines.push(`- PROJECT_FACTS.md present: ${factsPresent ? "yes" : "no"}`);
  lines.push(`- Telegram campaign material present: ${communityPresent ? "yes" : "no"}`);
  lines.push("");
  lines.push("## Latest Daily Status");
  lines.push("");
  for (const line of statusSummary.summary) lines.push(line);
  lines.push("");
  lines.push("## Gate Results");
  lines.push("");
  if (statusSummary.checks.length === 0) {
    lines.push("No check table found in the latest status report.");
  } else {
    lines.push("| Check | Status | Duration | Command |");
    lines.push("| --- | --- | ---: | --- |");
    for (const line of statusSummary.checks) lines.push(line);
  }
  lines.push("");
  lines.push("## Roadmap And Risk Snapshot");
  lines.push("");
  lines.push("Release gates:");
  for (const line of roadmap.gates) lines.push(`- ${line}`);
  lines.push("");
  lines.push("Known issue headings:");
  for (const line of roadmap.issues) lines.push(`- ${line}`);
  lines.push("");
  lines.push("## This Week Priorities");
  lines.push("");
  priorities.forEach((item, index) => lines.push(`${index + 1}. ${item}`));
  lines.push("");
  lines.push("## Communication Queue");
  lines.push("");
  lines.push("- Telegram: continue Monday/Wednesday/Friday guarded updates only after claims gate passes.");
  lines.push("- X/Twitter: keep pending until an approved API or scheduler integration exists.");
  lines.push("- Public copy must not mention sale, value, listing, mainnet approval, completed audit, partner, live benefit, or completed property unless PROJECT_FACTS.md is updated with verified support.");
  lines.push("");
  lines.push("## Git Status");
  lines.push("");
  lines.push(markdownCode(gitStatus || "clean"));
  lines.push("");
  lines.push("## Next Recommended Codex Prompt");
  lines.push("");
  lines.push("```text");
  lines.push("Review the latest TikiDeco weekly steering report and daily automation status. Pick the highest-impact small PR-sized task that improves release readiness, public clarity, or automation safety without changing token economics or unsupported public claims.");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const latest = latestStatusReport();
  const statusText = latest ? readText(latest.fullPath) : "";
  const statusSummary = extractStatusSummary(statusText);
  const roadmap = extractRoadmapSnapshot();
  const git = run("git", ["status", "--short"]);
  const report = buildReport({
    latest,
    statusSummary,
    roadmap,
    gitStatus: git.stdout.trim(),
    factsPresent: fs.existsSync(factsPath),
    communityPresent: fs.existsSync(communityPath)
  });

  fs.mkdirSync(automationDir, { recursive: true });
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
  const reportPath = path.join(automationDir, `WEEKLY_${date}.md`);
  fs.writeFileSync(reportPath, report, "utf8");
  console.log(`Wrote ${path.relative(root, reportPath).replace(/\\/g, "/")}`);
}

main();

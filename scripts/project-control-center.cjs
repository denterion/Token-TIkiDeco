const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const root = path.join(__dirname, "..");

const verificationCommands = [
  ["npm", ["run", "claims"]],
  ["npm", ["run", "value"]],
  ["npm", ["run", "release:check"]],
  ["npm", ["run", "v02:rc"]],
  ["npm", ["run", "pilot:live:blocked"]],
  ["npm", ["run", "pilot:evidence"]],
  ["npm", ["run", "preview:check"]],
  ["npm", ["run", "privacy:preview:check"]],
  ["node", ["scripts/check-mainnet-readiness.cjs", "--expect-blocked"]]
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function git(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function gitIsAncestor(ancestor, descendant) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function countGates(gates) {
  const entries = Object.entries(gates.requiredBeforeLiveCampaign || {});
  return {
    total: entries.length,
    approved: entries.filter(([, gate]) => gate.status === "approved" && gate.approvalStatus === "approved").length,
    evidenceOnly: entries.filter(([, gate]) => gate.status === "evidence-only").length,
    blocked: entries.filter(([, gate]) => gate.status !== "approved" || gate.approvalStatus !== "approved").length,
    issues: [...new Set(entries.map(([, gate]) => gate.issue).filter((issue) => Number.isInteger(issue)))].sort((a, b) => a - b)
  };
}

function listCheckedItems(markdown, heading) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start === -1) return { total: 0, checked: 0, unchecked: 0 };
  const next = markdown.indexOf("\n## ", start + 1);
  const section = markdown.slice(start, next === -1 ? markdown.length : next);
  const boxes = [...section.matchAll(/^- \[( |x|X)\]/gm)].map((match) => match[1].toLowerCase());
  return {
    total: boxes.length,
    checked: boxes.filter((box) => box === "x").length,
    unchecked: boxes.filter((box) => box === " ").length
  };
}

function runVerification() {
  const npmCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  return verificationCommands.map(([command, args]) => {
    const printable = [command, ...args].join(" ");
    const executable = command === "npm" ? process.execPath : command;
    const executableArgs = command === "npm" ? [npmCli, ...args] : args;
    const result = spawnSync(executable, executableArgs, { cwd: root, encoding: "utf8", shell: false });
    return {
      command: printable,
      ok: result.status === 0,
      status: result.status,
      output: `${result.error?.message || ""}\n${result.stdout || ""}${result.stderr || ""}`.trim().split(/\r?\n/).filter(Boolean).slice(-8)
    };
  });
}

function buildSummary(options = {}) {
  const head = git(["rev-parse", "HEAD"]);
  const shortHead = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const canonical = readJson("deployments/canonical.json");
  const packageJson = readJson("package.json");
  const releaseEvidence = readJson("config/release-evidence.json");
  const gatesDoc = read("docs/NEXT_RELEASE_GATES.md");
  const liveGates = readJson("config/utility-pilot/live-readiness-gates.json");
  const campaign = readJson("config/utility-pilot/tide-community-preview-001.json");
  const evidenceCommit = releaseEvidence.sourceCommit;
  const bundlePath = releaseEvidence.reviewBundlePath;
  const gate3 = listCheckedItems(gatesDoc, "Gate 3: V2 Audit Package Readiness");
  const gate4 = listCheckedItems(gatesDoc, "Gate 4: Community Preview");
  const liveGateCounts = countGates(liveGates);
  const evidenceMatchesHead = evidenceCommit === head;
  const evidenceIsAncestor = /^[0-9a-f]{40}$/i.test(evidenceCommit || "") && gitIsAncestor(evidenceCommit, head);

  const blockers = [];
  if (!evidenceIsAncestor) blockers.push("v0.2 RC evidence source is missing from or diverges from the current history.");
  if (campaign.status !== "draft-not-live") blockers.push("Pilot campaign is not draft-not-live; review immediately.");
  if (canonical.network !== "sepolia") blockers.push("Canonical deployment network is not Sepolia.");
  if (canonical.contractVersion !== "v1-legacy") blockers.push("Canonical contract version is not v1-legacy.");
  if (canonical.auditStatus?.independentAudit !== "not-started") blockers.push("Independent audit status changed; verify public claims.");
  if (liveGateCounts.approved > 0) blockers.push("At least one live-pilot gate is approved; confirm this was intentional.");

  const nextActions = [];
  if (!evidenceMatchesHead && evidenceIsAncestor) {
    nextActions.push("Treat the recorded bundle as an immutable source baseline; later commits are not included in its source archive.");
    nextActions.push("Regenerate it before the next immutable release candidate or after a release-critical source change.");
  }
  nextActions.push("Keep npm run pilot:live:blocked green until legal, privacy, security, operations, and governance approvals exist.");
  nextActions.push("Keep V2 candidate status explicit until external audit handoff is complete and a later manifest promotes it.");

  const summary = {
    generatedAt: new Date().toISOString(),
    repository: {
      branch,
      head,
      shortHead,
      packageName: packageJson.name,
      packageVersion: packageJson.version
    },
    canonical: {
      network: canonical.network,
      chainId: canonical.chainId,
      contractVersion: canonical.contractVersion,
      token: canonical.contracts?.token?.address,
      vestingVault: canonical.contracts?.vestingVault?.address,
      ownerSafe: canonical.ownership?.ownerSafe,
      treasury: canonical.treasury,
      independentAudit: canonical.auditStatus?.independentAudit,
      mainnetApproved: canonical.auditStatus?.mainnetApproved
    },
    releaseCandidate: {
      evidenceCommit,
      evidenceMatchesHead,
      evidenceIsAncestor,
      bundlePath,
      bundlePathExists: bundlePath ? exists(bundlePath) : false
    },
    pilot: {
      campaignId: campaign.campaignId,
      campaignStatus: campaign.status,
      liveReadinessStatus: liveGates.status,
      gates: liveGateCounts
    },
    roadmap: {
      gate3,
      gate4
    },
    blockers,
    nextActions
  };

  if (options.verify) summary.verification = runVerification();
  return summary;
}

function renderMarkdown(summary) {
  const lines = [];
  lines.push("# TikiDeco Project Control Center");
  lines.push("");
  lines.push(`Generated: ${summary.generatedAt}`);
  lines.push("");
  lines.push("This report is an internal release-management view. It is not a token sale, value statement, mainnet approval, live utility approval, V2 promotion, or independent audit claim.");
  lines.push("");
  lines.push("## Current Baseline");
  lines.push("");
  lines.push(`- Branch: \`${summary.repository.branch || "detached"}\``);
  lines.push(`- HEAD: \`${summary.repository.head}\``);
  lines.push(`- Canonical network: ${summary.canonical.network} (${summary.canonical.chainId})`);
  lines.push(`- Canonical version: \`${summary.canonical.contractVersion}\``);
  lines.push(`- Independent audit: \`${summary.canonical.independentAudit}\``);
  lines.push(`- Mainnet approved: \`${summary.canonical.mainnetApproved}\``);
  lines.push("");
  lines.push("## Release Candidate Evidence");
  lines.push("");
  lines.push(`- Evidence commit: \`${summary.releaseCandidate.evidenceCommit || "missing"}\``);
  lines.push(`- Evidence matches HEAD: \`${summary.releaseCandidate.evidenceMatchesHead}\``);
  lines.push(`- Evidence is in current history: \`${summary.releaseCandidate.evidenceIsAncestor}\``);
  lines.push(`- Review bundle path: \`${summary.releaseCandidate.bundlePath || "missing"}\``);
  lines.push(`- Review bundle exists locally: \`${summary.releaseCandidate.bundlePathExists}\``);
  lines.push("");
  lines.push("## Pilot Gates");
  lines.push("");
  lines.push(`- Campaign: \`${summary.pilot.campaignId}\``);
  lines.push(`- Campaign status: \`${summary.pilot.campaignStatus}\``);
  lines.push(`- Live readiness status: \`${summary.pilot.liveReadinessStatus}\``);
  lines.push(`- Gates: ${summary.pilot.gates.approved} approved / ${summary.pilot.gates.evidenceOnly} evidence-only / ${summary.pilot.gates.blocked} blocked / ${summary.pilot.gates.total} total`);
  lines.push(`- Tracking issues: ${summary.pilot.gates.issues.map((issue) => `#${issue}`).join(", ")}`);
  lines.push("");
  lines.push("## Roadmap Gate Snapshot");
  lines.push("");
  lines.push(`- Gate 3 V2 audit package readiness: ${summary.roadmap.gate3.checked}/${summary.roadmap.gate3.total} checked`);
  lines.push(`- Gate 4 community preview: ${summary.roadmap.gate4.checked}/${summary.roadmap.gate4.total} checked`);
  lines.push("");
  lines.push("## Blockers");
  lines.push("");
  if (summary.blockers.length === 0) lines.push("- No control-center blockers detected.");
  else summary.blockers.forEach((blocker) => lines.push(`- ${blocker}`));
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  summary.nextActions.forEach((action) => lines.push(`- ${action}`));
  if (summary.verification) {
    lines.push("");
    lines.push("## Verification");
    lines.push("");
    summary.verification.forEach((item) => {
      lines.push(`- ${item.ok ? "PASS" : "FAIL"} \`${item.command}\``);
      if (!item.ok && item.output.length > 0) {
        lines.push("");
        lines.push("  ```text");
        item.output.forEach((line) => lines.push(`  ${line}`));
        lines.push("  ```");
      }
    });
  }
  lines.push("");
  lines.push("## Required Boundaries");
  lines.push("");
  lines.push("- TIDE remains an Ethereum Sepolia prototype.");
  lines.push("- No token sale is approved.");
  lines.push("- No stated monetary value is approved.");
  lines.push("- No mainnet deployment is approved.");
  lines.push("- No active guest benefits are live.");
  lines.push("- Independent audit has not started.");
  lines.push("- V2 remains candidate code only.");
  return `${lines.join("\n")}\n`;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const summary = buildSummary({ verify: args.has("--verify") });
  if (args.has("--json")) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  console.log(renderMarkdown(summary));
  if (args.has("--fail-on-blockers") && summary.blockers.length > 0) process.exit(1);
  if (summary.verification?.some((item) => !item.ok)) process.exit(1);
}

main();

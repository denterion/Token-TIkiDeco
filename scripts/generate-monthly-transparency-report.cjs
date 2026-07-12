const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const reportsDir = path.join(root, "docs", "reports");
const socialDir = path.join(root, "docs", "social", "monthly");
const now = new Date();
const reportDate = process.env.REPORT_DATE || now.toISOString().slice(0, 10);
const month = process.env.REPORT_MONTH || reportDate.slice(0, 7);
const monthToken = month.replace("-", "_");
const reportName = `MONTHLY_REPORT_${monthToken}`;
const reportPath = `docs/reports/${reportName}.md`;
const jsonPath = `docs/reports/${reportName}.json`;
const checksumPath = `docs/reports/${reportName}.sha256`;
const xPath = `docs/social/monthly/${reportName}_X.md`;
const telegramPath = `docs/social/monthly/${reportName}_TELEGRAM.md`;
const generatedAt = `${reportDate}T00:00:00.000Z`;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function json(relativePath) {
  return JSON.parse(read(relativePath));
}

function command(executable, args) {
  return execFileSync(executable, args, { cwd: root, encoding: "utf8" }).trim();
}

function rootLink(relativePath, label = relativePath) {
  return `[${label}](../../${relativePath.replaceAll("\\", "/")})`;
}

function latestStatusReport() {
  const dir = path.join(reportsDir, "automation");
  const file = fs.readdirSync(dir).filter((name) => /^STATUS_\d{4}_\d{2}_\d{2}\.md$/.test(name)).sort().at(-1);
  if (!file) throw new Error("Run npm run project:status before building the monthly report.");
  return `docs/reports/automation/${file}`;
}

function parseStatusChecks(markdown) {
  const section = markdown.split("## Check Results")[1]?.split("\n## ")[0] || "";
  return section.split(/\r?\n/)
    .filter((line) => /^\|[^-].*\|$/.test(line) && !line.includes("| Check |"))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length === 4)
    .filter((cells) => !cells.every((cell) => /^:?-+:?$/.test(cell)))
    .map(([name, status, duration, checkCommand]) => ({ name, status, duration, command: checkCommand.replaceAll("`", "") }));
}

function summarizeFindings(registry) {
  const findings = registry.findings || [];
  const bySeverity = {};
  const byStatus = {};
  for (const finding of findings) {
    bySeverity[finding.severity] = (bySeverity[finding.severity] || 0) + 1;
    byStatus[finding.status] = (byStatus[finding.status] || 0) + 1;
  }
  return { total: findings.length, bySeverity, byStatus };
}

function summarizeIssues(issues) {
  const byMilestone = {};
  const byPriority = {};
  for (const issue of issues) {
    const milestone = issue.milestone?.title || "No milestone";
    byMilestone[milestone] = (byMilestone[milestone] || 0) + 1;
    for (const label of issue.labels.map((item) => item.name).filter((name) => name.startsWith("priority:"))) {
      byPriority[label] = (byPriority[label] || 0) + 1;
    }
  }
  return { total: issues.length, byMilestone, byPriority };
}

const canonical = json("deployments/canonical.json");
const versions = json("config/public-versions.json");
const releaseEvidence = json("config/release-evidence.json");
const candidate = json("config/audit/v2-review-candidate.json");
const community = json("config/community-review/status.json");
const findingsRegistry = json("config/community-review/findings.json");
const pilot = json("config/utility-pilot/tide-community-preview-001.json");
const safe = json("config/governance/safe-resilience.json");
const governance = json("config/governance/readiness.json");
const operator = json("config/hospitality-operator/readiness-gates.json");
const operatorReport = json("operations/hospitality-operator/operator-sandbox-report.json");
const roadmap = json("config/roadmap/roadmap.json");
const sourceCommit = command("git", ["rev-parse", "origin/main"]);
const releaseEvidenceFreshness = releaseEvidence.sourceCommit === sourceCommit
  ? "matches current main at generation"
  : "does not match current main at generation";
const statusReportPath = latestStatusReport();
const statusReport = read(statusReportPath);
const checks = parseStatusChecks(statusReport);
if (checks.length === 0) throw new Error(`No check results found in ${statusReportPath}.`);
const issues = JSON.parse(command("gh", ["issue", "list", "--state", "open", "--limit", "200", "--json", "number,labels,milestone,updatedAt"]));
const issueSummary = summarizeIssues(issues);
const findingsSummary = summarizeFindings(findingsRegistry);
const mainnetOutput = command(process.execPath, ["scripts/check-mainnet-readiness.cjs", "--expect-blocked"]);
const mainnetBlockers = Number(mainnetOutput.match(/Unapproved statuses:\s*(\d+)/)?.[1]);
if (!Number.isInteger(mainnetBlockers)) throw new Error("Could not read the blocked mainnet status count.");

const sources = {
  canonical: "deployments/canonical.json",
  versions: "config/public-versions.json",
  releaseEvidence: "config/release-evidence.json",
  candidate: "config/audit/v2-review-candidate.json",
  community: "config/community-review/status.json",
  findings: "config/community-review/findings.json",
  issues: "gh issue list --state open --limit 200 --json number,labels,milestone,updatedAt",
  checks: statusReportPath,
  pilot: "config/utility-pilot/tide-community-preview-001.json",
  safe: "config/governance/safe-resilience.json",
  governance: "config/governance/readiness.json",
  operator: "config/hospitality-operator/readiness-gates.json",
  operatorReport: "operations/hospitality-operator/operator-sandbox-report.json",
  blockers: "docs/MAINNET_GO_NO_GO.md",
  roadmap: "config/roadmap/roadmap.json",
  roadmapDelta: "docs/reports/ROADMAP_DELTA_2026_07.md"
};

const roadmapQuarters = ["Q1", "Q2", "Q3", "Q4"];
const roadmapCompleted = new Set(["internally-complete", "externally-verified"]);
const roadmapStats = Object.fromEntries(roadmapQuarters.map((quarter) => {
  const items = roadmap.items.filter((item) => item.quarter === quarter && item.status !== "superseded");
  const verified = items.filter((item) => roadmapCompleted.has(item.status)).length;
  return [quarter, { verified, total: items.length, percent: items.length ? Math.round((verified / items.length) * 1000) / 10 : 0 }];
}));
const roadmapActions = roadmap.items
  .filter((item) => !roadmapCompleted.has(item.status) && item.status !== "superseded")
  .sort((a, b) => roadmapQuarters.indexOf(a.quarter) - roadmapQuarters.indexOf(b.quarter) || a.id.localeCompare(b.id))
  .slice(0, 4);
const roadmapActionRows = roadmapActions.map((item) => {
  const label = item.status === "in-progress" ? "In progress" : ["externally-blocked", "no-go"].includes(item.status) ? "Blocked" : "Planned";
  return `| ${label} | ${item.nextAction} | ${rootLink(sources.roadmap)} / ${rootLink(item.evidenceFiles[0])} |`;
}).join("\n");

const releaseRows = versions.publishedReleases.map((release) =>
  `| ${release.version} | ${release.status} | \`${release.sourceCommit}\` | [Release](${release.releaseUrl}) / ${rootLink(sources.versions)} |`
).join("\n");
const findingRows = [
  `| Total recorded | ${findingsSummary.total} | ${rootLink(sources.findings)} |`,
  ...Object.entries(findingsSummary.bySeverity).map(([severity, count]) => `| Severity: ${severity} | ${count} | ${rootLink(sources.findings)} |`),
  ...Object.entries(findingsSummary.byStatus).map(([status, count]) => `| Status: ${status} | ${count} | ${rootLink(sources.findings)} |`)
].join("\n");
const issueRows = Object.entries(issueSummary.byMilestone)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([milestone, count]) => `| ${milestone} | ${count} | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / \`${sources.issues}\` |`)
  .join("\n");
const checkRows = checks.map((item) =>
  `| ${item.name} | ${item.status} | \`${item.command}\` | ${rootLink(sources.checks)} |`
).join("\n");

const body = `# TikiDeco Monthly Transparency Report - ${month}

Report period: ${month}. Generated from repository and GitHub evidence on ${reportDate}. Every status below is a dated snapshot, not a promise of future completion. Evidence: ${rootLink("docs/PROJECT_FACTS.md")} and ${rootLink("docs/CLAIMS_MATRIX.md")}.

## Current Main Commit

| Fact | Status | Evidence |
| --- | --- | --- |
| Current main at generation | \`${sourceCommit}\` | [Commit](https://github.com/denterion/Token-TIkiDeco/commit/${sourceCommit}) / \`git rev-parse origin/main\` |

## Canonical Deployment

| Fact | Status | Evidence |
| --- | --- | --- |
| Network | Ethereum Sepolia, chain ID ${canonical.chainId} | ${rootLink(sources.canonical)} |
| Canonical version | ${canonical.contractVersion}; legacy testnet prototype | ${rootLink(sources.canonical)} |
| Token | \`${canonical.contracts.token.address}\` | [Verified source](${canonical.contracts.token.verification}) / ${rootLink(sources.canonical)} |
| Vesting vault | \`${canonical.contracts.vestingVault.address}\` | [Verified source](${canonical.contracts.vestingVault.verification}) / ${rootLink(sources.canonical)} |
| Owner Safe | \`${canonical.ownership.ownerSafe}\`; threshold ${canonical.ownership.safeThreshold} | ${rootLink(sources.canonical)} |

## Current Releases

| Release | Status | Source commit | Evidence |
| --- | --- | --- | --- |
${releaseRows}
| Review evidence baseline | ${releaseEvidence.status} | \`${releaseEvidence.sourceCommit}\` | ${rootLink(sources.releaseEvidence)} |

## V2 Candidate Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Candidate | Frozen non-canonical review candidate | ${rootLink(sources.candidate)} / ${rootLink(sources.canonical)} |
| Candidate evidence commit | \`${candidate.evidenceCommit}\` | [Commit](https://github.com/denterion/Token-TIkiDeco/commit/${candidate.evidenceCommit}) / ${rootLink(sources.candidate)} |
| Package SHA-256 | \`${candidate.packageSha256}\` | ${rootLink(sources.candidate)} |
| Independent review | ${candidate.independentTechnicalReviewStatus}; formal independent smart-contract audit ${candidate.independentAuditStatus} | ${rootLink(sources.candidate)} |

## Community Review Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Community peer review | ${community.status} | ${rootLink(sources.community)} |
| Candidate commit | \`${community.candidateCommit}\` | [Candidate](https://github.com/denterion/Token-TIkiDeco/tree/${community.candidateCommit}) / ${rootLink(sources.community)} |
| Acknowledged reviewers | ${community.reviewersAcknowledged.length} | ${rootLink(sources.community)} |
| Formal audit status | ${community.formalAuditStatus}; community review is not a formal audit | ${rootLink(sources.community)} |

## Findings Summary

| Fact | Count | Evidence |
| --- | ---: | --- |
${findingRows}

Zero recorded findings is not evidence that vulnerabilities do not exist. Evidence: ${rootLink("docs/community-review/FINDING_LIFECYCLE.md")}.

## Open Issue Summary

| Milestone | Open issues | Evidence |
| --- | ---: | --- |
${issueRows}
| **Total** | **${issueSummary.total}** | [Open issues](https://github.com/denterion/Token-TIkiDeco/issues?q=is%3Aissue+is%3Aopen) / \`${sources.issues}\` |

## Test And Security Checks

| Check | Result | Command | Evidence |
| --- | --- | --- | --- |
${checkRows}

These are repository checks recorded by the latest internal status run; they are not an independent security conclusion. Evidence: ${rootLink(sources.checks)} and ${rootLink("SECURITY_CI.md")}.

## Pilot Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Campaign | ${pilot.status}; lifecycle stage ${pilot.lifecycle.currentStage} | ${rootLink(sources.pilot)} |
| Request window | ${pilot.requestWindow.status} | ${rootLink(sources.pilot)} |
| Published inventory | ${pilot.inventory.publishedCapacity} | ${rootLink(sources.pilot)} |
| Required approvals | ${Object.values(pilot.requiredApprovalsBeforePublication).filter((status) => status === "not-approved").length} not approved | ${rootLink(sources.pilot)} |

## Safe Drill Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Threshold decision | ${safe.decision}; threshold unchanged | ${rootLink(sources.safe)} |
| Tabletop drill | ${safe.incidentDrillStatus} | ${rootLink(sources.safe)} / ${rootLink("docs/governance/SAFE_RESILIENCE_DRILL_2026.md")} |
| Governance readiness | ${governance.status}; ${governance.gates.filter((gate) => gate.status === "approved").length}/${governance.gates.length} gates approved | ${rootLink(sources.governance)} |

## Operator Sandbox Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Operator pilot | ${operator.status}; operator ${operator.operatorStatus}; property ${operator.propertyStatus} | ${rootLink(sources.operator)} |
| Real inventory | ${operator.inventory} | ${rootLink(sources.operator)} |
| Local demonstration | ${operatorReport.mode}; report state ${operatorReport.report.state} | ${rootLink(sources.operatorReport)} |
| Demonstration report SHA-256 | \`${operatorReport.sha256}\` | ${rootLink(sources.operatorReport)} |

## Legal And External-Review Blockers

| Blocker | Status | Evidence |
| --- | --- | --- |
| Independent reviewer engagement | Not started; selection and handoff remain externally blocked | ${rootLink("docs/PUBLIC_REVIEW_PROCUREMENT_BRIEF.md")} / [Issue #121](https://github.com/denterion/Token-TIkiDeco/issues/121) |
| Legal/entity review | Requires external counsel review; no approval is recorded | ${rootLink("docs/LEGAL_READINESS.md")} / ${rootLink(sources.blockers)} |
| Operator readiness | ${operator.status}; all ${Object.keys(operator.gates).length} operator gates remain not approved | ${rootLink(sources.operator)} |
| Release evidence refresh | Recorded baseline \`${releaseEvidence.sourceCommit}\` ${releaseEvidenceFreshness} | ${rootLink(sources.releaseEvidence)} / ${rootLink("docs/RELEASE_CONTROL_CENTER.md")} |

## Mainnet Status

| Fact | Status | Evidence |
| --- | --- | --- |
| Mainnet readiness | Blocked; ${mainnetBlockers} unapproved statuses | ${rootLink(sources.blockers)} / \`node scripts/check-mainnet-readiness.cjs --expect-blocked\` |
| Canonical network | Sepolia; no mainnet deployment recorded | ${rootLink(sources.canonical)} |

## Roadmap Progress

| Fact | Verified | Tracked | Compliance | Evidence |
| --- | ---: | ---: | ---: | --- |
${roadmapQuarters.map((quarter) => `| ${quarter} | ${roadmapStats[quarter].verified} | ${roadmapStats[quarter].total} | ${roadmapStats[quarter].percent}% | ${rootLink(sources.roadmap)} |`).join("\n")}

Internal engineering completion does not satisfy reviewer, legal, operator, user, or production evidence. Monthly status changes: ${rootLink(sources.roadmapDelta)}.

## Next-Month Goals

| Status | Goal | Evidence |
| --- | --- | --- |
${roadmapActionRows}

## Public Boundaries

TIDE remains a Sepolia testnet prototype: no sale, no stated monetary value, no mainnet deployment, no active hospitality benefit, and no completed independent audit. V2 remains non-canonical. Evidence: ${rootLink("docs/PROJECT_FACTS.md")} and ${rootLink("docs/VALUE_CLAIM_POLICY.md")}.
`;

const reportSha256 = crypto.createHash("sha256").update(body).digest("hex");
const report = `${body}\n## Report Integrity\n\n| Fact | Value | Evidence |\n| --- | --- | --- |\n| Report body SHA-256 | \`${reportSha256}\` | Recompute with \`npm run transparency:monthly:check\` |\n| Machine summary | \`${jsonPath}\` | ${rootLink(jsonPath)} |\n`;

const summary = {
  schemaVersion: "1.0.0",
  month,
  generatedAt,
  sourceCommit,
  reportPath,
  reportSha256,
  canonical: {
    network: canonical.network,
    chainId: canonical.chainId,
    version: canonical.contractVersion,
    token: canonical.contracts.token.address,
    vault: canonical.contracts.vestingVault.address,
    ownerSafe: canonical.ownership.ownerSafe,
    safeThreshold: canonical.ownership.safeThreshold
  },
  releases: versions.publishedReleases.map(({ version, tag, status, sourceCommit }) => ({ version, tag, status, sourceCommit })),
  v2Candidate: {
    status: candidate.status,
    freezeCommit: candidate.v2FreezeCommit,
    evidenceCommit: candidate.evidenceCommit,
    packageSha256: candidate.packageSha256,
    independentAuditStatus: candidate.independentAuditStatus
  },
  communityReview: {
    status: community.status,
    candidateCommit: community.candidateCommit,
    reviewersAcknowledged: community.reviewersAcknowledged.length
  },
  findings: findingsSummary,
  openIssues: {
    ...issueSummary,
    sourceCommand: sources.issues,
    issueNumbers: issues.map((issue) => issue.number).sort((a, b) => a - b)
  },
  checks: { source: statusReportPath, results: checks },
  pilot: { id: pilot.campaignId, status: pilot.status, stage: pilot.lifecycle.currentStage, inventory: pilot.inventory.publishedCapacity },
  safe: { status: safe.incidentDrillStatus, decision: safe.decision, thresholdChanged: safe.thresholdChanged },
  operator: { status: operator.status, operatorStatus: operator.operatorStatus, propertyStatus: operator.propertyStatus, inventory: operator.inventory, sandboxReportSha256: operatorReport.sha256 },
  roadmap: { source: sources.roadmap, quarterCompliance: roadmapStats, currentActions: roadmapActions.map(({ id, status, evidenceType, nextAction }) => ({ id, status, evidenceType, nextAction })) },
  blockers: {
    mainnetUnapprovedStatuses: mainnetBlockers,
    operatorGatesNotApproved: Object.keys(operator.gates).length,
    independentReview: "not-started",
    legalReview: "requires-review",
    releaseEvidenceSourceCommit: releaseEvidence.sourceCommit,
    releaseEvidenceMatchesMainAtGeneration: releaseEvidence.sourceCommit === sourceCommit
  },
  sources
};

const reportUrl = `https://github.com/denterion/Token-TIkiDeco/blob/main/${reportPath}`;
const xDraft = `# Monthly Transparency Draft - ${month}\n\nCompleted: Safe tabletop evidence and a fake-data operator sandbox are published.\nIn progress: community peer review of the frozen non-canonical V2 candidate.\nBlocked: the pilot, external validation, legal approval, and mainnet readiness.\nPlanned: independent reviewer outreach and privacy-safe operator interviews.\n\nSepolia prototype only. No sale, no stated monetary value, no active hospitality benefit, and independent audit not completed.\n\nSource-linked report: ${reportUrl}\n`;
const telegramDraft = `# Monthly Transparency Draft - Telegram - ${month}\n\nTikiDeco monthly status\n\nCompleted\n- Test-only Safe resilience drill evidence.\n- Fake-data operator sandbox and aggregate report.\n\nIn progress\n- Community peer review for the frozen, non-canonical V2 candidate.\n\nBlocked\n- Utility pilot publication.\n- Independent technical validation and legal approval.\n- Mainnet readiness.\n\nPlanned\n- Independent reviewer outreach.\n- Privacy-safe operator workflow interviews.\n\nTIDE remains a Sepolia prototype. No sale, no stated monetary value, no active hospitality benefit, and independent audit not completed.\n\nFull source-linked report: ${reportUrl}\n`;
const latest = `# Latest Monthly Transparency Report\n\nCurrent monthly snapshot: [${month}](${reportName}.md)\n\n- Machine-readable summary: [JSON](${reportName}.json)\n- Report body SHA-256: \`${reportSha256}\`\n- Generated from main commit at snapshot: \`${sourceCommit}\`\n\nThis pointer is generated by \`npm run transparency:monthly:build\`.\n`;

fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(socialDir, { recursive: true });
fs.writeFileSync(path.join(root, reportPath), report);
fs.writeFileSync(path.join(root, jsonPath), `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(path.join(root, checksumPath), `${reportSha256}  ${reportName}.md.body\n`);
fs.writeFileSync(path.join(reportsDir, "MONTHLY_REPORT_LATEST.md"), latest);
fs.writeFileSync(path.join(root, xPath), xDraft);
fs.writeFileSync(path.join(root, telegramPath), telegramDraft);

console.log(`Monthly transparency report: ${reportPath}`);
console.log(`JSON summary: ${jsonPath}`);
console.log(`Report body SHA-256: ${reportSha256}`);
console.log(`Open issues captured: ${issueSummary.total}`);
console.log(`Recorded findings: ${findingsSummary.total}`);

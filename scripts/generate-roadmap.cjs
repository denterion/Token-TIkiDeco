const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const roadmap = JSON.parse(fs.readFileSync(path.join(root, "config/roadmap/roadmap.json"), "utf8"));
const releaseEvidence = JSON.parse(fs.readFileSync(path.join(root, "config/release-evidence.json"), "utf8"));
const versions = JSON.parse(fs.readFileSync(path.join(root, "config/public-versions.json"), "utf8"));
const generatedCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const completed = new Set(["internally-complete", "externally-verified"]);
const quarters = ["Q1", "Q2", "Q3", "Q4"];

function link(file) {
  return `[${file}](../${file})`;
}

function quarterStats(items) {
  const active = items.filter((item) => item.status !== "superseded");
  const verified = active.filter((item) => completed.has(item.status));
  return { total: active.length, verified: verified.length, percent: active.length ? Math.round((verified.length / active.length) * 1000) / 10 : 0 };
}

function statusLabel(status) {
  return status.replaceAll("-", " ");
}

const stats = Object.fromEntries(quarters.map((quarter) => [quarter, quarterStats(roadmap.items.filter((item) => item.quarter === quarter))]));
const byEvidence = Object.fromEntries(roadmap.evidenceTypes.map((type) => [type, quarterStats(roadmap.items.filter((item) => item.evidenceType === type))]));
const actions = roadmap.items
  .filter((item) => !completed.has(item.status) && item.status !== "superseded")
  .sort((a, b) => quarters.indexOf(a.quarter) - quarters.indexOf(b.quarter) || a.id.localeCompare(b.id));
const changed = roadmap.items.filter((item) => item.baselineStatus !== item.status);

const roadmapDoc = `# Current Evidence-Linked Roadmap

Generated from \`config/roadmap/roadmap.json\` at repository commit \`${generatedCommit}\` on ${roadmap.snapshotDate}. This is a generated planning snapshot, not an immutable release and not a promise of completion.

Current canonical deployment remains V1 legacy on Ethereum Sepolia. V2 remains a non-canonical candidate. Community peer review does not establish independent validation.

## Quarter Compliance

Compliance means an item has repository evidence marked \`internally-complete\` or real external evidence marked \`externally-verified\`. A passing internal command never satisfies an external gate.

| Quarter | Verified | Tracked | Compliance |
| --- | ---: | ---: | ---: |
${quarters.map((quarter) => `| ${quarter} | ${stats[quarter].verified} | ${stats[quarter].total} | ${stats[quarter].percent}% |`).join("\n")}

## Internal And External Progress

| Evidence class | Verified | Tracked | Compliance |
| --- | ---: | ---: | ---: |
${roadmap.evidenceTypes.map((type) => `| ${statusLabel(type)} | ${byEvidence[type].verified} | ${byEvidence[type].total} | ${byEvidence[type].percent}% |`).join("\n")}

## Roadmap Items

| ID | Quarter | Evidence class | Status | Source commit | Evidence | Next action |
| --- | --- | --- | --- | --- | --- | --- |
${roadmap.items.map((item) => `| \`${item.id}\` | ${item.quarter} | ${statusLabel(item.evidenceType)} | **${statusLabel(item.status)}** | \`${item.sourceCommit.slice(0, 12)}\` | ${item.evidenceFiles.map(link).join("; ")} | ${item.nextAction} |`).join("\n")}

## Current Actions

${actions.map((item, index) => `${index + 1}. **${item.id} - ${statusLabel(item.status)}.** ${item.nextAction}${item.blocker ? ` Blocker: ${item.blocker}` : ""}`).join("\n")}

## Snapshot Separation

- Repository commit at generation: \`${generatedCommit}\`.
- Latest immutable review/release evidence snapshot: \`${releaseEvidence.sourceCommit}\`.
- Published tags keep their own source commits: ${versions.publishedReleases.map((release) => `\`${release.version}\` -> \`${release.sourceCommit}\``).join("; ")}.
- An older immutable snapshot is historical evidence, not current main. Generate a new snapshot rather than rewriting it.

## Boundaries

This roadmap does not authorize deployment, transactions, V2 promotion, commercial operations, or any external approval. Reviewer, legal, operator, user, and production states remain unverified until real evidence exists.
`;

const actionsDoc = `# Maintainer Action List

Generated from \`config/roadmap/roadmap.json\` at commit \`${generatedCommit}\`. Actions are ordered by roadmap quarter; blocked external work is not represented as an engineering completion.

${actions.map((item, index) => `## ${index + 1}. ${item.id}\n\n- Quarter: ${item.quarter}\n- Status: \`${item.status}\`\n- Owner type: \`${item.ownerType}\`\n- Evidence class: \`${item.evidenceType}\`\n- Blocker: ${item.blocker || "None recorded."}\n- Next action: ${item.nextAction}\n- Verification: ${item.verificationCommands.map((command) => `\`${command}\``).join(", ")}\n- Evidence: ${item.evidenceFiles.map(link).join(", ")}\n`).join("\n")}

## Control Rule

Do not change an external item to \`externally-verified\` because an internal script passes. Record real reviewer, counsel, operator, user, or production evidence first.
`;

const deltaDoc = `# Roadmap Progress Delta - ${roadmap.monthlyBaseline.period}

Comparison baseline: \`${roadmap.monthlyBaseline.sourceCommit}\`. Current roadmap generation commit: \`${generatedCommit}\`.

| Item | Previous | Current | Evidence |
| --- | --- | --- | --- |
${changed.length ? changed.map((item) => `| \`${item.id}\` | ${statusLabel(item.baselineStatus)} | ${statusLabel(item.status)} | ${item.evidenceFiles.map((file) => `[${file}](../../${file})`).join("; ")} |`).join("\n") : "| None | No status changes | No status changes | config/roadmap/roadmap.json |"}

Changed items: **${changed.length}** of **${roadmap.items.length}**. External reviewer and counsel engagement remain unstarted unless their dedicated evidence records change.
`;

const deltaJson = {
  schemaVersion: "1.0.0",
  period: roadmap.monthlyBaseline.period,
  baselineCommit: roadmap.monthlyBaseline.sourceCommit,
  generatedCommit,
  generatedAt: `${roadmap.snapshotDate}T00:00:00Z`,
  quarterCompliance: stats,
  evidenceCompliance: byEvidence,
  changedItems: changed.map(({ id, baselineStatus, status, sourceCommit }) => ({ id, previousStatus: baselineStatus, currentStatus: status, sourceCommit }))
};

fs.writeFileSync(path.join(root, "docs/ROADMAP_CURRENT.md"), roadmapDoc);
fs.writeFileSync(path.join(root, "docs/MAINTAINER_ACTIONS.md"), actionsDoc);
fs.writeFileSync(path.join(root, `docs/reports/ROADMAP_DELTA_${roadmap.monthlyBaseline.period.replace("-", "_")}.md`), deltaDoc);
fs.writeFileSync(path.join(root, `docs/reports/ROADMAP_DELTA_${roadmap.monthlyBaseline.period.replace("-", "_")}.json`), `${JSON.stringify(deltaJson, null, 2)}\n`);

console.log(`Roadmap generated at ${generatedCommit}.`);
for (const quarter of quarters) console.log(`${quarter}: ${stats[quarter].verified}/${stats[quarter].total} (${stats[quarter].percent}%)`);
console.log(`Changed since ${roadmap.monthlyBaseline.sourceCommit}: ${changed.length} items.`);

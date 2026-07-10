const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const registryPath = path.join(root, "docs", "claims-registry.json");
const reportPath = path.join(root, "PUBLIC_CLAIMS_CONSISTENCY_REPORT.md");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function normalize(filePath) {
  return filePath.replaceAll("\\", "/");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function uniq(values) {
  return [...new Set(values)];
}

function targetFiles() {
  const docsDir = path.join(root, "docs");
  const siteDir = path.join(root, "site");
  const docsFiles = walk(docsDir).filter((filePath) => {
    const rel = normalize(path.relative(root, filePath));
    return (
      /^docs\/WHITEPAPER_.*\.md$/.test(rel) ||
      /^docs\/releases\/.*\.md$/.test(rel) ||
      /^docs\/FAQ.*\.md$/.test(rel) ||
      rel === "docs/PUBLIC_MATERIALS.md" ||
      rel === "docs/CLAIMS_MATRIX.md" ||
      rel === "docs/COMMUNICATION_PLAYBOOK.md" ||
      rel === "docs/COMMUNICATION_POLICY.md" ||
      rel === "docs/LEGAL_READINESS.md" ||
      rel === "docs/RISK_DISCLOSURE.md" ||
      rel === "docs/PROJECT_FACTS.md" ||
      rel === "docs/VALUE_AND_UTILITY_BOUNDARY.md" ||
      rel === "docs/BUSINESS_MODEL.md" ||
      rel === "docs/MAINNET_GO_NO_GO.md" ||
      rel === "docs/MAINNET_READINESS_GAP_ANALYSIS.md" ||
      rel === "docs/VALUE_CLAIM_POLICY.md" ||
      rel === "docs/HOSPITALITY_OPERATIONS_GATE.md" ||
      /^docs\/utility-pilot\/.*\.md$/.test(rel)
    );
  });
  const siteFiles = walk(siteDir).filter((filePath) => {
    const rel = normalize(path.relative(root, filePath));
    return /^site\/.*\.html$/.test(rel);
  });
  return uniq([
    path.join(root, "README.md"),
    path.join(root, "package.json"),
    ...docsFiles,
    ...siteFiles
  ]).filter((filePath) => fs.existsSync(filePath));
}

function isPolicyContextFile(rel) {
  return [
    "docs/CLAIMS_MATRIX.md",
    "docs/COMMUNICATION_PLAYBOOK.md",
    "docs/COMMUNICATION_POLICY.md",
    "docs/LEGAL_READINESS.md",
    "docs/RISK_DISCLOSURE.md",
    "docs/PROJECT_FACTS.md",
    "docs/releases/RELEASE_CHECKLIST.md"
  ].includes(rel);
}

function phraseRegex(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function isAllowedContext(rel, lines, index, markers) {
  if (isPolicyContextFile(rel)) return true;
  const previous = lines[index - 1] || "";
  const current = lines[index] || "";
  const next = lines[index + 1] || "";
  const windowText = `${previous}\n${current}\n${next}`.toLowerCase();
  if (/^\s*#{1,6}\s+.*\?\s*$/.test(current)) return true;
  return markers.some((marker) => windowText.includes(marker.toLowerCase()));
}

function sentenceForLine(line) {
  return line.trim().replace(/\s+/g, " ");
}

function scanUnsupportedPhrases(files, registry) {
  const phrases = registry.prohibitedOrCounselRequiredClaims;
  const markers = registry.scanner.allowedContextMarkers;
  const conflicts = [];
  const allowedMentions = [];

  for (const filePath of files) {
    const rel = normalize(path.relative(root, filePath));
    const lines = readText(filePath).split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const phrase of phrases) {
        if (!phraseRegex(phrase).test(line)) continue;
        const item = {
          file: rel,
          line: index + 1,
          phrase,
          sentence: sentenceForLine(line)
        };
        if (isAllowedContext(rel, lines, index, markers)) {
          allowedMentions.push(item);
        } else {
          conflicts.push(item);
        }
      }
    });
  }

  return { conflicts, allowedMentions };
}

function aggregateText(files) {
  return files.map((filePath) => readText(filePath)).join("\n").toLowerCase();
}

function checkRequiredStatements(files, registry) {
  const text = aggregateText(files);
  const checks = [
    {
      label: "Ethereum Sepolia prototype",
      ok: text.includes("sepolia") && (text.includes("prototype") || text.includes("testnet"))
    },
    {
      label: "no sale",
      ok: text.includes("no token sale") || text.includes("not offered for sale")
    },
    {
      label: "no stated monetary value",
      ok: text.includes("no stated monetary value") || text.includes("has no stated monetary value")
    },
    {
      label: "no mainnet deployment",
      ok: text.includes("not deployed on mainnet") || text.includes("no mainnet deployment")
    },
    {
      label: "no independent audit",
      ok: text.includes("not independently audited") || text.includes("independent audit not started")
    },
    {
      label: "no equity, debt, revenue, property or return rights",
      ok: text.includes("equity") && text.includes("debt") && text.includes("revenue") && text.includes("property") && text.includes("return")
    },
    {
      label: "hospitality functionality is conceptual or planned",
      ok: text.includes("conceptual") && text.includes("planned") && text.includes("hospitality")
    }
  ];
  return checks.map((check) => ({
    ...check,
    expected: registry.requiredBaselineStatements.find((statement) => statement.toLowerCase().includes(check.label.split(" ")[0].toLowerCase())) || check.label
  }));
}

function markdownTable(rows) {
  if (rows.length === 0) return "None.\n";
  const escape = (value) => String(value).replaceAll("|", "\\|");
  return [
    "| File | Line | Phrase | Sentence |",
    "| --- | ---: | --- | --- |",
    ...rows.map((row) => `| \`${escape(row.file)}\` | ${row.line} | \`${escape(row.phrase)}\` | ${escape(row.sentence)} |`)
  ].join("\n") + "\n";
}

function writeReport({ files, required, conflicts, allowedMentions, registry }) {
  const failedRequired = required.filter((item) => !item.ok);
  const content = `# Public Claims Consistency Report

Generated by \`npm run claims:check\`.

This is a compliance-oriented documentation control, not legal advice.

## Registry

- Registry: \`docs/claims-registry.json\`
- Registry version: \`${registry.version}\`

## Scanned Surfaces

${files.map((filePath) => `- \`${normalize(path.relative(root, filePath))}\``).join("\n")}

## Required Baseline Statements

| Statement | Status |
| --- | --- |
${required.map((item) => `| ${item.label} | ${item.ok ? "present" : "missing"} |`).join("\n")}

## Conflicting Sentences

${markdownTable(conflicts)}

## Allowed Historical, Risk, Or Prohibition Context Mentions

${markdownTable(allowedMentions)}

## Result

${conflicts.length === 0 && failedRequired.length === 0 ? "PASS" : "FAIL"}
`;
  fs.writeFileSync(reportPath, content);
}

function main() {
  const registry = readJson(registryPath);
  const files = targetFiles();
  const { conflicts, allowedMentions } = scanUnsupportedPhrases(files, registry);
  const required = checkRequiredStatements(files, registry);
  writeReport({ files, required, conflicts, allowedMentions, registry });

  const failedRequired = required.filter((item) => !item.ok);
  if (conflicts.length > 0 || failedRequired.length > 0) {
    console.error(`Public claims check failed. See ${normalize(path.relative(root, reportPath))}.`);
    if (failedRequired.length > 0) {
      console.error(`Missing required baseline statements: ${failedRequired.map((item) => item.label).join(", ")}`);
    }
    if (conflicts.length > 0) {
      console.error(`Conflicting sentences: ${conflicts.length}`);
    }
    process.exit(1);
  }

  console.log(`Public claims check passed. Report written to ${normalize(path.relative(root, reportPath))}.`);
}

main();

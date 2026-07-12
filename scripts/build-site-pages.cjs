const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { summarize: summarizeCommunityFindings } = require("./lib/community-findings.cjs");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "deployments", "canonical.json"), "utf8"));
const releaseEvidence = JSON.parse(fs.readFileSync(path.join(root, "config", "release-evidence.json"), "utf8"));
const publicVersions = JSON.parse(fs.readFileSync(path.join(root, "config", "public-versions.json"), "utf8"));
const pilotCampaign = JSON.parse(fs.readFileSync(path.join(root, "config", "utility-pilot", "tide-community-preview-001.json"), "utf8"));
const v2Review = JSON.parse(fs.readFileSync(path.join(root, "config", "audit", "v2-independent-review.json"), "utf8"));
const v2ReviewCandidate = JSON.parse(fs.readFileSync(path.join(root, "config", "audit", "v2-review-candidate.json"), "utf8"));
const communityReview = JSON.parse(fs.readFileSync(path.join(root, "config", "community-review", "status.json"), "utf8"));
const communityFindings = JSON.parse(fs.readFileSync(path.join(root, "config", "community-review", "findings.json"), "utf8"));
const roadmap = JSON.parse(fs.readFileSync(path.join(root, "config", "roadmap", "roadmap.json"), "utf8"));
const communityFindingsSummary = summarizeCommunityFindings(communityFindings);
const headCommit = manifest.sourceCommit;
const lastUpdated = manifest.publishedReports?.[0]?.publishedAt || manifest.ownership.ownershipTransferredAt;
const v01ReleaseCommit = publicVersions.publishedReleases.find((release) => release.tag === "v0.1.0-sepolia").sourceCommit;
const v02ReleaseCommit = publicVersions.publishedReleases.find((release) => release.tag === "v0.2.0-utility-pilot").sourceCommit;
const v2FreezeBaseline = v2Review.v2FreezeCommit;
const currentEvidenceCommit = releaseEvidence.sourceCommit;
const siteLastUpdated = releaseEvidence.evidenceDate;

function gitCommit(ref) {
  try {
    return execFileSync("git", ["rev-parse", ref], { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

const currentMainCommit = process.env.GITHUB_REF === "refs/heads/main" && /^[0-9a-f]{40}$/i.test(process.env.GITHUB_SHA || "")
  ? process.env.GITHUB_SHA
  : gitCommit("origin/main") || gitCommit("HEAD") || "unavailable";
const evidenceFreshness = currentEvidenceCommit === currentMainCommit
  ? "Current evidence commit matches main"
  : "Recorded source baseline; later commits are not included in its source archive";
const repoBlob = "https://github.com/denterion/Token-TIkiDeco/blob/main";
const evidenceReportUrl = `${repoBlob}/${releaseEvidence.transparencyReport}`;
const evidenceHashReportUrl = `${repoBlob}/${releaseEvidence.transparencyReport.replace(/\.md$/, "_HASH.md")}`;
const candidateTree = `https://github.com/denterion/Token-TIkiDeco/tree/${communityReview.candidateCommit}`;
const candidateBlob = `https://github.com/denterion/Token-TIkiDeco/blob/${communityReview.candidateCommit}`;
const freezeBlob = `https://github.com/denterion/Token-TIkiDeco/blob/${communityReview.freezeCommit}`;
const definitionBlob = `https://github.com/denterion/Token-TIkiDeco/blob/${communityReview.definitionCommit}`;
const reviewerAcknowledgements = communityReview.reviewersAcknowledged.length > 0
  ? communityReview.reviewersAcknowledged.join(", ")
  : "No reviewers have been acknowledged yet";

function readLatestMonthlyReport() {
  const reportsDir = path.join(root, "docs", "reports");
  const file = fs.readdirSync(reportsDir).filter((name) => /^MONTHLY_REPORT_\d{4}_\d{2}\.json$/.test(name)).sort().at(-1);
  return file ? JSON.parse(fs.readFileSync(path.join(reportsDir, file), "utf8")) : null;
}

const monthlyReport = readLatestMonthlyReport();
const monthlyReportUrl = monthlyReport ? `${repoBlob}/${monthlyReport.reportPath}` : null;

const baseUrl = "https://tikideco.xyz";
const pages = [
  {
    path: "trust/index.html",
    title: "Trust Center",
    description: "A source-linked status and verification center for the TikiDeco Ethereum Sepolia prototype.",
    eyebrow: "Public verification",
    heading: "Trust Center",
    intro: "One cautious-reader view of what exists, what is blocked, which commits back each release, and where every critical fact comes from.",
    sections: [
      ["Project Status", [
        ["Current network", "Ethereum Sepolia", `${repoBlob}/deployments/canonical.json`],
        ["Canonical deployment", `${manifest.contractVersion} legacy`, `${repoBlob}/deployments/canonical.json`],
        ["Current main commit", currentMainCommit, `https://github.com/denterion/Token-TIkiDeco/commit/${currentMainCommit}`],
        ["Current evidence commit", currentEvidenceCommit, `${repoBlob}/config/release-evidence.json`],
        ["Evidence freshness", evidenceFreshness, `${repoBlob}/docs/PUBLIC_EVIDENCE_DASHBOARD.md`],
        ...(monthlyReport ? [["Latest monthly transparency report", `${monthlyReport.month}; body SHA-256 ${monthlyReport.reportSha256}`, monthlyReportUrl]] : []),
        ["Pilot status", pilotCampaign.status, `${repoBlob}/config/utility-pilot/tide-community-preview-001.json`],
        ["Mainnet", "Not deployed; not approved", `${repoBlob}/docs/MAINNET_GO_NO_GO.md`],
        ["Independent smart-contract audit", "Not started", `${repoBlob}/deployments/canonical.json`]
      ]],
      ["Release Version Matrix", [
        ...publicVersions.publishedReleases.map((release) => [
          release.version,
          `${release.status}; tag ${release.tag}; source ${release.sourceCommit}`,
          release.releaseUrl
        ]),
        ["Current main", `${currentMainCommit}; mutable development line`, `https://github.com/denterion/Token-TIkiDeco/commit/${currentMainCommit}`],
        ["Current review bundle", `${releaseEvidence.status}; source ${currentEvidenceCommit}; ${evidenceFreshness}`, `${repoBlob}/config/release-evidence.json`],
        ["Next release candidate", `${publicVersions.nextReleaseCandidate.version}; ${publicVersions.nextReleaseCandidate.status}; source ${publicVersions.nextReleaseCandidate.sourceCommit || "not assigned"}`, `${repoBlob}/config/public-versions.json`]
      ]],
      ["Canonical V1", [
        ["Token", manifest.contracts.token.address, manifest.contracts.token.verification],
        ["Vesting vault", manifest.contracts.vestingVault.address, manifest.contracts.vestingVault.verification],
        ["Owner Safe", manifest.ownership.ownerSafe, `${repoBlob}/deployments/canonical.json`],
        ["Safe threshold", manifest.ownership.safeThreshold, `${repoBlob}/deployments/canonical.json`],
        ["Treasury", manifest.treasury.address, `${repoBlob}/deployments/canonical.json`]
      ]],
      ["Candidate And Business Boundaries", [
        ["V2", "Candidate code only; not canonical", `${repoBlob}/docs/V2_AUDIT_TARGET_FREEZE.md`],
        ["Operator", "Publicly maintained through an individual GitHub account; legal identity not verified", `${repoBlob}/docs/OPERATOR_AND_ENTITY_STATUS.md`],
        ["Legal entity", "Not publicly verified", `${repoBlob}/docs/OPERATOR_AND_ENTITY_STATUS.md`],
        ["Hospitality business", "No commercial hospitality service operating", `${repoBlob}/docs/OPERATOR_AND_ENTITY_STATUS.md`],
        ["Hospitality partner", "Not publicly verified", `${repoBlob}/docs/OPERATOR_AND_ENTITY_STATUS.md`],
        ["Active guest benefit", "Not live", `${repoBlob}/docs/PROJECT_FACTS.md`]
      ]],
      ["Reports And Limitations", [
        ["Latest repository evidence report", releaseEvidence.transparencyReport, `${repoBlob}/${releaseEvidence.transparencyReport}`],
        ...(monthlyReport ? [["Latest monthly transparency report", `${monthlyReport.month}; source ${monthlyReport.sourceCommit}`, monthlyReportUrl]] : []),
        ["Public preview proof baseline", "Zero public sample; campaign remains draft-not-live", `${repoBlob}/docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md`],
        ["Evidence report SHA-256", releaseEvidence.transparencyReportSha256, evidenceHashReportUrl],
        ["Latest on-chain report", manifest.publishedReports[0].uri, `https://sepolia.etherscan.io/tx/${manifest.publishedReports[0].transaction}`],
        ["Known limitations", "Published; legal, audit, operator, pilot, and mainnet gates remain open", `${repoBlob}/KNOWN_ISSUES.md`],
        ["Dependency audit", "npm advisory scan only; not an independent smart-contract audit", `${repoBlob}/package.json`]
      ]],
      ["Public Paths", [
        ["V2 community review", "Exact candidate, checksum, reproduction, findings, and reporting paths", "/community-review/"],
        ["Aggregate community findings", "Public-safe counts and candidate impact without sensitive exploit details", "/community-review/findings/"],
        ["Security reporting", "GitHub private vulnerability reporting and SECURITY.md", "https://github.com/denterion/Token-TIkiDeco/security/advisories/new"],
        ["Public feedback", "GitHub issue forms for non-sensitive feedback", "https://github.com/denterion/Token-TIkiDeco/issues/new/choose"],
        ["Participation status", "Issues enabled; Discussions disabled", `${repoBlob}/docs/PUBLIC_PARTICIPATION.md`],
        ["Fact-source map", "Every Trust Center field has a verification rule and stale-data behavior", `${repoBlob}/docs/TRUST_CENTER_SOURCE_MAP.md`]
      ]]
    ],
    links: [
      ["Project Facts", `${repoBlob}/docs/PROJECT_FACTS.md`],
      ["Release Control Center", `${repoBlob}/docs/RELEASE_CONTROL_CENTER.md`],
      ["Trust Center Source Map", `${repoBlob}/docs/TRUST_CENTER_SOURCE_MAP.md`],
      ["Operator And Entity Status", `${repoBlob}/docs/OPERATOR_AND_ENTITY_STATUS.md`],
      ["Public Participation", `${repoBlob}/docs/PUBLIC_PARTICIPATION.md`],
      ["Known Issues", `${repoBlob}/KNOWN_ISSUES.md`],
      ...(monthlyReport ? [["Latest Monthly Report", monthlyReportUrl]] : [])
    ],
    disclaimer: "TIDE is a Sepolia testnet prototype: no sale, no stated monetary value, no mainnet deployment, no active guest benefit, and independent audit not started."
  },
  {
    path: "community-review/index.html",
    title: "V2 Community Review",
    description: "Public peer-review path for the exact frozen, non-canonical TikiDeco V2 candidate.",
    eyebrow: "Open community peer review",
    heading: "Review the frozen V2 candidate",
    intro: "Verify one immutable candidate, reproduce its evidence, inspect known questions, and use the appropriate public or private reporting path.",
    sections: [
      ["Review Identity", [
        ["Current review status", communityReview.status, `${repoBlob}/config/community-review/status.json`],
        ["Review candidate source commit", communityReview.candidateCommit, candidateTree],
        ["Frozen V2 code commit", communityReview.freezeCommit, `https://github.com/denterion/Token-TIkiDeco/commit/${communityReview.freezeCommit}`],
        ["Package SHA-256", communityReview.packageSha256, `${definitionBlob}/config/audit/v2-review-candidate.json`],
        ["Formal independent audit", communityReview.formalAuditStatus, `${repoBlob}/SECURITY.md`],
        ["Opened", communityReview.openedAt, `${repoBlob}/config/community-review/status.json`]
      ]],
      ["Contracts And Scripts In Scope", [
        ["Token candidate", "contracts/TikiDecoTokenV2.sol", `${freezeBlob}/contracts/TikiDecoTokenV2.sol`],
        ["Vesting candidate", "contracts/TikiDecoVestingVaultV2.sol", `${freezeBlob}/contracts/TikiDecoVestingVaultV2.sol`],
        ["Deployment guard", "scripts/deploy-v2.cjs", `${freezeBlob}/scripts/deploy-v2.cjs`],
        ["Candidate tooling", v2ReviewCandidate.reviewTooling.join(", "), `${definitionBlob}/config/audit/v2-review-candidate.json`]
      ]],
      ["Tests And Review Evidence", [
        ["Hardhat tests", v2ReviewCandidate.tests.filter((file) => file.startsWith("test/")).join(", "), `${candidateBlob}/test`],
        ["Foundry tests", v2ReviewCandidate.tests.filter((file) => file.startsWith("foundry/")).join(", "), `${candidateBlob}/foundry`],
        ["Known issues", `${v2ReviewCandidate.knownIssues.ids.join(", ")} remain visible for review`, `${candidateBlob}/KNOWN_ISSUES.md`],
        ["Reviewer questions", "Access control, pause behavior, vesting liabilities, metadata, roles, and Slither classifications", `${candidateBlob}/docs/AUDITOR_QUESTIONS.md`]
      ]],
      ["Reproduce", [
        ["Checkout", `git checkout ${communityReview.candidateCommit}`],
        ["Focused checks", "npm ci && npm run compile && npm test && npm run foundry:test && npm run slither"],
        ["Build package", `npm run review:candidate:build -- --commit ${communityReview.candidateCommit}`],
        ["Expected package SHA-256", communityReview.packageSha256],
        ["Process check", "npm run community-review:check"]
      ]],
      ["Report Or Ask", [
        ["Public security finding", "Public-safe Medium, Low, or Informational finding", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=community_security_finding.yml"],
        ["Reproducibility issue", "Broken command, checksum, scope, or immutable link", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=community_reproducibility_issue.yml"],
        ["Test suggestion", "Focused Hardhat, Foundry, invariant, or deployment-guard test", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=community_test_coverage_suggestion.yml"],
        ["Review question", "Public non-sensitive scope or technical question", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=community_review_question.yml"],
        ["Sensitive vulnerability", "Use private vulnerability reporting; do not publish exploitable unresolved Critical or High details", "https://github.com/denterion/Token-TIkiDeco/security/advisories/new"]
      ]],
      ["Out Of Scope", v2ReviewCandidate.explicitExclusions.map((item) => ["Excluded", item])],
      ["Acknowledgements", [
        ["Reviewers acknowledged", reviewerAcknowledgements, `${repoBlob}/config/community-review/status.json`],
        ["Public findings", String(communityReview.publicFindingsCount), `${repoBlob}/config/community-review/status.json`],
        ["Private findings disclosed as aggregate", String(communityReview.privateFindingsCountPubliclyDisclosedAsAggregate), `${repoBlob}/config/community-review/status.json`]
      ]]
    ],
    links: [
      ["Community Review Guide", `${repoBlob}/docs/community-review/COMMUNITY_REVIEW_GUIDE.md`],
      ["Finding Lifecycle", `${repoBlob}/docs/community-review/FINDING_LIFECYCLE.md`],
      ["Aggregate Findings", "/community-review/findings/"],
      ["Exact candidate source", candidateTree],
      ["Immutable candidate definition", `${definitionBlob}/config/audit/v2-review-candidate.json`],
      ["Security policy", `${repoBlob}/SECURITY.md`],
      ["Private vulnerability reporting", "https://github.com/denterion/Token-TIkiDeco/security/advisories/new"]
    ],
    disclaimer: "Community peer review is not a formal independent smart-contract audit. V2 remains non-canonical and non-deployed. No mainnet, sale, liquidity, listing, stated monetary value, or active hospitality benefit is approved."
  },
  {
    path: "community-review/findings/index.html",
    title: "Community Review Findings",
    description: "Public-safe aggregate state for findings submitted against the exact frozen TikiDeco V2 review candidate.",
    eyebrow: "Aggregate review state",
    heading: "Community findings, without sensitive details",
    intro: "This page reports counts and release impact only. Unresolved sensitive reproduction steps remain in private vulnerability reporting.",
    sections: [
      ["Candidate", [
        ["Candidate version", communityFindings.candidateVersion, `${repoBlob}/config/community-review/findings.json`],
        ["Candidate commit", communityFindings.candidateCommit, candidateTree],
        ["Package SHA-256", communityFindings.packageSha256, `${definitionBlob}/config/audit/v2-review-candidate.json`],
        ["Candidate status", communityFindingsSummary.nextCandidateRequired ? "New candidate required" : "Current candidate source unchanged", `${repoBlob}/config/community-review/findings.json`]
      ]],
      ["Aggregate Findings", [
        ["Total submitted", String(communityFindingsSummary.totalSubmitted), `${repoBlob}/config/community-review/findings.json`],
        ["Validated", String(communityFindingsSummary.validated), `${repoBlob}/config/community-review/findings.json`],
        ["Rejected, duplicate, or invalid", String(communityFindingsSummary.rejected), `${repoBlob}/config/community-review/findings.json`],
        ["Remediated", String(communityFindingsSummary.remediated), `${repoBlob}/config/community-review/findings.json`],
        ["Retested", String(communityFindingsSummary.retested), `${repoBlob}/config/community-review/findings.json`]
      ]],
      ["Open By Severity", Object.entries(communityFindingsSummary.openBySeverity).map(([severity, count]) => [severity, String(count), `${repoBlob}/config/community-review/findings.json`])],
      ["Disclosure Boundary", [
        ["Public findings", String(communityReview.publicFindingsCount), `${repoBlob}/config/community-review/status.json`],
        ["Private findings disclosed as aggregate", String(communityReview.privateFindingsCountPubliclyDisclosedAsAggregate), `${repoBlob}/config/community-review/status.json`],
        ["Sensitive details", "Not displayed on this page", `${repoBlob}/SECURITY.md`],
        ["Deployment", "Blocked; this aggregate does not approve deployment", `${repoBlob}/docs/MAINNET_GO_NO_GO.md`]
      ]]
    ],
    links: [
      ["Community Review", "/community-review/"],
      ["Triage Playbook", `${repoBlob}/docs/community-review/FINDING_TRIAGE_PLAYBOOK.md`],
      ["Finding Lifecycle", `${repoBlob}/docs/community-review/FINDING_LIFECYCLE.md`],
      ["Public-safe finding form", "https://github.com/denterion/Token-TIkiDeco/issues/new?template=community_security_finding.yml"],
      ["Private vulnerability reporting", "https://github.com/denterion/Token-TIkiDeco/security/advisories/new"]
    ],
    disclaimer: "Community peer review is not a formal independent smart-contract audit. V2 remains non-canonical and non-deployed. No mainnet, sale, stated monetary value, or active hospitality benefit is approved."
  },
  {
    path: "audit/index.html",
    title: "Audit Status",
    description: "Internal review status, canonical V1 versus candidate V2 scope, compiler settings, known issues, and verification artifacts for TikiDeco.",
    eyebrow: "Internal review",
    heading: "Audit status and review scope",
    intro: "TikiDeco is not independently audited. This page separates the historical Sepolia V1 deployment from the non-canonical V2 candidate review target.",
    sections: [
      ["Status", [
        ["Internal review", manifest.auditStatus.internalReview],
        ["Independent audit", manifest.auditStatus.independentAudit],
        ["Current evidence date", siteLastUpdated],
        ["v0.1.0-sepolia release status", `Public pre-release at ${v01ReleaseCommit}`],
        ["v0.2.0-utility-pilot release status", `Public pre-release at ${v02ReleaseCommit}; pilot campaign remains draft-not-live`],
        ["v0.2 evidence commit", currentEvidenceCommit],
        ["v0.2 evidence report", releaseEvidence.transparencyReport],
        ["Release manifest hash", releaseEvidence.releaseManifestSha256],
        ["V2 freeze baseline", v2FreezeBaseline],
        ["Current evidence/source commit", currentEvidenceCommit],
        ["Canonical V1 source commit", headCommit],
        ["V2 candidate status", "Non-canonical candidate code; independent audit not started; not promoted by deployments/canonical.json"],
        ["Last updated", siteLastUpdated]
      ]],
      ["Canonical V1 Versus Candidate V2", [
        ["Canonical V1", `${manifest.contracts.token.name} and ${manifest.contracts.vestingVault.name} on Ethereum Sepolia`],
        ["Candidate V2", "TikiDecoTokenV2.sol and TikiDecoVestingVaultV2.sol are non-canonical audit-target candidates"],
        ["Promotion status", "No V2 promotion is recorded in deployments/canonical.json"]
      ]],
      ["In-Scope Contracts", [
        ["V1 token", manifest.contracts.token.source],
        ["V1 vesting vault", manifest.contracts.vestingVault.source],
        ["V2 candidate token", "contracts/TikiDecoTokenV2.sol"],
        ["V2 candidate vesting vault", "contracts/TikiDecoVestingVaultV2.sol"]
      ]],
      ["Compiler And Analysis", [
        ["Compiler", `${manifest.compiler.version}, ${manifest.compiler.evmTarget}, optimizer runs ${manifest.compiler.optimizer.runs}`],
        ["Test status", "Hardhat suite and Foundry secondary invariant suite are CI gates"],
        ["Coverage status", "Hardhat coverage is the primary gate; Foundry V2 line, function, and branch thresholds are configured for the secondary invariant suite"],
        ["Static analysis", "Slither V1 informational scan and blocking V2 baseline comparison are configured"]
      ]],
      ["Known Issues And Governance", [
        ["Known issues", "See KNOWN_ISSUES.md and security/slither-baseline-v2.json"],
        ["Owner Safe", manifest.ownership.ownerSafe],
        ["Safe threshold", manifest.ownership.safeThreshold],
        ["Treasury", manifest.treasury.address]
      ]]
    ],
    links: [
      ["ABI artifacts", "/artifacts/v1/TikiDecoToken/abi.json"],
      ["Token bytecode", "/artifacts/v1/TikiDecoToken/deployed-bytecode.txt"],
      ["Vault bytecode", "/artifacts/v1/TikiDecoVestingVault/deployed-bytecode.txt"],
      ["Deployment manifest", "/deployment-manifest.json"],
      ["Final evidence report", evidenceReportUrl],
      ["Reports", "/#reports"],
      ["Known issues", "https://github.com/denterion/Token-TIkiDeco/blob/main/KNOWN_ISSUES.md"]
    ],
    disclaimer: "Audit-status disclaimer: this is an internal review page only. TikiDeco has not completed an independent smart-contract audit."
  },
  {
    path: "verify/index.html",
    title: "Verify",
    description: "Reproducible commands for verifying TikiDeco Sepolia network, contracts, bytecode, supply, roles, treasury, Safe threshold, and report hashes.",
    eyebrow: "Reproducible verification",
    heading: "Verify the prototype without connecting a wallet",
    intro: "These commands use public repository files and read-only RPC/Etherscan checks. They do not sign transactions.",
    sections: [
      ["Network And Addresses", [
        ["Network", `${manifest.network}, chain ID ${manifest.chainId}`],
        ["Token", manifest.contracts.token.address],
        ["Vesting vault", manifest.contracts.vestingVault.address],
        ["Treasury", manifest.treasury.address],
        ["Owner Safe", manifest.ownership.ownerSafe]
      ]],
      ["Commands", [
        ["Manifest", "npm run manifest:check && npm run manifest:source"],
        ["Bytecode", "npm run compile && npm run bytecode:size"],
        ["Tests", "npm test"],
        ["Foundry", "npm run foundry:test"],
        ["Slither", "npm run slither:baseline after generating Slither JSON"]
      ]],
      ["What To Verify", [
        ["Deployed bytecode", "Compare Etherscan deployed bytecode with site/artifacts/v1/*/deployed-bytecode.txt"],
        ["Total supply", "Read totalSupply() and compare with MAX_SUPPLY"],
        ["Owner or roles", "V1 owner should match the Safe; V2 candidate roles are documented but non-canonical"],
        ["Safe threshold", "Read getThreshold() from the Safe address"],
        ["Report hashes", "Compare documentHash values in deployment-manifest.json and report markdown hash files"]
      ]]
    ],
    links: [
      ["Token verified source", manifest.contracts.token.verification],
      ["Vault verified source", manifest.contracts.vestingVault.verification],
      ["Manifest", "/deployment-manifest.json"],
      ["Security CI", "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY_CI.md"]
    ],
    disclaimer: "Verification disclaimer: this page provides read-only checks and does not certify economic value, sale availability, or independent audit completion."
  },
  {
    path: "status/index.html",
    title: "Project Status",
    description: "Current project status for TikiDeco Sepolia prototype, including network, contract version, audit status, and limitations.",
    eyebrow: "Status",
    heading: "Current status is testnet prototype",
    intro: "This page summarizes what is current, what is planned, and what remains conceptual.",
    sections: [
      ["Current", [
        ["Current evidence date", siteLastUpdated],
        ["Current evidence commit", currentEvidenceCommit],
        ["Evidence report", releaseEvidence.transparencyReport],
        ...(monthlyReport ? [["Latest monthly report", `${monthlyReport.month}; source-linked snapshot`, monthlyReportUrl]] : []),
        ["Network", "Ethereum Sepolia"],
        ["Canonical version", manifest.contractVersion],
        ["v0.1.0-sepolia", "Public pre-release; historical Sepolia V1 canonical deployment"],
        ["v0.2.0-utility-pilot", "Public pre-release; utility pilot campaign is draft-not-live"],
        ["V2 candidate", "Candidate code only; not canonical and not deployed by the canonical manifest"],
        ["Utility pilot", "Planned / not live; read-only Sepolia balance check prepared for v0.2"],
        ["Mainnet", "Not approved"],
        ["Sale", "No token sale"],
        ["Monetary value", "No stated monetary value"],
        ["Audit", "Independent audit not started"],
        ["Business utility", "Design stage"],
        ["Active guest benefits", "Not live"]
      ]],
      ["Planned", [
        ["V2", "Candidate review and testing before any promotion"],
        ["Security", "Further Slither triage, Foundry invariants, and independent review planning"],
        ["Utility pilot", "Conditional Sepolia-only pilot documentation and read-only balance eligibility design"]
      ]],
      ["Conceptual", [
        ["Hospitality concept", "Not a completed property"],
        ["Benefits", "No active guest benefits are represented by this prototype"],
        ["Mainnet", "No mainnet deployment is approved"]
      ]]
    ],
    links: [["Risk disclosure", "/legal/risk-disclosure/"], ["Project status legal note", "/legal/project-status/"], ...(monthlyReport ? [["Latest monthly report", monthlyReportUrl]] : [])],
    disclaimer: "Audit-status disclaimer: status information is project-maintained and not an independent audit report."
  },
  {
    path: "proof/index.html",
    title: "Pilot Proof Pack",
    description: "A verification-first proof pack for the planned TikiDeco Sepolia utility pilot, including status, blockers, commands, and dry-run evidence.",
    eyebrow: "Pilot proof pack",
    heading: "Proof before promotion",
    intro: "This page gives reviewers one short path to check the planned Sepolia-only pilot without treating it as live.",
    sections: [
      ["Current Proof", [
        ["Network", "Ethereum Sepolia"],
        ["Canonical version", manifest.contractVersion],
        ["Campaign status", "draft-not-live"],
        ["Read-only balance check", "Implemented for v0.2 pre-release review"],
        ["Release evidence commit", currentEvidenceCommit],
        ["Release evidence report", releaseEvidence.transparencyReport],
        ["Dry-run report", "Aggregate-only; fake/test addresses; no Safe broadcast"],
        ["V2 status", "Candidate only; not canonical"],
        ["Independent audit", "Not started"]
      ]],
      ["What Works Now", [
        ["Manifest", "Canonical Sepolia V1 deployment facts are recorded in deployments/canonical.json."],
        ["Website", "Public pages are read-only and do not require wallet connection for browsing."],
        ["Eligibility checker", "The v0.2 flow can read Sepolia TIDE balance without transaction signing."],
        ["Gate register", "Live-pilot blockers are mapped to owner roles, evidence files, and tracking issues."],
        ["Dry-run evidence", "Allocation dry run exists as Safe Transaction Builder JSON draft plus aggregate report."]
      ]],
      ["What Is Blocked", [
        ["Request window", "Not published."],
        ["Snapshot or live-check mode", "Not published or approved."],
        ["Inventory", "Not published."],
        ["Approvals", "Legal, privacy, security, operations, and governance gates are not approved."],
        ["Live utility", "No active guest benefit is live."],
        ["Mainnet", "Not approved."]
      ]],
      ["Verification Commands", [
        ["Claims", "npm run claims"],
        ["Value boundary", "npm run value"],
        ["Site", "npm run site"],
        ["Pilot", "npm run pilot"],
        ["Blocked live gate", "npm run pilot:live:blocked"],
        ["Mainnet blocked gate", "node scripts/check-mainnet-readiness.cjs --expect-blocked"]
      ]],
      ["Release Evidence", [
        ["Proof command", releaseEvidence.proofCommand],
        ["Source archive hash", releaseEvidence.sourceArchiveSha256],
        ["Release manifest hash", releaseEvidence.releaseManifestSha256],
        ["Checksums file hash", releaseEvidence.checksumsSha256],
        ["Transparency report hash", releaseEvidence.transparencyReportSha256]
      ]],
      ["Dry-Run Evidence", [
        ["Total input rows", "3"],
        ["Valid test wallets", "3"],
        ["Duplicate wallets rejected", "0"],
        ["Invalid rows rejected", "0"],
        ["Draft testnet allocation", "150 TIDE"],
        ["Safe draft hash", "38bd27fdd7ed42bd95aec498034eb52ee996308748d8ee4f317be5f1ecc2f61d"],
        ["Report hash", "e86e00ce3ff03de0ab73b7e2b1889c3e9cc4e792f7d2bb4fa9b9158c07b181ae"]
      ]]
    ],
    links: [
      ["Pilot Proof Pack", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PILOT_PROOF_PACK.md"],
      ["Final evidence report", evidenceReportUrl],
      ["v0.2 RC draft", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/releases/v0.2.0-utility-pilot-rc.1.md"],
      ["Dry-run report", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_07_09_PILOT_PROOF_DRY_RUN.md"],
      ["Live blocker register", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md"],
      ["Project facts", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md"],
      ["GitHub feedback", "https://github.com/denterion/Token-TIkiDeco/issues"]
    ],
    disclaimer: "No-offer disclaimer: TIDE is a Sepolia testnet prototype, not offered for sale, has no stated monetary value, is not deployed on mainnet, and independent audit not started."
  },
  {
    path: "utility/index.html",
    title: "TIDE Utility",
    description: "A read-only explanation of what TIDE can test on Sepolia, what remains planned, and what TIDE does not provide.",
    eyebrow: "Utility boundary",
    heading: "What TIDE can test, and what it does not provide",
    intro: "TIDE is used here as a Sepolia-only prototype for transparent hospitality-linked eligibility and reporting research.",
    sections: [
      ["What TIDE Can Be Used To Test", [
        ["Eligibility signal", "A testnet balance can be evaluated at a published snapshot block for a limited pilot campaign."],
        ["Read-only balance check", "The v0.2 flow can read `balanceOf(wallet)` from the canonical Sepolia token through allowlisted RPC endpoints."],
        ["Read-only verification", "Public users can verify contract addresses, report hashes, Safe control, and status pages without connecting a wallet."],
        ["Operating workflow", "The project can test how public rules, manual review, and reports fit future hospitality operations."]
      ]],
      ["Guest Loyalty Signal", [
        ["Purpose", "TIDE can be explored as a signal for future loyalty eligibility review, not as a payment asset."],
        ["Current status", "Design stage only; no active guest benefit is live."],
        ["Review", "Any real guest utility requires legal, privacy, security, and operations approval."]
      ]],
      ["Early Reservation Windows", [
        ["Concept", "A future limited pilot may test an earlier RSVP window for selected community previews."],
        ["Limits", "No guaranteed benefit; inventory, blackout dates, manual review, and cancellation rules apply."],
        ["Status", "Planned pilot concept, not a live reservation system."]
      ]],
      ["Event RSVP Priority", [
        ["Concept", "A pilot may test priority review for selected community preview events."],
        ["Limits", "Priority review is not paid access, not cash value, and not confirmation of entry."],
        ["Status", "Planned pilot concept only."]
      ]],
      ["Transparent Project Reports", [
        ["Current", "The project publishes repository reports and links report hashes from the canonical manifest."],
        ["Pilot", "Future pilot reports should summarize rules, inventory, request counts, disputes, and corrections without exposing private data."],
        ["Verification", "Report links and hashes should remain publicly reviewable."]
      ]],
      ["Community Rewards", [
        ["Concept", "Future non-cash community recognition may be explored where legally allowed."],
        ["Limits", "No resale value, no cash redemption, no revenue rights, and no guaranteed benefit."],
        ["Status", "Planned only; not active."]
      ]],
      ["What TIDE Does Not Provide", [
        ["No sale", "TIDE is not offered for sale."],
        ["No value", "TIDE has no stated monetary value."],
        ["No mainnet", "TIDE is not deployed on mainnet."],
        ["No independent audit", "Independent audit not started."],
        ["No property rights", "TIDE does not provide hotel ownership."],
        ["No revenue rights", "TIDE does not provide revenue rights."],
        ["No benefit promise", "TIDE does not provide guaranteed benefits."]
      ]]
    ],
    links: [
      ["Utility pilot docs", "https://github.com/denterion/Token-TIkiDeco/tree/main/docs/utility-pilot"],
      ["Value and utility boundary", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/VALUE_AND_UTILITY_BOUNDARY.md"],
      ["Claims matrix", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/CLAIMS_MATRIX.md"],
      ["Risk disclosure", "/legal/risk-disclosure/"]
    ],
    disclaimer: "No-offer disclaimer: TIDE is a Sepolia testnet prototype, not offered for sale, has no stated monetary value, is not deployed on mainnet, and independent audit not started."
  },
  {
    path: "pilot/index.html",
    interactive: true,
    title: "TIDE Loyalty Pilot",
    description: "Planned TIDE Loyalty Pilot page covering eligibility, snapshots, non-cash perk examples, wallet verification, privacy, and reports.",
    eyebrow: "Planned pilot",
    heading: "TIDE Loyalty Pilot",
    intro: "The pilot is a planned Sepolia-only eligibility and reporting test. It is not live and does not create active hospitality benefits.",
    sections: [
      ["Pilot Status", [
        ["Status", "Planned / not live"],
        ["Network", `Ethereum Sepolia, chain ID ${manifest.chainId}`],
        ["Canonical version", manifest.contractVersion],
        ["Audit", "Independent audit not started"]
      ]],
      ["How Eligibility Works", [
        ["Wallet control", "A participant may optionally prepare an off-chain message proof for manual review."],
        ["Balance check", "Eligibility can reference a read-only Sepolia TIDE balance from the canonical token contract."],
        ["Manual review", "Staff review and override remain part of the planned process."]
      ]],
      ["Snapshot Block Concept", [
        ["Purpose", "A snapshot block fixes the point in time used for eligibility review."],
        ["Publication", "Campaign rules should publish the token address, threshold, snapshot block, and review window before review starts."],
        ["Fallback", "RPC failure should pause review or use documented fallback verification."]
      ]],
      ["Non-Cash Perk Examples", [
        ["Early RSVP", "A limited early RSVP window may be tested for selected community previews."],
        ["Priority review", "Selected event RSVP requests may receive priority review."],
        ["Welcome eligibility", "Small non-cash welcome eligibility may be reviewed where legally allowed."]
      ]],
      ["Wallet Verification Concept", [
        ["Message signing", "Optional verification uses a nonce-based message signature only."],
        ["No transaction signing", "The pilot must not ask users to sign transactions, approve tokens, transfer tokens, or pay fees."],
        ["No private keys", "The project must never request seed phrases, private keys, or recovery phrases."]
      ]],
      ["Privacy Note", [
        ["Data minimization", "Collect only the minimum data needed for a pilot review."],
        ["Public reports", "Use aggregate counts and report hashes rather than private participant details."],
        ["Review gate", "Collecting emails, names, guest records, or wallet-to-person mappings requires privacy and counsel review first."]
      ]],
      ["Pilot Reports", [
        ["Before campaign", "Publish campaign rules, inventory, snapshot block, and dispute window."],
        ["After campaign", "Publish privacy-safe outcomes, cancellation notes, and correction records if needed."],
        ["Current status", "Pilot reports are planned; no live pilot report exists yet."],
        ["Allocation policy", "A Sepolia-only allocation policy and report template are prepared for future campaign review."]
      ]]
    ],
    links: [
      ["Pilot README", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/README.md"],
      ["Eligibility rules", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/ELIGIBILITY_RULES.md"],
      ["Wallet verification", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/WALLET_VERIFICATION.md"],
      ["Public preview specification", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/PUBLIC_PREVIEW_PRODUCT_SPEC.md"],
      ["Privacy threat model", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/PUBLIC_PREVIEW_PRIVACY_THREAT_MODEL.md"],
      ["Preview proof report", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_07_10_PUBLIC_PREVIEW_PROOF.md"],
      ["No offer notice", "/legal/no-offer/"]
    ],
    disclaimer: "No-offer disclaimer: TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and independent audit not started. No hotel ownership, no revenue rights, and no guaranteed benefits."
  },
  {
    path: "business/index.html",
    title: "Business Utility",
    description: "Business utility page explaining hospitality operations plus transparency infrastructure without token sale, value, or mainnet claims.",
    eyebrow: "Business utility",
    heading: "Hospitality operations plus transparency infrastructure",
    intro: "TikiDeco explores how public records and off-chain operations could support clearer future loyalty workflows.",
    sections: [
      ["Why Hospitality Needs Transparent Loyalty", [
        ["Eligibility clarity", "Published rules and snapshot blocks can reduce confusion around limited pilot eligibility."],
        ["Operational trust", "Reports and hashes can help show when rules, outcomes, or corrections were published."],
        ["Guest experience", "Clear status pages can separate current, planned, and conceptual features."]
      ]],
      ["On-Chain Reports And Off-Chain Operations", [
        ["On-chain", "Sepolia contracts and report hashes provide public reference points."],
        ["Off-chain", "Staff review, inventory limits, blackout dates, privacy handling, and disputes remain operational processes."],
        ["Boundary", "A blockchain record does not replace legal review, privacy review, operations, or safety decisions."]
      ]],
      ["Before Real Guest Utility", [
        ["Legal", "Counsel review and terms are required before any real guest utility claim."],
        ["Security", "Independent audit not started; V2 remains non-canonical candidate code."],
        ["Operations", "Inventory rules, cancellation process, staff training, privacy handling, and dispute process must be ready."]
      ]],
      ["Legal / Audit / Operations Gates", [
        ["Legal gate", "No sale, no stated monetary value, no mainnet, no hotel ownership, and no revenue rights."],
        ["Audit gate", "V2 freeze baseline exists, but external audit not started and V2 is not canonical."],
        ["Operations gate", "Pilot reports, manual review, staff override, and privacy controls must be documented before launch."]
      ]]
    ],
    links: [
      ["Business model", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/BUSINESS_MODEL.md"],
      ["Counsel intake package", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/COUNSEL_INTAKE_PACKAGE.md"],
      ["Project facts", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md"],
      ["Status", "/status/"]
    ],
    disclaimer: "No-offer disclaimer: business utility is design-stage only. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and independent audit not started."
  },
  {
    path: "roadmap/index.html",
    title: "Evidence Roadmap",
    description: "Evidence-linked TikiDeco roadmap separating internal engineering progress from external validation and production decisions.",
    eyebrow: "Evidence-linked roadmap",
    heading: "Progress means evidence, not activity.",
    intro: "Internal engineering, external review, legal, operator, user, and production evidence are tracked separately.",
    sections: [
      ["Quarter Status", ["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
        const items = roadmap.items.filter((item) => item.quarter === quarter && item.status !== "superseded");
        const verified = items.filter((item) => ["internally-complete", "externally-verified"].includes(item.status)).length;
        return [quarter, `${verified}/${items.length} evidence-linked items verified`];
      })],
      ["Internal And External Boundaries", [
        ["Internal engineering", "Repository checks can establish implementation evidence only."],
        ["External reviewer", "No reviewer engagement or independent validation is recorded."],
        ["Legal and operator", "No external counsel approval or verified hospitality operator is recorded."],
        ["User and production", "The limited preview remains blocked and production approval remains no-go."]
      ]],
      ["Current Actions", roadmap.items
        .filter((item) => !["internally-complete", "externally-verified", "superseded"].includes(item.status))
        .slice(0, 6)
        .map((item) => [item.id, `${item.status}: ${item.nextAction}`])]
    ],
    links: [
      ["Generated public roadmap", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/ROADMAP_CURRENT.md"],
      ["Machine-readable roadmap", "https://github.com/denterion/Token-TIkiDeco/blob/main/config/roadmap/roadmap.json"],
      ["Maintainer actions", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/MAINTAINER_ACTIONS.md"],
      ["Monthly progress delta", "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/ROADMAP_DELTA_2026_07.md"]
    ],
    disclaimer: "Roadmap status is evidence-based planning, not a deployment authorization, external approval, partnership statement, or operational promise."
  },
  {
    path: "operator-sandbox/index.html",
    interactive: true,
    title: "Operator Sandbox",
    description: "A local fake-data hospitality loyalty workflow demonstration with controlled mock inventory and aggregate reporting.",
    eyebrow: "Local demonstration",
    heading: "Operator Sandbox",
    intro: "Create, review, operate, and close a fake Sepolia-only loyalty campaign without real guest data or transaction broadcasting.",
    sections: [],
    links: [],
    disclaimer: "Fake data only. No active hospitality service, no real benefit, no payments, no mainnet, and no transaction broadcasting."
  },
  {
    path: "operator-sandbox/why/index.html",
    interactive: true,
    title: "Why Operators Test This",
    description: "A plain-language explanation of controlled loyalty campaign rules, inventory, staff decisions, and privacy-safe reporting.",
    eyebrow: "Hospitality operations",
    heading: "Why Operators Test This",
    intro: "A conceptual workflow for repeatable loyalty operations without exposing guest data on-chain.",
    sections: [],
    links: [],
    disclaimer: "No real operator, property, partnership, active hospitality service, or real benefit is represented."
  },
  {
    path: "legal/no-offer/index.html",
    title: "No Offer",
    description: "No-offer notice for TikiDeco TIDE Sepolia prototype.",
    eyebrow: "Legal notice",
    heading: "No offer, no sale, no monetary value",
    intro: "TIDE is a Sepolia testnet prototype, is not deployed on mainnet, and is not offered for sale.",
    sections: [
      ["Notice", [
        ["No sale", "The project does not provide sale or transaction-signing flows."],
        ["No value statement", "TIDE has no stated monetary value."],
        ["Mainnet status", "TIDE is not deployed on mainnet."],
        ["Audit status", "TikiDeco has not completed an independent audit and is not independently audited."],
        ["No financial rights", "The prototype does not represent hotel ownership, revenue rights, or financial upside."]
      ]]
    ],
    links: [["Risk disclosure", "/legal/risk-disclosure/"]],
    disclaimer: "This notice is project communication, not legal advice."
  },
  {
    path: "legal/terms/index.html",
    title: "Terms",
    description: "Static website terms for the TikiDeco Sepolia prototype.",
    eyebrow: "Legal",
    heading: "Website terms",
    intro: "This static website provides project documentation and read-only public data.",
    sections: [
      ["Terms", [
        ["Read-only site", "The site does not connect wallets, sign transactions, provide sale flows, or execute contract calls."],
        ["Information", "Content may change as the prototype evolves."],
        ["No warranty", "Materials are provided for review and research without operational guarantees."]
      ]]
    ],
    links: [["Privacy", "/legal/privacy/"], ["No offer", "/legal/no-offer/"]],
    disclaimer: "These terms are a project-maintained draft and should be reviewed by counsel before public launch."
  },
  {
    path: "legal/privacy/index.html",
    title: "Privacy",
    description: "Privacy notice for the TikiDeco static website.",
    eyebrow: "Legal",
    heading: "Privacy notice",
    intro: "The static site is designed to avoid wallet collection and transaction flows.",
    sections: [
      ["Data", [
        ["Wallets", "The site does not request wallet connection."],
        ["RPC", "The dashboard performs read-only RPC calls to allowlisted public Sepolia endpoints."],
        ["Local cache", "The browser may store the last successful dashboard read timestamp and values for fallback display."]
      ]]
    ],
    links: [["Terms", "/legal/terms/"]],
    disclaimer: "This privacy notice is limited to the static site and should be reviewed before broader product use."
  },
  {
    path: "legal/risk-disclosure/index.html",
    title: "Risk Disclosure",
    description: "Risk disclosure for the TikiDeco Sepolia prototype.",
    eyebrow: "Legal",
    heading: "Prototype risk disclosure",
    intro: "TikiDeco is experimental, testnet-only, and not independently audited.",
    sections: [
      ["Risks", [
        ["Testnet", "Sepolia contracts and testnet tokens are experimental artifacts."],
        ["Security", "Internal review and automated checks do not replace an independent audit."],
        ["Operations", "Future hospitality concepts, if any, require separate legal, operational, and technical review."],
        ["Clickjacking", "A meta CSP tag is not a substitute for an HTTP Content-Security-Policy frame-ancestors header. A compatible hosting layer should provide HTTP CSP headers."]
      ]]
    ],
    links: [["Audit status", "/audit/"], ["Security policy", "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY.md"]],
    disclaimer: "Risk disclosure is informational and not a regulatory compliance statement."
  },
  {
    path: "legal/project-status/index.html",
    title: "Project Status Notice",
    description: "Project status notice distinguishing current, planned and conceptual TikiDeco work.",
    eyebrow: "Legal",
    heading: "Project status boundaries",
    intro: "This page separates current implementation from planned or conceptual work.",
    sections: [
      ["Current", [
        ["Current contracts", "Canonical Sepolia V1 legacy contracts listed in deployment-manifest.json."],
        ["Current reports", "Report hashes and links are public records."],
        ["Current governance", "Sepolia owner control is documented through Safe ownership."]
      ]],
      ["Not Current", [
        ["V2", "Candidate code only until separately reviewed and promoted."],
        ["Property", "Concept imagery is not a completed property."],
        ["Benefits", "No active hospitality benefits are represented by the current token."]
      ]]
    ],
    links: [["Status", "/status/"], ["Verify", "/verify/"]],
    disclaimer: "Audit-status disclaimer: project status is not an independent audit conclusion."
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function nav() {
  return `
      <nav id="site-nav" class="nav" aria-label="Sections">
        <a href="/trust/">Trust</a>
        <a href="/status/">Status</a>
        <a href="/pilot/">Pilot</a>
        <a href="/audit/">Audit</a>
        <a href="/community-review/">Review</a>
        <a href="https://github.com/denterion/Token-TIkiDeco/issues" target="_blank" rel="noopener noreferrer">Feedback</a>
      </nav>`;
}

function legalFooter() {
  return `
    <footer class="footer legal-footer" data-legal-footer>
      <picture>
        <source srcset="/assets/favicon.webp" type="image/webp">
        <img class="footer-mark" src="/assets/favicon.png" width="512" height="512" alt="TikiDeco TIDE emblem">
      </picture>
      <div>
        <p>TikiDeco / TIDE is a public Sepolia prototype. TIDE is not offered for sale, has no stated monetary value, is not deployed on mainnet, and independent audit has not started.</p>
        <p class="footer-links">
          <a href="/utility/">Utility</a>
          <a href="/trust/">Trust Center</a>
          <a href="/community-review/">Community Review</a>
          <a href="/proof/">Proof Pack</a>
          <a href="${evidenceReportUrl}" target="_blank" rel="noopener noreferrer">Evidence Report</a>
          <a href="/pilot/">Pilot</a>
          <a href="/operator-sandbox/">Operator demo</a>
          <a href="/business/">Business</a>
          <a href="https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md" target="_blank" rel="noopener noreferrer">Project Facts</a>
          <a href="https://github.com/denterion/Token-TIkiDeco/blob/main/docs/RELEASE_CONTROL_CENTER.md" target="_blank" rel="noopener noreferrer">Release Control</a>
          <a href="/roadmap/">Roadmap</a>
          <a href="https://github.com/denterion/Token-TIkiDeco/issues" target="_blank" rel="noopener noreferrer">Feedback</a>
          <a href="/legal/no-offer/">No offer</a>
          <a href="/legal/terms/">Terms</a>
          <a href="/legal/privacy/">Privacy</a>
          <a href="/legal/risk-disclosure/">Risk disclosure</a>
          <a href="/legal/project-status/">Project status</a>
        </p>
      </div>
    </footer>`;
}

function linkAttrs(href) {
  if (href.startsWith("http://") || href.startsWith("https://")) return ' target="_blank" rel="noopener noreferrer"';
  return "";
}

function renderPage(page) {
  const url = `${baseUrl}/${page.path.replace(/index\.html$/, "")}`;
  const sections = page.sections.map(([title, rows]) => `
        <section class="content-card" aria-labelledby="${title.toLowerCase().replaceAll(" ", "-")}">
          <h2 id="${title.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(title)}</h2>
          <dl class="record-list">
            ${rows.map(([label, value, source]) => `<div${source ? ' data-source-linked-fact' : ''}><dt>${escapeHtml(label)}</dt><dd>${source ? `<a href="${escapeHtml(source)}"${linkAttrs(source)}>${escapeHtml(value)}</a>` : escapeHtml(value)}</dd></div>`).join("\n            ")}
          </dl>
        </section>`).join("\n");
  const links = page.links.map(([label, href]) => `<a href="${escapeHtml(href)}"${linkAttrs(href)}>${escapeHtml(label)}</a>`).join("\n          ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' https://ethereum-sepolia-rpc.publicnode.com https://rpc.sepolia.org; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="theme-color" content="#0b1020">
    <meta property="og:type" content="website">
    <meta property="og:title" content="TikiDeco | ${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:image" content="${baseUrl}/assets/tide-logo.png">
    <meta property="og:url" content="${url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="TikiDeco | ${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${baseUrl}/assets/tide-logo.png">
    <link rel="canonical" href="${url}">
    <link rel="icon" href="/assets/favicon.png" type="image/png">
    <link rel="stylesheet" href="/styles.css">
    <script defer src="/app.js"></script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "TikiDeco ${escapeHtml(page.title)}",
        "url": "${url}",
        "isPartOf": {
          "@type": "WebSite",
          "name": "TikiDeco",
          "url": "${baseUrl}/"
        }
      }
    </script>
    <title>TikiDeco | ${escapeHtml(page.title)}</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <a class="status-badge" href="/legal/no-offer/" aria-label="Sepolia testnet status and no-offer notice">SEPOLIA TESTNET &middot; NO MONETARY VALUE</a>
    <header class="topbar" aria-label="Primary">
      <a class="brand" href="/" aria-label="TikiDeco home">
        <picture>
          <source srcset="/assets/favicon.webp" type="image/webp">
          <img class="brand-mark" src="/assets/favicon.png" width="34" height="34" alt="" aria-hidden="true">
        </picture>
        <span>TikiDeco</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="menu-toggle-lines" aria-hidden="true"></span>
        <span class="menu-toggle-label">Menu</span>
      </button>
${nav()}
    </header>
    <main id="main" class="page-main">
      <section class="page-hero" aria-labelledby="page-title">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1 id="page-title">${escapeHtml(page.heading)}</h1>
        <p class="hero-copy">${escapeHtml(page.intro)}</p>
        <p class="audit-disclaimer">${escapeHtml(page.disclaimer)}</p>
      </section>
      <div class="content-grid">
${sections}
        <section class="content-card" aria-labelledby="page-links">
          <h2 id="page-links">Reference links</h2>
          <div class="reference-links">
          ${links}
          </div>
        </section>
      </div>
    </main>
${legalFooter()}
  </body>
</html>
`;
}

function renderInteractivePage(page, homeShell) {
  const route = page.path.replace(/index\.html$/, "");
  const url = `${baseUrl}/${route}`;
  const pilotFallback = `<main id="main" class="pilot-static-fallback">
      <section aria-labelledby="pilot-title">
        <p>SEPOLIA TESTNET - NO MONETARY VALUE</p>
        <h1 id="pilot-title">TIDE Loyalty Pilot</h1>
        <p>The public preview provides a read-only Sepolia balance check, a blocked campaign lifecycle, and public feedback paths. The campaign is draft-not-live.</p>
        <p>No sale, no mainnet deployment, no active hotel benefit, V2 remains candidate code only, and independent audit not started.</p>
        <p>
          <a href="https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/PUBLIC_PREVIEW_PRODUCT_SPEC.md" target="_blank" rel="noopener noreferrer">Product specification</a>
          <a href="https://github.com/denterion/Token-TIkiDeco/blob/main/docs/utility-pilot/PUBLIC_PREVIEW_PRIVACY_THREAT_MODEL.md" target="_blank" rel="noopener noreferrer">Privacy threat model</a>
          <a href="https://github.com/denterion/Token-TIkiDeco/issues/new?template=utility_pilot_feedback.yml" target="_blank" rel="noopener noreferrer">Public feedback</a>
        </p>
      </section>
    </main>`;
  const operatorFallback = `<main id="main" class="pilot-static-fallback">
      <section aria-labelledby="operator-title">
        <p>SEPOLIA TESTNET - NO MONETARY VALUE</p>
        <p>LOCAL DEMONSTRATION - FAKE DATA</p>
        <h1 id="operator-title">Operator Sandbox</h1>
        <p>A fake-data-only workflow for campaign rules, limited mock inventory, staff review, campaign closure, and aggregate reporting.</p>
        <p>No active hospitality service, no real benefit, no real guest or booking data, no payments, no mainnet, and no transaction broadcasting.</p>
        <p><a href="/operator-sandbox/why/">Why would a hospitality operator test this?</a></p>
      </section>
    </main>`;
  const whyFallback = `<main id="main" class="pilot-static-fallback">
      <section aria-labelledby="operator-why-title">
        <p>SEPOLIA TESTNET - NO MONETARY VALUE</p>
        <p>CONCEPT WORKFLOW - FAKE DATA</p>
        <h1 id="operator-why-title">Why would a hospitality operator test this?</h1>
        <p>To review transparent campaign rules, control mock inventory, repeat staff decisions, and generate aggregate reports without exposing guest data on-chain.</p>
        <p>No real operator, property, active hospitality service, or real benefit is represented.</p>
        <p><a href="/operator-sandbox/">Open the local demonstration</a></p>
      </section>
    </main>`;
  const fallback = page.path === "operator-sandbox/index.html"
    ? operatorFallback
    : page.path === "operator-sandbox/why/index.html"
      ? whyFallback
      : pilotFallback;

  return homeShell
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<title>[^<]*<\/title>/, `<title>TikiDeco | ${escapeHtml(page.title)}</title>`)
    .replace(/<main id="main">[\s\S]*?<\/main>/, fallback)
    .replace('"url": "https://tikideco.xyz/"', `"url": "${url}"`);
}

const homeShell = fs.readFileSync(path.join(siteDir, "index.html"), "utf8");
for (const page of pages) {
  const target = path.join(siteDir, page.path);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const html = page.interactive ? renderInteractivePage(page, homeShell) : renderPage(page);
  fs.writeFileSync(target, html.replace(/\r\n?/g, "\n"), "utf8");
}

console.log(`Wrote ${pages.length} static pages.`);

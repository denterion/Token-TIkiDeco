const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..", "..");
const registryPath = "config/community-review/findings.json";
const candidatePath = "config/audit/v2-review-candidate.json";
const statusPath = "config/community-review/status.json";
const severities = ["Critical", "High", "Medium", "Low", "Informational", "Unassigned"];
const statuses = ["submitted", "acknowledged", "validated", "rejected", "duplicate", "invalid", "accepted-risk", "remediation-planned", "fix-in-review", "retest", "resolved"];
const retestStatuses = ["not-requested", "pending", "passed", "failed", "not-applicable"];
const disclosureStatuses = ["private", "coordinated", "public", "not-applicable"];
const closedStatuses = new Set(["rejected", "duplicate", "invalid", "accepted-risk", "resolved"]);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function git(args, options = {}) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", ...options }).trim();
}

function tryGit(args) {
  try { return git(args); } catch { return null; }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadState() {
  return {
    registry: readJson(registryPath),
    candidate: readJson(candidatePath),
    status: readJson(statusPath)
  };
}

function summarize(registry) {
  const openBySeverity = Object.fromEntries(severities.map((severity) => [severity, 0]));
  for (const finding of registry.findings) {
    if (!closedStatuses.has(finding.status)) openBySeverity[finding.severity] += 1;
  }
  return {
    totalSubmitted: registry.findings.length,
    validated: registry.findings.filter((finding) => ["validated", "remediation-planned", "fix-in-review", "retest", "resolved", "accepted-risk"].includes(finding.status)).length,
    rejected: registry.findings.filter((finding) => ["rejected", "invalid", "duplicate"].includes(finding.status)).length,
    openBySeverity,
    remediated: registry.findings.filter((finding) => ["retest", "resolved"].includes(finding.status)).length,
    retested: registry.findings.filter((finding) => finding.retestStatus === "passed").length,
    nextCandidateRequired: registry.findings.some((finding) => finding.candidateCommit === registry.candidateCommit && finding.codeChanged && ["fix-in-review", "retest", "resolved"].includes(finding.status))
  };
}

function validateFinding(finding, candidateCommit) {
  const allowedCandidateCommits = candidateCommit instanceof Set ? candidateCommit : new Set([candidateCommit]);
  assert(/^CR-[0-9]{4}$/.test(finding.findingId || ""), `Invalid finding ID: ${finding.findingId || "missing"}`);
  assert(allowedCandidateCommits.has(finding.candidateCommit), `${finding.findingId} does not reference an exact registered candidate commit`);
  assert(String(finding.reviewer || "").trim(), `${finding.findingId} lacks reviewer attribution`);
  assert(String(finding.title || "").trim(), `${finding.findingId} lacks a title`);
  assert(severities.includes(finding.severity), `${finding.findingId} has invalid severity`);
  assert(statuses.includes(finding.status), `${finding.findingId} has invalid status`);
  assert(retestStatuses.includes(finding.retestStatus), `${finding.findingId} has invalid retest status`);
  assert(disclosureStatuses.includes(finding.disclosureStatus), `${finding.findingId} has invalid disclosure status`);
  assert(finding.reference && ["public-issue", "private-reference"].includes(finding.reference.kind) && String(finding.reference.value || "").trim(), `${finding.findingId} lacks a public issue or private reference`);
  assert(Array.isArray(finding.affectedFiles) && finding.affectedFiles.length > 0 && new Set(finding.affectedFiles).size === finding.affectedFiles.length, `${finding.findingId} lacks unique affected files`);
  assert(typeof finding.codeChanged === "boolean", `${finding.findingId} lacks codeChanged`);
  assert(typeof finding.acceptedForDeployment === "boolean", `${finding.findingId} lacks acceptedForDeployment`);
  assert(String(finding.publicSummary || "").trim(), `${finding.findingId} lacks a public-safe summary`);
  for (const field of ["description", "impact", "reproduction"]) assert(String(finding[field] || "").trim(), `${finding.findingId} lacks ${field}`);
  if (["validated", "accepted-risk", "remediation-planned", "fix-in-review", "retest", "resolved"].includes(finding.status)) {
    assert(finding.severity !== "Unassigned", `${finding.findingId} is validated without an assigned severity`);
  }

  if (["Critical", "High"].includes(finding.severity)) {
    assert(!finding.acceptedForDeployment, `${finding.findingId} ${finding.severity} finding cannot be accepted for deployment`);
  }
  if (["rejected", "duplicate", "invalid"].includes(finding.status)) {
    assert(String(finding.dispositionRationale || "").trim(), `${finding.findingId} ${finding.status} disposition lacks rationale`);
  }
  if (finding.status === "accepted-risk") {
    assert(!["Critical", "High"].includes(finding.severity), `${finding.findingId} Critical/High risk cannot be accepted`);
    assert(finding.riskAcceptance && finding.riskAcceptance.approver && finding.riskAcceptance.reviewedAt && finding.riskAcceptance.rationale, `${finding.findingId} accepted risk lacks approval evidence`);
    assert(!Number.isNaN(Date.parse(finding.riskAcceptance.reviewedAt)), `${finding.findingId} accepted-risk timestamp is invalid`);
  }
  if (finding.status === "resolved") {
    assert(/^(https:\/\/|private-reference:)/.test(String(finding.remediation || "")), `${finding.findingId} is resolved without a remediation link`);
    assert(String(finding.regressionTest || "").trim(), `${finding.findingId} is resolved without a regression test`);
    if (["Critical", "High", "Medium"].includes(finding.severity)) {
      assert(finding.retestStatus === "passed", `${finding.findingId} requires a passed reviewer retest`);
      assert(/^(https:\/\/|private-reference:)/.test(String(finding.retestEvidence || "")), `${finding.findingId} requires reviewer retest evidence`);
    }
  }
  if (["private", "coordinated"].includes(finding.disclosureStatus) && !closedStatuses.has(finding.status)) {
    for (const field of ["description", "impact", "reproduction"]) {
      assert(/^\[REDACTED[:\]]/i.test(String(finding[field] || "")), `${finding.findingId} exposes unresolved sensitive ${field}`);
    }
  }
}

function validateRegistry(registry, candidateCommit) {
  assert(Array.isArray(registry.findings), "Findings registry must contain a findings array");
  const ids = registry.findings.map((finding) => finding.findingId);
  assert(new Set(ids).size === ids.length, "Finding IDs must be unique");
  for (const finding of registry.findings) validateFinding(finding, candidateCommit);
}

function assertCandidateSourceMatches(candidate) {
  const scopedFiles = [...candidate.contracts, ...candidate.deploymentScripts];
  for (const relativePath of scopedFiles) {
    const frozen = tryGit(["show", `${candidate.evidenceCommit}:${relativePath}`]);
    assert(frozen !== null, `Cannot read ${relativePath} at candidate commit ${candidate.evidenceCommit}`);
    const current = fs.readFileSync(path.join(root, relativePath), "utf8").trim();
    assert(current === frozen, `${relativePath} differs from the recorded candidate; new candidate commit and checksum required`);
  }
}

function baseCandidateState(baseRef = defaultBaseRef()) {
  const registryText = tryGit(["show", `${baseRef}:${registryPath}`]);
  const candidateText = tryGit(["show", `${baseRef}:${candidatePath}`]);
  if (!registryText || !candidateText) return null;
  return { registry: JSON.parse(registryText), candidate: JSON.parse(candidateText) };
}

function candidateRefreshComplete(state, baseRef = defaultBaseRef()) {
  const files = changedFiles(baseRef);
  const scope = new Set([...state.candidate.contracts, ...state.candidate.deploymentScripts]);
  if (!files.some((file) => scope.has(file))) return true;
  const previous = baseCandidateState(baseRef);
  if (!previous) return false;
  const archived = (state.registry.candidateHistory || []).some((entry) =>
    entry.candidateVersion === previous.registry.candidateVersion &&
    entry.candidateCommit === previous.registry.candidateCommit &&
    entry.packageSha256 === previous.registry.packageSha256
  );
  return archived &&
    state.registry.candidateVersion !== previous.registry.candidateVersion &&
    state.candidate.evidenceCommit !== previous.candidate.evidenceCommit &&
    state.candidate.packageSha256 !== previous.candidate.packageSha256;
}

function defaultBaseRef() {
  if (process.env.GITHUB_BASE_REF && tryGit(["rev-parse", `origin/${process.env.GITHUB_BASE_REF}`])) return `origin/${process.env.GITHUB_BASE_REF}`;
  if (tryGit(["rev-parse", "origin/main"])) return "origin/main";
  return "HEAD^";
}

function changedFiles(baseRef = defaultBaseRef()) {
  const output = tryGit(["diff", "--name-only", baseRef, "--"]);
  return output ? output.split(/\r?\n/).filter(Boolean).map((file) => file.replaceAll("\\", "/")) : [];
}

function releaseImpact(state, baseRef) {
  const files = changedFiles(baseRef);
  const candidateScope = new Set([...state.candidate.contracts, ...state.candidate.deploymentScripts]);
  const candidateChanges = files.filter((file) => candidateScope.has(file));
  const testFiles = files.filter((file) => file.startsWith("test/") || file.startsWith("foundry/"));
  const documentationFiles = files.filter((file) => /^(docs\/|README\.md$|site\/|site-v2\/|\.github\/ISSUE_TEMPLATE\/|config\/community-review\/)/.test(file));
  const summary = summarize(state.registry);
  const unresolvedCriticalHigh = state.registry.findings.filter((finding) => ["Critical", "High"].includes(finding.severity) && !closedStatuses.has(finding.status));
  const refreshComplete = candidateRefreshComplete(state, baseRef);
  return {
    baseRef: baseRef || defaultBaseRef(),
    changedFiles: files,
    changeClass: candidateChanges.length ? "candidate-invalidating-code-change" : files.length > 0 && testFiles.length === files.length ? "test-only-update" : files.length > 0 && documentationFiles.length === files.length ? "documentation-only-update" : "review-tooling-update",
    documentationOnlyUpdate: files.length > 0 && documentationFiles.length === files.length,
    testOnlyUpdate: files.length > 0 && testFiles.length === files.length,
    candidateInvalidatingCodeChange: candidateChanges.length > 0,
    candidateChangedFiles: candidateChanges,
    candidateRefreshComplete: refreshComplete,
    newCandidateRequired: (candidateChanges.length > 0 && !refreshComplete) || summary.nextCandidateRequired,
    findingDeploymentBlocked: unresolvedCriticalHigh.length > 0,
    deploymentBlocked: unresolvedCriticalHigh.length > 0 || state.candidate.status !== "canonical" || state.candidate.independentAuditStatus !== "completed",
    deploymentBlockReasons: [
      ...(unresolvedCriticalHigh.length ? [`${unresolvedCriticalHigh.length} unresolved Critical/High community finding(s)`] : []),
      ...(state.candidate.status !== "canonical" ? ["V2 review candidate is non-canonical"] : []),
      ...(state.candidate.independentAuditStatus !== "completed" ? ["independent audit is not completed"] : [])
    ]
  };
}

function validateState(state) {
  const { registry, candidate, status } = state;
  assert(registry.candidateCommit === candidate.evidenceCommit, "Findings registry candidate commit disagrees with candidate definition");
  assert(registry.packageSha256 === candidate.packageSha256, "Findings registry checksum disagrees with candidate definition");
  assert(registry.candidateCommit === status.candidateCommit, "Findings registry candidate commit disagrees with community review status");
  assert(String(registry.candidateVersion || "").trim(), "Findings registry candidate version is missing");
  assert(Array.isArray(registry.candidateHistory), "Findings registry candidateHistory must be an array");
  const historyCommits = new Set();
  for (const entry of registry.candidateHistory) {
    assert(entry.candidateVersion && /^[0-9a-f]{40}$/.test(entry.candidateCommit || "") && /^[0-9a-f]{64}$/.test(entry.packageSha256 || ""), "Candidate history entry is incomplete");
    assert(!historyCommits.has(entry.candidateCommit), "Candidate history commits must be unique");
    historyCommits.add(entry.candidateCommit);
  }
  assert(!historyCommits.has(registry.candidateCommit), "Active candidate cannot also appear in candidateHistory");
  validateRegistry(registry, new Set([registry.candidateCommit, ...historyCommits]));
  const summary = summarize(registry);
  assert(status.publicFindingsCount === registry.findings.filter((finding) => finding.disclosureStatus === "public").length, "Public finding count disagrees with community review status");
  assert(status.privateFindingsCountPubliclyDisclosedAsAggregate === registry.findings.filter((finding) => ["private", "coordinated"].includes(finding.disclosureStatus)).length, "Private aggregate count disagrees with community review status");
  assertCandidateSourceMatches(candidate);
  assert(candidateRefreshComplete(state), "Frozen V2 scope changed without a new candidate version, source commit, checksum, and archived prior candidate");
  return summary;
}

module.exports = { root, loadState, summarize, validateFinding, validateRegistry, validateState, releaseImpact, candidateRefreshComplete, defaultBaseRef };

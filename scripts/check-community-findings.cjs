const { loadState, validateState, releaseImpact } = require("./lib/community-findings.cjs");

try {
  const state = loadState();
  const summary = validateState(state);
  const impact = releaseImpact(state);
  if (impact.newCandidateRequired) throw new Error("Frozen V2 scope changed; a new candidate version, source commit, package checksum, and archived prior candidate are required");
  console.log(`Community findings check passed: ${summary.totalSubmitted} submitted, ${summary.validated} validated, ${summary.retested} retested.`);
  console.log(`Candidate ${state.registry.candidateCommit} remains valid for community review.`);
} catch (error) {
  console.error(`Community findings check failed: ${error.message}`);
  process.exit(1);
}

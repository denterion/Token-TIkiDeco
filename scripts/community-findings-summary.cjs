const { loadState, validateState } = require("./lib/community-findings.cjs");

try {
  const state = loadState();
  const summary = validateState(state);
  console.log("# Community Review Findings Summary\n");
  console.log(`- Candidate: \`${state.registry.candidateCommit}\``);
  console.log(`- Total submitted: ${summary.totalSubmitted}`);
  console.log(`- Validated: ${summary.validated}`);
  console.log(`- Rejected, duplicate, or invalid: ${summary.rejected}`);
  console.log(`- Remediated: ${summary.remediated}`);
  console.log(`- Retested: ${summary.retested}`);
  console.log(`- Next candidate required: ${summary.nextCandidateRequired ? "yes" : "no"}`);
  console.log("- Open by severity:");
  for (const [severity, count] of Object.entries(summary.openBySeverity)) console.log(`  - ${severity}: ${count}`);
  console.log("\nCommunity peer review is not a formal independent smart-contract audit.");
} catch (error) {
  console.error(`Community findings summary failed: ${error.message}`);
  process.exit(1);
}

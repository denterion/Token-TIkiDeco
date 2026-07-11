const { validateFinding, validateRegistry } = require("./lib/community-findings.cjs");

const candidateCommit = "cdc9e7e27e66f204c50d59e45ccf970ad20290d6";
const baseFinding = {
  findingId: "CR-0001",
  reviewer: "test-reviewer",
  candidateCommit,
  reference: { kind: "public-issue", value: "https://github.com/denterion/Token-TIkiDeco/issues/1" },
  title: "Fixture finding",
  publicSummary: "Public-safe fixture summary.",
  affectedFiles: ["contracts/TikiDecoTokenV2.sol"],
  severity: "Low",
  status: "submitted",
  description: "Fixture description.",
  impact: "Fixture impact.",
  reproduction: "Fixture reproduction.",
  remediation: "",
  regressionTest: "",
  retestStatus: "not-requested",
  retestEvidence: "",
  codeChanged: false,
  acceptedForDeployment: false,
  disclosureStatus: "public"
};

function expectFailure(name, fn, expected) {
  try {
    fn();
    throw new Error(`${name} unexpectedly passed`);
  } catch (error) {
    if (error.message.includes("unexpectedly passed")) throw error;
    if (!error.message.includes(expected)) throw new Error(`${name} failed for the wrong reason: ${error.message}`);
    console.log(`ok - ${name}`);
  }
}

validateFinding(baseFinding, candidateCommit);
console.log("ok - valid submitted finding");

expectFailure("duplicate IDs", () => validateRegistry({ findings: [baseFinding, { ...baseFinding }] }, candidateCommit), "unique");
expectFailure("wrong candidate", () => validateFinding({ ...baseFinding, candidateCommit: "0".repeat(40) }, candidateCommit), "registered candidate");
expectFailure("Critical accepted for deployment", () => validateFinding({ ...baseFinding, severity: "Critical", acceptedForDeployment: true }, candidateCommit), "cannot be accepted");
expectFailure("resolved without regression test", () => validateFinding({ ...baseFinding, status: "resolved", remediation: "https://github.com/denterion/Token-TIkiDeco/pull/1", retestStatus: "not-applicable" }, candidateCommit), "regression test");
expectFailure("Medium resolved without retest", () => validateFinding({ ...baseFinding, severity: "Medium", status: "resolved", remediation: "https://github.com/denterion/Token-TIkiDeco/pull/1", regressionTest: "test/example.js", retestStatus: "pending" }, candidateCommit), "passed reviewer retest");
expectFailure("unresolved private detail exposure", () => validateFinding({ ...baseFinding, disclosureStatus: "private", reference: { kind: "private-reference", value: "private-advisory:CR-0001" } }, candidateCommit), "exposes unresolved sensitive");

console.log("Community finding validator tests passed.");

import canonical from "../../../deployments/canonical.json";
import releaseEvidence from "../../../config/release-evidence.json";

export const projectFacts = {
  network: "Ethereum Sepolia",
  chainId: canonical.chainId,
  canonicalVersion: canonical.contractVersion,
  tokenAddress: canonical.contracts.token.address,
  vaultAddress: canonical.contracts.vestingVault.address,
  safeAddress: canonical.ownership.ownerSafe,
  treasuryAddress: canonical.treasury.address,
  safeThreshold: canonical.ownership.safeThreshold,
  supply: "100,000,000 TIDE",
  auditStatus: "Internal review only; independent audit not started",
  saleStatus: "Not offered",
  monetaryValue: "No stated value",
  mainnetStatus: "Not deployed",
  releaseEvidence,
  verification: {
    token: canonical.contracts.token.verification,
    vault: canonical.contracts.vestingVault.verification
  },
  reports: canonical.publishedReports,
  links: {
    repository: "https://github.com/denterion/Token-TIkiDeco",
    issues: "https://github.com/denterion/Token-TIkiDeco/issues",
    officialPreview: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/OFFICIAL_PUBLIC_PREVIEW.md",
    finalEvidenceReport: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/reports/REPORT_2026_07_11_V02_FINAL_EVIDENCE.md",
    releaseCandidate: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/releases/v0.2.0-utility-pilot-rc.1.md",
    publicEntrypoints: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PUBLIC_ENTRYPOINTS.md",
    pilotProofPack: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PILOT_PROOF_PACK.md",
    projectFacts: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md",
    releaseControl: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/RELEASE_CONTROL_CENTER.md",
    roadmap: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/THREE_PHASE_ROADMAP.md",
    claimsMatrix: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/CLAIMS_MATRIX.md",
    feedbackGuide: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/FEEDBACK_GUIDE.md",
    communityPreview: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/COMMUNITY_PREVIEW.md",
    securityPolicy: "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY.md",
    noOffer: "/legal/no-offer/",
    riskDisclosure: "/legal/risk-disclosure/",
    trust: "/trust/",
    utility: "/utility/",
    pilot: "/pilot/",
    operatorSandbox: "/operator-sandbox/",
    business: "/business/",
    audit: "/audit/",
    verify: "/verify/",
    status: "/status/"
  }
} as const;

export const requiredDisclaimers = [
  "Sepolia testnet prototype",
  "no sale",
  "no stated monetary value",
  "independent audit not started",
  "no mainnet deployment"
] as const;

export const transparencyCards = [
  {
    title: "Final evidence report",
    body: `v0.2 release evidence is pinned to commit ${releaseEvidence.sourceCommit.slice(0, 7)} with public bundle hashes.`,
    href: projectFacts.links.finalEvidenceReport
  },
  {
    title: "Pilot proof pack",
    body: "One short path shows pilot status, blocked gates, dry-run evidence, and verification commands.",
    href: projectFacts.links.pilotProofPack
  },
  {
    title: "Project facts",
    body: "The source-of-truth file separates verified, planned, experimental, and unknown claims.",
    href: projectFacts.links.projectFacts
  },
  {
    title: "Release control",
    body: "The maintainer control view shows stale evidence, pilot blockers, and next release actions.",
    href: projectFacts.links.releaseControl
  },
  {
    title: "Roadmap",
    body: "The roadmap keeps public preview, utility pilot, and V2 audit preparation separated.",
    href: projectFacts.links.roadmap
  },
  {
    title: "GitHub issues",
    body: "Public feedback is collected through issue templates, not sale or transaction flows.",
    href: projectFacts.links.issues
  },
  {
    title: "Claims matrix",
    body: "Public copy is constrained by verified facts and prohibited-claim rules.",
    href: projectFacts.links.claimsMatrix
  },
  {
    title: "Security policy",
    body: "Responsible disclosure and internal review materials are published.",
    href: projectFacts.links.securityPolicy
  }
] as const;

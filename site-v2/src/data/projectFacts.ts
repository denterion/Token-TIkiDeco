import canonical from "../../../deployments/canonical.json";

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
  verification: {
    token: canonical.contracts.token.verification,
    vault: canonical.contracts.vestingVault.verification
  },
  reports: canonical.publishedReports,
  links: {
    repository: "https://github.com/denterion/Token-TIkiDeco",
    projectFacts: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md",
    claimsMatrix: "https://github.com/denterion/Token-TIkiDeco/blob/main/docs/CLAIMS_MATRIX.md",
    securityPolicy: "https://github.com/denterion/Token-TIkiDeco/blob/main/SECURITY.md",
    noOffer: "/legal/no-offer/",
    riskDisclosure: "/legal/risk-disclosure/",
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
    title: "Contract verification",
    body: "Verified Sepolia source pages are linked from the canonical manifest.",
    href: projectFacts.verification.token
  },
  {
    title: "Safe multisig control",
    body: `Privileged V1 ownership is documented as ${projectFacts.safeThreshold} Safe control.`,
    href: `https://sepolia.etherscan.io/address/${projectFacts.safeAddress}`
  },
  {
    title: "Public report hashes",
    body: "Repository reports and on-chain hashes are cross-linked for public review.",
    href: "https://github.com/denterion/Token-TIkiDeco/tree/main/docs/reports"
  },
  {
    title: "Vesting transparency",
    body: "The legacy vault address and candidate V2 vesting model are documented separately.",
    href: projectFacts.verification.vault
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

import { projectFacts, transparencyCards } from "./projectFacts";

const statusRows = [
  { key: "network", value: projectFacts.network },
  { key: "v02", value: `Public pre-release; evidence pinned to ${projectFacts.releaseEvidence.sourceCommit.slice(0, 7)}` },
  { key: "evidence", value: projectFacts.releaseEvidence.evidenceDate },
  { key: "campaign", value: "Draft-not-live" },
  { key: "tokenSupply", value: projectFacts.supply },
  { key: "mainnet", value: projectFacts.mainnetStatus },
  { key: "sale", value: projectFacts.saleStatus },
  { key: "monetaryValue", value: projectFacts.monetaryValue },
  { key: "audit", value: projectFacts.auditStatus }
] as const;

export const siteCopy = {
  skip: "Skip to content",
  navAria: "Primary navigation",
  sectionsAria: "Page sections",
  homeAria: "TikiDeco home",
  nav: {
    trust: "Trust",
    status: "Status",
    pilot: "Pilot",
    audit: "Audit",
    review: "Review",
    feedback: "Feedback"
  },
  hero: {
    badge: "ETHEREUM SEPOLIA - NO MONETARY VALUE",
    eyebrow: "Hospitality loyalty, tested in public",
    title: "TikiDeco",
    subtitle:
      "A public test project exploring how future hospitality loyalty and access rules could be verified openly.",
    context: "Today: test contracts, read-only checks, and public evidence on Ethereum Sepolia.",
    badges: ["v0.2 Pre-Release", "Pilot Not Live", "No Sale", "Independent Audit Not Started"],
    actionsAria: "Primary links",
    primaryAction: "Understand the project",
    statusAction: "Check current status",
    repo: "View source",
    note: "No stated monetary value, no mainnet deployment, no active hospitality benefit, and not independently audited."
  },
  brief: {
    eyebrow: "The one-minute version",
    title: "A loyalty experiment with public proof.",
    body:
      "TikiDeco tests whether hospitality loyalty rules can be easier to inspect when selected records are published on a public test network.",
    items: [
      {
        step: "01",
        title: "What exists",
        body: "A fixed-supply test token, verified Sepolia contracts, Safe governance, and public project reports."
      },
      {
        step: "02",
        title: "What you can do",
        body: "Review the evidence or try a read-only test-wallet balance check. The site never asks for a transaction."
      },
      {
        step: "03",
        title: "What comes next",
        body: "A limited testnet preview remains blocked until legal, privacy, security, operations, and governance reviews exist."
      }
    ]
  },
  status: {
    eyebrow: "Current Status",
    title: "Current status in one panel.",
    body: "TIDE is Sepolia-only public infrastructure. The v0.2 utility-pilot flow is a pre-release track, and the first campaign is draft-not-live.",
    labels: {
      network: "Network",
      chainId: "Chain ID",
      canonicalVersion: "Canonical version",
      v02: "v0.2 status",
      evidence: "Evidence date",
      campaign: "Pilot campaign",
      tokenSupply: "Supply",
      mainnet: "Mainnet",
      sale: "Sale",
      monetaryValue: "Value",
      audit: "Audit"
    },
    helper: "Every value links back to public documentation or Sepolia records."
  },
  transparency: {
    eyebrow: "Verify",
    title: "Four places to verify the project.",
    body: "Use project facts, release control, the roadmap, and public feedback issues as the shortest review path.",
    cards: transparencyCards.slice(0, 4).map((card) => ({ ...card }))
  },
  audit: {
    eyebrow: "Review Boundary",
    title: "Prepared for review; independent audit not started.",
    body: "V1 is the legacy canonical Sepolia deployment. V2 is candidate review code and is not promoted by the canonical manifest.",
    readiness: [
      ["Internal review", "Repository material"],
      ["Independent audit", "Not started"],
      ["V2 contracts", "Candidate only"],
      ["Mainnet", "Not approved"]
    ]
  },
  footer: {
    title: "TikiDeco / TIDE",
    disclaimer:
      "TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed on mainnet, and has not completed an independent audit. Nothing on this site is financial, investment, legal or tax advice.",
    links: {
      trust: "Trust Center",
      repository: "Repository",
      officialPreview: "Official Preview",
      pilotProofPack: "Pilot Proof Pack",
      finalEvidenceReport: "Evidence Report",
      projectFacts: "Project Facts",
      releaseControl: "Release Control",
      roadmap: "Roadmap",
      securityPolicy: "Security Policy",
      claimsMatrix: "Claims Matrix",
      feedbackGuide: "Feedback Guide",
      issues: "Give Feedback",
      etherscanToken: "Etherscan Token",
      etherscanVault: "Etherscan Vault",
      noOffer: "No Offer Notice",
      riskDisclosure: "Risk Disclosure"
    }
  },
  statusRows
} as const;

export type SiteCopy = typeof siteCopy;

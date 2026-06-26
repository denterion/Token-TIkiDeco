import campaignManifest from "../../../../config/utility-pilot/tide-community-preview-001.json";

export const SEPOLIA_CHAIN_ID = 11155111;

export type PilotCampaignStatus = "draft-not-live" | "planned" | "published-testnet" | "closed";

export type PilotCampaignRules = {
  id: string;
  name: string;
  chainId: typeof SEPOLIA_CHAIN_ID;
  snapshotBlock: number | null;
  minimumTideBalance: number;
  startsAt: string;
  endsAt: string;
  maxRequestsPerWallet: number;
  benefitStatus: "not-live";
  valueStatus: "no-stated-monetary-value";
  transferPolicy: "no-transfer-of-guest-rights";
  resalePolicy: "no-resale";
  cashPolicy: "no-cash-value";
  campaignStatus: PilotCampaignStatus;
};

export const pilotCampaignRules: PilotCampaignRules = {
  id: campaignManifest.campaignId,
  name: campaignManifest.campaignName,
  chainId: SEPOLIA_CHAIN_ID,
  snapshotBlock: campaignManifest.snapshot.block,
  minimumTideBalance: Number(campaignManifest.eligibility.minimumTideBalance),
  startsAt: "2026-06-01T00:00:00.000Z",
  endsAt: "2026-12-31T23:59:59.000Z",
  maxRequestsPerWallet: 1,
  benefitStatus: "not-live",
  valueStatus: "no-stated-monetary-value",
  transferPolicy: "no-transfer-of-guest-rights",
  resalePolicy: "no-resale",
  cashPolicy: "no-cash-value",
  campaignStatus: campaignManifest.status
};

export const testPilotCampaignFixture: PilotCampaignRules = {
  ...pilotCampaignRules,
  snapshotBlock: 11093006,
  campaignStatus: "published-testnet"
};

export const mockPilotCampaign = testPilotCampaignFixture;

export function isCampaignActive(rules: PilotCampaignRules, now = new Date()): boolean {
  const current = now.getTime();
  return current >= Date.parse(rules.startsAt) && current <= Date.parse(rules.endsAt);
}

export function campaignDisclaimers(rules: PilotCampaignRules): string[] {
  return [
    `${rules.name} is a Sepolia-only utility pilot flow.`,
    "The pilot remains planned until campaign rules and allocation reports are published.",
    "TIDE is not offered for sale and has no stated monetary value.",
    "Eligibility is limited, conditional, manually reviewed, and subject to pilot rules.",
    "Pilot participation has no cash value, no resale, and no transfer of guest rights."
  ];
}

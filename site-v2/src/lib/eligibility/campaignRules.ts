export const SEPOLIA_CHAIN_ID = 11155111;

export type PilotCampaignRules = {
  id: string;
  name: string;
  chainId: typeof SEPOLIA_CHAIN_ID;
  snapshotBlock: number;
  minimumTideBalance: number;
  startsAt: string;
  endsAt: string;
  maxRequestsPerWallet: number;
  benefitStatus: "not-live";
  valueStatus: "no-stated-monetary-value";
  transferPolicy: "no-transfer-of-guest-rights";
  resalePolicy: "no-resale";
  cashPolicy: "no-cash-value";
};

export const mockPilotCampaign: PilotCampaignRules = {
  id: "tide-community-preview-001",
  name: "TIDE Loyalty Pilot - Community Preview",
  chainId: SEPOLIA_CHAIN_ID,
  snapshotBlock: 11093006,
  minimumTideBalance: 100,
  startsAt: "2026-06-01T00:00:00.000Z",
  endsAt: "2026-12-31T23:59:59.000Z",
  maxRequestsPerWallet: 1,
  benefitStatus: "not-live",
  valueStatus: "no-stated-monetary-value",
  transferPolicy: "no-transfer-of-guest-rights",
  resalePolicy: "no-resale",
  cashPolicy: "no-cash-value"
};

export function isCampaignActive(rules: PilotCampaignRules, now = new Date()): boolean {
  const current = now.getTime();
  return current >= Date.parse(rules.startsAt) && current <= Date.parse(rules.endsAt);
}

export function campaignDisclaimers(rules: PilotCampaignRules): string[] {
  return [
    `${rules.name} is a Sepolia-only mock pilot.`,
    "The pilot is not live and does not create active guest benefits.",
    "TIDE is not offered for sale and has no stated monetary value.",
    "Eligibility is limited, conditional, manually reviewed, and subject to pilot rules.",
    "Pilot participation has no cash value, no resale, and no transfer of guest rights."
  ];
}

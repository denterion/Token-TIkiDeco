import type { PilotCampaignRules } from "./campaignRules";

export type SnapshotBalanceSource = "live" | "cached" | "stale" | "unavailable";

export type SnapshotBalance = {
  walletAddress: string;
  blockNumber: number;
  balanceTide: number;
  source: SnapshotBalanceSource;
  checkedAt: string;
};

export function normalizeWalletAddress(walletAddress: string): string {
  return walletAddress.trim().toLowerCase();
}

export function isValidEthereumAddress(walletAddress: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim());
}

export function createSnapshotBalance(
  walletAddress: string,
  rules: PilotCampaignRules,
  balanceTide: number,
  source: SnapshotBalanceSource = "live",
  checkedAt = new Date().toISOString()
): SnapshotBalance {
  return {
    walletAddress: normalizeWalletAddress(walletAddress),
    blockNumber: rules.snapshotBlock,
    balanceTide,
    source,
    checkedAt
  };
}

export function hasMinimumSnapshotBalance(balance: SnapshotBalance, rules: PilotCampaignRules): boolean {
  return balance.blockNumber === rules.snapshotBlock && balance.balanceTide >= rules.minimumTideBalance;
}

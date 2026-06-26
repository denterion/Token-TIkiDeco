import { SEPOLIA_CHAIN_ID, type PilotCampaignRules } from "./campaignRules";
import { normalizeWalletAddress } from "./snapshot";

export type MockSignatureSession = {
  walletAddress: string;
  campaignId: string;
  chainId: typeof SEPOLIA_CHAIN_ID;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
  message: string;
};

export function createMockNonce(walletAddress: string, campaignId: string, issuedAt = new Date().toISOString()): string {
  return `${campaignId}:${normalizeWalletAddress(walletAddress)}:${Date.parse(issuedAt)}`;
}

export function createMockSignatureMessage(
  walletAddress: string,
  rules: PilotCampaignRules,
  issuedAt = new Date().toISOString(),
  ttlMinutes = 15
): MockSignatureSession {
  const normalized = normalizeWalletAddress(walletAddress);
  const expiresAt = new Date(Date.parse(issuedAt) + ttlMinutes * 60_000).toISOString();
  const nonce = createMockNonce(normalized, rules.id, issuedAt);
  const message = [
    "TikiDeco TIDE Loyalty Pilot off-chain verification",
    `Campaign: ${rules.id}`,
    `Wallet: ${normalized}`,
    `Chain ID: ${rules.chainId}`,
    `Snapshot block: ${rules.snapshotBlock}`,
    `Nonce: ${nonce}`,
    `Issued at: ${issuedAt}`,
    `Expires at: ${expiresAt}`,
    "This is an off-chain message only.",
    "This does not authorize a blockchain transaction, token approval, transfer, purchase, booking, or live benefit."
  ].join("\n");

  return {
    walletAddress: normalized,
    campaignId: rules.id,
    chainId: rules.chainId,
    nonce,
    issuedAt,
    expiresAt,
    message
  };
}

export function isMockSignatureSessionFresh(session: MockSignatureSession, now = new Date()): boolean {
  return now.getTime() <= Date.parse(session.expiresAt);
}

import { isCampaignActive, mockPilotCampaign, SEPOLIA_CHAIN_ID, type PilotCampaignRules } from "./campaignRules";
import { hasMinimumSnapshotBalance, isValidEthereumAddress, normalizeWalletAddress, type SnapshotBalance } from "./snapshot";
import { isMockSignatureSessionFresh, type MockSignatureSession } from "./walletSignature";

export type EligibilityCode =
  | "wrong-chain"
  | "empty-wallet"
  | "invalid-address"
  | "expired-campaign"
  | "duplicate-wallet"
  | "missing-signature"
  | "expired-signature"
  | "insufficient-balance"
  | "eligible-mock";

export type EligibilityInput = {
  walletAddress: string;
  chainId: number;
  snapshotBalance?: SnapshotBalance;
  signatureSession?: MockSignatureSession;
  previouslySubmittedWallets?: ReadonlySet<string>;
  now?: Date;
  rules?: PilotCampaignRules;
};

export type EligibilityResult = {
  code: EligibilityCode;
  eligible: boolean;
  title: string;
  explanation: string;
  activeBenefits: false;
  requiresTransaction: false;
  transactionFlow: false;
};

function result(code: EligibilityCode, eligible: boolean, title: string, explanation: string): EligibilityResult {
  return {
    code,
    eligible,
    title,
    explanation,
    activeBenefits: false,
    requiresTransaction: false,
    transactionFlow: false
  };
}

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const rules = input.rules ?? mockPilotCampaign;
  const wallet = normalizeWalletAddress(input.walletAddress);

  if (input.chainId !== SEPOLIA_CHAIN_ID) {
    return result("wrong-chain", false, "Wrong network", "This mock pilot only evaluates Ethereum Sepolia.");
  }

  if (!wallet) {
    return result("empty-wallet", false, "Wallet required", "Enter a wallet address to run the local mock check.");
  }

  if (!isValidEthereumAddress(wallet)) {
    return result("invalid-address", false, "Invalid address", "Use a valid Ethereum-style address.");
  }

  if (!isCampaignActive(rules, input.now)) {
    return result("expired-campaign", false, "Campaign inactive", "The mock campaign window is not active.");
  }

  if (input.previouslySubmittedWallets?.has(wallet)) {
    return result("duplicate-wallet", false, "Duplicate wallet", "The pilot policy allows one request per wallet per campaign.");
  }

  if (!input.signatureSession) {
    return result("missing-signature", false, "Mock signature missing", "The mock flow requires an off-chain message signature placeholder.");
  }

  if (!isMockSignatureSessionFresh(input.signatureSession, input.now)) {
    return result("expired-signature", false, "Mock signature expired", "Create a fresh mock message before review.");
  }

  if (!input.snapshotBalance || !hasMinimumSnapshotBalance(input.snapshotBalance, rules)) {
    return result("insufficient-balance", false, "Below mock threshold", "The read-only mock balance is below the campaign threshold.");
  }

  return result(
    "eligible-mock",
    true,
    "Mock eligible for review",
    "This means the mock checks passed. It is not a live benefit, booking, transfer, cash value, or confirmation."
  );
}

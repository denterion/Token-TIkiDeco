import { useMemo, useState } from "react";
import {
  createMockSignatureMessage,
  createMockSnapshotBalance,
  evaluateEligibility,
  mockPilotCampaign,
  privacyNotice,
  SEPOLIA_CHAIN_ID
} from "../lib/eligibility";

const eligibleMockAddress = "0x1111111111111111111111111111111111111111";
const duplicateMockAddress = "0x2222222222222222222222222222222222222222";

function mockBalanceFor(walletAddress: string): number {
  const normalized = walletAddress.trim().toLowerCase();
  if (normalized === eligibleMockAddress) return 250;
  if (normalized === duplicateMockAddress) return 250;
  return 0;
}

export function PilotEligibilityCard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [hasMockMessage, setHasMockMessage] = useState(false);

  const balance = mockBalanceFor(walletAddress);
  const signatureSession = useMemo(() => {
    if (!walletAddress || !hasMockMessage) return undefined;
    return createMockSignatureMessage(walletAddress, mockPilotCampaign, "2026-07-01T12:00:00.000Z");
  }, [hasMockMessage, walletAddress]);

  const snapshotBalance = walletAddress
    ? createMockSnapshotBalance(walletAddress, mockPilotCampaign, balance, "mock", "2026-07-01T12:00:00.000Z")
    : undefined;

  const result = evaluateEligibility({
    walletAddress,
    chainId: SEPOLIA_CHAIN_ID,
    snapshotBalance,
    signatureSession,
    previouslySubmittedWallets: new Set([duplicateMockAddress]),
    now: new Date("2026-07-01T12:01:00.000Z")
  });

  return (
    <section className="section pilot-eligibility" aria-labelledby="pilot-eligibility-title">
      <div className="section-heading">
        <p className="eyebrow">Mock pilot checker</p>
        <h2 id="pilot-eligibility-title">TIDE Loyalty Pilot eligibility mock</h2>
        <p>
          This local demo shows how a Sepolia-only pilot review could explain eligibility. It is not live, does not
          connect a wallet, and does not create active guest benefits.
        </p>
      </div>

      <div className="pilot-card" aria-live="polite">
        <div className="pilot-card-header">
          <span className="site-badge">NOT LIVE</span>
          <span className="pilot-card-network">Ethereum Sepolia · chain {SEPOLIA_CHAIN_ID}</span>
        </div>

        <label className="field-label" htmlFor="pilot-wallet">
          Optional wallet address
        </label>
        <input
          id="pilot-wallet"
          className="text-field"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={walletAddress}
          onChange={(event) => setWalletAddress(event.target.value)}
          placeholder={eligibleMockAddress}
        />

        <label className="check-row">
          <input type="checkbox" checked={hasMockMessage} onChange={(event) => setHasMockMessage(event.target.checked)} />
          <span>Use an off-chain message placeholder for this mock review.</span>
        </label>

        <div className="pilot-meter" role="group" aria-label="Read-only mock balance check">
          <span>Read-only mock balance</span>
          <strong>{balance.toLocaleString("en-US")} TIDE</strong>
          <small>
            Threshold: {mockPilotCampaign.minimumTideBalance.toLocaleString("en-US")} TIDE at block{" "}
            {mockPilotCampaign.snapshotBlock.toLocaleString("en-US")}
          </small>
        </div>

        <div className={`pilot-result pilot-result-${result.eligible ? "ok" : "hold"}`}>
          <h3>{result.title}</h3>
          <p>{result.explanation}</p>
          <ul>
            <li>No transaction button.</li>
            <li>No token approval, transfer, fee, or booking integration.</li>
            <li>No cash value, resale, or transfer of guest rights.</li>
          </ul>
        </div>

        <p className="privacy-note">{privacyNotice()}</p>
      </div>
    </section>
  );
}

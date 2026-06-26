import { useMemo, useState } from "react";
import {
  createMockSignatureMessage,
  createSnapshotBalance,
  evaluateEligibility,
  isValidEthereumAddress,
  mockPilotCampaign,
  privacyNotice,
  readTideBalance,
  SEPOLIA_CHAIN_ID,
  type TideBalanceResult
} from "../lib/eligibility";

const duplicateTestnetAddress = "0x2222222222222222222222222222222222222222";

export function PilotEligibilityCard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [hasOffchainMessage, setHasOffchainMessage] = useState(false);
  const [balanceResult, setBalanceResult] = useState<TideBalanceResult>({ status: "idle", blockTag: "latest" });
  const [isChecking, setIsChecking] = useState(false);

  const signatureSession = useMemo(() => {
    if (!walletAddress || !hasOffchainMessage) return undefined;
    return createMockSignatureMessage(walletAddress, mockPilotCampaign, "2026-07-01T12:00:00.000Z");
  }, [hasOffchainMessage, walletAddress]);

  const snapshotBalance =
    walletAddress && balanceResult.balanceTide !== undefined && ["live", "cached", "stale"].includes(balanceResult.status)
      ? createSnapshotBalance(
          walletAddress,
          mockPilotCampaign,
          balanceResult.balanceTide,
          balanceResult.status,
          balanceResult.checkedAt || new Date().toISOString()
        )
      : balanceResult.status === "unavailable"
        ? createSnapshotBalance(walletAddress, mockPilotCampaign, 0, "unavailable", new Date().toISOString())
        : undefined;

  const result = evaluateEligibility({
    walletAddress,
    chainId: balanceResult.status === "wrong-chain" && balanceResult.chainId ? balanceResult.chainId : SEPOLIA_CHAIN_ID,
    snapshotBalance,
    signatureSession,
    previouslySubmittedWallets: new Set([duplicateTestnetAddress]),
    now: new Date("2026-07-01T12:01:00.000Z")
  });

  async function checkBalance() {
    if (!isValidEthereumAddress(walletAddress)) {
      setBalanceResult({ status: "unavailable", blockTag: "latest", error: "Enter a valid Ethereum address first." });
      return;
    }
    setIsChecking(true);
    try {
      setBalanceResult(await readTideBalance(walletAddress));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <section className="section pilot-eligibility" aria-labelledby="pilot-eligibility-title">
      <div className="section-heading">
        <p className="eyebrow">Read-only Sepolia checker</p>
        <h2 id="pilot-eligibility-title">TIDE Loyalty Pilot eligibility flow</h2>
        <p>
          This testnet-only flow reads the canonical TIDE balance on Sepolia and explains whether a wallet could enter
          manual pilot review. It does not connect a wallet, sign transactions, or create active guest benefits.
        </p>
      </div>

      <div className="pilot-card" aria-live="polite">
        <div className="pilot-card-header">
          <span className="site-badge">NOT LIVE</span>
          <span className="pilot-card-network">Ethereum Sepolia - chain {SEPOLIA_CHAIN_ID}</span>
        </div>

        <label className="field-label" htmlFor="pilot-wallet">
          Wallet address
        </label>
        <input
          id="pilot-wallet"
          className="text-field"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={walletAddress}
          onChange={(event) => {
            setWalletAddress(event.target.value);
            setBalanceResult({ status: "idle", blockTag: "latest" });
          }}
          placeholder="0x..."
        />

        <button className="button button-primary pilot-check-button" type="button" onClick={checkBalance} disabled={isChecking}>
          {isChecking ? "Checking Sepolia" : "Check Sepolia balance"}
        </button>

        <label className="check-row">
          <input
            type="checkbox"
            checked={hasOffchainMessage}
            onChange={(event) => setHasOffchainMessage(event.target.checked)}
          />
          <span>Prepare an optional off-chain message proof for manual review. This is not a transaction.</span>
        </label>

        {signatureSession ? (
          <>
            <label className="field-label" htmlFor="pilot-message">
              Off-chain message text
            </label>
            <textarea id="pilot-message" className="text-field pilot-message" readOnly value={signatureSession.message} />
          </>
        ) : null}

        <div className="pilot-meter" role="group" aria-label="Read-only Sepolia balance check">
          <span>Read-only Sepolia balance</span>
          <strong>
            {balanceResult.balanceTide !== undefined ? `${balanceResult.balanceTide.toLocaleString("en-US")} TIDE` : "Not checked"}
          </strong>
          <small>
            Threshold: {mockPilotCampaign.minimumTideBalance.toLocaleString("en-US")} TIDE at block{" "}
            {mockPilotCampaign.snapshotBlock.toLocaleString("en-US")}
          </small>
          <small>
            Data: {balanceResult.status.toUpperCase()}
            {balanceResult.checkedAt ? ` - ${new Date(balanceResult.checkedAt).toLocaleString("en-US")}` : ""}
          </small>
          {balanceResult.error ? <small>{balanceResult.error}</small> : null}
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

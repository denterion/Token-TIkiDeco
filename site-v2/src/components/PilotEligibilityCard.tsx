import { useMemo, useState } from "react";
import {
  campaignDisclaimers,
  createOffchainMessageProof,
  createSnapshotBalance,
  evaluateEligibility,
  isValidEthereumAddress,
  pilotCampaignRules,
  privacyNotice,
  readTideBalance,
  SEPOLIA_CHAIN_ID,
  type TideBalanceResult
} from "../lib/eligibility";

export function PilotEligibilityCard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [hasOffchainMessage, setHasOffchainMessage] = useState(false);
  const [balanceResult, setBalanceResult] = useState<TideBalanceResult>({ status: "idle", blockTag: "latest" });
  const [isChecking, setIsChecking] = useState(false);

  const signatureSession = useMemo(() => {
    if (!walletAddress || !hasOffchainMessage) return undefined;
    return createOffchainMessageProof(walletAddress, pilotCampaignRules);
  }, [hasOffchainMessage, walletAddress]);

  const snapshotBalance =
    walletAddress && balanceResult.balanceTide !== undefined && ["live", "cached", "stale"].includes(balanceResult.status)
      ? createSnapshotBalance(
          walletAddress,
          pilotCampaignRules,
          balanceResult.balanceTide,
          balanceResult.status,
          balanceResult.checkedAt || new Date().toISOString()
        )
      : balanceResult.status === "unavailable"
        ? createSnapshotBalance(walletAddress, pilotCampaignRules, 0, "unavailable", new Date().toISOString())
        : undefined;

  const result = evaluateEligibility({
    walletAddress,
    chainId: balanceResult.status === "wrong-chain" && balanceResult.chainId ? balanceResult.chainId : SEPOLIA_CHAIN_ID,
    snapshotBalance,
    signatureSession,
    now: new Date()
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
          <span className="site-badge">{pilotCampaignRules.campaignStatus.toUpperCase()}</span>
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
            Threshold: {pilotCampaignRules.minimumTideBalance.toLocaleString("en-US")} TIDE;{" "}
            {pilotCampaignRules.snapshotBlock
              ? `snapshot block ${pilotCampaignRules.snapshotBlock.toLocaleString("en-US")}`
              : "snapshot block not published"}
          </small>
          <small>
            Data: {balanceResult.status.toUpperCase()}
            {balanceResult.checkedAt ? ` - ${new Date(balanceResult.checkedAt).toLocaleString("en-US")}` : ""}
          </small>
          {balanceResult.error ? <small>{balanceResult.error}</small> : null}
        </div>

        <div className="pilot-result pilot-result-hold">
          <h3>Campaign status: draft-not-live</h3>
          <p>
            This checker can read a Sepolia balance for planning and manual review design, but the campaign is not live.
            No request window, inventory, allocation report, or approval gate is complete.
          </p>
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
        <p className="privacy-note">{campaignDisclaimers(pilotCampaignRules).join(" ")}</p>
        <p className="privacy-note">
          TIDE is a Sepolia testnet prototype. It is not offered for sale, has no stated monetary value, is not deployed
          on mainnet, and has not completed an independent audit.
        </p>
      </div>
    </section>
  );
}

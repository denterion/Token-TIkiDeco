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
import { previewMetrics } from "../lib/previewMetrics";

export function PilotEligibilityCard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [hasOffchainMessage, setHasOffchainMessage] = useState(false);
  const [balanceResult, setBalanceResult] = useState<TideBalanceResult>({ status: "idle", blockTag: "latest" });
  const [isChecking, setIsChecking] = useState(false);
  const walletError = balanceResult.error === "Enter a valid Ethereum address first." ? balanceResult.error : undefined;

  const signatureSession = useMemo(() => {
    if (!walletAddress || !hasOffchainMessage) return undefined;
    return createOffchainMessageProof(walletAddress, pilotCampaignRules);
  }, [hasOffchainMessage, walletAddress]);

  const snapshotBalance =
    walletAddress && balanceResult.balanceTide !== undefined &&
      (balanceResult.status === "live" || balanceResult.status === "cached" || balanceResult.status === "stale")
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
    if (isChecking) return;
    previewMetrics.record("balanceCheckAttempts");
    if (!isValidEthereumAddress(walletAddress)) {
      setBalanceResult({ status: "unavailable", blockTag: "latest", error: "Enter a valid Ethereum address first." });
      return;
    }
    setIsChecking(true);
    try {
      const nextBalance = await readTideBalance(walletAddress);
      setBalanceResult(nextBalance);
      if (["live", "cached", "stale"].includes(nextBalance.status) && nextBalance.balanceTide !== undefined) {
        previewMetrics.record("successfulChecks");
        previewMetrics.record(nextBalance.balanceTide >= pilotCampaignRules.minimumTideBalance ? "eligibleResults" : "ineligibleResults");
      } else {
        previewMetrics.record("rpcFailures");
      }
    } finally {
      setIsChecking(false);
    }
  }

  const statusMessage = isChecking
    ? "Checking the Sepolia network for the entered wallet address."
    : walletError
      ? `Error: ${walletError}`
      : balanceResult.status === "live"
        ? `Balance check complete. Live Sepolia balance: ${balanceResult.balanceTide?.toLocaleString("en-US")} TIDE.`
        : balanceResult.status === "cached" || balanceResult.status === "stale"
          ? `Balance check complete using ${balanceResult.status} data: ${balanceResult.balanceTide?.toLocaleString("en-US")} TIDE.`
          : balanceResult.status === "wrong-chain"
            ? `Balance check failed. ${balanceResult.error}`
            : balanceResult.status === "unavailable"
              ? `Balance check failed. ${balanceResult.error || "Data temporarily unavailable"}`
              : "Enter a wallet address to run a read-only Sepolia balance check.";

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

      <div className="pilot-card" aria-busy={isChecking}>
        <div className="pilot-card-header">
          <span className="site-badge">NOT LIVE</span>
          <span className="site-badge">{pilotCampaignRules.campaignStatus.toUpperCase()}</span>
          <span className="pilot-card-network">Ethereum Sepolia - chain {SEPOLIA_CHAIN_ID}</span>
        </div>

        <label className="field-label" htmlFor="pilot-wallet">
          Wallet address
        </label>
        <p className="field-help" id="pilot-wallet-help">
          Enter a public Ethereum address. No wallet connection or transaction is requested.
        </p>
        <input
          id="pilot-wallet"
          className="text-field"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="pilot-wallet-help"
          aria-invalid={walletError ? true : undefined}
          aria-errormessage={walletError ? "pilot-wallet-error" : undefined}
          value={walletAddress}
          onChange={(event) => {
            setWalletAddress(event.target.value);
            setBalanceResult({ status: "idle", blockTag: "latest" });
          }}
          placeholder="0x..."
        />

        <button
          className="button button-primary pilot-check-button"
          type="button"
          onClick={checkBalance}
          aria-controls="pilot-balance-status"
          aria-disabled={isChecking}
        >
          {isChecking ? "Checking Sepolia" : "Check Sepolia balance"}
        </button>

        <div id="pilot-balance-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>

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
          {balanceResult.error ? <small id={walletError ? "pilot-wallet-error" : undefined}>{balanceResult.error}</small> : null}
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

        <p className="privacy-note">Metrics are aggregate counters held only in this tab's memory. The wallet address is never added to analytics.</p>

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

# Sepolia Public Preview Product Specification

Status: measurable preview specification; campaign remains `draft-not-live`. This document does not activate a hospitality campaign or approve a real-world benefit.

## User Problem

A cautious reviewer needs to understand whether the TIDE workflow works without connecting a wallet, signing a transaction, or reading the full repository.

## Target Reviewer

- community reviewer checking the public user flow;
- privacy reviewer checking data minimization;
- operator reviewing campaign gates;
- security reviewer checking RPC and failure states;
- translation reviewer checking EN, ES, and RU copy.

## Primary Action

Visit `/pilot/`, manually enter a test wallet address, run a read-only Sepolia `balanceOf` check, read the conditional eligibility explanation, then open a public feedback form.

## Success State

The reviewer sees a Live, Cached, Stale, Wrong Chain, or Unavailable data state; understands that the result is a testnet balance signal rather than an active benefit; and can submit non-sensitive feedback through a GitHub issue form.

## Failure States

| State | User-facing result | Metric |
| --- | --- | --- |
| Invalid address | Explain the required Ethereum address format. | `balanceCheckAttempts` only. |
| RPC unavailable | Show `Data temporarily unavailable`; do not display a fabricated zero. | `rpcFailures`. |
| Wrong chain | Explain expected Sepolia chain ID `11155111`. | `rpcFailures`. |
| Stale cache | Label the last successful result `Stale`. | `successfulChecks`. |
| Below threshold | Explain the test threshold without promising access. | `ineligibleResults`. |
| Meets threshold | Explain that manual review would still be required and the campaign is not live. | `eligibleResults`. |

## Campaign State

Current manifest state: `draft-not-live`; lifecycle stage: `draft`. No request window, inventory, allocation, hospitality service, or approved preview is active.

Lifecycle:

1. `draft`
2. `evidence-review`
3. `approved-testnet-preview`
4. `paused`
5. `closed`
6. `archived`

The transition to `approved-testnet-preview` is blocked unless every configured legal, privacy, security, operations, governance, campaign, inventory, reporting, staff, dispute, feedback, and transparency gate has reviewer evidence and approval metadata.

## Privacy Boundary

- No third-party analytics SDK.
- No cookies or persistent analytics identifier.
- No raw wallet address in metrics, logs, reports, or feedback prompts.
- In-browser counters exist only in memory and reset on reload.
- GitHub feedback must not request names, emails, booking data, private keys, seed phrases, or sensitive personal data.

## Non-Goals

- no hospitality campaign publication;
- no token distribution or transaction signing;
- no booking or guest-data integration;
- no mainnet or V2 promotion;
- no real-world benefit confirmation;
- no monetary, investment, price, or independent-audit claim.

## Measurable Outcomes

Only these aggregate counters are allowed:

- page sessions;
- balance-check attempts;
- successful checks;
- RPC failures;
- eligible/ineligible threshold result counts;
- language selected;
- feedback link clicks.

Comprehension is manually aggregated from public issue-form answers for Sepolia-only status, no sale, no mainnet, no active hotel benefit, independent audit not started, and V2 candidate-only status.

## Initial Acceptance Target

Before any approved testnet preview, the technical dry run should show:

- all browser and preview checks passing;
- no raw wallet persistence;
- RPC failure and stale-cache states covered;
- campaign transition gate blocked;
- zero public sample reported as zero, not estimated;
- feedback and comprehension fields ready for public review.

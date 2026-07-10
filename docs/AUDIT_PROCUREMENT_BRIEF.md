# V2 Independent Review Procurement Brief

Status: public request-for-review outline. No reviewer or audit firm is named or contracted by this document. An external independent audit has not started.

## Scope

- Two non-canonical V2 candidate contracts: `TikiDecoTokenV2.sol` and `TikiDecoVestingVaultV2.sol`.
- Approximately 435 Solidity source lines across the primary contracts.
- V2 deployment guardrails, role manifest assumptions, Hardhat tests, Foundry invariants and Slither baseline.
- Solidity `0.8.28`, EVM `paris`, optimizer enabled with 200 runs, OpenZeppelin Contracts `5.6.1`.

The exact freeze commit and files are machine-readable in `config/audit/v2-independent-review.json`.

## Expected Deliverables

- Scope confirmation and methodology.
- Findings with severity, affected code, impact, reproducible scenario and remediation guidance.
- Explicit review of the questions in `docs/AUDITOR_QUESTIONS.md`.
- Review of known issues and accepted static-analysis findings.
- Retest result for remediated findings.
- Final report suitable for publication, with unresolved or accepted risks visible.

## Disclosure And Remediation

Findings remain private during the agreed remediation window. Critical suspected fund-loss paths should be reported immediately through the security contact in `SECURITY.md`. Each accepted finding receives an ID, triage decision, regression test where applicable and response record.

## Retest And Publication Expectations

- Retest the exact remediation commit, not an uncommitted working tree.
- Identify findings that remain open, disputed or accepted.
- Publish a final report only after both parties verify scope, commit hashes and retest status.
- Maintainer materials must continue to distinguish internal review from the external report.

## Exclusions

V1 semantics, public-network deployment, mainnet, legal conclusions, market activity, hospitality operator claims, private keys and transaction execution are excluded unless a later signed scope explicitly adds them.

# TikiDeco Communication Playbook

Verification date: 2026-06-17

Purpose: keep public TikiDeco / TIDE communication consistent, verifiable, and careful. Use this playbook together with [`PROJECT_FACTS.md`](PROJECT_FACTS.md) and [`CLAIMS_MATRIX.md`](CLAIMS_MATRIX.md).

## Tone Of Voice

- Clear, calm, and specific.
- Hospitality-aware, but not promotional hype.
- Technical claims should link to repository files, Sepolia Etherscan, or the canonical manifest.
- Separate `Current`, `Planned`, and `Conceptual` every time a feature could be misunderstood.
- Prefer "researching", "prototype", "candidate", "possible", and "subject to review" over launch-style language.

## Approved Terminology

| Term | Use |
| --- | --- |
| Sepolia testnet prototype | Current deployed status. |
| No monetary value | Current token status. |
| Not offered for sale | Current availability status. |
| Publicly verifiable source code | Use with Sepolia Etherscan source links. |
| Fixed supply in the current deployed contract | Use for the V1 Sepolia token. |
| Owner Safe | Use for the Sepolia Safe that controls privileged V1 operations. |
| Candidate V2 | Use for OpenZeppelin V2 code until a manifest promotes it. |
| Conceptual hospitality use case | Use for loyalty/access ideas that are not live guest benefits. |
| Internal review | Use for repository review work; do not call it an audit. |

## Prohibited Terminology

Do not use these phrases in public TikiDeco material unless legal counsel approves a compliant structure and `PROJECT_FACTS.md` is updated with verified support:

- guaranteed profit
- passive income
- investment opportunity
- expected price growth
- risk-free
- guaranteed listing
- ownership share in a hotel
- guaranteed revenue share
- active hotel discount
- live membership benefit
- audited, unless an independent audit report exists
- partner, unless a public partner approval exists

## Current / Planned / Conceptual Labels

Use these labels consistently:

| Label | Meaning |
| --- | --- |
| Current | Verified today from repository files, canonical manifest, tests, or read-only on-chain data. |
| Planned | Described as a later work item, not live and not guaranteed. |
| Conceptual | A research direction or design idea that may never become a live feature. |

Example:

> Current: TIDE is deployed on Sepolia with verified source code.
>
> Planned: independent audit is a required step before production promotion.
>
> Conceptual: hospitality loyalty and access scenarios are research directions, not active guest benefits.

## Response Template: Security Questions

Use when asked "Is TikiDeco safe?" or "Has it been audited?"

```text
TikiDeco is a Sepolia testnet prototype. The repository includes tests, CI, an internal security review, Slither workflow, and verified Sepolia source code. It has not completed an independent smart-contract audit, so we do not describe it as audited or production-ready. Current security notes are public in SECURITY.md and SECURITY_REVIEW.md.
```

Add links:

- [`SECURITY.md`](../SECURITY.md)
- [`SECURITY_REVIEW.md`](../SECURITY_REVIEW.md)
- Sepolia token source: <https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code>

## Response Template: Token Price Questions

Use when asked "What is the price?" or "Can TIDE go up?"

```text
TIDE currently has no stated monetary value and is not offered for sale. It is a Sepolia testnet prototype, not a mainnet market asset. We do not provide price targets, appreciation claims, or trading guidance.
```

Do not discuss expected price movement.

## Response Template: Exchange-Listing Questions

Use when asked "When listing?" or "Which exchange?"

```text
There is no confirmed exchange listing. TIDE is currently a Sepolia testnet prototype with no sale and no stated monetary value. Any public listing claim would require verified confirmation and legal review before it appears in project materials.
```

Do not imply a listing is planned, negotiated, or guaranteed.

## Response Template: Partnership Questions

Use when asked "Who are the hotel partners?" or "Is this backed by a property?"

```text
No confirmed hotel partnership or completed property claim is currently supported by the public repository facts. TikiDeco is researching transparent loyalty and access infrastructure for a future hospitality concept. Concept imagery is labeled as visualization, not an existing property.
```

If a partnership later exists, update `PROJECT_FACTS.md` before changing public copy.

## Incident Communication Procedure

1. **Triage privately.** Capture report source, affected files/contracts, reproduction steps, and possible impact.
2. **Acknowledge receipt.** Tell the reporter the issue is being reviewed. Do not speculate publicly.
3. **Reproduce.** Create a minimal test or script where possible.
4. **Classify severity.** Use Critical, High, Medium, Low, or Informational.
5. **Mitigate.** Pause affected testnet functions if appropriate and controlled by Safe. Do not deploy new contracts without explicit approval.
6. **Document.** Update `SECURITY_REVIEW.md`, tests, and relevant docs.
7. **Publish carefully.** Release a transparency report after mitigation, with facts, affected scope, transaction links if any, and remaining risks.

Do not call a patch audited unless an independent audit report exists.

## Monthly Transparency Report Structure

Use this structure for `docs/reports/REPORT_YYYY_MM_DD_*.md`:

1. Report title and date.
2. Scope and status: Current / Planned / Conceptual.
3. Canonical deployment table: network, token, vault, owner Safe, treasury.
4. Contract and ownership changes since the last report.
5. Report hashes or on-chain publication transactions.
6. Test, CI, Slither, and audit status.
7. Treasury and vault balances if verified.
8. Documentation and communication changes.
9. Known limitations and remaining risks.
10. Next review items without launch promises.

Every report should state:

```text
TIDE is a Sepolia testnet prototype. It currently has no monetary value and is not offered for sale. This report is not a financial disclosure, securities offering, or promise of future utility.
```

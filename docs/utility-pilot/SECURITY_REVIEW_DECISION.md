# Security Review Decision

Status: security no-go evidence. This document records the current security-review boundary for the draft TIDE utility-pilot campaign and V2 audit-preparation track. It does not approve a live campaign, mainnet deployment, token sale, monetary-value claim, active guest benefit, V2 promotion, Safe transaction, or independent audit claim.

Last reviewed: 2026-06-28

Tracking issue: [#62](https://github.com/denterion/Token-TIkiDeco/issues/62)

Machine-readable gate: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json) -> `requiredBeforeLiveCampaign.securityReview`

## Decision

The security review gate remains:

| Field | Required state |
| --- | --- |
| Campaign status | `draft-not-live` |
| Security gate status | `not-approved` |
| Security approval status | `not-approved` |
| Independent audit | Not started |
| V2 status | Candidate only, not canonical |
| Mainnet deployment | Not approved |
| Live campaign | Not approved |
| Wallet transaction flow | Not present |
| Safe transaction broadcast | Not approved by this document |

The repository has reviewable security evidence for the read-only utility-pilot flow, but that evidence is not a live-campaign approval and is not an external audit result.

## Current Review Surface

Security review evidence currently covers:

- read-only Sepolia balance checks with allowlisted RPC endpoints;
- manual wallet-address input, not required wallet connection;
- no transaction signing, approvals, transfers, fees, booking confirmation, or purchase flow;
- fallback states for RPC failure, wrong chain, cached, stale, and unavailable data;
- pilot campaign manifest remains `draft-not-live`;
- public-claims checks for sale, value, mainnet, active-benefit, and audit-status boundaries;
- V2 candidate audit package tooling and known-issues register;
- Slither baseline discipline for V2 candidate review.

Security review evidence does not cover or approve:

- mainnet deployment;
- V2 promotion to canonical status;
- production booking integration;
- real-world guest utility;
- participant data collection;
- Safe transaction execution;
- a completed external audit.

## Required Evidence Before Any Future Approval

The security reviewer must verify all of the following before this gate can move away from `not-approved`:

- clean `npm ci` output or documented accepted dependency warnings;
- `npm run claims`, `npm run value`, `npm run pilot`, `npm run pilot:report`, and `npm run site` pass;
- `npm run pilot:live:blocked` confirms the campaign remains blocked until approvals exist;
- `npm run audit` and `npm run audit:handoff` pass for the current evidence commit before auditor handoff;
- `npm run slither:baseline` has no new untriaged V2 finding;
- known issues are current and not hidden from auditor handoff materials;
- V2 remains candidate-only and non-canonical;
- public site and pilot UI remain read-only and do not add wallet transaction signing;
- generated allocation artifacts remain Safe Transaction Builder drafts and never broadcast automatically;
- browser and eligibility tests cover RPC unavailable, wrong chain, stale cache, and no transaction/sale UI states.

## Current No-Go Rationale

- The first campaign manifest is still `draft-not-live`.
- Legal and operations approval evidence is still missing.
- Independent audit has not started.
- V2 is candidate code only and is not canonical.
- The security gate cannot approve live campaign operations while legal, privacy, operations, governance, and campaign-window controls remain blocked or not approved.

## Required Validation

The following commands should pass while preserving the blocked security state:

```bash
npm run claims
npm run value
npm run pilot:report
npm run pilot
npm run pilot:live:blocked
npm run site
npm run release
npm run audit
npm run audit:handoff
```

The following commands are expected to fail until approvals exist:

```bash
npm run pilot:live:check
npm run mainnet:check
```

Expected failure here is a safety control, not a release failure.

## References

- [`../../SECURITY_REVIEW.md`](../../SECURITY_REVIEW.md)
- [`../../KNOWN_ISSUES.md`](../../KNOWN_ISSUES.md)
- [`../EXTERNAL_AUDIT_READINESS.md`](../EXTERNAL_AUDIT_READINESS.md)
- [`../EXTERNAL_AUDIT_PACKAGE_INDEX.md`](../EXTERNAL_AUDIT_PACKAGE_INDEX.md)
- [`READ_ONLY_BALANCE_CHECK.md`](READ_ONLY_BALANCE_CHECK.md)
- [`PILOT_LIVE_BLOCKER_REGISTER.md`](PILOT_LIVE_BLOCKER_REGISTER.md)

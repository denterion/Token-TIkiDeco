# Governance Review Decision

Status: governance no-go evidence. This document records why the first TIDE utility-pilot campaign must remain `draft-not-live`. It does not approve a live campaign, mainnet deployment, token sale, monetary-value claim, active guest benefit, V2 promotion, Safe transaction, or independent audit claim.

Last reviewed: 2026-06-28

Tracking issue: [#60](https://github.com/denterion/Token-TIkiDeco/issues/60)

Machine-readable gate: [`../../config/utility-pilot/live-readiness-gates.json`](../../config/utility-pilot/live-readiness-gates.json) -> `requiredBeforeLiveCampaign.governanceReview`

## Decision

The governance review gate remains:

| Field | Required state |
| --- | --- |
| Campaign status | `draft-not-live` |
| Governance gate status | `not-approved` |
| Governance approval status | `not-approved` |
| Mainnet deployment | Not approved |
| Token sale | Not approved |
| Monetary-value claim | Not approved |
| V2 promotion | Not approved |
| Active guest utility | Not live |
| Independent audit | Not started |

The project can keep preparing review evidence, but it must not publish the campaign as live until every required gate has explicit evidence and approval.

## Current Rationale

- The live-campaign gate register still contains unresolved legal, privacy, security, and operations approvals.
- `docs/MAINNET_GO_NO_GO.md` keeps mainnet, sale, value-claim, V2-promotion, and active-utility gates blocked.
- `docs/VALUE_CLAIM_POLICY.md` keeps value-related public statements unapproved.
- `docs/GOVERNANCE_DECISION_REGISTER.md` records the current no-sale, no-mainnet, no-value, no financial-rights, and no independent-audit boundaries.
- The current campaign manifest is `draft-not-live`; it is not a public live utility campaign.

## Owner Checklist Before Any Future Approval

The governance reviewer must verify all of the following before this gate can move away from `not-approved`:

- legal review is complete for the specific Sepolia-only pilot proposal;
- privacy review confirms approved data boundaries;
- security review covers the read-only balance flow, allocation drafts, report workflow, and current audit-package state;
- operations review confirms staffing, support, dispute handling, inventory limits, and stop conditions;
- no public copy implies a sale, stated monetary value, mainnet deployment, active guest benefit, financial right, or independent audit completion;
- no workflow asks for private keys, seed phrases, approvals, transfers, fees, or booking confirmations;
- no Safe transaction is broadcast automatically by pilot tooling;
- the exact campaign status transition is reviewed in `config/utility-pilot/tide-community-preview-001.json`;
- `npm run pilot:live:check` passes only after every live gate is approved.

## Required Validation

The following commands should pass while preserving the blocked governance state:

```bash
npm run claims
npm run value
npm run pilot
npm run pilot:report
npm run pilot:live:blocked
npm run site
npm run release:check
```

The following commands are expected to fail until the relevant approvals exist:

```bash
npm run pilot:live:check
npm run mainnet:check
```

Expected failure here is a safety control, not a release failure.

## References

- [`../MAINNET_GO_NO_GO.md`](../MAINNET_GO_NO_GO.md)
- [`../VALUE_CLAIM_POLICY.md`](../VALUE_CLAIM_POLICY.md)
- [`../GOVERNANCE_DECISION_REGISTER.md`](../GOVERNANCE_DECISION_REGISTER.md)
- [`PILOT_LIVE_BLOCKER_REGISTER.md`](PILOT_LIVE_BLOCKER_REGISTER.md)
- [`PHASE2_LIVE_GATE_STATUS.md`](PHASE2_LIVE_GATE_STATUS.md)

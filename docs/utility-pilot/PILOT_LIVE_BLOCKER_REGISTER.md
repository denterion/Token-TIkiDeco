# Pilot Live Blocker Register

Status: blocked. This register tracks what remains before any future Sepolia-only utility pilot campaign can be marked live. It does not approve a live campaign, mainnet deployment, token sale, value statement, active guest benefit, or independent audit claim.

Machine-readable source: `config/utility-pilot/live-readiness-gates.json`.

Validation:

```bash
npm run pilot:live:blocked
```

`npm run pilot:live:check` is expected to fail while this register contains blocked, draft, not-approved, not-published, not-started, unknown, or missing items.

## Current Blockers

| Blocker | Owner | Current status | Approval status | Tracking issue | Evidence |
| --- | --- | --- | --- | --- | --- |
| Legal review | legal-reviewer | not-approved | not-approved | #56 | External counsel review not complete |
| Privacy review | privacy-reviewer | not-approved | not-approved | #56 | No private participant data process approved |
| Security review | security-reviewer | not-approved | not-approved | #62 | External audit not started; V2 remains candidate only |
| Operations review | operations-reviewer | not-approved | not-approved | #56 | Staff process, support, and dispute flow not approved |
| Governance review | governance-reviewer | not-approved | not-approved | #60 | Mainnet/value/utility approvals remain blocked |
| Campaign-specific rules | pilot-operator | draft | not-approved | #56 | `docs/utility-pilot/CAMPAIGN_RULES_REVIEW_PACKET.md` |
| Snapshot block or approved live-check window | pilot-operator | not-published | not-approved | #56 | `docs/utility-pilot/REQUEST_WINDOW_DRAFT.md` |
| Request window | pilot-operator | not-published | not-approved | #56 | `docs/utility-pilot/REQUEST_WINDOW_DRAFT.md` |
| Inventory limits | operations-reviewer | not-published | not-approved | #58 | `docs/utility-pilot/INVENTORY_LIMITS_DRAFT.md` |
| Allocation report path | reporting-reviewer | draft | not-approved | #58 | `docs/utility-pilot/ALLOCATION_REPORT_REVIEW_PACKET.md` |
| Staff process | operations-reviewer | draft | not-approved | #56 | `docs/utility-pilot/MANUAL_REVIEW_AND_DISPUTE_FLOW.md` |
| Dispute process | operations-reviewer | draft | not-approved | #56 | `docs/utility-pilot/MANUAL_REVIEW_AND_DISPUTE_FLOW.md` |
| Community feedback summary | community-maintainer | not-started | not-approved | #66 | `docs/COMMUNITY_PREVIEW_REPORT_TEMPLATE.md` |
| Transparency update | transparency-maintainer | draft | not-approved | #65 | `docs/COMMUNITY_PREVIEW_REPORT_TEMPLATE.md` |

## Non-Negotiable Boundaries

- TIDE remains a Sepolia testnet prototype.
- TIDE is not offered for sale.
- TIDE has no stated monetary value.
- TIDE is not deployed on mainnet.
- No active guest benefit is live.
- Independent audit has not started.
- The project must not collect private guest data for this draft campaign.
- No Safe transaction may be broadcast by this readiness register.

## Exit Criteria

To move from blocked to a future reviewable live-campaign proposal, every blocker above must have:

- a responsible reviewer;
- an owner recorded in `config/utility-pilot/live-readiness-gates.json`;
- an explicit `approvalStatus`;
- explicit approval evidence;
- published campaign rules;
- published snapshot block or approved live-check window;
- published request window;
- published inventory limits;
- allocation report path;
- staff and dispute process;
- privacy-safe transparency update plan.

Even if every Sepolia pilot blocker is later approved, mainnet, value, sale, V2 promotion, or independent audit claims remain separately blocked unless their own gates are explicitly approved.

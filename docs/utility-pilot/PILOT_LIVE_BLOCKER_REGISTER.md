# Pilot Live Blocker Register

Status: blocked. This register tracks what remains before any future Sepolia-only utility pilot campaign can be marked live. It does not approve a live campaign, mainnet deployment, token sale, value statement, active guest benefit, or independent audit claim.

Machine-readable source: `config/utility-pilot/live-readiness-gates.json`.

Validation:

```bash
npm run pilot:live:blocked
```

`npm run pilot:live:check` is expected to fail while this register contains blocked, draft, not-approved, not-published, not-started, unknown, or missing items.

## Current Blockers

| Blocker | Current status | Tracking issue | Evidence |
| --- | --- | --- | --- |
| Legal review | not-approved | #56 | External counsel review not complete |
| Privacy review | not-approved | #56 | No private participant data process approved |
| Security review | not-approved | #62 | External audit not started; V2 remains candidate only |
| Operations review | not-approved | #56 | Staff process, support, and dispute flow not approved |
| Governance review | not-approved | #60 | Mainnet/value/utility approvals remain blocked |
| Campaign-specific rules | draft | #56 | `config/utility-pilot/tide-community-preview-001.json` |
| Snapshot block or approved live-check window | not-published | #56 | Not available |
| Request window | not-published | #56 | Not available |
| Inventory limits | not-published | #58 | Not available |
| Allocation report path | draft | #58 | `docs/utility-pilot/ALLOCATION_REPORT_TEMPLATE.md` |
| Staff process | draft | #56 | `docs/utility-pilot/TIDE_LOYALTY_PILOT.md` |
| Dispute process | draft | #56 | `docs/utility-pilot/TIDE_LOYALTY_PILOT.md` |
| Community feedback summary | not-started | #66 | `docs/COMMUNITY_PREVIEW_REPORT_TEMPLATE.md` |
| Transparency update | draft | #65 | `docs/COMMUNITY_PREVIEW_REPORT_TEMPLATE.md` |

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
- explicit approval evidence;
- published campaign rules;
- published snapshot block or approved live-check window;
- published request window;
- published inventory limits;
- allocation report path;
- staff and dispute process;
- privacy-safe transparency update plan.

Even if every Sepolia pilot blocker is later approved, mainnet, value, sale, V2 promotion, or independent audit claims remain separately blocked unless their own gates are explicitly approved.

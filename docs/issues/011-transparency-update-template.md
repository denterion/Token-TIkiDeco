# Issue 011: Prepare transparency update template for v0.2 RC

Labels: `community-preview`, `documentation`

## Goal

Prepare a transparency update template for v0.2 release-candidate status.

## Current Boundary

Transparency updates must separate current, planned, conceptual, and not-claimable items.

## Acceptance Criteria

- Includes validation commands and expected blocked gates.
- Includes report hash workflow without broadcasting transactions.
- Includes current status of live-campaign blockers.
- Avoids private participant data.

## Commands To Run

```bash
npm run v02:rc
npm run pilot:live:blocked
npm run claims
```

## Files Likely Affected

- `docs/COMMUNITY_PREVIEW_REPORT_TEMPLATE.md`
- `docs/reports/`
- `docs/utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md`

## Prohibited Claims

No live-campaign, mainnet, sale, value, active-benefit, or independent-audit-complete claim.

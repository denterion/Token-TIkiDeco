# Issue 002: Review pilot campaign rules

Labels: `v0.2-utility-pilot`, `community-preview`, `operations-gate`

## Goal

Review `config/utility-pilot/tide-community-preview-001.json` and keep the campaign `draft-not-live`.

## Current Boundary

The campaign is not live. No request window, inventory, allocation report, or approval gate is complete.

## Acceptance Criteria

- Campaign status remains `draft-not-live`.
- Snapshot block or approved live-check window remains unpublished until approvals.
- Legal, privacy, security, operations, and governance statuses remain explicit.
- Request window, inventory, and report path remain blocked until approved.

## Commands To Run

```bash
npm run pilot:campaign
npm run pilot:live:blocked
npm run v02:rc
```

## Files Likely Affected

- `config/utility-pilot/tide-community-preview-001.json`
- `config/utility-pilot/live-readiness-gates.json`
- `docs/utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md`

## Prohibited Claims

No active campaign, mainnet, active guest benefit, guaranteed benefit, sale, or independent audit claim.

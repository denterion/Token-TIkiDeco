# Issue 012: Collect community preview feedback summary

Labels: `community-preview`, `documentation`

## Goal

Collect and summarize community preview feedback without creating sale, value, mainnet, active-benefit, or audit-completion claims.

## Current Boundary

Feedback is public, non-sensitive, and should not include private guest data or security vulnerability details.

## Acceptance Criteria

- Feedback received is grouped by site, docs, utility boundary, accessibility, translation, and security questions.
- Summary separates current, planned, conceptual, and not-claimable items.
- Risks raised and next actions are documented.
- Summary links follow-up issues or PRs.

## Commands To Run

```bash
npm run claims
npm run value
npm run site
```

## Files Likely Affected

- `docs/COMMUNITY_PREVIEW_REPORT_TEMPLATE.md`
- `docs/COMMUNITY_PREVIEW_LAUNCH_PLAN.md`
- `docs/FEEDBACK_GUIDE.md`

## Prohibited Claims

No sale, price, mainnet, active guest benefits, financial-return, property-rights, revenue-rights, or independent-audit-complete claims.

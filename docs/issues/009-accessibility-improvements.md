# Issue 009: Improve accessibility for utility pilot pages

Labels: `site`, `good-first-issue`

## Goal

Improve keyboard and screen-reader behavior for public utility and pilot pages.

## Current Boundary

Accessibility work must preserve all disclaimers and must not add wallet transaction flows.

## Acceptance Criteria

- Keyboard navigation covers the balance checker.
- Visible focus states are clear.
- Labels and semantic headings remain correct.
- Mobile layout has no horizontal overflow.

## Commands To Run

```bash
npm run site
npm run claims
```

## Files Likely Affected

- `site-v2/src/components/PilotEligibilityCard.tsx`
- `site-v2/src/styles/site.css`
- `scripts/check-site-v2.cjs`

## Prohibited Claims

No sale, price, mainnet, active-benefit, or audit-completion copy.

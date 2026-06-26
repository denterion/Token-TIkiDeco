# Issue 010: Review EN/ES/RU utility-pilot translations

Labels: `translation`, `community-preview`, `claims-check`

## Goal

Review translations so public copy is clear and cautious in English, Spanish, and Russian.

## Current Boundary

Every language must preserve the Sepolia-only, no-sale, no-value, no-mainnet, no-active-benefit, and independent-audit-not-started boundaries.

## Acceptance Criteria

- Translated text does not imply a sale or current monetary value.
- Translated text does not imply active hospitality benefits.
- Internal review is not translated as independent audit completion.
- Current, planned, conceptual, and not-claimable states remain distinct.

## Commands To Run

```bash
npm run site
npm run claims
npm run value
```

## Files Likely Affected

- `site-v2/src/data/i18n.ts`
- `docs/PROJECT_FACTS.md`
- `docs/CLAIMS_MATRIX.md`

## Prohibited Claims

No sale, price, mainnet, active-benefit, property-rights, revenue-rights, or audit-completion claim in any language.

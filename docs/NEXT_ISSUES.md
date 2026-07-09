# Next Ready-To-Open Issues

Status: maintainer planning list. These are not promises of launch, value, sale, mainnet deployment, active hospitality benefits, or independent audit completion.

## 1. Read-Only Sepolia Balance Checker

Labels: `site`, `utility-pilot`, `testing`

Goal: review the v0.2 read-only `balanceOf(wallet)` flow across desktop and mobile.

Acceptance criteria:
- Manual wallet input validates Ethereum addresses.
- RPC unavailable state does not display invented values.
- Live, cached, stale, wrong-chain, and unavailable states are understandable.
- No wallet connection, transaction signing, approval, transfer, fee, sale, price, or booking UI exists.

## 2. Pilot Campaign Rules

Labels: `utility-pilot`, `governance`

Goal: review `config/utility-pilot/tide-community-preview-001.json` and confirm it stays `draft-not-live`.

Acceptance criteria:
- Snapshot block or approved live-check window remains unpublished until approvals.
- Legal, privacy, security, operations, and governance statuses remain explicit.
- Request window, inventory, and report path are blocked until approved.

## 3. Testnet Allocation Policy

Labels: `utility-pilot`, `documentation`

Goal: review Sepolia-only allocation policy for clarity and abuse controls.

Acceptance criteria:
- Per-wallet cap and campaign cap are documented.
- Duplicate and invalid addresses are rejected.
- Manual review and anti-spam rules are clear.

## 4. Allocation Report Template

Labels: `utility-pilot`, `reports`

Goal: make the post-campaign allocation report easy to fill without private participant data.

Acceptance criteria:
- Includes campaign ID, totals, status, SHA-256 hash, and no-private-data statement.
- Separates request totals from any allocation outcome.

## 5. Frontend Eligibility Tests

Labels: `site`, `testing`

Goal: expand deterministic tests for the eligibility card and read-only balance reader.

Acceptance criteria:
- Invalid address, zero balance, sufficient mocked balance, wrong chain, unavailable RPC, stale cache, and forbidden-copy checks pass.

## 6. Mainnet Gate Script

Labels: `release`, `governance`

Goal: keep `npm run mainnet` failing until all mainnet/value/utility gates are approved.

Acceptance criteria:
- Fails on not-approved, requires-review, blocked, draft, unknown, or missing gate states.
- Documents expected failure in release docs.

## 7. Value Claim Checker

Labels: `communications`, `release`

Goal: keep unsupported value, sale, mainnet, active-benefit, and audit claims out of public surfaces.

Acceptance criteria:
- `npm run value` passes on policy/prohibition contexts.
- Unsupported public claims fail with file and line output.

## 8. Audit Package Command

Labels: `audit-readiness`, `release`

Goal: keep V2 external-audit package generation reproducible.

Acceptance criteria:
- Collects contracts, ABI, bytecode, tests, Foundry artifacts, Slither baseline, coverage, audit scope, known issues, freeze doc, and checksums.
- Fails if V2 is described as canonical or independent audit completion is claimed.

## 9. Accessibility Improvements

Labels: `site`, `accessibility`

Goal: improve keyboard, contrast, reduced-motion, and mobile readability.

Acceptance criteria:
- All interactive controls have visible focus states.
- No horizontal overflow on mobile.
- 3D scene fallback remains readable.

## 10. Translation Review

Labels: `translation`, `documentation`

Goal: review EN/ES/RU public-site and FAQ copy for consistency.

Acceptance criteria:
- No translated copy implies sale, value, mainnet, active benefit, completed property, or independent audit.

## 11. Transparency Update Template

Labels: `reports`, `communications`

Goal: create a monthly transparency update structure for community preview.

Acceptance criteria:
- Separates current, planned, conceptual, not-claimable, risks, and next actions.

## 12. Community Feedback Summary

Labels: `community-preview`, `communications`

Goal: summarize preview feedback without turning requests into commitments.

Acceptance criteria:
- Feedback is grouped by site, docs, utility pilot, audit readiness, and claims.
- Summary states that no sale, no value, no mainnet, no active benefit, and no independent audit claims are made.

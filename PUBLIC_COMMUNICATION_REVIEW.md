# TikiDeco Public Communication Review

Review date: 2026-06-17

Scope: README, public site copy, FAQ drafts, claims matrix, public material drafts, and release note draft.

This document is a communication review. It is not a legal opinion, securities analysis, regulatory approval, or compliance certification.

## Summary

The public communication package now separates verified current facts from planned and conceptual items. Public materials repeat the required boundary that TikiDeco / TIDE is a Sepolia prototype and that TIDE is not offered for sale.

## Dangerous Or Ambiguous Claims Found

| Claim or wording | Location | Risk | Fix |
| --- | --- | --- | --- |
| Future hospitality phrasing could sound like an implied product commitment. | `site/index.html` hospitality and use-case sections. | Readers could interpret research directions as active or committed guest benefits. | Reframed sections as `Conceptual`; changed wording to research and campaign concepts. |
| Future hotel perks allocation label could sound like a live benefit. | `site/index.html` allocation section. | Could imply active hotel perks. | Changed site label to `Conceptual hospitality perks`. |
| V2 language could sound like promoted production code. | `site/index.html`, README. | Could confuse candidate code with active deployment. | Labeled V2 as planned review / candidate code only. |
| README structure buried risk and control information below broader project narrative. | `README.md`. | Readers could miss what works, what does not exist, and who controls privileged operations. | Rebuilt README around current deployment, working features, non-existent items, verification, controls, limitations, tests, reports, and disclosure. |
| Russian claims matrix text previously had encoding issues. | `docs/CLAIMS_MATRIX.md`. | Public source-of-truth document looked unreliable. | Replaced with clean Russian positioning text. |

## Claims Requiring Legal Review Before Public Use

- Any token sale, sale timing, price, market, exchange listing, or trading-related claim.
- Any claim that TIDE gives hotel ownership, equity, debt, revenue rights, dividends, return participation, or financial returns.
- Any claim that TIDE provides active discounts, memberships, booking rights, guest benefits, or assured access.
- Any claim that TikiDeco has confirmed hotel partners, permits, customers, bookings, or operating hospitality services.
- Any property-backed or real-estate-backed framing.
- Any statement describing the project as audited before an independent audit report exists.

## Facts Still Not Confirmed

| Fact | Status |
| --- | --- |
| Mainnet deployment | Not confirmed; current canonical deployment is Sepolia. |
| Independent smart-contract audit | Not started in current project facts. |
| Active hospitality services | Not confirmed. |
| Confirmed hotel partnership | Not confirmed. |
| Completed property | Not confirmed. |
| Token monetary value or listing | Not confirmed; public copy states no current monetary value and no sale. |
| Live guest utility | Not confirmed; use cases remain conceptual or planned. |

## Materials Added Or Updated

| File | Purpose |
| --- | --- |
| `docs/PUBLIC_MATERIALS.md` | GitHub About description, topics, X post, LinkedIn post, Telegram message, media kit copy, and links. |
| `docs/FAQ_EN.md` | English FAQ with Sepolia and no-sale boundaries. |
| `docs/FAQ_RU.md` | Russian FAQ with Sepolia and no-sale boundaries. |
| `docs/releases/v0.1.0-sepolia.md` | Draft release notes for `v0.1.0-sepolia`. |
| `docs/COMMUNICATION_PLAYBOOK.md` | Templates and communication operating rules. |
| `README.md` | Public project overview rebuilt around verifiable facts and limitations. |
| `site/index.html` | Public site copy separates current, planned, and conceptual material. |

## Remaining Communication Controls

- Before publication, compare each new claim against `docs/PROJECT_FACTS.md`.
- Keep concept imagery labeled as visualization, not a completed property.
- Keep release notes as draft until `release date` and `source commit` placeholders are filled.
- Do not create GitHub Releases, token sale pages, or listing announcements without separate approval and review.

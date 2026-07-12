# Contributor Task Board

Source: [`../operations/github/issue-actions.json`](../operations/github/issue-actions.json). This board contains only public, reproducible work. It does not authorize mainnet, token economics, deployment, private infrastructure, or active hospitality functionality.

## Beginner Tasks

| Issue | Outcome | Local checks |
| --- | --- | --- |
| [#127](https://github.com/denterion/Token-TIkiDeco/issues/127) | Add deterministic landmark and heading hierarchy checks across public routes. | `npm run site`; `npm run site:browser`; `npm run claims`; `npm run value` |
| [#119](https://github.com/denterion/Token-TIkiDeco/issues/119) | Enforce complete generated route, sitemap and canonical URL parity with negative fixtures. | `npm run site`; `npm run site:browser` |

## Intermediate Tasks

| Issue | Outcome | Local checks |
| --- | --- | --- |
| [#120](https://github.com/denterion/Token-TIkiDeco/issues/120) | Extend the existing fake-data baseline with duplicate-wallet, inventory-exhaustion, repeated-decision, post-close and audit-log invariant tests. | `npm run operator-pilot:sandbox`; `npm run operator-pilot:check`; `npm run site:typecheck`; `npm run claims`; `npm run value` |

## Security-Review Tasks

- Review the exact frozen V2 candidate through [`community-review/COMMUNITY_REVIEW_GUIDE.md`](community-review/COMMUNITY_REVIEW_GUIDE.md).
- Public-safe findings use the Community Review issue form. Sensitive unresolved Critical or High details use private vulnerability reporting.
- Finding remediation follows [`community-review/FINDING_TRIAGE_PLAYBOOK.md`](community-review/FINDING_TRIAGE_PLAYBOOK.md).
- #121 is not contributor-ready: reviewer selection and procurement require maintainer and external decisions.

## Externally Blocked Tasks

| Issue | Blocker |
| --- | --- |
| #60 | 29 unapproved production, legal, audit, operator, governance and value states. |
| #66 | No real external feedback submission exists to aggregate. |
| #121 | No contracted qualified independent reviewer or handoff evidence exists. |

These are not coding tasks and must not carry `ready-for-contributor`.

## Maintainer-Only Tasks

- Review the evidence comments before manually closing #55, #56, #57, #58, #59, #61, #62, #63 and #65.
- Decide whether #64 should be respecified for future translations or archived as superseded. Do not call it completed under its original EN/ES/RU criteria.
- Maintain milestone ownership, priority labels, private disclosure routing and external-review procurement.
- Keep mainnet, sale, value and active-utility decisions outside the contributor queue.

## Contributor Rules

1. Work from a current branch and do not add secrets or private participant data.
2. Use deterministic fixtures instead of live RPC or private services where the issue permits.
3. Run every command listed in the issue before opening a PR.
4. Do not change token economics, canonical V1 facts, V2 promotion status or production gates.
5. Use `SECURITY.md` instead of a public issue for potentially exploitable unresolved Critical or High findings.

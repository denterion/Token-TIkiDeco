# Dependency PR Triage - 2026-06-24

Status: internal dependency and CI-maintenance review.

This triage does not change deployed V1 contracts, does not promote V2 to canonical status, and does not publish or broadcast transactions.

## Open PR Review

| PR | Update | Decision |
| --- | --- | --- |
| #7 | `dotenv` `16.6.1` -> `17.4.2` | Superseded by batch branch after local checks. |
| #8 | `chai` `5.3.3` -> `6.2.2` | Superseded by batch branch after local checks. |
| #9 | `mocha` `11.7.5` -> `11.7.6` | Superseded by batch branch after local checks. |
| #32 | `gitleaks/gitleaks-action` pinned SHA update | Superseded by batch branch with full SHA pin preserved. |
| #33 | `actions/setup-python` `5.6.0` -> `6.3.0` | Superseded by batch branch with full SHA pin and version comment. |
| #34 | `github/codeql-action` pinned SHA update | Superseded by batch branch with full SHA pin and version comment. |
| #35 | `actions/deploy-pages` `4.0.5` -> `5.0.0` | Superseded by batch branch with full SHA pin and version comment. |
| #36 | `actions/setup-node` `4.4.0` -> `6.4.0` | Superseded by batch branch with full SHA pin and version comment. |
| #37 | `typescript` `5.9.3` -> `6.0.3` | Superseded by batch branch after local checks. |
| #38 | `@react-three/fiber` `8.17.10` -> `9.6.1` | Blocked. This major requires React `>=19 <19.3`, while the site currently uses React `18.3.1`. Defer to a dedicated React 19 / R3F 9 migration with visual regression testing. |

## Checks Run On Batch Branch

```text
npm ci
npm run compile
npm test
npm run audit
npm run workflow:pins
npm run claims:check
npm run site:check
npm run release
npm run slither:baseline
npm run manifest:source
```

Observed result: all listed checks passed. `npm ci` still reports the known maintenance warning for transitive `glob@10.5.0` and the known install-script review warning for `esbuild@0.28.1`; `npm audit` reports zero vulnerabilities.

## Follow-Up

- Close or supersede #7, #8, #9, #32, #33, #34, #35, #36, and #37 after the batch PR is merged.
- Close #38 or keep it blocked until a planned React 19 migration is scoped.
- Keep `@react-three/fiber` semver-major updates ignored in Dependabot until the React 19 migration is ready.

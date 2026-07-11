# Community Review Finding Triage Playbook

Status: fail-closed process for the frozen, non-canonical V2 review candidate. Community peer review is not a formal independent smart-contract audit. V1 remains the canonical Sepolia legacy deployment.

Source registry: [`../../config/community-review/findings.json`](../../config/community-review/findings.json). Finding shape: [`../../config/community-review/finding.schema.json`](../../config/community-review/finding.schema.json).

The registry starts empty because no external community finding has been validated. The existing `KI-*` entries in [`KNOWN_ISSUES.md`](../../KNOWN_ISSUES.md) remain internal review observations and are not relabeled as community findings.

## Severity

| Severity | Triage meaning | Deployment effect |
| --- | --- | --- |
| Critical | Direct or near-direct loss of funds, supply integrity failure, privileged takeover, or irreversible severe failure. | Deployment blocked. Risk cannot be accepted for deployment. |
| High | Material custody, authorization, accounting, or denial-of-service impact with a practical failure path. | Deployment blocked. Risk cannot be accepted for deployment. |
| Medium | Meaningful security, accounting, availability, or operational weakness that does not meet High impact. | Fix, reject with evidence, or obtain documented risk acceptance before deployment review. |
| Low | Limited-impact hardening, edge case, or defense-in-depth issue. | Track remediation or documented risk acceptance. |
| Informational | Non-exploitable documentation, maintainability, or tooling observation. | Track when useful; never present it as a security conclusion. |

`Unassigned` is allowed only while a submission is being acknowledged. A validated finding must have an assigned severity.

## Validation Requirements

A maintainer must:

1. Confirm the finding references the exact candidate commit.
2. Confirm the affected file and assumptions are in scope.
3. Reproduce the behavior or document why reproduction is unsafe or unavailable.
4. Check whether an existing community finding or `KNOWN_ISSUES.md` item already covers it.
5. Assign severity from demonstrated impact and likelihood, not reporter wording.
6. Preserve sensitive details in private reporting until coordinated disclosure is safe.

Validation is evidence, not agreement. A finding may be rejected only with a written rationale and reproducible counter-evidence where practical.

## Duplicate And Invalid Submissions

- `duplicate`: link the canonical finding in `dispositionRationale`; do not inflate aggregate validated counts.
- `invalid`: record the failed assumption or out-of-scope reason. Do not delete the record merely because it was rejected.
- `rejected`: use when the described behavior is reproducible but does not create the claimed issue, with rationale.
- Sensitive duplicates remain private while the canonical finding remains unresolved.

## Accepted Risk

- Critical and High findings cannot be accepted for deployment.
- Medium, Low, or Informational findings may use `accepted-risk` only with approver, timestamp, rationale, and deployment impact.
- A maintainer cannot convert missing evidence into accepted risk.
- Risk acceptance applies only to the named candidate and must be reconsidered for a new candidate or changed assumptions.

## Remediation And Retest

Target dates are planning placeholders, not promises. Record them in the linked issue or private reference rather than the machine-readable public aggregate.

Every remediation PR must include the finding ID, root cause, changed files, compatibility impact, regression test, disclosure impact, and reviewer-retest state. A code-changing fix is not resolved until its regression test passes. Critical, High, and Medium fixes additionally require linked reviewer retest evidence with `retestStatus: passed`.

If `contracts/TikiDecoTokenV2.sol`, `contracts/TikiDecoVestingVaultV2.sol`, or the scoped V2 deployment script changes, the current candidate becomes invalid. A new review candidate version, source commit, package checksum, evidence package, and reviewer notice are required before checks may pass again. The superseded version/commit/checksum must move to `candidateHistory`; existing findings keep their original affected candidate commit.

## Disclosure

- Public-safe Medium, Low, Informational, test, and reproducibility reports may use GitHub Issues.
- Potentially exploitable unresolved Critical or High details must use [`SECURITY.md`](../../SECURITY.md) and private vulnerability reporting.
- A public registry entry for a sensitive unresolved finding contains only a safe summary and `[REDACTED: private report]` placeholders.
- Public disclosure follows validation, remediation, regression testing, reviewer retest where required, and a disclosure-safety decision.
- Aggregate counts never expose private reproduction steps, participant data, secrets, or signer information.

## Commands

```bash
npm run findings:check
npm run findings:summary
npm run findings:release-impact
```

`findings:check` is the blocking integrity gate. `findings:summary` is public-safe aggregate output. `findings:release-impact` reports candidate invalidation and deployment blockers; it never approves deployment.

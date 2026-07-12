# First Community Review Session

Status: reusable agenda only. No reviewer, meeting or completed review is represented. Community peer review is not a formal independent smart-contract audit.

Candidate: `cdc9e7e27e66f204c50d59e45ccf970ad20290d6`  
Frozen V2 source: `9099fdb87a6be715b1d7fd4fafa6fade0b12b61c`  
Package SHA-256: `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`

## Before The Session

- Reviewer checks out the exact candidate commit.
- Maintainer confirms the checksum and scope have not changed.
- Both parties read `SECURITY.md` and avoid secrets or private participant data.
- Conflicts, credit preferences and recording expectations are discussed before technical work.

## 60-Minute Agenda

| Time | Topic | Evidence or decision |
| ---: | --- | --- |
| 0-5 min | Candidate verification | Confirm candidate commit, frozen source commit and package SHA-256. Stop on mismatch. |
| 5-10 min | Scope walkthrough | Two V2 contracts, V2 deployment guard, tests, known issues and explicit exclusions. |
| 10-18 min | Known issues | Review `KI-01` through `KI-09`, owner decisions and unresolved reviewer questions. |
| 18-28 min | Role architecture | Default admin transfer delay, pauser, reporter, vesting admin, treasury and non-deployed role template. |
| 28-40 min | Vesting logic | Prefunding, liabilities, release, revoke, refunds, pause interaction and accounting invariants. |
| 40-48 min | Finding submission | Public-safe issue form versus private vulnerability reporting; required reproduction evidence. |
| 48-53 min | Disclosure boundaries | Do not publish unresolved exploitable details or submit secrets and private data. |
| 53-60 min | Next steps | Record questions, optional focus area, contribution reference and whether credit consent is granted. |

## Verification Commands

```bash
git rev-parse HEAD
npm ci
npm run compile
npm test
npm run foundry:test
npm run slither
npm run review:candidate:check
```

Expected identity: `git rev-parse HEAD` returns `cdc9e7e27e66f204c50d59e45ccf970ad20290d6`, and the candidate definition records package SHA-256 `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`.

## Reporting Boundaries

Use public issues only for non-sensitive findings and reproducibility questions. Potentially exploitable unresolved Critical or High details use [GitHub private vulnerability reporting](https://github.com/denterion/Token-TIkiDeco/security/advisories/new) under [`SECURITY.md`](../../SECURITY.md).

The session ends without a completion claim. Follow-up review, remediation, retest and acknowledgement each require separate evidence.

# Community Review Finding Lifecycle

This process applies to findings against candidate commit `cdc9e7e27e66f204c50d59e45ccf970ad20290d6`. It is a community peer-review workflow, not a formal independent smart-contract audit.

```text
submitted
  -> acknowledged
  -> validated or rejected
  -> severity assigned
  -> remediation planned
  -> fix PR
  -> regression test
  -> reviewer retest
  -> resolved
  -> publicly disclosed when safe
```

## State Rules

| State | Required evidence |
| --- | --- |
| Submitted | Candidate commit, affected files, description, impact, and reproduction. |
| Acknowledged | Maintainer response and tracking identifier. |
| Validated | Reproduction or technical rationale. Rejected items keep a written rationale. |
| Severity assigned | Critical, High, Medium, Low, or Informational using the project taxonomy. |
| Remediation planned | Owner, intended change, test requirement, and scope impact. |
| Fix PR | Narrow remediation branch linked to the finding. Frozen V2 files are not changed inside the community-review process PR. |
| Regression test | A test that fails before the remediation and passes after it. |
| Reviewer retest | Original reviewer or another qualified reviewer records pass/fail against an exact commit. |
| Resolved | Maintainer records disposition and remaining risk. |
| Public disclosure | Coordinated only after exploit risk is addressed and disclosure is safe. |

## Sensitive Findings

Potentially exploitable unresolved Critical or High issues must not be opened publicly. Use [GitHub private vulnerability reporting](https://github.com/denterion/Token-TIkiDeco/security/advisories/new) and follow [`SECURITY.md`](../../SECURITY.md).

Public aggregate counts must not reveal private vulnerability details, reporter identity without consent, private keys, seed phrases, participant data, guest data, or remediation information that enables exploitation before a fix is available.

## Freeze Impact

A validated finding may require a later remediation PR. Any V2 contract or deployment-script change invalidates the current freeze and requires a new candidate commit, package checksum, regression evidence, and review status. It does not silently modify this candidate.

## Finding Remediation

| Field | Evidence |
| --- | --- |
| Finding ID | `CR-____` |
| Candidate commit | `________________________________________` |
| Linked public issue or private reference | |
| Root cause | |
| Changed files | |
| Regression test | |
| Compatibility impact | |
| Reviewer retest status | `not-requested / pending / passed / failed / not-applicable` |
| Disclosure impact | `private / coordinated / public / not-applicable` |
| New candidate required | `yes / no` |

## Safety Checks

- [ ] The finding is validated; this PR does not invent or silently resolve a finding.
- [ ] No deployed V1 semantics or canonical V1 address changed.
- [ ] Critical or High unresolved exploit details are not publicly disclosed.
- [ ] A code change includes a regression test.
- [ ] A V2 contract or scoped deployment-script change invalidates the old candidate and records a new candidate source commit and package checksum.
- [ ] Community review is not described as a formal independent smart-contract audit.
- [ ] No deployment or transaction is included.

## Commands

```text
npm run findings:check
npm run findings:release-impact
npm test
npm run foundry:test
npm run slither
npm run review:candidate:check
```

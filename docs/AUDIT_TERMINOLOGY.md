# Audit Terminology

These terms are intentionally separate and must not be used interchangeably.

| Term | Meaning | Current status |
| --- | --- | --- |
| npm dependency advisory scan | `npm audit` review of known advisories in JavaScript dependencies. It is not smart-contract review. | Automated gate available. |
| Static analysis | Slither analysis compared with the versioned V2 baseline. It can identify patterns; it does not establish safety. | Automated internal evidence available. |
| Internal security review | Maintainer-authored threat models, tests, findings and review decisions. | Available and still evolving. |
| Independent technical review | Third-party reproduction and technical assessment of the frozen candidate. It is narrower than a formal audit unless the engagement contract says otherwise. | Not started. |
| Formal independent smart-contract audit | Contracted audit with an agreed scope, severity model, draft report, remediation cycle, retest and publishable final report. | Not started. |

These statuses are not interchangeable. Public text must not use an unqualified phrase such as `audit passed`. Passing the npm dependency advisory scan, static analysis, internal security review or independent technical review does not establish completion of a formal independent smart-contract audit.

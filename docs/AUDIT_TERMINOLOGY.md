# Audit Terminology

These terms are intentionally separate and must not be used interchangeably.

| Term | Meaning | Current status |
| --- | --- | --- |
| Dependency audit / npm advisory scan | `npm audit` review of known advisories in JavaScript dependencies. It is not smart-contract review. | Automated gate available. |
| Static analysis | Slither analysis compared with the versioned V2 baseline. It can identify patterns; it does not establish safety. | Automated internal evidence available. |
| Internal review | Maintainer-authored threat models, tests, findings and review decisions. | Available and still evolving. |
| External independent audit | Review performed by an independent contracted reviewer, followed by a final report and any agreed retest. | Not started. |

Passing dependency, static-analysis or internal-review gates must never be described as completing an external independent audit.

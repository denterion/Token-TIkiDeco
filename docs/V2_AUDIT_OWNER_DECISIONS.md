# V2 Audit Owner Decisions

Status: owner-decision register for V2 candidate audit preparation. This is not an independent audit report, not V2 promotion, and not approval for mainnet or live utility.

Purpose: make every known V2 question reviewable before external auditor handoff. If a decision is not finalized, it must remain an explicit auditor question or blocker.

## Decision Status Key

- `accepted-for-audit`: current behavior is intentionally kept for external review.
- `needs-owner-decision`: owner/release-manager decision is still required.
- `ask-auditor`: keep the issue in audit scope and ask the auditor to review tradeoffs.
- `blocked-before-deployment`: do not use a public V2 candidate deployment until resolved.

## Owner Decision Table

| ID | Topic | Current decision | Required evidence before auditor handoff | Test or check |
| --- | --- | --- | --- | --- |
| KI-01 | V2 token metadata as public claims surface | `needs-owner-decision` | Exact project name, business entity, jurisdiction, and project URI approved in release notes and role manifest. | Constructor metadata tests plus deployment config review. |
| KI-02 | V2 public deploy script role configuration | `blocked-before-deployment` | Role manifest reviewed against expected admin, pauser, reporter, vesting admin, and treasury addresses. | Deployment-script negative tests and role-manifest checklist. |
| KI-03 | V2 vault has no on-chain pause role | `ask-auditor` | Owner decision confirming token-pause-only incident model or a scoped change request for vault-local pause. | Pause/release tests and auditor response. |
| KI-04 | Report supersede graph policy | `accepted-for-audit` | Off-chain correction policy requiring same category or explicit correction reason in repository report. | Report supersede tests and documentation check. |
| KI-05 | Public site RPC availability | `accepted-for-audit` | Dashboard labels Live/Cached/Stale/Unavailable and links to canonical docs. | `npm run site` and `npm run site:browser`. |
| KI-06 | Slither baseline model | `accepted-for-audit` | `security/slither-baseline-v2.json` contains accepted findings with explanations; `npm run slither` fails on new untriaged V2 findings. | `npm run slither`. |
| KI-07 | Bytecode size after coverage artifacts | `accepted-for-audit` | Release/runbook order requires clean compile before bytecode evidence. | `npm run lint` and release package check. |
| KI-08 | Dependency maintenance warnings | `needs-owner-decision` | Dependency warnings accepted, removed, or tracked with issue references before audit package freeze. | `npm ci` and `npm run audit`. |
| KI-09 | Release package local Foundry path and generated site output | `accepted-for-audit` | Package generated from clean tree and current commit; generated site output remains deterministic. | `npm run audit`, `npm run audit:handoff`, release package reproduction. |

## Required Owner Decisions Before Public V2 Candidate Deployment

- [ ] Approve neutral V2 metadata strings.
- [ ] Approve the V2 role manifest.
- [ ] Decide whether token-pause-only is sufficient for vesting incident response.
- [ ] Accept or remediate dependency maintenance warnings.
- [ ] Confirm no deployer retains unintended privileged roles.
- [ ] Confirm the deployment is explicitly non-canonical.
- [ ] Confirm public docs do not describe V2 as live, canonical, mainnet-ready, or independently audited.

## Auditor Questions To Keep In Scope

- Is `AccessControlDefaultAdminRules` configured with an appropriate admin-transfer delay?
- Is role separation sufficient for admin, pauser, reporter, vesting admin, and treasury?
- Should the vesting vault have a vault-local pause role?
- Are treasury-transfer and revoke flows safe under compromised-role scenarios?
- Are report metadata bounds and supersede semantics sufficient?
- Are deployment-script fail-closed checks enough for public networks?
- Are accepted Slither findings correctly classified?
- Are Foundry invariants covering the main accounting properties?

## Handoff Rule

Do not send the V2 audit package as final evidence until:

```bash
npm run audit
npm run audit:handoff
npm run slither
npm test
npm run foundry:test
npm run foundry:coverage
```

have been run against the intended evidence commit, and every `needs-owner-decision` or `blocked-before-deployment` item above has either a decision or an explicit auditor question.

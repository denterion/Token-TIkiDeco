# V2 Audit Owner Decisions

Status: owner-decision register for V2 candidate audit preparation. This is not an independent audit report, not V2 promotion, not mainnet approval, not a sale, and not a value statement.

Purpose: make every known V2 review item explicit before external auditor handoff. Do not hide unresolved issues. If an owner decision is not final, it is marked as an explicit auditor question.

Source finding register: [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md)

## Decision Status Key

- `accepted-for-audit`: current behavior is intentionally kept for external review.
- `planned-remediation-before-deployment`: acceptable for audit handoff, but must be resolved before any public V2 candidate deployment proposal.
- `ask-auditor`: keep the issue in audit scope and ask the auditor to review tradeoffs.
- `blocked-before-deployment`: do not use a public V2 candidate deployment until resolved.

## Owner Decision Register

| ID | Decision | Rationale | Accepted risk or planned remediation | Auditor should review | Linked test or missing test | Linked issue / PR |
| --- | --- | --- | --- | --- | --- | --- |
| KI-01: V2 token metadata public claims surface | `planned-remediation-before-deployment` | Metadata validation is bounded and neutral, but final strings are operational/legal facts, not Solidity-only facts. | Before any public V2 candidate deployment, release manager must approve exact `projectName`, `businessEntity`, `projectJurisdiction`, and `projectURI` in the deployment config and role manifest. Until then, V2 package may be reviewed but not deployed publicly. | Yes, review whether bounds and updateability are sufficient. | Existing: `test/TikiDecoTokenV2.js` metadata validation. Missing before deployment: exact reviewed metadata fixture test. | Issue #62 audit-readiness; future deployment PR required. |
| KI-02: V2 public deploy script role configuration | `blocked-before-deployment` | Public-network role assignment is safety-critical and must fail closed. The deployer must not silently become admin or treasury. | No public V2 deployment until role manifest review confirms default admin, pauser, reporter, vesting admin, treasury, Safe threshold, deployer role removal, zero-address checks, and explicit non-canonical status. | Yes, focus on compromised deployer and wrong-role scenarios. | Existing: `test/V2DeploymentConfig.js` negative config tests and deploy script assertions. Missing before deployment: reviewed role manifest artifact for the intended network. | Issue #62; `docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md`. |
| KI-03: V2 vault has no on-chain pause role | `ask-auditor` | Current freeze uses token-pause-only as the incident circuit breaker. This keeps one global transfer stop, but it can delay beneficiary releases during token pause. | Accepted for audit package only. Auditor question: should V2 add a vault-local pause role before any production or mainnet decision? | Yes, explicit audit question. | Existing: `test/TikiDecoVestingVaultV2.js` release while token paused. Missing if changed: vault-local pause tests for release, revoke, and treasury transfer. | Issue #62; `docs/V2_AUDIT_TARGET_FREEZE.md#fd-02-vault-pause-model`. |
| KI-04: Report supersede graph policy | `accepted-for-audit` | On-chain validation requires existing report ID and emits a supersede event. Semantic correction reason can remain off-chain for candidate scope. | Accepted risk: reporter can publish unrelated corrections if governance/report policy is weak. Planned control: repository report policy must require correction context. | Yes, ask whether same-category or correction-reason hash should become on-chain. | Existing: `test/TikiDecoTokenV2.js` report and supersede event tests. Missing: off-chain report-policy lint for correction reason. | Issue #62; future reporting-policy PR if auditor recommends on-chain change. |
| KI-05: Public site RPC availability | `accepted-for-audit` | Site is read-only and must show unavailable/cached/stale states instead of invented values. This is mostly frontend trust risk, not V2 contract risk. | Accepted risk: public RPC outage can reduce dashboard usefulness. Planned control: keep Etherscan/source links prominent and avoid zero fallback data. | Optional, not primary Solidity scope. | Existing: `site-v2/tests/site-regression.spec.ts` RPC unavailable and mocked balance tests; `npm run site`. | Issue #66 / site feedback issues. |
| KI-06: Slither baseline model | `accepted-for-audit` | Known V2 Slither findings are versioned and explained. New untriaged V2 findings should fail the gate. | Accepted risk: accepted findings remain visible, not hidden. Planned control: `npm run slither` and `npm run slither:baseline` before handoff. | Yes, review accepted classifications. | Existing: `security/slither-baseline-v2.json`; `scripts/check-slither-baseline.cjs`; `npm run slither`. | Issue #62. |
| KI-07: Bytecode size after coverage artifacts | `accepted-for-audit` | Coverage can influence artifacts; release evidence should run clean compile before bytecode. | Accepted operational risk with runbook control. Planned control: fresh-checkout proof runs compile before bytecode and package generation. | Optional, release-process review. | Existing: `npm run lint`; `scripts/check-bytecode-size.cjs`. Missing: CI proof from fresh checkout after final SHA. | This PR; `docs/FRESH_CHECKOUT_RELEASE_PROOF.md`. |
| KI-08: Dependency maintenance warnings | `planned-remediation-before-deployment` | Dependency warnings do not change on-chain semantics, but they are relevant to audit/release reproducibility. | Before public V2 deployment proposal, either remove warnings, record accepted warnings, or link Dependabot/security issue. Audit handoff may include current warnings if `npm run audit` is clean. | Optional, release/process review. | Existing: `npm ci`; `npm run audit`. Missing: documented accepted-warning file if warnings persist at final handoff. | Future dependency-maintenance issue; Dependabot. |
| KI-09: Release package local Foundry path and generated site output | `accepted-for-audit` | Package tooling now handles repository-pinned Foundry path and restores generated site output. Fresh-checkout proof should verify this from exact commit. | Accepted risk only if reproducibility proof passes from clean tree. Planned control: `npm run release -- --commit <sha> --release v0.2.0-utility-pilot`. | Yes, ask auditor to verify package inputs/checksums if in scope. | Existing: `scripts/generate-audit-release-package.cjs`; `scripts/run-foundry.cjs`. New: `scripts/prove-release-reproducibility.cjs`. | This PR; release proof doc. |

## Required Owner Decisions Before Public V2 Candidate Deployment

- [ ] Approve exact neutral V2 metadata strings.
- [ ] Approve generated V2 role manifest for the intended public network.
- [ ] Decide whether token-pause-only is sufficient for vesting incident response or create a scoped vault-local pause remediation PR.
- [ ] Accept or remediate dependency maintenance warnings.
- [ ] Confirm no deployer retains unintended privileged roles.
- [ ] Confirm the deployment is explicitly non-canonical.
- [ ] Confirm public docs do not describe V2 as live, canonical, mainnet-ready, or independently audited.

## Auditor Questions To Keep In Scope

1. Is `AccessControlDefaultAdminRules` configured with an appropriate admin-transfer delay for the intended Safe/governance model?
2. Is role separation sufficient for admin, pauser, reporter, vesting admin, and treasury?
3. Should the vesting vault have a vault-local pause role?
4. Are treasury-transfer and revoke flows safe under compromised-role scenarios?
5. Are report metadata bounds and supersede semantics sufficient?
6. Are deployment-script fail-closed checks enough for public networks?
7. Are accepted Slither findings correctly classified?
8. Are Foundry invariants covering the main accounting properties?

## Handoff Rule

Do not send the V2 audit package as final evidence until:

```bash
npm run audit
npm run audit:handoff
npm run slither
npm test
npm run foundry:test
npm run foundry:coverage
npm run release -- --commit <current-main-sha> --release v0.2.0-utility-pilot
```

have been run against the intended evidence commit, and every `planned-remediation-before-deployment` or `blocked-before-deployment` item above is either explicitly accepted for audit scope or recorded as a blocker before deployment.

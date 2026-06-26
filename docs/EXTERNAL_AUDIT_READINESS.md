# TikiDeco External Audit Readiness Plan

Status: preparation plan only. TikiDeco V2 is candidate code, not independently audited, not canonical, not deployed on mainnet, and not offered as a production system.

Purpose: define the concrete work needed before sending V2 contracts and supporting materials to an external Solidity auditor.

## Audit Target Boundary

| Item | Status |
| --- | --- |
| V1 Sepolia contracts | Historical canonical deployment; compatibility and public documentation only. |
| V2 contracts | Candidate audit target. |
| Mainnet deployment | Not in scope. |
| Token sale or value | Not in scope. |
| Real-world hospitality utility | Conceptual/planned; not active. |
| Independent audit status | Not started. |

Primary V2 contracts:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`

Primary supporting files:

- `AUDIT_SCOPE.md`
- `ARCHITECTURE.md`
- `THREAT_MODEL.md`
- `SPECIFICATION.md`
- `INVARIANTS.md`
- `KNOWN_ISSUES.md`
- `docs/V2_AUDIT_TARGET_FREEZE.md`
- `security/slither-baseline-v2.json`

## Readiness Gates

| Gate | Required result | Current state |
| --- | --- | --- |
| Source freeze | Exact V2 source baseline recorded. | Freeze baseline recorded in `docs/V2_AUDIT_TARGET_FREEZE.md`. |
| Evidence commit | Exact package/evidence commit recorded after final merge. | Must be updated after each merged preparation PR. |
| Hardhat tests | All tests pass. | Current documented result: `69 passing`; rerun before final package. |
| Foundry tests | V2 fuzz/invariant tests pass with deterministic seed. | Configured through `npm run foundry:test`. |
| Foundry coverage | V2 thresholds pass. | Configured through `npm run foundry:coverage`; known anchor warnings are tooling noise if exit code is zero. |
| Slither | New untriaged V2 findings equal zero. | Enforced by `npm run slither:baseline`. |
| Claims check | No unsupported public claims in public surfaces. | Enforced by `npm run claims`. |
| Site check | Read-only site, required disclaimers, no banned claims. | Enforced by `npm run site`. |
| V2 audit package | V2 candidate package includes contracts, ABI, bytecode, tests, Foundry artifacts if present, Slither baseline, coverage if present, audit scope, known issues, freeze doc, and checksums. | Enforced by `npm run audit`. |
| Handoff discipline | Package must be generated from the current commit, include checksums, include known issues and Slither baseline, and keep V2 non-canonical. | Enforced by `npm run audit:handoff`. |
| Release package | Bundle generated from clean tree and exact commit. | Run only after final merge SHA is known. |

## Open Review Questions For Auditor

These questions should be sent with the audit package:

1. Should V2 add a vault-local pause role in addition to token-level pause?
2. Should report supersede corrections enforce same-category or correction-reason hashes on-chain?
3. Are `AccessControlDefaultAdminRules` delay settings appropriate for the expected Safe/governance model?
4. Are vesting liability invariants sufficient for arbitrary prefunding, partial release, revoke, and treasury-transfer sequences?
5. Are metadata and URI/report bounds appropriate for long-term public transparency?
6. Are there any ERC-20 integration concerns from pause behavior, report metadata, role management, or project metadata fields?
7. Are role separation and deployer-no-role assertions sufficient for a public candidate deployment?

## Package Command

Run only from a clean tree after the target commit is final:

```bash
npm run audit
npm run audit:handoff
npm run release:package -- --commit <final-main-sha> --release v0.2.0-utility-pilot
```

The package command must not deploy contracts, broadcast transactions, create a tag, or publish a GitHub Release.

## Auditor Handoff Checklist

- [ ] Confirm `git status --short` is clean.
- [ ] Confirm target commit is merged to `main`.
- [ ] Run `npm ci`.
- [ ] Run `npm run compile`.
- [ ] Run `npm test`.
- [ ] Run `npm run coverage`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run audit`.
- [ ] Run `npm run audit:handoff`.
- [ ] Verify `SHA256SUMS.txt` inside the generated V2 audit package.
- [ ] Send the package to auditor with `docs/EXTERNAL_AUDIT_PACKAGE_INDEX.md`, `docs/AUDITOR_QUESTIONS.md`, `KNOWN_ISSUES.md`, and `docs/AUDIT_RESPONSE_PROCESS.md`.
- [ ] Freeze unrelated changes while audit review is active.
- [ ] Run `npm run manifest`.
- [ ] Run `npm run bytecode`.
- [ ] Run `npm run gas`.
- [ ] Run `npm run foundry:test`.
- [ ] Run `npm run foundry:coverage`.
- [ ] Run `npm run slither:baseline`.
- [ ] Run `npm run claims`.
- [ ] Run `npm run site`.
- [ ] Run `npm run release`.
- [ ] Generate release package with the final `main` SHA.
- [ ] Attach package SHA-256 checksums.
- [ ] Include `KNOWN_ISSUES.md` and accepted Slither baseline.
- [ ] Explicitly state that V2 is candidate code and not independently audited.

## Stop Conditions

Do not send the package for external audit if:

- the git tree is dirty;
- a package was generated from a non-final commit;
- tests or coverage fail;
- Slither reports new untriaged V2 findings;
- public docs imply sale, monetary value, mainnet deployment, active utility, completed property, or independent audit;
- V2 source, deployment scripts, role schema, or security assumptions changed without resetting the freeze baseline;
- release package checksums are missing.

## Post-Audit Handling

When an external audit exists, do not summarize it as “secure” or “audited” without the exact report link, scope, date, version, and unresolved findings. Update:

- `deployments/canonical.json` only if a canonical deployment status changes;
- `docs/PROJECT_FACTS.md`;
- `docs/CLAIMS_MATRIX.md`;
- `README.md`;
- public site audit/status pages;
- `KNOWN_ISSUES.md`;
- `docs/V2_AUDIT_TARGET_FREEZE.md` or successor freeze document.

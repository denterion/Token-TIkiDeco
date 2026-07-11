# TikiDeco V2 Community Review Guide

Current public-safe aggregate finding state: [`/community-review/findings/`](https://tikideco.xyz/community-review/findings/). Triage and remediation rules: [`FINDING_TRIAGE_PLAYBOOK.md`](FINDING_TRIAGE_PLAYBOOK.md).

Status: open community peer review of a frozen, non-canonical and non-deployed V2 candidate. Community review is not a formal independent smart-contract audit and does not approve deployment.

## Immutable Review Identity

- Review candidate source commit: [`cdc9e7e27e66f204c50d59e45ccf970ad20290d6`](https://github.com/denterion/Token-TIkiDeco/tree/cdc9e7e27e66f204c50d59e45ccf970ad20290d6)
- Frozen V2 code commit: [`9099fdb87a6be715b1d7fd4fafa6fade0b12b61c`](https://github.com/denterion/Token-TIkiDeco/commit/9099fdb87a6be715b1d7fd4fafa6fade0b12b61c)
- Package SHA-256: `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`
- Candidate definition: [`config/audit/v2-review-candidate.json`](https://github.com/denterion/Token-TIkiDeco/blob/f4db5508c59672648fd09cad62c0d8abe0f02417/config/audit/v2-review-candidate.json)

The candidate source commit packages the frozen contracts, deployment guard, tests, known issues, static-analysis baseline, and reproduction tooling. Contract review must use the frozen commit named above; later branches are not substitutes.

## 30-Minute Verification

1. Confirm the candidate commit and package checksum against `config/community-review/status.json`.
2. Read [`AUDIT_SCOPE.md`](https://github.com/denterion/Token-TIkiDeco/blob/cdc9e7e27e66f204c50d59e45ccf970ad20290d6/AUDIT_SCOPE.md), [`KNOWN_ISSUES.md`](https://github.com/denterion/Token-TIkiDeco/blob/cdc9e7e27e66f204c50d59e45ccf970ad20290d6/KNOWN_ISSUES.md), and [`docs/AUDITOR_QUESTIONS.md`](https://github.com/denterion/Token-TIkiDeco/blob/cdc9e7e27e66f204c50d59e45ccf970ad20290d6/docs/AUDITOR_QUESTIONS.md).
3. Confirm `deployments/canonical.json` keeps V1 canonical and identifies V2 as candidate-only.
4. Inspect the two V2 contracts and `scripts/deploy-v2.cjs` at the exact frozen commit.
5. Run `npm run community-review:check` on current `main` to validate the public review process.

## Two-Hour Focused Review

Complete the 30-minute path, then:

```bash
git clone https://github.com/denterion/Token-TIkiDeco.git
cd Token-TIkiDeco
git checkout cdc9e7e27e66f204c50d59e45ccf970ad20290d6
npm ci
npm run compile
npm test
npm run foundry:test
npm run slither
npm run bytecode
```

Focus on:

- `AccessControlDefaultAdminRules` and role separation;
- token pause effects on vesting release;
- prefunded vesting liabilities, revoke, and refund accounting;
- treasury transfer and deployment fail-closed guards;
- project/report metadata validation and correction semantics;
- accepted Slither classifications and invariant coverage.

## Full Technical Review

1. Complete every command in `docs/INDEPENDENT_REVIEWER_GUIDE.md` at the exact candidate commit.
2. Rebuild the deterministic package with:

   ```bash
   npm run review:candidate:build -- --commit cdc9e7e27e66f204c50d59e45ccf970ad20290d6
   ```

3. Verify the generated package SHA-256 equals `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`.
4. Review all `KI-01` through `KI-09`, owner decisions, reviewer questions, Hardhat tests, Foundry invariants, and Slither baseline entries.
5. Record each public-safe finding using `config/community-review/finding.schema.json` and follow `FINDING_LIFECYCLE.md`.

## Reporting

Public, non-sensitive Medium/Low/Informational findings, reproducibility problems, test suggestions, and review questions may use the GitHub issue forms linked from `/community-review/`.

Do not publish an exploitable unresolved Critical or High issue. Report sensitive vulnerabilities through [GitHub private vulnerability reporting](https://github.com/denterion/Token-TIkiDeco/security/advisories/new) and follow [`SECURITY.md`](../../SECURITY.md).

Never submit private keys, seed phrases, passwords, RPC credentials, signer recovery material, private participant data, private guest data, or unrelated sensitive personal data.

## Boundaries

- V1 remains the canonical legacy Sepolia deployment.
- V2 remains frozen, non-canonical, and non-deployed.
- Community peer review is not a formal audit.
- Independent professional audit is not completed.
- Mainnet, sale, liquidity, listing, stated monetary value, and active hospitality benefits remain unapproved.

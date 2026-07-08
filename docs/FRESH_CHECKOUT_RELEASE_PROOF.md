# Fresh Checkout Release Proof

Status: reproducibility runbook for release and V2 audit-preparation evidence. This is not a deployment guide, not a mainnet approval, not a token sale, not a value statement, and not an independent audit claim.

Purpose: prove that the v0.2 release package and V2 audit handoff evidence can be reproduced from a clean checkout and an exact commit.

## Exact Environment

Use the pinned repository toolchain:

| Tool | Source |
| --- | --- |
| Node.js / npm | Local runtime used by `npm ci`; CI should use the pinned workflow version. |
| Solidity compiler | `hardhat.config.js`, Solidity `0.8.28`, EVM `paris`, optimizer enabled with `200` runs. |
| OpenZeppelin | `@openzeppelin/contracts` pinned in `package-lock.json`. |
| Foundry | `foundry.toml` plus repository wrapper `scripts/run-foundry.cjs`; CI should install the pinned Foundry version. |
| Slither | `slither.config.json` plus `security/slither-baseline-v2.json`. |

## Clean Clone Steps

```bash
git clone https://github.com/denterion/Token-TIkiDeco.git
cd Token-TIkiDeco
git checkout <exact-commit-sha>
git status --short
```

The working tree must be clean before packaging.

## Dependency Install

```bash
npm ci
```

Record warnings. `npm run audit` must still pass before handoff.

## Compile

```bash
npm run compile
```

## Hardhat Tests

```bash
npm test
npm run coverage
```

## Foundry Tests

```bash
npm run foundry:test
npm run foundry:coverage
```

Foundry coverage may print known tooling warnings if exit code is zero. Do not weaken invariants to silence tooling output.

## Slither Baseline

```bash
npm run slither
npm run slither:baseline
```

The baseline must fail on new untriaged V2 findings.

## Site Checks

```bash
npm run site
npm run site:browser
```

The site must remain read-only and must not contain sale, value, mainnet, active-benefit, or independent-audit claims.

## Release Package Generation

```bash
npm run release -- --commit <exact-commit-sha> --release v0.2.0-utility-pilot
```

The proof script checks the commit, clean tree, public-claims gates, V2 non-canonical status, audit status, and package generation.

## Checksum Comparison

If an expected checksum is already published for the generated package checksum file:

```bash
npm run release -- --commit <exact-commit-sha> --release v0.2.0-utility-pilot --expected-checksum <sha256>
```

The checksum is calculated over:

```text
release-artifacts/v0.2.0-utility-pilot/<exact-commit-sha>/SHA256SUMS.txt
```

## Expected Blocked Gates

These blocked states are expected and should not be bypassed:

- Mainnet/value readiness remains blocked.
- Pilot live readiness remains blocked until approvals exist.
- V2 remains non-canonical candidate code.
- Independent audit has not started.

Verification commands:

```bash
node scripts/check-mainnet-readiness.cjs --expect-blocked
npm run pilot:live:blocked
```

## Stop Conditions

Stop the handoff if:

- the git tree is dirty before package generation;
- the package commit does not match current `HEAD`;
- V2 is described as canonical;
- public text claims mainnet, sale, value, active utility, completed property, or independent audit completion;
- Slither baseline is missing or stale;
- Foundry coverage is missing or not referenced;
- known issues and owner decisions are out of sync;
- checksums are missing or do not match.

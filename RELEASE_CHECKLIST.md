# v0.1.0-sepolia GitHub Release Checklist

This checklist is for a public Sepolia prototype release. It does not publish the release automatically, deploy contracts, broadcast transactions, or create a token sale.

## Pre-Release Boundaries

- [ ] Confirm this is a Sepolia prototype release, not a mainnet launch.
- [ ] Confirm V1 remains the canonical Sepolia legacy deployment.
- [ ] Confirm V2 remains candidate code only unless a later canonical manifest explicitly promotes it.
- [ ] Confirm TIDE is not offered for sale.
- [ ] Confirm TIDE has no stated monetary value.
- [ ] Confirm no sale, presale, staking, yield, APY, exchange listing, price, or investment language appears in public materials.
- [ ] Confirm the project is not described as audited, approved for production use, or approved for mainnet use.
- [ ] Confirm independent audit status is `not-started`.

## Source And Package

- [ ] Merge release-preparation PRs through protected `main`.
- [ ] Record the final full 40-character `main` commit SHA.
- [ ] Update or verify `docs/releases/v0.1.0-sepolia.md` for the selected commit.
- [ ] Run `npm ci`.
- [ ] Run `npm run release`.
- [ ] Run `npm run release:package -- --commit <40-character-commit-sha>`.
- [ ] Confirm the release package includes `release-manifest.json`.
- [ ] Confirm the release package includes `SHA256SUMS.txt`.
- [ ] Confirm the release package source archive matches the selected commit.

## Required Local Checks

- [ ] `npm run compile`
- [ ] `npm test`
- [ ] `npm run coverage`
- [ ] `npm run lint`
- [ ] `npm run audit`
- [ ] `npm run manifest`
- [ ] `npm run bytecode`
- [ ] `npm run gas`
- [ ] `npm run site`
- [ ] `npm run release`
- [ ] `npm run slither:baseline`

## GitHub Release Draft

- [ ] Use release title `v0.1.0-sepolia`.
- [ ] Attach or link the generated release package.
- [ ] Include the exact source commit SHA.
- [ ] Include canonical token, vault, Safe, treasury, and chain ID.
- [ ] Include the no-sale/no-value/no-mainnet/no-independent-audit disclaimer.
- [ ] Include known limitations.
- [ ] Include reproduction commands.
- [ ] Do not mark the release as audited.
- [ ] Do not create or push a tag automatically unless the release manager intentionally follows the signed tag workflow.

## Final Human Review

- [ ] Review `PUBLIC_CLAIMS_CONSISTENCY_REPORT.md`.
- [ ] Review `docs/CLAIMS_MATRIX.md`.
- [ ] Review `SECURITY.md`.
- [ ] Review `KNOWN_ISSUES.md`.
- [ ] Confirm no private keys, RPC secrets, or deployment credentials are included.
- [ ] Confirm no contract deployment or transaction broadcast is part of the release process.

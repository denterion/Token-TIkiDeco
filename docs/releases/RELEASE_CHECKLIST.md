# v0.1.0-sepolia Release Checklist

This checklist prepares a release package for review. It does not publish a GitHub Release, create a tag, deploy contracts, or broadcast transactions.

## Before Packaging

- [ ] Confirm the target commit is a full 40-character SHA.
- [ ] Confirm the Git tree is clean.
- [ ] Confirm `deployments/canonical.json` still describes Sepolia V1 as legacy canonical state.
- [ ] Confirm V2 contracts remain candidate code unless a later reviewed manifest promotes them.
- [ ] Confirm `docs/releases/v0.1.0-sepolia.md` contains no `TBD`.
- [ ] Confirm public text says TIDE is a Sepolia prototype, not offered for sale, has no stated monetary value, is not deployed on mainnet, and is not independently audited.
- [ ] Confirm no unsupported claims were added about investment returns, hotel ownership, revenue rights, partnerships, exchange listings, active benefits, or completed property.

## Generate Package

```bash
npm ci
npm run release:package -- --commit <40-character-commit-sha>
```

The generator rejects the package if:

- the Git tree is dirty;
- the commit is not explicitly supplied;
- tests fail;
- Slither has new untriaged V2 findings;
- addresses disagree across README, site, and manifests;
- legal status text is inconsistent;
- release notes contain `TBD`;
- audit status is missing;
- checksums are missing.

## Expected Bundle Contents

- exact source commit;
- source archive;
- compiler and optimizer settings;
- dependency lockfile;
- ABI;
- creation bytecode;
- runtime bytecode;
- bytecode hashes;
- canonical deployment manifest;
- role manifest;
- Safe configuration;
- test report;
- coverage report;
- gas report;
- Slither output and triage;
- SPDX SBOM;
- SHA-256 checksums;
- known issues;
- audit scope;
- reproduction instructions.

## Signed Tag Workflow

Use a signed tag only after the package is reviewed:

```bash
git tag -s v0.1.0-sepolia <40-character-commit-sha> -m "v0.1.0-sepolia"
git tag -v v0.1.0-sepolia
```

Do not create or push the tag automatically from the package generator.

When ready, a human release manager may push the signed tag:

```bash
git push origin v0.1.0-sepolia
```

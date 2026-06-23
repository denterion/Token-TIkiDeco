## Summary

Describe the change and why it is needed.

## Scope

- [ ] Contracts
- [ ] Deployment scripts or manifests
- [ ] Tests
- [ ] Public site
- [ ] Documentation
- [ ] CI or release tooling
- [ ] Release package or release notes

## Safety Boundaries

- [ ] Does not modify deployed V1 contract semantics or canonical V1 addresses.
- [ ] Does not deploy contracts or broadcast transactions.
- [ ] Does not add secrets, private keys, RPC credentials, or signer instructions that require private keys.
- [ ] Treats V1 as the canonical Sepolia legacy deployment.
- [ ] Treats V2 as candidate code only unless a later canonical manifest explicitly promotes it.
- [ ] Does not claim TIDE is for sale, has stated monetary value, is independently audited, approved for production use, or approved for mainnet use.
- [ ] Does not add sale, presale, staking, yield, APY, exchange listing, price, or investment language.
- [ ] Does not add unsupported claims about hotel ownership, equity, debt, revenue rights, partnerships, active benefits, or completed property.

## Checks Run

```text
npm ci
npm run compile
npm test
npm run coverage
npm run lint
npm run audit
npm run manifest
npm run bytecode
npm run gas
npm run site
npm run release
```

List any checks not run and why.

## Release Impact

- [ ] Does not affect the v0.1.0-sepolia release.
- [ ] Updates `docs/releases/v0.1.0-sepolia.md`.
- [ ] Updates `deployments/canonical.json`.
- [ ] Updates the public site.
- [ ] Updates release tooling or release artifacts.

If release-impacting, explain whether the release package must be regenerated on the final merge commit.

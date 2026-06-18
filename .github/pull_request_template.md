## Summary

Describe the change and why it is needed.

## Scope

- [ ] Contracts
- [ ] Deployment scripts or manifests
- [ ] Tests
- [ ] Public site
- [ ] Documentation
- [ ] CI or release tooling

## Safety Boundaries

- [ ] Does not modify deployed V1 contract semantics.
- [ ] Does not deploy or broadcast transactions.
- [ ] Does not add secrets, private keys, or RPC credentials.
- [ ] Does not claim TIDE is for sale, has monetary value, is independently audited, approved for production use, or approved for mainnet use.
- [ ] Does not add unsupported claims about hotel ownership, revenue rights, partnerships, exchange listings, active benefits, or completed property.

## Checks Run

```text
npm ci
npm run compile
npm test
npm run lint
npm run site:check
npm run release:check
```

List any checks not run and why.

## Release Impact

Does this change affect `docs/releases/v0.1.0-sepolia.md`, `deployments/canonical.json`, the public site, or release artifacts?

# Contributing

Thank you for helping improve TikiDeco. This repository is a public Sepolia prototype, not a token sale or mainnet launch.

## Ground Rules

- Do not add private keys, RPC secrets, mnemonics, API keys, or deployment credentials.
- Do not publish or broadcast transactions from CI.
- Do not describe the project as independently audited, approved for production use, approved for mainnet use, or free of vulnerabilities.
- Do not add claims about investment returns, price growth, hotel ownership, revenue rights, exchange listings, partnerships, active benefits, or completed property unless they are verified and approved for public use.
- Keep V1 deployed contract semantics historical. V2 candidate changes must stay clearly non-canonical until a later manifest explicitly promotes them.

## Local Setup

```bash
npm ci
npm run compile
npm test
npm run lint
npm run site:check
npm run release:check
```

Optional security checks require local tooling:

```bash
npm run slither
npm run slither:baseline
npm run foundry:test
```

## Pull Requests

Every pull request should explain:

- what changed;
- whether contracts, deployment scripts, public site, or documentation are affected;
- which checks were run;
- whether public claims or legal-status text changed;
- whether canonical addresses or manifests changed.

Contract changes should include tests. Public communication changes should follow `docs/CLAIMS_MATRIX.md` and `docs/COMMUNICATION_PLAYBOOK.md`.

## Release Contributions

Do not create or push release tags automatically. The release manager should run:

```bash
npm run release:package -- --commit <40-character-commit-sha>
```

The package generator rejects dirty trees, missing explicit commits, failing tests, new untriaged V2 Slither findings, inconsistent addresses, inconsistent legal status text, missing audit status, release notes containing `TBD`, and missing checksums.

## Responsible Disclosure

Please do not file public issues for suspected vulnerabilities. Follow `SECURITY.md` and use GitHub private vulnerability reporting when available.

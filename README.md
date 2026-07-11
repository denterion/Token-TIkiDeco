<div align="center">

<img src="site/assets/tide-logo.png" alt="TikiDeco TIDE logo" width="180">

# TikiDeco Token

**TikiDeco is an open-source Sepolia prototype exploring transparent loyalty and access infrastructure for a future hospitality concept. TIDE currently has no monetary value and is not offered for sale.**

[![CI](https://github.com/denterion/Token-TIkiDeco/actions/workflows/ci.yml/badge.svg)](https://github.com/denterion/Token-TIkiDeco/actions/workflows/ci.yml)
[![Security](https://github.com/denterion/Token-TIkiDeco/actions/workflows/security.yml/badge.svg)](https://github.com/denterion/Token-TIkiDeco/actions/workflows/security.yml)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-2f2f2f)
![Network](https://img.shields.io/badge/Testnet-Sepolia-2b6cb0)
![Supply](https://img.shields.io/badge/Supply-100M%20TIDE-0f766e)
![Status](https://img.shields.io/badge/Status-Testnet%20prototype-b7791f)

[Website](https://tikideco.xyz/) |
[Trust Center](https://tikideco.xyz/trust/) |
[Community Review](https://tikideco.xyz/community-review/) |
[Token](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code) |
[Vault](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code) |
[Project Facts](docs/PROJECT_FACTS.md) |
[Competitive Landscape](docs/COMPETITIVE_LANDSCAPE.md) |
[Pilot Proof Pack](docs/PILOT_PROOF_PACK.md) |
[Public Evidence](docs/PUBLIC_EVIDENCE_DASHBOARD.md) |
[Mainnet Readiness](docs/MAINNET_READINESS_GAP_ANALYSIS.md) |
[Claims Matrix](docs/CLAIMS_MATRIX.md) |
[Security Policy](SECURITY.md)

</div>

## Start Here

TikiDeco / TIDE is a public Ethereum Sepolia prototype for transparent hospitality-linked token infrastructure. It is designed to make token rules, public reports, governance controls, and future pilot boundaries easier to verify.

For a first-time reader, use the four public entry points:

| Entry point | Use it for |
| --- | --- |
| [Overview / Trust](https://tikideco.xyz/trust/) | What exists, which source proves it, and what remains blocked. |
| [Status](docs/PUBLIC_ENTRYPOINTS.md#status) | Current Sepolia deployment, releases, and blockers. |
| [Pilot](docs/PUBLIC_ENTRYPOINTS.md#pilot) | Planned read-only utility-pilot flow and why it is not live. |
| [Audit](docs/PUBLIC_ENTRYPOINTS.md#audit) | V1 legacy scope, V2 candidate scope, and audit-readiness evidence. |

- Short paths: [`docs/START_HERE.md`](docs/START_HERE.md)
- Trust Center source map: [`docs/TRUST_CENTER_SOURCE_MAP.md`](docs/TRUST_CENTER_SOURCE_MAP.md)
- Operator and entity status: [`docs/OPERATOR_AND_ENTITY_STATUS.md`](docs/OPERATOR_AND_ENTITY_STATUS.md)
- Public participation: [`docs/PUBLIC_PARTICIPATION.md`](docs/PUBLIC_PARTICIPATION.md)
- Public entrypoint rules: [`docs/PUBLIC_ENTRYPOINTS.md`](docs/PUBLIC_ENTRYPOINTS.md)
- Market position: [`docs/COMPETITIVE_LANDSCAPE.md`](docs/COMPETITIVE_LANDSCAPE.md)
- Pilot proof pack: [`docs/PILOT_PROOF_PACK.md`](docs/PILOT_PROOF_PACK.md)
- Public evidence dashboard: [`docs/PUBLIC_EVIDENCE_DASHBOARD.md`](docs/PUBLIC_EVIDENCE_DASHBOARD.md)
- Mainnet readiness gap analysis: [`docs/MAINNET_READINESS_GAP_ANALYSIS.md`](docs/MAINNET_READINESS_GAP_ANALYSIS.md)
- Release control: [`docs/RELEASE_CONTROL_CENTER.md`](docs/RELEASE_CONTROL_CENTER.md)

## V2 Community Review

The frozen, non-canonical V2 candidate is open for community peer review. Community review is not a formal independent smart-contract audit and does not approve deployment.

- Public review page: [tikideco.xyz/community-review](https://tikideco.xyz/community-review/)
- Exact candidate source: [`cdc9e7e27e66f204c50d59e45ccf970ad20290d6`](https://github.com/denterion/Token-TIkiDeco/tree/cdc9e7e27e66f204c50d59e45ccf970ad20290d6)
- Frozen V2 code: [`9099fdb87a6be715b1d7fd4fafa6fade0b12b61c`](https://github.com/denterion/Token-TIkiDeco/commit/9099fdb87a6be715b1d7fd4fafa6fade0b12b61c)
- Package SHA-256: `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`
- Review guide: [`docs/community-review/COMMUNITY_REVIEW_GUIDE.md`](docs/community-review/COMMUNITY_REVIEW_GUIDE.md)
- Aggregate findings: [tikideco.xyz/community-review/findings](https://tikideco.xyz/community-review/findings/)
- Triage playbook: [`docs/community-review/FINDING_TRIAGE_PLAYBOOK.md`](docs/community-review/FINDING_TRIAGE_PLAYBOOK.md)
- Sensitive reports: follow [`SECURITY.md`](SECURITY.md); do not publish exploitable unresolved Critical or High details.

```bash
npm run community-review:status
npm run community-review:check
```

## 30-Second Project Status

| Question | Current answer |
| --- | --- |
| What is it? | Open-source Ethereum Sepolia prototype for transparent hospitality-linked token infrastructure. |
| What exists now? | Canonical V1 legacy token and vesting vault on Sepolia, verified source links, Safe ownership, public docs, read-only website, v0.1 and v0.2 pre-releases. |
| What does not exist? | No token sale, no stated monetary value, no mainnet deployment, no active guest benefits, no V2 canonical promotion, no completed independent audit. |
| What is the next release candidate? | `v0.2.0-utility-pilot-rc.1`: read-only utility-pilot evidence, with the campaign still `draft-not-live`. |
| How do I verify it? | Start with the [Trust Center](https://tikideco.xyz/trust/), then use [`deployments/canonical.json`](deployments/canonical.json), [`docs/PROJECT_FACTS.md`](docs/PROJECT_FACTS.md), and `npm run trust:check`. |
| How do I give feedback? | Use [GitHub Issues](https://github.com/denterion/Token-TIkiDeco/issues) and [`docs/FEEDBACK_GUIDE.md`](docs/FEEDBACK_GUIDE.md). |

Maintainer status command:

```bash
npm run project:control
```

## Public Boundary

TIDE is not sold, is not deployed on mainnet, has no stated monetary value, and does not represent hotel ownership, equity, debt, revenue rights, or a completed hospitality service.

## Current Deployment

| Field | Current value |
| --- | --- |
| Network | Ethereum Sepolia |
| Chain ID | `11155111` |
| Canonical version | `v1-legacy` |
| Token | [`0xE4c1DE533440b411Be5C17883FF662e95a462097`](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code) |
| Vesting vault | [`0xc480565482af6B08A3b65D0C9aba985d6240702E`](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code) |
| Owner Safe | [`0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`](https://sepolia.etherscan.io/address/0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3) |
| Safe threshold | `3-of-3` |
| Treasury | [`0xf1DAd608ddD5B71F039FEE82026164bc6a245081`](https://sepolia.etherscan.io/address/0xf1DAd608ddD5B71F039FEE82026164bc6a245081) |
| Supply | `100,000,000 TIDE` |
| Verification | Token and vault source are verified on Sepolia Etherscan |
| Audit status | Internal review in progress; independent audit not started |
| Canonical manifest | [`deployments/canonical.json`](deployments/canonical.json) |

## What Currently Works

| Area | Status |
| --- | --- |
| ERC-20-style token | Deployed on Sepolia with fixed supply, transfers, approvals, and `transferFrom`. |
| Ownership | Token and vault owner is the Sepolia Safe listed above. |
| Treasury | Initial supply was assigned to the treasury address. |
| Pause controls | V1 token includes owner-controlled pause and unpause for transfers. |
| Vesting vault | V1 vault exists as the canonical Sepolia legacy deployment. |
| Report publishing | V1 token can publish report hashes on-chain through owner-controlled workflow. |
| Public site | Static site includes a read-only dashboard that uses public Sepolia RPC calls and does not connect a wallet. |
| Candidate V2 | OpenZeppelin-based V2 contracts exist as review code only. |

## What Does Not Yet Exist

| Item | Current boundary |
| --- | --- |
| Mainnet deployment | Not approved and not present in this repository. |
| Token sale | No sale, no presale, no purchase flow. |
| Monetary value | No stated value and no exchange listing claim. |
| Independent audit | Not started. Internal review is not an audit. |
| Active hotel benefits | Loyalty, access, and hospitality perks are research directions, not live services. |
| Confirmed hotel partners | No public partner claim is supported by repository facts. |
| Completed property | Concept imagery is not evidence of a completed property. |
| V2 promotion | V2 is non-canonical candidate code until a later manifest explicitly promotes it. |

## How To Verify Contracts

Use the canonical manifest first:

```bash
npm run manifest:check
```

Then verify addresses against Sepolia Etherscan:

| Contract | Verified source |
| --- | --- |
| TikiDecoToken | [`0xE4c1DE533440b411Be5C17883FF662e95a462097#code`](https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code) |
| TikiDecoVestingVault | [`0xc480565482af6B08A3b65D0C9aba985d6240702E#code`](https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code) |

Read-only local state checks:

```bash
npm run sepolia:state
npm run owner:check:sepolia
```

These commands require public Sepolia RPC configuration for network reads. They do not need a private key for read-only checks.

## Who Controls Privileged Operations

| Operation | Controller |
| --- | --- |
| Token pause / unpause | Owner Safe on Sepolia V1 |
| Report publication | Owner Safe on Sepolia V1 |
| V1 ownership transfer | Owner Safe using two-step ownership |
| V1 vesting administration | Owner Safe |
| Treasury token custody | Treasury address listed in the canonical manifest |
| V2 role model | Candidate code only; see [`docs/ACCESS_CONTROL.md`](docs/ACCESS_CONTROL.md) |

Safe runbook: [`docs/SAFE_MULTISIG.md`](docs/SAFE_MULTISIG.md)

Governance notes: [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md)

## Known Limitations

- Sepolia V1 is a historical prototype, not a production deployment.
- V1 uses custom ERC-20 code; later review should prefer the OpenZeppelin V2 track.
- V1 vesting remains legacy semantics; V2 candidate contains the clarified cliff plus vesting-duration model.
- Slither findings are documented and require explicit review decisions before any V2 promotion.
- The Hardhat 3 verification plugin is intentionally not installed while its dependency tree reintroduces npm audit advisories.
- The public dashboard depends on public Sepolia RPC availability and may show `Data temporarily unavailable`.
- No independent smart-contract audit has been completed.
- Legal, securities, hospitality operations, and utility design remain outside the current prototype.

## Mainnet And Value Gate

Mainnet, value-related statements, real guest utility, token distribution, and liquidity/listing activity are **not approved**.

The project uses a fail-closed readiness gate:

```bash
npm run value:check
npm run mainnet:check
```

`npm run value:check` verifies that public value-claim policy remains restricted. `npm run mainnet:check` is expected to fail until legal, security, treasury, tax/accounting, privacy, hospitality operations, guest terms, distribution, communications, and liquidity/listing gates are explicitly approved.

This is not a promise of mainnet, not a value statement, not an offer, and not legal approval. See [`docs/MAINNET_GO_NO_GO.md`](docs/MAINNET_GO_NO_GO.md), [`docs/VALUE_CLAIM_POLICY.md`](docs/VALUE_CLAIM_POLICY.md), and [`docs/HOSPITALITY_OPERATIONS_GATE.md`](docs/HOSPITALITY_OPERATIONS_GATE.md).

## Community Preview

The community preview collects public feedback on the read-only website, documentation, verification steps, translations, and Sepolia-only utility-pilot boundaries. It does not create active guest benefits, a token offering, mainnet deployment, or independent audit claim.

Start here:

- [`docs/OFFICIAL_PUBLIC_PREVIEW.md`](docs/OFFICIAL_PUBLIC_PREVIEW.md)
- [`docs/COMMUNITY_PREVIEW.md`](docs/COMMUNITY_PREVIEW.md)
- [`docs/FEEDBACK_GUIDE.md`](docs/FEEDBACK_GUIDE.md)
- [`docs/NEXT_ISSUES.md`](docs/NEXT_ISSUES.md)
- [`docs/PROJECT_FACTS.md`](docs/PROJECT_FACTS.md)
- [`docs/COMMUNITY_PREVIEW_LAUNCH_PLAN.md`](docs/COMMUNITY_PREVIEW_LAUNCH_PLAN.md)
- [`docs/reports/REPORT_2026_07_04_OFFICIAL_PUBLIC_PREVIEW.md`](docs/reports/REPORT_2026_07_04_OFFICIAL_PUBLIC_PREVIEW.md)

Open public feedback through the GitHub issue templates. Do not submit private keys, seed phrases, passwords, private guest data, sensitive personal data, or non-public vulnerability details.

## How To Run Tests

Install dependencies:

```bash
npm install
```

Run the suite:

```bash
npm test
```

Current verified local test count:

```text
69 passing
```

Additional checks:

```bash
npm run compile
npm run lint
npm run coverage
npm run gas:snapshot
npm run deps:audit
npm run site:browser:install
npm run site:browser
npm run site:check
npm run release:check
```

Slither:

```bash
npm run slither
```

`npm run slither` runs the local Slither JSON scan and then applies the V2 baseline gate. Known accepted findings remain visible in generated artifacts; any new untriaged V2 finding fails. Use `npm run slither:raw` when you need Slither's unfiltered analyzer exit code and console output.

`npm run deps:audit` is an npm advisory scan for JavaScript dependencies. It is not an independent smart-contract audit. The legacy `npm run audit` command remains an aggregate compatibility command that runs the dependency advisory scan and builds the V2 candidate review package.

Slither requires local Slither and solc `0.8.28` setup. Slither output is review material, not an audit certificate.

## Reports

Reports are public documents whose hashes can be anchored on-chain.

Current report workflow:

1. Prepare a public report in `docs/reports/`.
2. Hash the final report file.
3. Publish the hash through the Safe-controlled token workflow.
4. Link the report, hash, and Sepolia transaction in the repository.

Latest on-chain report:

| Field | Value |
| --- | --- |
| Report | [`REPORT_2026_06_17_SAFE_AND_V2.md`](docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md) |
| Hash | `0x04119c47a7c09f09bfdcee87d77925e6f5ec89c2ea1fe9759feaae7091c0b5cc` |
| Transaction | [`0x5886945fc62fb8a48e64559eebecaaf80ee20115a02c82808a737063874041f9`](https://sepolia.etherscan.io/tx/0x5886945fc62fb8a48e64559eebecaaf80ee20115a02c82808a737063874041f9) |

Useful commands:

```bash
npm run report:hash
npm run report:safe:sepolia
```

Reporting cadence: [`docs/REPORTING_CADENCE.md`](docs/REPORTING_CADENCE.md)

## Documentation Map

| Center | Documents |
| --- | --- |
| Overview | [`docs/PROJECT_FACTS.md`](docs/PROJECT_FACTS.md), [`docs/WHITEPAPER_EN.md`](docs/WHITEPAPER_EN.md), [`docs/TOKENOMICS.md`](docs/TOKENOMICS.md), [`docs/UTILITY.md`](docs/UTILITY.md) |
| Security | [`SECURITY.md`](SECURITY.md), [`SECURITY_REVIEW.md`](SECURITY_REVIEW.md), [`docs/OPENZEPPELIN_V2.md`](docs/OPENZEPPELIN_V2.md), [`docs/HARDHAT3_MIGRATION.md`](docs/HARDHAT3_MIGRATION.md) |
| Governance | [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md), [`docs/SAFE_MULTISIG.md`](docs/SAFE_MULTISIG.md), [`docs/TREASURY_POLICY.md`](docs/TREASURY_POLICY.md), [`docs/ACCESS_CONTROL.md`](docs/ACCESS_CONTROL.md) |
| Communications | [`docs/CLAIMS_MATRIX.md`](docs/CLAIMS_MATRIX.md), [`docs/COMMUNICATION_POLICY.md`](docs/COMMUNICATION_POLICY.md), [`docs/COMMUNICATION_PLAYBOOK.md`](docs/COMMUNICATION_PLAYBOOK.md), [`docs/RISK_DISCLOSURE.md`](docs/RISK_DISCLOSURE.md) |
| Legal readiness | [`docs/LEGAL_READINESS.md`](docs/LEGAL_READINESS.md), [`docs/COUNSEL_BRIEF.md`](docs/COUNSEL_BRIEF.md) |
| Custom domain | [`docs/CUSTOM_DOMAIN.md`](docs/CUSTOM_DOMAIN.md) |

## Responsible Disclosure

Please do not disclose suspected vulnerabilities publicly before the maintainer has had a chance to investigate.

Use [`SECURITY.md`](SECURITY.md) as the reporting policy. Include:

- affected contract or script;
- network and address, if relevant;
- reproduction steps;
- expected and actual behavior;
- estimated impact;
- any transaction hashes or test cases that help reproduce the issue.

The project should acknowledge the report, reproduce the issue, assess impact, prepare a fix or mitigation, and publish a transparency update when appropriate. Do not describe internal review as an independent audit.

## Communication Boundary

Public copy should follow [`docs/PROJECT_FACTS.md`](docs/PROJECT_FACTS.md) and [`docs/CLAIMS_MATRIX.md`](docs/CLAIMS_MATRIX.md).

Allowed framing: Sepolia testnet prototype, fixed supply in the deployed contract, publicly verifiable source code, experimental loyalty and access infrastructure, no token sale, no current monetary value, not independently audited.

Do not market TIDE as a financial product, hotel ownership, revenue participation, guaranteed access, exchange listing, or completed hospitality service without verified facts and legal review.

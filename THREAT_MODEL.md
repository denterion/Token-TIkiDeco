# TikiDeco Threat Model

Status: internal review threat model. V2 is a candidate and is not independently audited.

## Assets

- TIDE token supply.
- Treasury balances.
- Vesting vault balances and liabilities.
- Admin, pauser, reporter, and vesting-admin roles.
- Canonical deployment manifest.
- Public website and domain.
- Report hashes and public communications.
- GitHub repository and CI workflows.

## Threats

| Threat | Scenario | Current mitigation | Recommended control |
| --- | --- | --- | --- |
| Malicious or compromised default admin | Admin grants roles, changes project URI, controls role graph, or deploys candidate code with wrong configuration. | Role-gated functions; Safe intended for ownership discipline. | Use Safe with documented threshold, signer rotation plan, role assignment checklist, and dry-run verification. |
| Compromised pauser | Pauser blocks token transfers and vesting releases because token pause affects `_update`. | Dedicated pauser role separate from reporter/vesting admin in V2. | Assign pauser to Safe or limited operations Safe; document pause/unpause incident criteria. |
| Compromised reporter | Reporter publishes misleading report hash or supersedes correct report. | Bounded non-empty report metadata and events. | Require report hash prepublication checklist and Safe approval for reporter role or reporter multisig. |
| Compromised vesting admin | Admin creates schedules for wrong beneficiaries or revokes revocable schedules. | Role-gated schedule creation/revocation; prefunded liability checks. | Use multisig vesting admin and CSV/manifest review before schedule creation. |
| Lost Safe signer | Safe cannot reach threshold for owner actions. | Safe threshold is documented. | Maintain signer recovery plan, signer inventory, and emergency governance process. |
| Compromised deployer | Deployer broadcasts wrong constructor args, wrong treasury, or non-canonical deployment. | V2 public-network deploy requires `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`. | Use deployment review checklist, dry-run deployment artifact, and post-deploy verification before public announcement. |
| Incorrect constructor metadata | Project URI/business metadata is wrong or implies claims that are not verified. | Metadata is explicit constructor input. | Treat metadata as release-blocking review item; keep wording aligned with claims matrix. |
| Incorrect treasury | Supply minted to wrong treasury or vault refunds to wrong treasury. | Zero-address checks and two-step vault treasury transfer. | Require treasury address checksum review by two reviewers and Safe confirmation. |
| Underfunded vesting | Schedules cannot be created or releases fail due to insufficient vault funds. | `unreservedBalance()` and `InsufficientUnreservedBalance`. | Prefund vault from treasury and reconcile `outstandingLiabilities()` before schedule creation. |
| RPC failure or spoofing | Site dashboard displays stale/unavailable or false read-only data. | Site shows unavailable state on RPC errors. | Treat dashboard as informational; link users to Etherscan and canonical manifest. |
| Compromised website or domain | Site claims sale/value/active benefits or links to malicious endpoints. | Static site, custom domain docs, content checks. | Protect GitHub Pages, domain registrar account, DNS, and branch protections; monitor content diffs. |
| Compromised GitHub Action | CI or Pages workflow publishes altered site or bypasses checks. | GitHub Actions and branch protection can gate merges. | Pin action versions when practical, require reviews, monitor Actions changes, keep secret scanning. |
| Malicious dependency | npm or OpenZeppelin dependency behavior changes. | Dependency pinning in lockfile and package versions. | Use `npm ci`, Dependabot review, npm audit, and lockfile review. |
| Misleading public claims | Public text implies sale, value, mainnet, audit, active benefits, or financial rights. | Claims matrix, public materials, legal readiness docs. | Require communication review before release notes/social posts. |
| Report-hash publication errors | Wrong file hash or wrong URI is anchored on-chain. | Report hash workflow exists. | Hash final immutable artifact; require two-person hash/URI verification before publication. |


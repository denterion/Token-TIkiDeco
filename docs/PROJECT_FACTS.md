# TikiDeco Project Facts

Verification date: 2026-06-17

Purpose: this file is the public-communications source of truth for TikiDeco / TIDE claims. Public README, site, white paper, reports, and social copy should use only facts listed here as `verified`, or clearly label `planned` and `experimental` items as not live.

Status key:

- `verified`: confirmed from repository files, local tests, or read-only Sepolia calls.
- `planned`: described as a future step in repository docs; not live.
- `experimental`: present as candidate code or draft content; not canonical production functionality.
- `unknown`: not confirmed; do not use as a public claim.

## Canonical Deployment

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Current canonical network is Ethereum Sepolia. | `deployments/canonical.json` (`network: sepolia`, `chainId: 11155111`); read-only Sepolia RPC check returned the same manifest network/chain context. | 2026-06-17 | verified |
| Current canonical contract version is `v1-legacy`. | `deployments/canonical.json` (`contractVersion: v1-legacy`, `status: legacy-canonical-testnet-prototype`). | 2026-06-17 | verified |
| The canonical token contract is `TikiDecoToken` at `0xE4c1DE533440b411Be5C17883FF662e95a462097`. | `deployments/canonical.json`; `deployments/sepolia.json`; read-only Sepolia RPC call to the token address. | 2026-06-17 | verified |
| The canonical vesting vault is `TikiDecoVestingVault` at `0xc480565482af6B08A3b65D0C9aba985d6240702E`. | `deployments/canonical.json`; `deployments/sepolia.json`; read-only Sepolia RPC balance check against the vault address. | 2026-06-17 | verified |
| The canonical Sepolia deployment is a testnet prototype, not a mainnet deployment. | `deployments/canonical.json`; `docs/ROADMAP.md` Mainnet Gate status is `not approved`. | 2026-06-17 | verified |
| OpenZeppelin V2 contracts exist only as non-canonical candidate code in this repository. | `deployments/canonical.json` (`nonCanonicalCandidates`); `docs/OPENZEPPELIN_V2.md`. | 2026-06-17 | experimental |

## Token State

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Token name is `TikiDeco`. | `contracts/TikiDecoToken.sol` (`name` constant); README snapshot. | 2026-06-17 | verified |
| Token symbol is `TIDE`. | `contracts/TikiDecoToken.sol` (`symbol` constant); README snapshot. | 2026-06-17 | verified |
| Token decimals are `18`. | `contracts/TikiDecoToken.sol` (`decimals` constant). | 2026-06-17 | verified |
| Total supply is `100,000,000 TIDE` (`100000000000000000000000000` base units). | `contracts/TikiDecoToken.sol` (`MAX_SUPPLY`); read-only Sepolia `totalSupply()` returned `100000000000000000000000000`. | 2026-06-17 | verified |
| Treasury token balance is `100,000,000 TIDE` on Sepolia at the time checked. | Read-only Sepolia `balanceOf(0xf1DAd608ddD5B71F039FEE82026164bc6a245081)` returned `100000000000000000000000000`; `deployments/canonical.json` records the same current balance. | 2026-06-17 | verified |
| Vesting vault token balance is `0 TIDE` on Sepolia at the time checked. | Read-only Sepolia `balanceOf(0xc480565482af6B08A3b65D0C9aba985d6240702E)` returned `0`. | 2026-06-17 | verified |
| Token transfers are not paused at the time checked. | Read-only Sepolia `paused()` returned `false`. | 2026-06-17 | verified |
| The deployed V1 token has no public mint function after construction. | `contracts/TikiDecoToken.sol`: `_mint` is private and called only in the constructor; tests cover fixed supply behavior. | 2026-06-17 | verified |

## Ownership, Treasury, And Safe

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Current token owner is `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`. | Read-only Sepolia `owner()` on token returned `0xb8aa322bcf931ae9dd0bd3fe57b03ab71b8a88c3`; `deployments/canonical.json` identifies this address as `ownerSafe`. | 2026-06-17 | verified |
| Current owner is described as a Sepolia Safe. | `deployments/canonical.json` (`ownership.ownerSafe`); `deployments/sepolia.json` (`ownershipModel: Safe multisig 3-of-3`); `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`. | 2026-06-17 | verified |
| Safe threshold is `3`. | Read-only Sepolia `getThreshold()` on `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` returned `3`; `deployments/canonical.json` records `safeThreshold: 3-of-3`. | 2026-06-17 | verified |
| Treasury address is `0xf1DAd608ddD5B71F039FEE82026164bc6a245081`. | `deployments/canonical.json`; `deployments/sepolia.json`; read-only Sepolia `balanceOf(treasury)` check. | 2026-06-17 | verified |
| Previous owner was `0xA9a4f99D5902850D3a6Afcd59838110D26B101E4`. | `deployments/canonical.json`; `deployments/sepolia.json`; ownership transfer transaction records listed in manifest. | 2026-06-17 | verified |
| Safe ownership transfer was recorded as completed at `2026-06-17T08:25:12.000Z`, block `11078670`. | `deployments/canonical.json`; `deployments/sepolia.json`; `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`. | 2026-06-17 | verified |

## Verification Status

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Token verification page is available on Sepolia Etherscan and contains contract-code content. | `deployments/canonical.json` verification URL; read-only GET to `https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code` returned HTTP `200` and contract-code page content. | 2026-06-17 | verified |
| Vesting vault verification page is available on Sepolia Etherscan and contains contract-code content. | `deployments/canonical.json` verification URL; read-only GET to `https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code` returned HTTP `200` and contract-code page content. | 2026-06-17 | verified |
| No mainnet contract verification exists in the repository. | `deployments/` contains Sepolia manifests only; `docs/ROADMAP.md` says Mainnet Gate is `not approved`. | 2026-06-17 | verified |

## Tests And Tooling

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Current local test suite result is `69 passing`. | `npm test` run in this workspace on 2026-06-18 returned `69 passing`; tests are in `test/*.js`; script is defined in `package.json`. | 2026-06-18 | verified |
| Tests cover V1 token, V1 vesting vault, V2 token, V2 vesting vault, and V2 invariant-style properties. | `test/TikiDecoToken.js`, `test/TikiDecoVestingVault.js`, `test/TikiDecoTokenV2.js`, `test/TikiDecoVestingVaultV2.js`, `test/TikiDecoInvariants.js`; `npm test` output. | 2026-06-17 | verified |
| `npm audit --audit-level=moderate` is configured as `npm run audit`. | `package.json`. | 2026-06-17 | verified |
| Slither command is configured but requires local Slither/solc setup. | `package.json` (`slither` script); `README.md` local development notes. | 2026-06-17 | verified |

## Audit And Review Status

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Internal security review exists and is in progress / repository-level, not a formal independent audit. | `SECURITY_REVIEW.md`; `deployments/canonical.json` (`auditStatus.internalReview: in-progress`). | 2026-06-17 | verified |
| Independent audit has not started. | `deployments/canonical.json` (`auditStatus.independentAudit: not-started`); `docs/ROADMAP.md` Phase 4 lists independent audit as planned. | 2026-06-17 | verified |
| Mainnet approval is false / not approved. | `deployments/canonical.json` (`mainnetApproved: false`); `docs/ROADMAP.md` Mainnet Gate status is `not approved`. | 2026-06-17 | verified |
| The project must not be described as audited. | `SECURITY_REVIEW.md` out-of-scope section excludes formal audit certification; `deployments/canonical.json` independent audit status is `not-started`. | 2026-06-17 | verified |

## Reports

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| One report is recorded on-chain in the V1 token at the time checked. | Read-only Sepolia `reportsCount()` returned `1`. | 2026-06-17 | verified |
| On-chain report ID `0` has category `safe-ownership-openzeppelin-v2`, document hash `0x04119c47a7c09f09bfdcee87d77925e6f5ec89c2ea1fe9759feaae7091c0b5cc`, and publication transaction `0x5886945fc62fb8a48e64559eebecaaf80ee20115a02c82808a737063874041f9`. | `deployments/canonical.json`; `docs/reports/REPORT_2026_06_17_SAFE_AND_V2_HASH.md`; read-only Sepolia `reportsCount()` confirms at least one report. | 2026-06-17 | verified |
| `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md` exists as a public repository report. | Repository file `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`. | 2026-06-17 | verified |
| `docs/reports/GENESIS_REPORT.md` exists as a repository report but is marked prepared, not yet published on-chain. | Repository file `docs/reports/GENESIS_REPORT.md`; `docs/reports/GENESIS_REPORT_HASH.md` (`Publication status: Prepared, not yet published on-chain`). | 2026-06-17 | verified |
| The `REPORT_2026_06_17_SAFE_AND_V2.md` file contains an older historical test count of `36 passing`; current public copy should prefer the separately verified current test count of `69 passing`. | Repository file `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`; current `npm test` run on 2026-06-18. | 2026-06-18 | verified |

## Current Functionality

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| V1 token supports ERC-20-style `totalSupply`, `balanceOf`, `allowance`, `transfer`, `approve`, and `transferFrom`. | `contracts/TikiDecoToken.sol`; `test/TikiDecoToken.js`. | 2026-06-17 | verified |
| V1 token has owner-controlled `pause()` and `unpause()` functions that block transfers while paused. | `contracts/TikiDecoToken.sol`; `test/TikiDecoToken.js`; read-only Sepolia `paused()` currently returned `false`. | 2026-06-17 | verified |
| V1 token supports two-step ownership transfer. | `contracts/TikiDecoToken.sol` (`Ownable2Step`); `test/TikiDecoToken.js`; Sepolia ownership transfer records in `deployments/canonical.json`. | 2026-06-17 | verified |
| V1 token can publish report hashes with `publishReport(bytes32 documentHash, string category, string uri)`. | `contracts/TikiDecoToken.sol`; `test/TikiDecoToken.js`; on-chain `reportsCount()` returned `1`. | 2026-06-17 | verified |
| V1 token rejects accidental native ETH transfers. | `contracts/TikiDecoToken.sol`; `test/TikiDecoToken.js`. | 2026-06-17 | verified |
| V1 vesting vault supports schedule creation, release, and revoke flows under the V1 funding model. | `contracts/TikiDecoVestingVault.sol`; `test/TikiDecoVestingVault.js`. | 2026-06-17 | verified |
| Current public site code includes a read-only trust dashboard that fetches `site/deployment-manifest.json` and uses read-only Sepolia RPC calls; it does not connect a wallet or submit transactions. | `site/app.js`; `scripts/build-site-manifest.cjs`; `site/index.html`. | 2026-06-17 | experimental |
| `site/deployment-manifest.json` is generated from `deployments/canonical.json` for GitHub Pages. | `scripts/build-site-manifest.cjs`; `.github/workflows/pages.yml`; `package.json` (`site:build`). | 2026-06-17 | experimental |

## Planned Or Experimental Functionality

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Independent security audit is planned but not complete. | `docs/ROADMAP.md` Phase 4; `deployments/canonical.json` audit status. | 2026-06-17 | planned |
| Legal and governance structure work is in progress. | `docs/ROADMAP.md` Phase 3. | 2026-06-17 | planned |
| Community preview is planned. | `docs/ROADMAP.md` Phase 5. | 2026-06-17 | planned |
| Mainnet deployment is not approved and should be considered only after legal review, audit, treasury review, final utility, final docs, and risk disclosure. | `docs/ROADMAP.md` Phase 6. | 2026-06-17 | planned |
| Possible utility scenarios include loyalty/access eligibility, community rewards, event RSVP priority, transparent project reporting, partner perk campaigns, and non-binding governance signaling. | `docs/UTILITY.md`. | 2026-06-17 | planned |
| Utility scenarios are not active guest benefits, not financial rights, and not guaranteed future commitments. | `docs/UTILITY.md`; `docs/ROADMAP.md`; `site/index.html`. | 2026-06-17 | planned |
| V2 candidate may provide OpenZeppelin ERC-20 base, AccessControl roles, Pausable, SafeERC20, ReentrancyGuard, explicit cliff plus vesting duration, prefunded vault accounting, and bounded report metadata if reviewed and promoted later. | `docs/OPENZEPPELIN_V2.md`; `contracts/TikiDecoTokenV2.sol`; `contracts/TikiDecoVestingVaultV2.sol`. | 2026-06-17 | experimental |

## Unknown Or Not Publicly Claimable

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| A completed TikiDeco hotel property exists. | No confirming repository or on-chain source found. Current docs describe a future concept/prototype. | 2026-06-17 | unknown |
| TikiDeco has confirmed hotel partners, permits, customers, bookings, or operating hospitality services. | No confirming repository or on-chain source found. | 2026-06-17 | unknown |
| TIDE has a monetary value, sale price, presale, exchange listing, or mainnet market. | No confirming repository or on-chain source found; docs repeatedly state testnet/no offering boundaries. | 2026-06-17 | unknown |
| TIDE gives equity, debt, revenue share, profit share, dividends, real-estate ownership, or investment return rights. | No confirming repository or on-chain source found; docs explicitly prohibit this framing. | 2026-06-17 | unknown |
| TikiDeco has completed an independent audit. | `deployments/canonical.json` says independent audit `not-started`; `SECURITY_REVIEW.md` is internal review only. | 2026-06-17 | unknown |
| V2 contracts are deployed as the active Sepolia or mainnet version. | `deployments/canonical.json` marks V2 as non-canonical candidate; no V2 deployment manifest is canonical. | 2026-06-17 | unknown |

## Public Copy Guardrails

Use:

- "Sepolia testnet prototype"
- "no stated monetary value"
- "not sold and not deployed on mainnet"
- "future hospitality-linked concept"
- "possible utility scenarios subject to legal, operational, and security review"
- "internal security review in progress; independent audit not started"
- "V2 candidate code, not canonical deployment"

Do not use:

- "investment"
- "presale"
- "profit"
- "price growth"
- "guaranteed utility"
- "hotel ownership"
- "revenue share"
- "audited"
- "approved mainnet launch"
- "confirmed partners"
- "completed property"

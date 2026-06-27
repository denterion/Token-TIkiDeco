# TikiDeco Project Facts

Verification date: 2026-06-28

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
| V1 `projectURI()` currently returns `https://tikideco.xyz/legal/project-status/`. | Read-only Sepolia `projectURI()` call after Safe execution returned `https://tikideco.xyz/legal/project-status/`; execution transaction `0xcb344831fbda491e31e373e1a184eb101710de91b679e3b1dedf2fafaf64d811`. | 2026-06-19 | verified |

## Ownership, Treasury, And Safe

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Current token owner is `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3`. | Read-only Sepolia `owner()` on token returned `0xb8aa322bcf931ae9dd0bd3fe57b03ab71b8a88c3`; `deployments/canonical.json` identifies this address as `ownerSafe`. | 2026-06-17 | verified |
| Current owner is described as a Sepolia Safe. | `deployments/canonical.json` (`ownership.ownerSafe`); `deployments/sepolia.json` (`ownershipModel: Safe multisig 3-of-3`); `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`. | 2026-06-17 | verified |
| Safe threshold is `3`. | Read-only Sepolia `getThreshold()` on `0xB8Aa322bCF931aE9dD0BD3fE57B03AB71B8A88c3` returned `3`; `deployments/canonical.json` records `safeThreshold: 3-of-3`. | 2026-06-17 | verified |
| Treasury address is `0xf1DAd608ddD5B71F039FEE82026164bc6a245081`. | `deployments/canonical.json`; `deployments/sepolia.json`; read-only Sepolia `balanceOf(treasury)` check. | 2026-06-17 | verified |
| Previous owner was `0xA9a4f99D5902850D3a6Afcd59838110D26B101E4`. | `deployments/canonical.json`; `deployments/sepolia.json`; ownership transfer transaction records listed in manifest. | 2026-06-17 | verified |
| Safe ownership transfer was recorded as completed at `2026-06-17T08:25:12.000Z`, block `11078670`. | `deployments/canonical.json`; `deployments/sepolia.json`; `docs/reports/REPORT_2026_06_17_SAFE_AND_V2.md`. | 2026-06-17 | verified |
| Safe executed the V1 `projectURI` update at block `11093006`, timestamp `2026-06-19T08:20:24.000Z`. | Read-only Sepolia receipt for `0xcb344831fbda491e31e373e1a184eb101710de91b679e3b1dedf2fafaf64d811`; `docs/reports/REPORT_2026_06_19_V1_PROJECT_URI_UPDATE.md`. | 2026-06-19 | verified |

## Verification Status

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Token verification page is available on Sepolia Etherscan and contains contract-code content. | `deployments/canonical.json` verification URL; read-only GET to `https://sepolia.etherscan.io/address/0xE4c1DE533440b411Be5C17883FF662e95a462097#code` returned HTTP `200` and contract-code page content. | 2026-06-17 | verified |
| Vesting vault verification page is available on Sepolia Etherscan and contains contract-code content. | `deployments/canonical.json` verification URL; read-only GET to `https://sepolia.etherscan.io/address/0xc480565482af6B08A3b65D0C9aba985d6240702E#code` returned HTTP `200` and contract-code page content. | 2026-06-17 | verified |
| No mainnet contract verification exists in the repository. | `deployments/` contains Sepolia manifests only; `docs/ROADMAP.md` says Mainnet Gate is `not approved`. | 2026-06-17 | verified |

## Tests And Tooling

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Current local test suite result is `69 passing`. | `npm test` run in this workspace on 2026-06-26 returned `69 passing`; tests are in `test/*.js`; script is defined in `package.json`. | 2026-06-26 | verified |
| Tests cover V1 token, V1 vesting vault, V2 token, V2 vesting vault, and V2 invariant-style properties. | `test/TikiDecoToken.js`, `test/TikiDecoVestingVault.js`, `test/TikiDecoTokenV2.js`, `test/TikiDecoVestingVaultV2.js`, `test/TikiDecoInvariants.js`; `npm test` output. | 2026-06-17 | verified |
| `npm run audit` runs dependency audit and the V2 candidate audit-package guard. | `package.json` (`audit`, `audit:deps`, `audit:package`); local `npm run audit` on 2026-06-26 returned `found 0 vulnerabilities` and generated the V2 audit package. | 2026-06-26 | verified |
| Slither command is configured but requires local Slither/solc setup. | `package.json` (`slither` script); `README.md` local development notes. | 2026-06-17 | verified |
| Dependency triage and post-merge audit-evidence sync for the V2 review track were merged through `e74c85612e745f14aa92260bf8b3633f9fd9fa4a` without changing V1 deployed semantics, V2 candidate contract semantics, or canonical deployment addresses. | `AUDIT_SCOPE.md`; `docs/DEPENDENCY_TRIAGE_2026_06_24.md`; `package.json`; `package-lock.json`; git history. | 2026-06-25 | verified |
| Current dependency-review state keeps `@react-three/fiber` semver-major updates blocked until a dedicated React 19 / R3F 9 migration. | `.github/dependabot.yml`; `docs/DEPENDENCY_TRIAGE_2026_06_24.md`; open Dependabot PR review. | 2026-06-25 | verified |

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
| `docs/reports/REPORT_2026_06_19_V1_PROJECT_URI_UPDATE.md` records the executed V1 `projectURI` update transaction. | Repository file `docs/reports/REPORT_2026_06_19_V1_PROJECT_URI_UPDATE.md`; SHA-256 in `docs/reports/REPORT_2026_06_19_V1_PROJECT_URI_UPDATE_HASH.md`; read-only Sepolia receipt for `0xcb344831fbda491e31e373e1a184eb101710de91b679e3b1dedf2fafaf64d811`. | 2026-06-19 | verified |
| `docs/reports/REPORT_2026_06_24_PUBLIC_RELEASE_AND_LOCALIZATION.md` records the public release and EN/ES/RU site-localization update. | Repository file `docs/reports/REPORT_2026_06_24_PUBLIC_RELEASE_AND_LOCALIZATION.md`; SHA-256 in `docs/reports/REPORT_2026_06_24_PUBLIC_RELEASE_AND_LOCALIZATION_HASH.md`. | 2026-06-24 | verified |
| `docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK.md` records the first privacy-safe community preview feedback intake summary. | Repository file `docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK.md`; SHA-256 in `docs/reports/REPORT_2026_06_27_COMMUNITY_PREVIEW_FEEDBACK_HASH.md`; GitHub issues #55 through #66. | 2026-06-27 | verified |

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
| The public 3D site includes EN/ES/RU localized UI copy. | `site-v2/src/data/i18n.ts`; `site-v2/src/main.tsx`; `site/index.html`. | 2026-06-24 | verified |
| `v0.2.0-utility-pilot` is published as a GitHub pre-release for read-only utility-pilot preparation. | GitHub release `v0.2.0-utility-pilot`; `docs/releases/v0.2.0-utility-pilot.md`; source commit `5ed20415b569779f8b00245af8b98b9599f77044`. | 2026-06-26 | verified |
| `v0.2.0-utility-pilot-rc.1` is a release-candidate draft document, not a published release and not a live campaign. | `docs/releases/v0.2.0-utility-pilot-rc.1.md`; `docs/releases/v0.2.0-utility-pilot-rc.1-checklist.md`. | 2026-06-26 | planned |

## Planned Or Experimental Functionality

| Fact | Source | Checked | Status |
| --- | --- | --- | --- |
| Independent security audit is planned but not complete. | `docs/ROADMAP.md` Phase 4; `deployments/canonical.json` audit status. | 2026-06-17 | planned |
| Legal and governance structure work is in progress. | `docs/ROADMAP.md` Phase 3. | 2026-06-17 | planned |
| Community preview is preparing, and the first public feedback issues are open. | `docs/ROADMAP.md` Phase 5; `docs/COMMUNITY_PREVIEW.md`; `docs/FEEDBACK_GUIDE.md`; GitHub issues #55 through #66. | 2026-06-27 | planned |
| Mainnet deployment is not approved and should be considered only after legal review, audit, treasury review, final utility, final docs, and risk disclosure. | `docs/ROADMAP.md` Phase 6. | 2026-06-17 | planned |
| Possible utility scenarios include loyalty/access eligibility, community rewards, event RSVP priority, transparent project reporting, partner perk campaigns, and non-binding governance signaling. | `docs/UTILITY.md`. | 2026-06-17 | planned |
| Utility scenarios are not active guest benefits, not financial rights, and not guaranteed future commitments. | `docs/UTILITY.md`; `docs/ROADMAP.md`; `site/index.html`. | 2026-06-17 | planned |
| V2 candidate may provide OpenZeppelin ERC-20 base, AccessControl roles, Pausable, SafeERC20, ReentrancyGuard, explicit cliff plus vesting duration, prefunded vault accounting, and bounded report metadata if reviewed and promoted later. | `docs/OPENZEPPELIN_V2.md`; `contracts/TikiDecoTokenV2.sol`; `contracts/TikiDecoVestingVaultV2.sol`. | 2026-06-17 | experimental |
| A proposed V2 audit-target freeze baseline is documented for external audit preparation. | `docs/V2_AUDIT_TARGET_FREEZE.md`; `AUDIT_SCOPE.md`; `KNOWN_ISSUES.md`. | 2026-06-24 | experimental |
| TIDE Loyalty Pilot documentation is planned as a limited Sepolia-only utility pilot framework. | `docs/utility-pilot/README.md`; `docs/utility-pilot/TIDE_LOYALTY_PILOT.md`. | 2026-06-25 | planned |
| Eligibility rules for a future pilot are documented but not live. | `docs/utility-pilot/ELIGIBILITY_RULES.md`. | 2026-06-25 | planned |
| Wallet signature verification for a future pilot is documented as off-chain message signing with no transaction signing and no private key collection. | `docs/utility-pilot/WALLET_VERIFICATION.md`. | 2026-06-25 | planned |
| Early RSVP pilot flow is documented as a possible limited non-cash pilot category, not an active benefit. | `docs/utility-pilot/PERK_INVENTORY.md`; `docs/utility-pilot/TIDE_LOYALTY_PILOT.md`. | 2026-06-25 | planned |
| Pilot reports are planned as privacy-safe summaries for future campaigns. | `docs/utility-pilot/README.md`; `docs/utility-pilot/TIDE_LOYALTY_PILOT.md`; `docs/BUSINESS_MODEL.md`. | 2026-06-25 | planned |
| Business model documentation describes hospitality operations plus transparency infrastructure, not token speculation. | `docs/BUSINESS_MODEL.md`; `docs/VALUE_AND_UTILITY_BOUNDARY.md`. | 2026-06-25 | planned |
| The v0.2 utility-pilot site flow is planned to perform a real read-only Sepolia `balanceOf(wallet)` check against the canonical TIDE token without wallet connection or transaction signing. | `site-v2/src/components/PilotEligibilityCard.tsx`; `site-v2/src/lib/eligibility/readOnlyBalance.ts`; `scripts/test-eligibility-engine.cjs`. | 2026-06-25 | planned |
| Testnet allocation policy and allocation report template are prepared for a future Sepolia-only campaign. | `docs/utility-pilot/TESTNET_ALLOCATION_POLICY.md`; `docs/utility-pilot/ALLOCATION_REPORT_TEMPLATE.md`; `scripts/check-allocation-report.cjs`. | 2026-06-25 | planned |
| Testnet allocation is not active; allocation drafts remain non-broadcast planning artifacts until campaign approvals and manual Safe review are complete. | `operations/utility-pilot/testnet-allocation-draft.json`; `operations/utility-pilot/safe-transaction-builder-draft.json`; `docs/utility-pilot/TESTNET_ALLOCATION_POLICY.md`. | 2026-06-26 | planned |
| The first utility pilot campaign manifest is prepared as `draft-not-live` and fails closed unless approvals, campaign window or approved live-check window, snapshot, inventory, and reporting fields are completed before publication. | `config/utility-pilot/tide-community-preview-001.json`; `docs/utility-pilot/CAMPAIGN_RULES_SCHEMA.md`; `scripts/check-pilot-campaign.cjs`. | 2026-06-26 | planned |
| A live-campaign blocker register exists and is intentionally blocked until legal, privacy, security, operations, governance, snapshot/window, inventory, allocation-report, staff-process, dispute-process, feedback, and transparency gates have evidence, owner roles, and approval status. | `config/utility-pilot/live-readiness-gates.json`; `docs/utility-pilot/PILOT_LIVE_BLOCKER_REGISTER.md`; `scripts/check-pilot-live-readiness.cjs`. | 2026-06-28 | planned |
| A three-phase operational roadmap exists for public verification, limited Sepolia preview preparation, and V2 audit handoff readiness. | `docs/THREE_PHASE_ROADMAP.md`; `docs/ROADMAP.md`; `docs/NEXT_RELEASE_GATES.md`. | 2026-06-27 | planned |
| A short start-here path exists for community, operator, security, release, governance, and legal/privacy reviewers. | `docs/START_HERE.md`; `README.md`. | 2026-06-27 | verified |
| A limited live-preview path exists, but it is blocked planning documentation and does not publish a live campaign. | `docs/utility-pilot/LIMITED_LIVE_PREVIEW_PATH.md`; `config/utility-pilot/live-readiness-gates.json`; `npm run pilot:live:blocked`. | 2026-06-27 | planned |
| V2 owner-decision and role-manifest review checklists exist for audit-preparation discipline. | `docs/V2_AUDIT_OWNER_DECISIONS.md`; `docs/V2_ROLE_MANIFEST_REVIEW_CHECKLIST.md`; `KNOWN_ISSUES.md`. | 2026-06-27 | planned |
| Playwright browser regression checks exist for the public site and read-only eligibility card. | `playwright.config.ts`; `site-v2/tests/site-regression.spec.ts`; `npm run site:browser`. | 2026-06-28 | verified |

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

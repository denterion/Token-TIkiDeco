# TikiDeco Community Reviewer Outreach Kit

Status: maintainer outreach material for an open community peer review. No reviewer engagement, finding, endorsement, compensation, or completed formal audit is represented by this document.

## One-Sentence Explanation

TikiDeco is an open-source Ethereum Sepolia prototype testing transparent hospitality-loyalty infrastructure, with a frozen non-deployed V2 candidate available for reproducible community peer review.

## Immutable Review Identity

- Candidate evidence commit: [`cdc9e7e27e66f204c50d59e45ccf970ad20290d6`](https://github.com/denterion/Token-TIkiDeco/tree/cdc9e7e27e66f204c50d59e45ccf970ad20290d6)
- Frozen V2 source commit: [`9099fdb87a6be715b1d7fd4fafa6fade0b12b61c`](https://github.com/denterion/Token-TIkiDeco/commit/9099fdb87a6be715b1d7fd4fafa6fade0b12b61c)
- Package SHA-256: `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`
- Machine-readable definition: [`config/audit/v2-review-candidate.json`](../../config/audit/v2-review-candidate.json)

## Exact Scope

Primary source:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `scripts/deploy-v2.cjs`

Supporting evidence includes the V2 Hardhat tests, Foundry invariants, Slither baseline, known issues `KI-01` through `KI-09`, role-template assumptions, deployment guardrails, ABI and bytecode evidence listed in the immutable candidate definition. V1 deployed semantics, public-network deployment, legal conclusions, operator readiness and production decisions are out of scope.

## Review Paths And Time

| Path | Expected reviewer time | Outcome |
| --- | ---: | --- |
| Verification | About 30 minutes | Confirm candidate identity, checksum, scope, canonical V1 boundary and reproducibility entry points. |
| Focused review | About 2 hours | Inspect one or more risk areas: roles, pause behavior, vesting liabilities, revoke/refund accounting, metadata bounds or deployment guards. |
| Full technical review | Planning estimate: 1-3 reviewer days | Reproduce the package, inspect all scoped source and tests, address known issues and reviewer questions, and submit written observations. Actual scope and timing remain reviewer-controlled. |

Community peer review is not a formal independent smart-contract audit. A full formal engagement, timeline and retest process would require a separate written agreement.

## Useful Experience

- Solidity and ERC-20 behavior;
- OpenZeppelin `AccessControlDefaultAdminRules` and pause patterns;
- vesting, liability and treasury accounting;
- Hardhat or Foundry testing and invariant reasoning;
- deployment-script and role-configuration review;
- coordinated vulnerability disclosure.

The 30-minute verification path is also suitable for contributors learning reproducible review. Security conclusions require evidence, not credentials alone.

## What Reviewers Receive

- public source pinned to an exact commit;
- candidate and freeze manifests;
- compiler, optimizer and dependency-lock identity;
- Hardhat tests, Foundry invariants and Slither baseline;
- known issues, owner decisions and explicit reviewer questions;
- finding schema, lifecycle and private disclosure route.

No private key, seed phrase, signer recovery material, private participant data or transaction authority is required. No reviewer compensation or bounty budget is currently approved or promised.

## Verify Before Reviewing

```bash
git clone https://github.com/denterion/Token-TIkiDeco.git
cd Token-TIkiDeco
git checkout cdc9e7e27e66f204c50d59e45ccf970ad20290d6
npm ci
npm run review:candidate:check
npm run community-review:check
```

Confirm that `config/audit/v2-review-candidate.json` records package SHA-256 `980555973d47cb5b21b900f3d463890d4faeeff1c45d351332906f5149bae1a2`. Stop and contact the maintainer if the commit, freeze, lock hash or package checksum differs.

## Findings And Sensitive Disclosure

Public-safe reproducibility questions, test suggestions and non-sensitive findings may use the [Community Review issue forms](https://github.com/denterion/Token-TIkiDeco/issues/new/choose).

Do not publish an exploitable unresolved Critical or High issue. Use [GitHub private vulnerability reporting](https://github.com/denterion/Token-TIkiDeco/security/advisories/new) and follow [`SECURITY.md`](../../SECURITY.md). Never submit secrets or private participant data.

## Credit

Reviewers may be credited only after a real contribution and explicit consent under [`ACKNOWLEDGEMENT_POLICY.md`](ACKNOWLEDGEMENT_POLICY.md). Silence, outreach, interest or attendance is not consent. Current acknowledgement state remains empty until evidence exists.

## Outreach Drafts

<!-- outreach-drafts:start -->

### X

TikiDeco has opened community peer review for a frozen, non-deployed V2 Solidity candidate. Choose a 30-minute verification, 2-hour focus, or full technical path. Exact commit, checksum, known issues, and private disclosure route: https://tikideco.xyz/community-review/

### LinkedIn

TikiDeco is inviting evidence-based community peer review of its frozen V2 candidate for an Ethereum Sepolia prototype. The scope includes two Solidity contracts, the guarded V2 deployment script, Hardhat tests, Foundry invariants, known issues, and static-analysis evidence.

Reviewers can choose a 30-minute reproducibility check, a 2-hour focused review, or a broader technical path. The candidate is pinned to an exact commit and package checksum. V2 is non-deployed and non-canonical, and community review is not a formal independent smart-contract audit.

Review guide and sensitive disclosure route: https://tikideco.xyz/community-review/

### Direct Message

Hello. I maintain TikiDeco, an open-source Ethereum Sepolia prototype. We have a frozen, non-deployed V2 Solidity candidate with reproducible tests, known issues, and an exact package checksum. Would you be interested in a 30-minute verification or a focused review of access control or vesting accounting? There is no assumption that you will participate, and no compensation is currently approved. Scope and private disclosure instructions: https://tikideco.xyz/community-review/

### University Blockchain Or Security Community

TikiDeco is looking for students and researchers who want a bounded, reproducible Solidity review exercise. The public package contains two V2 contracts, tests, invariants, known issues, role assumptions, and a checksum-pinned evidence bundle. Suggested paths take about 30 minutes or 2 hours, with a deeper path available. This is community peer review of a non-deployed candidate, not a formal audit. Start here: https://tikideco.xyz/community-review/

### Open-Source Solidity Community

Peer-review request: frozen V2 ERC-20 and prefunded vesting-vault candidate, pinned to commit `cdc9e7e27e66f204c50d59e45ccf970ad20290d6`. Focus areas include default-admin transfer rules, role separation, pause effects, liability accounting, revoke/refund behavior, metadata bounds, and fail-closed deployment configuration. Reproduction paths and coordinated disclosure: https://tikideco.xyz/community-review/

### GitHub Discussion Draft

Title: Community peer review: frozen TikiDeco V2 candidate

TikiDeco has published a checksum-pinned, non-deployed V2 candidate for community peer review. Please choose the 30-minute verification, 2-hour focused review, or full technical path in the reviewer guide. Use public threads only for non-sensitive observations. Potentially exploitable unresolved issues belong in GitHub private vulnerability reporting. No reviewer is assumed or acknowledged until a real contribution and consent exist.

This draft may be posted only after GitHub Discussions is enabled and moderation rules are confirmed.

<!-- outreach-drafts:end -->

## Maintainer Use

1. Verify the candidate and checksum before each outreach batch.
2. Select recipients using [`REVIEWER_SELECTION_CHECKLIST.md`](../REVIEWER_SELECTION_CHECKLIST.md) and [`REVIEWER_CONFLICT_POLICY.md`](../REVIEWER_CONFLICT_POLICY.md).
3. Send one relevant draft without implying agreement, urgency or scarcity.
4. Record only public-safe evidence in `operations/community-review/outreach.json`.
5. Schedule [`FIRST_REVIEW_SESSION.md`](FIRST_REVIEW_SESSION.md) only after a person replies with interest.
6. Credit a reviewer only after contribution evidence and explicit consent.

### Tracking Record Contract

When a real contact exists, add only public-safe fields: `reviewerId`, `publicProfileUrl`, `candidateCommit`, approved `status`, `evidenceReference`, and `updatedAt`. Evidence may be a public HTTPS URL or `private-reference:sha256:<hash>` when the underlying record must remain private. Do not store email addresses, phone numbers, message contents or sensitive report details in the repository.

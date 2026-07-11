# Public V2 Review Procurement Brief

Status: request for an independent technical review of frozen non-canonical candidate code. This is not mainnet approval and not a completed formal independent smart-contract audit.

## Project Summary

TikiDeco is an open-source Ethereum Sepolia prototype. V1 remains the canonical legacy Sepolia deployment. V2 is non-deployed candidate code intended for independent validation before any deployment decision.

## Exact Scope

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `scripts/deploy-v2.cjs`
- V2 Hardhat tests and Foundry invariant tests listed in `config/audit/v2-independent-review.json`
- role model, deployment guardrails, known issues, static-analysis baseline and package reproducibility

Approximate scope size:

- 367 Solidity source lines across the two primary contracts;
- 231 JavaScript lines in the V2 deployment script;
- approximately 1,510 test and invariant source lines.

Generated package metadata records the exact freeze commit, evidence commit, compiler settings, dependency lock hash and content checksums.

## Reviewer Qualifications

- verifiable Solidity and ERC-20 review history;
- public or referenceable prior work of comparable access-control or vesting scope;
- experience with OpenZeppelin `AccessControlDefaultAdminRules`, ERC-20 pause semantics and accounting invariants;
- independence from TikiDeco treasury, token allocation and future deployment decisions;
- ability to provide written findings and a scoped retest.

## Requested Methodology

Review source and deployment assumptions manually; reproduce Hardhat and Foundry tests; inspect Slither baseline classifications; validate access-control transitions, prefunded vesting liabilities, revoke/refund accounting, pause behavior, metadata/report integrity and fail-closed deployment configuration. Tool output alone is not a substitute for manual reasoning.

## Severity Taxonomy

| Severity | Meaning |
| --- | --- |
| Critical | Direct fund/supply compromise or privileged takeover with immediate severe impact. |
| High | Material custody, authorization or accounting exploit with serious impact. |
| Medium | Meaningful security or operational failure requiring remediation or explicit risk acceptance. |
| Low | Limited-impact weakness, defense-in-depth gap or clarity problem. |
| Informational | Non-exploitable documentation, tooling or maintainability observation. |

## Deliverables

- scope and methodology confirmation;
- draft findings with file/line, scenario, likelihood, impact and remediation;
- review of every explicit auditor question and accepted Slither classification;
- final findings register after maintainer responses;
- retest result tied to exact remediation commits;
- publishable final report if a formal engagement and publication terms are agreed.

## Draft, Remediation And Retest

The reviewer sends a private draft first. Maintainers triage without suppressing disputed findings, apply narrow remediation branches, add regression tests and provide exact commits for retest. Any contract change resets the V2 freeze and requires a new package checksum.

## Disclosure And Conflicts

The reviewer must disclose financial, employment, advisory, token-allocation or treasury relationships. Compensation must not depend on token distribution, market activity, listing, finding count or a favorable conclusion. Publication timing, coordinated disclosure and any confidentiality period must be agreed in writing.

## Confidentiality Boundaries

The package contains public source and review evidence only. Reviewers must not request private keys, seed phrases, signer recovery material, private participant data or public-network transaction authority.

## Timeline And Budget

- Review window: `[to be agreed]`
- Draft report target: `[to be agreed]`
- Remediation/retest window: `[to be agreed]`
- Budget and payment terms: `[to be agreed]`

These placeholders are procurement inputs, not commitments. This candidate review does not approve mainnet, a token sale, liquidity, listing, value claims or active hospitality benefits.

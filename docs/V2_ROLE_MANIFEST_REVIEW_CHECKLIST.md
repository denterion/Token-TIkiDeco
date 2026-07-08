# V2 Role Manifest Review Checklist

Status: release-review checklist for V2 candidate deployments. This checklist does not approve deployment, does not promote V2 to canonical, and does not approve mainnet.

Use this checklist before any public-network V2 candidate deployment proposal or audit simulation.

## Required Inputs

- V2 deployment configuration file or environment snapshot.
- Generated role manifest.
- Intended network and chain ID.
- Intended default admin address.
- Intended pauser address.
- Intended reporter address.
- Intended vesting admin address.
- Intended treasury address.
- Intended Safe address and Safe threshold.
- Default admin transfer delay.
- Role-transfer evidence, if any role is transferred after deployment.
- Intended non-canonical deployment confirmation.
- Public-network fail-closed deployment config.

## Address Review

| Check | Required result | Reviewer |
| --- | --- | --- |
| Default admin is explicit. | No public network fallback to deployer. | Release manager |
| Pauser is explicit. | No public network fallback to deployer. | Security reviewer |
| Reporter is explicit. | No public network fallback to deployer. | Security reviewer |
| Vesting admin is explicit. | No public network fallback to deployer. | Security reviewer |
| Treasury is explicit. | No public network fallback to deployer. | Treasury/governance reviewer |
| Zero addresses rejected. | Deployment script fails closed. | Release manager |
| Shared role addresses are intentional. | Any shared address is documented with reason. | Governance reviewer |
| Deployer has no unintended privileged role. | Role assertion passes after deployment simulation. | Security reviewer |
| Safe threshold is reviewed. | Threshold is documented and matches governance policy for the candidate network. | Governance reviewer |
| Emergency pause owner is reviewed. | `PAUSER_ROLE` holder is explicit, reachable, and operationally separate when required. | Security reviewer |
| Role-transfer evidence is attached. | Admin-transfer or role-grant/revoke evidence is linked when a post-deploy transfer occurs. | Release manager |
| Public-network config fails closed. | Missing role, treasury, metadata, or confirmation variables reject deployment. | Release manager |

## Role Manifest Required Fields

| Role or address | Required evidence |
| --- | --- |
| Default admin | Address, Safe or EOA classification, admin-transfer delay, expected holder assertion. |
| Pauser | Address, emergency pause owner rationale, expected holder assertion. |
| Reporter | Address, report-publisher rationale, expected holder assertion. |
| Vesting admin | Address, vesting-operations rationale, expected holder assertion. |
| Treasury | Address, token custody rationale, non-zero assertion. |
| Deployer | Explicit proof that no unintended privileged role remains. |
| Safe threshold | Threshold, owner-count source, governance reviewer note. |
| Role transfer | Transaction hash or local deployment simulation evidence; if none, state `not applicable`. |

## Metadata Review

| Check | Required result |
| --- | --- |
| Project name | Neutral, bounded, non-empty, and approved. |
| Business entity | Bounded, non-empty, and not misleading. |
| Jurisdiction | Bounded, non-empty, and reviewed. |
| Project URI | Points to approved public project-status page or candidate metadata page. |
| V2 status | Explicitly non-canonical candidate. |

## On-Chain Assertions

Before any public V2 candidate deployment is considered reviewable, the script must assert:

- expected default admin has the default admin role;
- expected pauser has pauser role;
- expected reporter has reporter role;
- expected vesting admin has vesting admin role;
- expected treasury is configured;
- deployer does not retain unexpected privileged roles;
- role manifest exactly matches expected addresses;
- token supply equals fixed `MAX_SUPPLY`;
- no post-constructor mint path exists.
- zero address checks are enforced for every privileged role and treasury field;
- public-network deployment fails without explicit role config and `CONFIRM_NON_CANONICAL_V2_DEPLOY=true`;
- Safe threshold evidence is recorded when a Safe is used for default admin, pauser, reporter, vesting admin, or treasury;
- emergency pause owner is identified and documented.

## Required Commands

```bash
npm test
npm run lint
npm run slither
npm run audit
npm run audit:handoff
```

If the deployment proposal touches site or public docs, also run:

```bash
npm run claims
npm run value
npm run site
```

## Rejection Conditions

Reject the deployment proposal if:

- any privileged address is missing on a public network;
- deployer keeps an unexpected privileged role;
- role manifest and deployment config disagree;
- treasury differs from the reviewed address;
- Safe threshold is missing or not reviewed;
- emergency pause owner is missing or not reviewed;
- role-transfer evidence is missing for post-deploy role changes;
- public-network deployment config silently falls back to deployer;
- metadata implies sale, value, mainnet, live guest benefits, property rights, or independent audit completion;
- deployment confirmation is missing;
- V2 is described as canonical.

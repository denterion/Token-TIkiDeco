# Pull Request Brief: OpenZeppelin V2 Contract Track

## Title

Add OpenZeppelin V2 contract track

## Summary

This PR adds a separate OpenZeppelin-based V2 implementation for the TikiDeco / TIDE contract system without replacing the currently deployed Sepolia V1 contracts.

V2 keeps the existing project behavior while moving core primitives to OpenZeppelin:

- `ERC20`
- `AccessControl`
- `Pausable`
- `SafeERC20`
- `ReentrancyGuard`

## Scope

Added:

- `contracts/TikiDecoTokenV2.sol`
- `contracts/TikiDecoVestingVaultV2.sol`
- `scripts/deploy-v2.cjs`
- `docs/OPENZEPPELIN_V2.md`
- V2 test coverage for token and vesting behavior
- V2 deploy scripts for localhost and Sepolia

Updated:

- README contract table and V2 references
- deployment docs with V2 deploy command
- public site test count

## Security Notes

V2 preserves:

- fixed `100,000,000 TIDE` supply
- no public mint function
- owner/treasury separation
- role-based admin, pauser, reporter, and vesting admin permissions
- prefunded vesting vault accounting
- treasury-only refund on revoke
- two-step treasury transfer
- standard OpenZeppelin ERC-20 allowance behavior
- pause/unpause role controls
- bounded report hash publishing with period, version, and supersede metadata
- explicit cliff duration and post-cliff linear vesting duration
- revocable vesting schedules
- native ETH rejection

Expected OpenZeppelin v5 behavior differences:

- paused transfers revert with `EnforcedPause`
- unauthorized role calls revert with `AccessControlUnauthorizedAccount`
- insufficient allowance uses `ERC20InsufficientAllowance`

## Verification

```text
npm test
56 passing
```

## Review Checklist

- Confirm V2 contracts preserve intended V1 behavior.
- Confirm OpenZeppelin v5 custom errors are acceptable.
- Confirm V2 remains a candidate implementation and does not overwrite current Sepolia V1 deployment.
- Confirm Safe ownership documentation from `main` is preserved after merge.
- Decide separately whether V2 should be deployed to Sepolia.

## Suggested Merge Policy

Merge after review and CI pass. Do not deploy V2 automatically as part of this PR.

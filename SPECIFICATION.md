# TikiDeco V2 Candidate Specification

Status: candidate specification for internal review. V2 is not canonical and is not independently audited.

## TikiDecoTokenV2

### Construction

Inputs:

- `defaultAdmin`
- `pauser`
- `reporter`
- `treasury`
- `initialProjectName`
- `initialBusinessEntity`
- `initialProjectJurisdiction`
- `initialProjectURI`
- `defaultAdminDelay`

Requirements:

- `defaultAdmin != address(0)`
- `pauser != address(0)`
- `reporter != address(0)`
- `treasury != address(0)`
- metadata fields are non-empty and bounded;
- mint exactly `100_000_000 * 10 ** 18` TIDE to treasury;
- grant `DEFAULT_ADMIN_ROLE` to `defaultAdmin` using OpenZeppelin `AccessControlDefaultAdminRules`;
- grant `PAUSER_ROLE` to `pauser`;
- grant `REPORTER_ROLE` to `reporter`.

### ERC-20 Behavior

- Standard OpenZeppelin ERC-20 transfer, approval, and allowance behavior.
- Paused state blocks token updates through `_update`.
- No public mint function after construction.
- Native ETH receive/fallback reverts.
- `updateProjectURI` is default-admin only and validates non-empty bounded URI input.

### Reports

`publishReport` requires:

- non-zero `documentHash`;
- non-empty bounded `category`;
- non-empty bounded `uri`;
- non-empty bounded `version`;
- `periodStart <= periodEnd`;
- `supersedesReportId` is either sentinel value or an existing report id.

Expected events:

- `ProjectReportPublished`
- `ProjectReportSuperseded` when applicable.

## TikiDecoVestingVaultV2

### Construction

Inputs:

- `tokenAddress`
- `defaultAdmin`
- `vestingAdmin`
- `initialTreasury`
- `defaultAdminDelay`

Requirements:

- no zero addresses;
- token address must contain code;
- grant `DEFAULT_ADMIN_ROLE` to `defaultAdmin` using OpenZeppelin `AccessControlDefaultAdminRules`;
- grant `VESTING_ADMIN_ROLE` to `vestingAdmin`.

### Funding Model

- Vault must be prefunded with TIDE.
- Schedule creation reserves unreserved vault balance.
- `outstandingLiabilities() = totalReserved - totalReleased`.
- `unreservedBalance() = max(token.balanceOf(vault) - outstandingLiabilities, 0)`.

### Vesting Model

- Before or at `start + cliffDuration`: vested amount is `0`.
- After cliff: linear vesting begins.
- Full vesting occurs at `start + cliffDuration + vestingDuration`.
- `vestingDuration` must be non-zero.

### Release

- Callable by beneficiary or vesting admin.
- Reverts if schedule does not exist or releasable amount is zero.
- Updates released amount and total released before transfer.
- Uses SafeERC20 transfer to beneficiary.

### Revoke

- Callable only by vesting admin.
- Schedule must be revocable and not already revoked.
- Vested unreleased amount is transferred to beneficiary.
- Unvested amount is transferred only to treasury.
- Updates liabilities and emitted event.

### Treasury Transfer

- `transferTreasury` sets pending treasury.
- `acceptTreasury` must be called by pending treasury.
- `cancelTreasuryTransfer` clears pending treasury.

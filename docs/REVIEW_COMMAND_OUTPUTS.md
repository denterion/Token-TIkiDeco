# TikiDeco Internal Review Command Outputs

Review target commit: `355b751111112d551eda735c3fdb63b43220fc11`

Run date: 2026-06-18

Environment note: Hardhat commands were run on Windows with `APPDATA` and `LOCALAPPDATA` pointed to workspace-local folders to avoid writing outside the workspace. Slither was first run exactly as `npm run slither`; that failed on local permissions. It was then rerun with `USERPROFILE` pointed to the workspace so `solc-select` could use a workspace-local cache.

## `npm ci`

Exit code: `0`

```text
added 162 packages, and audited 163 packages in 7s

44 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:
npm warn allow-scripts   esbuild@0.28.1 (postinstall: node install.js)
npm warn allow-scripts
npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.
```

## `npm run compile`

Exit code: `0`

```text
> tikideco-token@0.1.0 compile
> hardhat compile

No contracts to compile
```

## `npm test`

Exit code: `0`

```text
> tikideco-token@0.1.0 test
> hardhat test

No contracts to compile

Running Solidity tests

Running Mocha tests

69 passing (1s)

69 passing (69 mocha)
```

## `npm run coverage`

Exit code: `0`

```text
> tikideco-token@0.1.0 coverage
> hardhat test --coverage

Compiled 4 Solidity files with solc 0.8.28 (evm target: paris)

69 passing (1s)

69 passing (69 mocha)

Saved html report to C:\Users\Asus\Documents\tokenTheTikiDeco\coverage\html

Coverage Report

File Path                            | Line % | Statement % | Uncovered Lines
contracts\TikiDecoToken.sol          | 83.85  | 77.17       | 29, 34, 40, 53-56, 114, 137, 178, 194-195, 199-201, 209, 225, 228, 239, 245, 256
contracts\TikiDecoVestingVault.sol   | 83.67  | 76.15       | 26, 95, 102, 112, 125-128, 133, 144-147, 170, 177, 183, 185, 197-198, 201-202, ...
contracts\TikiDecoTokenV2.sol        | 87.50  | 82.86       | 65, 80, 96-98, 156
contracts\TikiDecoVestingVaultV2.sol | 86.60  | 86.24       | 71, 101, 133-134, 161, 168, 174, 177, 191, 194-195, 223, 249
Total                                | 84.83  | 80.29       |
```

## `npm run lint`

Exit code: `0`

```text
> tikideco-token@0.1.0 lint
> npm run compile && node scripts/check-deployment-manifest.cjs && node scripts/check-bytecode-size.cjs

> tikideco-token@0.1.0 compile
> hardhat compile

No contracts to compile
Deployment manifest consistency check passed.
OK TikiDecoToken: 6035 deployed bytes
OK TikiDecoVestingVault: 5628 deployed bytes
OK TikiDecoTokenV2: 7239 deployed bytes
OK TikiDecoVestingVaultV2: 6787 deployed bytes
```

## `npm run audit`

Exit code: `0`

```text
> tikideco-token@0.1.0 audit
> npm audit --audit-level=moderate

found 0 vulnerabilities
```

## `npm run manifest`

Exit code: `0`

```text
> tikideco-token@0.1.0 manifest
> npm run manifest:check

> tikideco-token@0.1.0 manifest:check
> node scripts/check-deployment-manifest.cjs

Deployment manifest consistency check passed.
```

## `npm run bytecode`

Exit code: `0`

```text
> tikideco-token@0.1.0 bytecode
> npm run bytecode:size

> tikideco-token@0.1.0 bytecode:size
> node scripts/check-bytecode-size.cjs

OK TikiDecoToken: 9512 deployed bytes
OK TikiDecoVestingVault: 10142 deployed bytes
OK TikiDecoTokenV2: 8295 deployed bytes
OK TikiDecoVestingVaultV2: 10763 deployed bytes
```

Note: this command was run after coverage in the requested order. See `KNOWN_ISSUES.md` KI-07.

Post-matrix clean check, exit code: `0`

```text
> tikideco-token@0.1.0 bytecode
> npm run bytecode:size

> tikideco-token@0.1.0 bytecode:size
> node scripts/check-bytecode-size.cjs

OK TikiDecoToken: 6035 deployed bytes
OK TikiDecoVestingVault: 5628 deployed bytes
OK TikiDecoTokenV2: 7239 deployed bytes
OK TikiDecoVestingVaultV2: 6787 deployed bytes
```

## `npm run gas`

Exit code: `0`

```text
> tikideco-token@0.1.0 gas
> npm run gas:snapshot

> tikideco-token@0.1.0 gas:snapshot
> hardhat test --gas-stats

Compiled 4 Solidity files with solc 0.8.28 (evm target: paris)

69 passing (1s)

69 passing (69 mocha)

Gas Usage Statistics

Bytecode size:
TikiDecoToken: 6035
TikiDecoTokenV2: 7239
TikiDecoVestingVault: 5628
TikiDecoVestingVaultV2: 6787
```

The full gas table was printed in the terminal output for this run.

## `npm run site`

Exit code: `0`

```text
> tikideco-token@0.1.0 site
> npm run site:check

> tikideco-token@0.1.0 site:check
> npm run site:build && node scripts/check-site-content.cjs

> tikideco-token@0.1.0 site:build
> node scripts/build-site-manifest.cjs

Wrote site\deployment-manifest.json from deployments/canonical.json
Site content checks passed.
```

## `npm run release`

Exit code: `0`

```text
> tikideco-token@0.1.0 release
> npm run release:check

> tikideco-token@0.1.0 release:check
> node scripts/check-release-draft.cjs

Release draft checks passed.
```

## `npm run slither`

First run exit code: `1`

```text
> tikideco-token@0.1.0 slither
> slither contracts --config-file slither.config.json --solc-remaps @openzeppelin/=node_modules/@openzeppelin/

PermissionError: [WinError 5] Отказано в доступе: 'C:\\Users\\Asus\\.solc-select'
```

Second run with workspace-local `USERPROFILE`, exit code: `1`

```text
INFO:Detectors:
Detector: locked-ether
Contract locking ether found:
  Contract TikiDecoToken (contracts/TikiDecoToken.sol#60-258) has payable functions:
  - TikiDecoToken.receive() (contracts/TikiDecoToken.sol#251-253)
  - TikiDecoToken.fallback() (contracts/TikiDecoToken.sol#255-257)

Detector: locked-ether
Contract locking ether found:
  Contract TikiDecoTokenV2 (contracts/TikiDecoTokenV2.sol#8-158) has payable functions:
  - TikiDecoTokenV2.receive() (contracts/TikiDecoTokenV2.sol#151-153)
  - TikiDecoTokenV2.fallback() (contracts/TikiDecoTokenV2.sol#155-157)

Detector: incorrect-equality
TikiDecoVestingVaultV2.release(uint256) (contracts/TikiDecoVestingVaultV2.sol#173-188) uses a dangerous strict equality:
  - amount == 0 (contracts/TikiDecoVestingVaultV2.sol#181)

Detector: locked-ether
Contract locking ether found:
  Contract TikiDecoVestingVaultV2 (contracts/TikiDecoVestingVaultV2.sol#9-251) has payable functions:
  - TikiDecoVestingVaultV2.receive() (contracts/TikiDecoVestingVaultV2.sol#244-246)
  - TikiDecoVestingVaultV2.fallback() (contracts/TikiDecoVestingVaultV2.sol#248-250)

Detector: timestamp
TikiDecoVestingVaultV2 uses timestamp-related comparisons in unreservedBalance, createSchedule, release, revoke, and _vestedAmount.

INFO:Slither:contracts analyzed (30 contracts with 101 detectors), 15 result(s) found
```

The second run also reported V1 legacy findings. V1 is preserved as historical Sepolia deployment and is not modified by this review package.

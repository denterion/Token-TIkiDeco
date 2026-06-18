# TikiDeco Security CI

Status: DevSecOps controls for a public Solidity repository. These gates do not deploy contracts and do not use public-network secrets.

## Tool Versions

| Tool | Pinned Version |
| --- | --- |
| Node.js | `22.13.1` |
| Python | `3.12.8` |
| Solidity compiler | `0.8.28` |
| Slither | `0.11.3` |
| Foundry | `v1.4.0` |

GitHub Actions are pinned to full commit SHAs. The line before every `uses:` entry documents the human-readable action tag.

## Workflow Controls

- Top-level workflow permissions default to `contents: read`.
- Jobs use explicit `timeout-minutes`.
- Pull request runs use concurrency groups with cancellation for superseded PR runs.
- `npm ci` is the only CI command that installs npm dependencies.
- Gitleaks checks full git history with `fetch-depth: 0`.
- Pages keeps only the additional permissions needed by GitHub Pages: `pages: write` and `id-token: write`.

## Required Gates

### Hardhat Compile And Tests

Runs:

```bash
npm ci
npm run compile
npm test
```

Purpose: primary deterministic test suite for V1 legacy contracts, V2 candidate contracts, deployment configuration, and existing invariant-style Hardhat tests.

### Foundry Fuzz, Invariants, And Coverage

Runs:

```bash
npm run foundry:test
npm run foundry:coverage
```

Purpose: secondary V2 fuzz and invariant toolchain. The deterministic seed is:

```text
0x54494b494445434f5f56325f46555a5a5f534545445f3030303030303031
```

Coverage gate requires line, function, and branch metrics. If function or branch metrics are absent from LCOV, the threshold script fails instead of silently passing.

### Deployment Manifest Source Check

Runs:

```bash
npm run manifest:check
npm run manifest:source
```

Purpose: confirms `deployments/canonical.json` remains consistent with `deployments/sepolia.json` and the compiler/optimizer settings in `hardhat.config.js`.

### Bytecode And Gas Artifacts

Runs:

```bash
npm run bytecode:size
npm run gas:snapshot
npm run artifacts:contracts
```

Purpose: enforces EIP-170 bytecode size limit, records gas snapshot output, and uploads ABI/bytecode/deployed-bytecode artifacts.

### Slither Split Scan

Runs:

```bash
slither contracts --config-file slither.config.json --solc-remaps @openzeppelin/=node_modules/@openzeppelin/ --json security-artifacts/slither/slither.json
npm run slither:baseline
```

Policy:

- Legacy V1 findings are stored as informational output.
- V2 candidate findings are compared against `security/slither-baseline-v2.json`.
- Every accepted V2 finding must include an explanation.
- Any new untriaged V2 finding fails CI.

### JavaScript And Site Scanner

CodeQL scans JavaScript and site code through `github/codeql-action` with `security-events: write` only on the CodeQL job.

### Secret Scan

Gitleaks scans full history. Do not commit RPC keys, private keys, API keys, or deployment secrets.

### SBOM And Checksums

Runs:

```bash
npm run sbom:spdx
npm run checksums
```

Purpose: generates an SPDX SBOM and SHA-256 checksums for release evidence, deployment manifests, contract artifacts, SBOM files, and Slither artifacts.

### Clean-Room Docker Build

Runs:

```bash
docker build -f .devcontainer/Dockerfile .
```

Purpose: proves the project can build and run the Hardhat suite from a clean container without local machine state.

## Uploaded Artifacts

CI uploads:

- Hardhat test logs;
- Foundry test and coverage logs;
- Hardhat coverage output;
- gas snapshot output;
- Slither JSON and split summaries;
- ABI and bytecode artifacts;
- SPDX SBOM;
- SHA-256 checksums.

## Local Reproduction

For the main local gate:

```bash
npm ci
npm run compile
npm test
npm run lint
npm run manifest:source
npm run artifacts:contracts
npm run sbom:spdx
npm run checksums
```

If Foundry is installed:

```bash
npm run foundry:test
npm run foundry:coverage
```

If Slither is installed:

```bash
mkdir -p security-artifacts/slither
slither contracts --config-file slither.config.json --solc-remaps @openzeppelin/=node_modules/@openzeppelin/ --json security-artifacts/slither/slither.json || true
npm run slither:baseline
```

## Recommended Branch Protection

Protect `main` with:

- require pull request before merge;
- require approvals from at least one maintainer;
- dismiss stale approvals when new commits are pushed;
- require conversation resolution;
- require signed commits if practical for maintainers;
- block force pushes;
- block branch deletion;
- require linear history if it matches the maintainer workflow;
- require status checks:
  - `CI / test`;
  - `Security / hardhat-security`;
  - `Security / slither`;
  - `Security / codeql`;
  - `Security / secret-scan`;
  - `Security / clean-room-docker`;
  - `Pages / build` for site changes.

Do not add deployment secrets to CI. Do not add automatic public-network deployment jobs without a separate reviewed release process.


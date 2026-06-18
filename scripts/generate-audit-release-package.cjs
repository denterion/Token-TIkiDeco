const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const releaseName = "v0.1.0-sepolia";
const outputRoot = path.join(root, "release-artifacts", releaseName);
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const nodeBin = process.execPath;

function detectPythonUserSite() {
  const result = spawnSync("python", ["-m", "site", "--user-site"], {
    cwd: root,
    encoding: "utf8",
    shell: false,
    env: process.env
  });
  if (result.status !== 0) return process.env.PYTHONPATH;
  const userSite = result.stdout.trim();
  if (!userSite) return process.env.PYTHONPATH;
  return process.env.PYTHONPATH ? `${userSite}${path.delimiter}${process.env.PYTHONPATH}` : userSite;
}

const pythonPath = detectPythonUserSite();
const commandEnv = {
  ...process.env,
  APPDATA: path.join(root, ".appdata"),
  LOCALAPPDATA: path.join(root, ".localappdata"),
  HOME: root,
  USERPROFILE: root
};
if (pythonPath) commandEnv.PYTHONPATH = pythonPath;

const contracts = [
  {
    name: "TikiDecoToken",
    source: "contracts/TikiDecoToken.sol",
    manifestKey: "token"
  },
  {
    name: "TikiDecoVestingVault",
    source: "contracts/TikiDecoVestingVault.sol",
    manifestKey: "vestingVault"
  },
  {
    name: "TikiDecoTokenV2",
    source: "contracts/TikiDecoTokenV2.sol",
    manifestKey: null
  },
  {
    name: "TikiDecoVestingVaultV2",
    source: "contracts/TikiDecoVestingVaultV2.sol",
    manifestKey: null
  }
];

function usage() {
  console.error("Usage: npm run release:package -- --commit <40-character-commit-sha> [--output <directory>]");
}

function parseArgs(argv) {
  const args = { output: outputRoot };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--commit") {
      args.commit = argv[index + 1];
      index += 1;
    } else if (arg === "--output") {
      args.output = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function rel(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args, options = {}) {
  const label = [command, ...args].join(" ");
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    env: commandEnv
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  if (options.captureFile) {
    fs.mkdirSync(path.dirname(options.captureFile), { recursive: true });
    fs.writeFileSync(options.captureFile, output);
  }
  if (result.error && !options.allowFailure) {
    throw result.error;
  }
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${label} failed with exit code ${result.status}\n${output}`);
  }
  return { status: result.status, output };
}

function toolAvailable(command, args = ["--version"]) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    env: commandEnv
  });
  return !result.error && result.status === 0;
}

function copyFile(source, destination) {
  assert(fs.existsSync(source), `Missing required file: ${rel(source)}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function copyDir(source, destination) {
  if (!fs.existsSync(source)) return false;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
  return true;
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return [fullPath];
  });
}

function assertCleanTree() {
  const status = run("git", ["status", "--porcelain"], { captureFile: null }).output.trim();
  assert(status.length === 0, `Git tree is dirty. Commit or stash changes before packaging:\n${status}`);
}

function resolveCommit(commit) {
  assert(commit, "Release package requires --commit <40-character-commit-sha>.");
  assert(/^[0-9a-f]{40}$/.test(commit), "Commit must be an explicit 40-character lowercase SHA.");
  const resolved = run("git", ["rev-parse", `${commit}^{commit}`]).output.trim();
  const head = run("git", ["rev-parse", "HEAD"]).output.trim();
  assert(resolved === commit, `Supplied commit did not resolve exactly: ${resolved}`);
  assert(head === commit, `Supplied commit must match current HEAD. HEAD is ${head}.`);
  return resolved;
}

function assertNoTbd(releaseText) {
  assert(!/\bTBD\b/i.test(releaseText), "Release notes contain TBD.");
}

function assertLegalStatus(text, label) {
  const lower = text.toLowerCase();
  const required = [
    "sepolia",
    "not offered for sale",
    "no stated monetary value",
    "not deployed on mainnet",
    "not independently audited"
  ];
  for (const phrase of required) {
    assert(lower.includes(phrase), `${label} missing legal status phrase: ${phrase}`);
  }
  const forbidden = [
    "production-ready",
    "mainnet-ready",
    "guaranteed profit",
    "passive income",
    "investment opportunity",
    "expected price growth",
    "risk-free",
    "guaranteed listing",
    "ownership share in a hotel",
    "guaranteed revenue share"
  ];
  for (const phrase of forbidden) {
    assert(!lower.includes(phrase), `${label} contains forbidden phrase: ${phrase}`);
  }
}

function assertAddressConsistency(manifest, siteManifest, readme) {
  const canonicalPairs = [
    ["token", manifest.contracts.token.address, siteManifest.contracts.token.address],
    ["vesting vault", manifest.contracts.vestingVault.address, siteManifest.contracts.vestingVault.address],
    ["owner Safe", manifest.ownership.ownerSafe, siteManifest.ownership.ownerSafe],
    ["treasury", manifest.treasury.address, siteManifest.treasury.address]
  ];
  for (const [label, canonical, site] of canonicalPairs) {
    assert(canonical === site, `Address mismatch for ${label}: canonical ${canonical}, site ${site}`);
    assert(readme.includes(canonical), `README missing canonical ${label} address ${canonical}`);
  }
}

function assertStaticReleaseState() {
  const manifest = readJson(path.join(root, "deployments", "canonical.json"));
  const siteManifest = readJson(path.join(root, "site", "deployment-manifest.json"));
  const readme = readText(path.join(root, "README.md"));
  const releaseText = readText(path.join(root, "docs", "releases", `${releaseName}.md`));
  const noOffer = readText(path.join(root, "site", "legal", "no-offer", "index.html"));

  assertNoTbd(releaseText);
  assert(manifest.auditStatus?.internalReview, "Canonical manifest missing internal review status.");
  assert(manifest.auditStatus?.independentAudit, "Canonical manifest missing independent audit status.");
  assert(manifest.auditStatus.mainnetApproved === false, "Canonical manifest must state mainnetApproved=false.");
  assertAddressConsistency(manifest, siteManifest, readme);
  assertLegalStatus(readme, "README");
  assertLegalStatus(releaseText, "release notes");
  assertLegalStatus(noOffer, "site legal no-offer page");

  return { manifest, releaseText };
}

function buildRoleManifest(manifest) {
  return {
    release: releaseName,
    network: manifest.network,
    chainId: manifest.chainId,
    canonicalVersion: manifest.contractVersion,
    v1LegacyOwnership: {
      tokenOwner: manifest.ownership.ownerSafe,
      vestingVaultOwner: manifest.ownership.ownerSafe,
      previousOwner: manifest.ownership.previousOwner,
      safeThreshold: manifest.ownership.safeThreshold,
      ownershipTransferredAt: manifest.ownership.ownershipTransferredAt,
      ownershipTransferTxs: manifest.ownership.ownershipTransferTxs
    },
    treasury: {
      address: manifest.treasury.address,
      initialSupply: manifest.treasury.initialSupply
    },
    v2CandidateRoles: {
      status: "candidate-only-not-deployed-by-canonical-manifest",
      roleManifestSource: "deployments/v2-role-manifest.local.json is generated only by explicit V2 deployment scripts",
      roleDocs: "docs/ACCESS_CONTROL.md"
    }
  };
}

function buildSafeConfig(manifest) {
  return {
    network: manifest.network,
    chainId: manifest.chainId,
    safe: manifest.ownership.ownerSafe,
    threshold: manifest.ownership.safeThreshold,
    previousOwner: manifest.ownership.previousOwner,
    activationTx: manifest.ownership.ownershipTransferTxs.safeActivation,
    acceptOwnershipBatchTx: manifest.ownership.ownershipTransferTxs.safeAcceptOwnershipBatch,
    note: "Signer addresses are intentionally not asserted by this static release package. Verify Safe owners through the Safe UI or trusted Sepolia RPC before operational use."
  };
}

function copyContractArtifacts(bundleDir, manifest) {
  const bytecodeHashes = {};
  const manifestContracts = [];

  for (const contract of contracts) {
    const artifactPath = path.join(root, "artifacts", "contracts", `${contract.name}.sol`, `${contract.name}.json`);
    assert(fs.existsSync(artifactPath), `Missing Hardhat artifact for ${contract.name}. Run npm run compile.`);
    const artifact = readJson(artifactPath);
    const contractDir = path.join(bundleDir, "artifacts", "contracts", contract.name);
    fs.mkdirSync(contractDir, { recursive: true });

    const abiPath = path.join(contractDir, "abi.json");
    const creationPath = path.join(contractDir, "creation-bytecode.txt");
    const runtimePath = path.join(contractDir, "runtime-bytecode.txt");
    fs.writeFileSync(abiPath, `${JSON.stringify(artifact.abi, null, 2)}\n`);
    fs.writeFileSync(creationPath, `${artifact.bytecode || "0x"}\n`);
    fs.writeFileSync(runtimePath, `${artifact.deployedBytecode || "0x"}\n`);

    const hashes = {
      creationSha256: sha256File(creationPath),
      runtimeSha256: sha256File(runtimePath)
    };
    bytecodeHashes[contract.name] = hashes;

    const deployed = contract.manifestKey ? manifest.contracts[contract.manifestKey] : null;
    manifestContracts.push({
      name: contract.name,
      source: contract.source,
      status: contract.manifestKey ? "legacy-canonical-v1" : "non-canonical-v2-candidate",
      address: deployed?.address || null,
      abi: rel(abiPath),
      creationBytecode: rel(creationPath),
      runtimeBytecode: rel(runtimePath),
      bytecodeHashes: hashes
    });
  }

  writeJson(path.join(bundleDir, "artifacts", "bytecode-hashes.json"), bytecodeHashes);
  return manifestContracts;
}

function generateReproductionInstructions(bundleDir, commit) {
  const content = `# Reproduction Instructions

This package is a review bundle for ${releaseName}. It is not a publication step, deployment step, or audit certificate.

## Source

- Commit: \`${commit}\`
- Network described by canonical manifest: Sepolia
- Mainnet status: not deployed on mainnet
- Audit status: internal review materials only; not independently audited

## Reproduce

\`\`\`bash
git clone https://github.com/denterion/Token-TIkiDeco.git
cd Token-TIkiDeco
git checkout ${commit}
npm ci
npm run compile
npm test
npm run coverage
npm run gas:snapshot
npm run site:check
npm run release:check
npm run slither
npm run slither:baseline
npm run sbom:spdx
npm run release:package -- --commit ${commit}
\`\`\`

The release package generator refuses to create a package when the tree is dirty, the commit is omitted, tests fail, Slither has new untriaged V2 findings, addresses disagree across public surfaces, legal status text is inconsistent, release notes contain \`TBD\`, audit status is missing, or checksums are missing.

## Signed Tag

If a release manager later decides to publish a tag, use a human-reviewed signed tag:

\`\`\`bash
git tag -s ${releaseName} ${commit} -m "${releaseName}"
git tag -v ${releaseName}
\`\`\`

Do not create or push a tag automatically from this package.
`;
  const target = path.join(bundleDir, "REPRODUCIBLE_BUILD.md");
  fs.writeFileSync(target, content);
  return target;
}

function generateChecksums(bundleDir) {
  const checksumPath = path.join(bundleDir, "SHA256SUMS.txt");
  const files = walkFiles(bundleDir).filter((filePath) => filePath !== checksumPath);
  const lines = files.sort().map((filePath) => `${sha256File(filePath)}  ${path.relative(bundleDir, filePath).replaceAll(path.sep, "/")}`);
  fs.writeFileSync(checksumPath, `${lines.join("\n")}\n`);
  assert(fs.existsSync(checksumPath), "Checksums file is missing.");
  assert(readText(checksumPath).trim().length > 0, "Checksums file is empty.");
  return checksumPath;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  assertCleanTree();
  const commit = resolveCommit(args.commit);
  const { manifest } = assertStaticReleaseState();

  const bundleDir = path.join(args.output, commit);
  fs.rmSync(bundleDir, { recursive: true, force: true });
  fs.mkdirSync(bundleDir, { recursive: true });

  const reportsDir = path.join(bundleDir, "reports");
  const slitherDir = path.join(root, "security-artifacts", "slither");

  run(npmBin, ["run", "compile"], { captureFile: path.join(reportsDir, "compile-report.txt") });
  run(npmBin, ["test"], { captureFile: path.join(reportsDir, "test-report.txt") });
  run(npmBin, ["run", "coverage"], { captureFile: path.join(reportsDir, "coverage-report.txt") });
  run(npmBin, ["run", "gas:snapshot"], { captureFile: path.join(reportsDir, "gas-report.txt") });
  run(npmBin, ["run", "site:check"], { captureFile: path.join(reportsDir, "site-check-report.txt") });
  run(npmBin, ["run", "release:check"], { captureFile: path.join(reportsDir, "release-check-report.txt") });

  fs.mkdirSync(slitherDir, { recursive: true });
  const slitherJson = path.join(slitherDir, "slither.json");
  assert(toolAvailable("forge"), "Forge is required for the Slither release gate because this repository includes Foundry configuration. Install the pinned Foundry version before packaging.");
  const slitherRun = run("slither", [
    "contracts",
    "--config-file",
    "slither.config.json",
    "--solc-remaps",
    "@openzeppelin/=node_modules/@openzeppelin/",
    "--json",
    slitherJson
  ], {
    captureFile: path.join(reportsDir, "slither-report.txt"),
    allowFailure: true
  });
  assert(fs.existsSync(slitherJson), `Slither did not produce ${rel(slitherJson)}. Exit code: ${slitherRun.status}`);
  run(nodeBin, [path.join(root, "scripts", "check-slither-baseline.cjs")], {
    captureFile: path.join(reportsDir, "slither-baseline-report.txt")
  });

  run(npmBin, ["run", "sbom:spdx"], { captureFile: path.join(reportsDir, "sbom-report.txt") });

  const sourceArchive = path.join(bundleDir, `source-${commit}.zip`);
  run("git", ["archive", "--format=zip", "--output", sourceArchive, commit], {
    captureFile: path.join(reportsDir, "source-archive-report.txt")
  });

  const contractEntries = copyContractArtifacts(bundleDir, manifest);
  copyFile(path.join(root, "package-lock.json"), path.join(bundleDir, "dependencies", "package-lock.json"));
  copyFile(path.join(root, "deployments", "canonical.json"), path.join(bundleDir, "manifests", "canonical.json"));
  copyFile(path.join(root, "docs", "releases", `${releaseName}.md`), path.join(bundleDir, "docs", "release-notes.md"));
  copyFile(path.join(root, "KNOWN_ISSUES.md"), path.join(bundleDir, "docs", "KNOWN_ISSUES.md"));
  copyFile(path.join(root, "AUDIT_SCOPE.md"), path.join(bundleDir, "docs", "AUDIT_SCOPE.md"));
  copyFile(path.join(root, "security", "slither-baseline-v2.json"), path.join(bundleDir, "slither", "slither-baseline-v2.json"));
  copyDir(path.join(root, "coverage"), path.join(bundleDir, "coverage"));
  copyDir(slitherDir, path.join(bundleDir, "slither"));
  copyDir(path.join(root, "security-artifacts", "sbom"), path.join(bundleDir, "sbom"));

  const roleManifestPath = path.join(bundleDir, "manifests", "role-manifest.json");
  const safeConfigPath = path.join(bundleDir, "manifests", "safe-configuration.json");
  writeJson(roleManifestPath, buildRoleManifest(manifest));
  writeJson(safeConfigPath, buildSafeConfig(manifest));

  const reproductionPath = generateReproductionInstructions(bundleDir, commit);
  const checksumPath = generateChecksums(bundleDir);

  const releaseManifestPath = path.join(bundleDir, "release-manifest.json");
  const releaseManifest = {
    release: releaseName,
    generatedAt: new Date().toISOString(),
    sourceCommit: commit,
    sourceArchive: rel(sourceArchive),
    compiler: {
      version: manifest.compiler.version,
      evmTarget: manifest.compiler.evmTarget
    },
    optimizer: manifest.compiler.optimizer,
    dependencyLockfile: {
      path: rel(path.join(bundleDir, "dependencies", "package-lock.json")),
      sha256: sha256File(path.join(bundleDir, "dependencies", "package-lock.json"))
    },
    contracts: contractEntries,
    canonicalDeploymentManifest: rel(path.join(bundleDir, "manifests", "canonical.json")),
    roleManifest: rel(roleManifestPath),
    safeConfiguration: rel(safeConfigPath),
    reports: {
      test: rel(path.join(reportsDir, "test-report.txt")),
      coverage: rel(path.join(reportsDir, "coverage-report.txt")),
      gas: rel(path.join(reportsDir, "gas-report.txt")),
      slither: rel(path.join(reportsDir, "slither-report.txt")),
      sbom: rel(path.join(reportsDir, "sbom-report.txt"))
    },
    auditStatus: manifest.auditStatus,
    knownIssues: rel(path.join(bundleDir, "docs", "KNOWN_ISSUES.md")),
    auditScope: rel(path.join(bundleDir, "docs", "AUDIT_SCOPE.md")),
    reproduction: rel(reproductionPath),
    checksums: rel(checksumPath)
  };
  writeJson(releaseManifestPath, releaseManifest);

  generateChecksums(bundleDir);
  assert(fs.existsSync(checksumPath), "Checksums are missing after final manifest write.");
  assert(readText(checksumPath).includes("release-manifest.json"), "Checksums do not include release-manifest.json.");

  console.log(`Prepared ${releaseName} review bundle at ${rel(bundleDir)}`);
  console.log("No tag was created. No deployment or transaction was performed.");
}

try {
  main();
} catch (error) {
  usage();
  console.error(`\nRelease package rejected: ${error.message}`);
  process.exit(1);
}

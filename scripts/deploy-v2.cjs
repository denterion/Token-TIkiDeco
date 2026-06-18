const { getHardhatConnection } = require("./hardhat-connection.cjs");

let ethers;
let networkName;
const fs = require("node:fs");
const path = require("node:path");
const { projectConfig } = require("../config/project.cjs");

const ROLE_NAMES = {
  DEFAULT_ADMIN_ROLE: "DEFAULT_ADMIN_ROLE",
  PAUSER_ROLE: "PAUSER_ROLE",
  REPORTER_ROLE: "REPORTER_ROLE",
  VESTING_ADMIN_ROLE: "VESTING_ADMIN_ROLE"
};

function requireAddress(ethersLib, name, value) {
  if (!value || !ethersLib.isAddress(value)) {
    throw new Error(`${name} must be a valid Ethereum address`);
  }
  return value;
}

function requireBoundedNonEmpty(name, value, maxLength) {
  if (typeof value !== "string" || value.length === 0 || Buffer.byteLength(value, "utf8") > maxLength) {
    throw new Error(`${name} must be non-empty and at most ${maxLength} bytes`);
  }
  return value;
}

function requireUint48(name, value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 281474976710655) {
    throw new Error(`${name} must be a uint48-compatible integer`);
  }
  return parsed;
}

function isLocalNetworkName(name) {
  return name === "hardhat" || name === "localhost";
}

function buildDeploymentConfig({ env, signers, ethersLib, network }) {
  const isLocalNetwork = isLocalNetworkName(network);
  const localDefaults = {
    V2_DEFAULT_ADMIN_ADDRESS: signers[1]?.address,
    V2_PAUSER_ADDRESS: signers[2]?.address,
    V2_REPORTER_ADDRESS: signers[3]?.address,
    V2_VESTING_ADMIN_ADDRESS: signers[4]?.address,
    V2_TREASURY_ADDRESS: signers[5]?.address
  };

  const readRoleAddress = (name) => {
    const value = env[name] ?? (isLocalNetwork ? localDefaults[name] : undefined);
    return requireAddress(ethersLib, name, value);
  };

  if (!isLocalNetwork && env.CONFIRM_NON_CANONICAL_V2_DEPLOY !== "true") {
    throw new Error(
      "TikiDeco V2 is a non-canonical candidate. Set CONFIRM_NON_CANONICAL_V2_DEPLOY=true to deploy it on a public network."
    );
  }

  const defaultAdmin = readRoleAddress("V2_DEFAULT_ADMIN_ADDRESS");
  const pauser = readRoleAddress("V2_PAUSER_ADDRESS");
  const reporter = readRoleAddress("V2_REPORTER_ADDRESS");
  const vestingAdmin = readRoleAddress("V2_VESTING_ADMIN_ADDRESS");
  const treasury = readRoleAddress("V2_TREASURY_ADDRESS");

  return {
    defaultAdmin,
    pauser,
    reporter,
    vestingAdmin,
    treasury,
    defaultAdminDelay: requireUint48("V2_DEFAULT_ADMIN_DELAY_SECONDS", env.V2_DEFAULT_ADMIN_DELAY_SECONDS ?? "86400"),
    projectName: requireBoundedNonEmpty("PROJECT_NAME", env.PROJECT_NAME ?? projectConfig.projectName, 80),
    businessEntity: requireBoundedNonEmpty("BUSINESS_ENTITY", env.BUSINESS_ENTITY ?? projectConfig.businessEntity, 120),
    jurisdiction: requireBoundedNonEmpty("PROJECT_JURISDICTION", env.PROJECT_JURISDICTION ?? projectConfig.jurisdiction, 80),
    projectURI: requireBoundedNonEmpty("PROJECT_URI", env.PROJECT_URI ?? projectConfig.projectURI, 256)
  };
}

async function assertRole(contract, role, account, expected, label) {
  const actual = await contract.hasRole(role, account);
  if (actual !== expected) {
    throw new Error(`${label} role assertion failed for ${account}: expected ${expected}, got ${actual}`);
  }
}

async function assertDeploymentRoles({ token, vestingVault, config, deployer }) {
  const tokenDefaultAdminRole = await token.DEFAULT_ADMIN_ROLE();
  const pauserRole = await token.PAUSER_ROLE();
  const reporterRole = await token.REPORTER_ROLE();
  const vaultDefaultAdminRole = await vestingVault.DEFAULT_ADMIN_ROLE();
  const vestingAdminRole = await vestingVault.VESTING_ADMIN_ROLE();

  await assertRole(token, tokenDefaultAdminRole, config.defaultAdmin, true, "token default admin");
  await assertRole(token, pauserRole, config.pauser, true, "token pauser");
  await assertRole(token, reporterRole, config.reporter, true, "token reporter");
  await assertRole(vestingVault, vaultDefaultAdminRole, config.defaultAdmin, true, "vault default admin");
  await assertRole(vestingVault, vestingAdminRole, config.vestingAdmin, true, "vault vesting admin");

  const deployerExpectedTokenRoles = {
    [ROLE_NAMES.DEFAULT_ADMIN_ROLE]: deployer === config.defaultAdmin,
    [ROLE_NAMES.PAUSER_ROLE]: deployer === config.pauser,
    [ROLE_NAMES.REPORTER_ROLE]: deployer === config.reporter
  };
  const deployerExpectedVaultRoles = {
    [ROLE_NAMES.DEFAULT_ADMIN_ROLE]: deployer === config.defaultAdmin,
    [ROLE_NAMES.VESTING_ADMIN_ROLE]: deployer === config.vestingAdmin
  };

  await assertRole(token, tokenDefaultAdminRole, deployer, deployerExpectedTokenRoles.DEFAULT_ADMIN_ROLE, "deployer token default admin");
  await assertRole(token, pauserRole, deployer, deployerExpectedTokenRoles.PAUSER_ROLE, "deployer token pauser");
  await assertRole(token, reporterRole, deployer, deployerExpectedTokenRoles.REPORTER_ROLE, "deployer token reporter");
  await assertRole(vestingVault, vaultDefaultAdminRole, deployer, deployerExpectedVaultRoles.DEFAULT_ADMIN_ROLE, "deployer vault default admin");
  await assertRole(vestingVault, vestingAdminRole, deployer, deployerExpectedVaultRoles.VESTING_ADMIN_ROLE, "deployer vault vesting admin");
}

async function buildRoleManifest({ token, vestingVault, config, deployer, network, chainId, deployedAt }) {
  return {
    schema: "tikideco.v2.role-manifest/1",
    version: "v2-openzeppelin-candidate",
    network,
    chainId,
    deployedAt,
    deployer,
    defaultAdminDelaySeconds: config.defaultAdminDelay,
    contracts: {
      token: await token.getAddress(),
      vestingVault: await vestingVault.getAddress()
    },
    roles: {
      token: {
        DEFAULT_ADMIN_ROLE: [config.defaultAdmin],
        PAUSER_ROLE: [config.pauser],
        REPORTER_ROLE: [config.reporter]
      },
      vestingVault: {
        DEFAULT_ADMIN_ROLE: [config.defaultAdmin],
        VESTING_ADMIN_ROLE: [config.vestingAdmin]
      }
    },
    treasury: config.treasury,
    metadata: {
      projectName: config.projectName,
      businessEntity: config.businessEntity,
      jurisdiction: config.jurisdiction,
      projectURI: config.projectURI
    }
  };
}

async function main() {
  ({ ethers, networkName } = await getHardhatConnection());
  const signers = await ethers.getSigners();
  const [deployer] = signers;
  const config = buildDeploymentConfig({ env: process.env, signers, ethersLib: ethers, network: networkName });

  const Token = await ethers.getContractFactory("TikiDecoTokenV2");
  const token = await Token.deploy(
    config.defaultAdmin,
    config.pauser,
    config.reporter,
    config.treasury,
    config.projectName,
    config.businessEntity,
    config.jurisdiction,
    config.projectURI,
    config.defaultAdminDelay
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  const VestingVault = await ethers.getContractFactory("TikiDecoVestingVaultV2");
  const vestingVault = await VestingVault.deploy(
    tokenAddress,
    config.defaultAdmin,
    config.vestingAdmin,
    config.treasury,
    config.defaultAdminDelay
  );
  await vestingVault.waitForDeployment();

  await assertDeploymentRoles({ token, vestingVault, config, deployer: deployer.address });

  const vestingVaultAddress = await vestingVault.getAddress();
  const deployedAt = new Date().toISOString();
  const chainId = Number((await ethers.provider.getNetwork()).chainId);
  const deployment = {
    version: "v2-openzeppelin-candidate",
    network: networkName,
    chainId,
    deployedAt,
    deployer: deployer.address,
    defaultAdmin: config.defaultAdmin,
    pauser: config.pauser,
    reporter: config.reporter,
    vestingAdmin: config.vestingAdmin,
    treasury: config.treasury,
    defaultAdminDelaySeconds: config.defaultAdminDelay,
    token: tokenAddress,
    vestingVault: vestingVaultAddress,
    projectName: config.projectName,
    businessEntity: config.businessEntity,
    jurisdiction: config.jurisdiction,
    projectURI: config.projectURI
  };
  const roleManifest = await buildRoleManifest({
    token,
    vestingVault,
    config,
    deployer: deployer.address,
    network: networkName,
    chainId,
    deployedAt
  });

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  const fileSuffix = networkName === "localhost" || networkName === "hardhat"
    ? "local-v2"
    : `${networkName}-v2`;
  const deploymentPath = path.join(deploymentsDir, `${fileSuffix}.json`);
  const roleManifestPath = path.join(deploymentsDir, `${fileSuffix}-roles.json`);
  fs.writeFileSync(deploymentPath, `${JSON.stringify(deployment, null, 2)}\n`);
  fs.writeFileSync(roleManifestPath, `${JSON.stringify(roleManifest, null, 2)}\n`);

  console.log("TikiDeco OpenZeppelin V2 token deployed to:", tokenAddress);
  console.log("V2 vesting vault deployed to:", vestingVaultAddress);
  console.log("Deployer:", deployer.address);
  console.log("Default admin:", config.defaultAdmin);
  console.log("Pauser:", config.pauser);
  console.log("Reporter:", config.reporter);
  console.log("Vesting admin:", config.vestingAdmin);
  console.log("Treasury:", config.treasury);
  console.log("Deployment record:", deploymentPath);
  console.log("Role manifest:", roleManifestPath);
  console.log("Symbol:", await token.symbol());
  console.log("Max supply:", ethers.formatUnits(await token.totalSupply(), 18), "TIDE");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  assertDeploymentRoles,
  buildDeploymentConfig,
  buildRoleManifest,
  isLocalNetworkName,
  requireBoundedNonEmpty,
  requireUint48
};

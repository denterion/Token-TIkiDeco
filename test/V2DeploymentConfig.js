import { expect } from "chai";
import { createRequire } from "node:module";
import { network } from "hardhat";

const require = createRequire(import.meta.url);
const {
  assertDeploymentRoles,
  buildDeploymentConfig,
  buildRoleManifest
} = require("../scripts/deploy-v2.cjs");

const { ethers } = await network.create();

describe("V2 deployment configuration", function () {
  async function expectAsyncThrow(action, message) {
    try {
      await action();
    } catch (error) {
      expect(error.message).to.include(message);
      return;
    }
    throw new Error(`Expected async throw including: ${message}`);
  }

  function baseEnv(addresses) {
    return {
      CONFIRM_NON_CANONICAL_V2_DEPLOY: "true",
      V2_DEFAULT_ADMIN_ADDRESS: addresses.defaultAdmin,
      V2_PAUSER_ADDRESS: addresses.pauser,
      V2_REPORTER_ADDRESS: addresses.reporter,
      V2_VESTING_ADMIN_ADDRESS: addresses.vestingAdmin,
      V2_TREASURY_ADDRESS: addresses.treasury,
      V2_DEFAULT_ADMIN_DELAY_SECONDS: "60",
      PROJECT_NAME: "TikiDeco Sepolia prototype",
      BUSINESS_ENTITY: "TikiDeco LLC",
      PROJECT_JURISDICTION: "Florida, USA",
      PROJECT_URI: "ipfs://project"
    };
  }

  async function deployForRoleAssertions({ tokenPauser, expectedPauser, tokenReporter, expectedReporter }) {
    const [deployer, defaultAdmin, pauser, reporter, vestingAdmin, treasury] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2", deployer);
    const token = await Token.deploy(
      defaultAdmin.address,
      tokenPauser || pauser.address,
      tokenReporter || reporter.address,
      treasury.address,
      "TikiDeco Sepolia prototype",
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project",
      60
    );
    const Vault = await ethers.getContractFactory("TikiDecoVestingVaultV2", deployer);
    const vestingVault = await Vault.deploy(
      await token.getAddress(),
      defaultAdmin.address,
      vestingAdmin.address,
      treasury.address,
      60
    );
    const config = {
      defaultAdmin: defaultAdmin.address,
      pauser: expectedPauser || pauser.address,
      reporter: expectedReporter || reporter.address,
      vestingAdmin: vestingAdmin.address,
      treasury: treasury.address,
      defaultAdminDelay: 60,
      projectName: "TikiDeco Sepolia prototype",
      businessEntity: "TikiDeco LLC",
      jurisdiction: "Florida, USA",
      projectURI: "ipfs://project"
    };

    return { token, vestingVault, config, deployer, defaultAdmin };
  }

  it("uses separate local defaults without assigning roles to deployer", async function () {
    const signers = await ethers.getSigners();
    const config = buildDeploymentConfig({
      env: {},
      signers,
      ethersLib: ethers,
      network: "hardhat"
    });

    expect(config.defaultAdmin).to.equal(signers[1].address);
    expect(config.pauser).to.equal(signers[2].address);
    expect(config.reporter).to.equal(signers[3].address);
    expect(config.vestingAdmin).to.equal(signers[4].address);
    expect(config.treasury).to.equal(signers[5].address);
    expect(config.defaultAdmin).to.not.equal(signers[0].address);
    expect(config.treasury).to.not.equal(signers[0].address);
  });

  it("fails closed on public networks when privileged addresses or confirmation are missing", async function () {
    const signers = await ethers.getSigners();
    const addresses = {
      defaultAdmin: signers[1].address,
      pauser: signers[2].address,
      reporter: signers[3].address,
      vestingAdmin: signers[4].address,
      treasury: signers[5].address
    };

    expect(() => buildDeploymentConfig({
      env: { ...baseEnv(addresses), CONFIRM_NON_CANONICAL_V2_DEPLOY: "false" },
      signers,
      ethersLib: ethers,
      network: "sepolia"
    })).to.throw("CONFIRM_NON_CANONICAL_V2_DEPLOY=true");

    for (const key of [
      "V2_DEFAULT_ADMIN_ADDRESS",
      "V2_PAUSER_ADDRESS",
      "V2_REPORTER_ADDRESS",
      "V2_VESTING_ADMIN_ADDRESS",
      "V2_TREASURY_ADDRESS"
    ]) {
      const env = baseEnv(addresses);
      delete env[key];
      expect(() => buildDeploymentConfig({ env, signers, ethersLib: ethers, network: "sepolia" }))
        .to.throw(`${key} must be a valid Ethereum address`);
    }
  });

  it("rejects missing and oversized deployment metadata", async function () {
    const signers = await ethers.getSigners();
    const env = baseEnv({
      defaultAdmin: signers[1].address,
      pauser: signers[2].address,
      reporter: signers[3].address,
      vestingAdmin: signers[4].address,
      treasury: signers[5].address
    });

    for (const key of ["PROJECT_NAME", "BUSINESS_ENTITY", "PROJECT_JURISDICTION", "PROJECT_URI"]) {
      expect(() => buildDeploymentConfig({
        env: { ...env, [key]: "" },
        signers,
        ethersLib: ethers,
        network: "sepolia"
      })).to.throw(`${key} must be non-empty`);
    }

    expect(() => buildDeploymentConfig({
      env: { ...env, PROJECT_NAME: "x".repeat(81) },
      signers,
      ethersLib: ethers,
      network: "sepolia"
    })).to.throw("PROJECT_NAME must be non-empty and at most 80 bytes");
  });

  it("detects wrong role assignments after deployment", async function () {
    const [deployer] = await ethers.getSigners();
    const { token, vestingVault, config } = await deployForRoleAssertions({
      expectedPauser: deployer.address
    });

    await expectAsyncThrow(
      () => assertDeploymentRoles({ token, vestingVault, config, deployer: deployer.address }),
      "token pauser role assertion failed"
    );
  });

  it("detects deployer retaining an unexpected privileged role", async function () {
    const [deployer] = await ethers.getSigners();
    const { token, vestingVault, config, defaultAdmin } = await deployForRoleAssertions({});
    await token.connect(defaultAdmin).grantRole(await token.PAUSER_ROLE(), deployer.address);

    await expectAsyncThrow(
      () => assertDeploymentRoles({ token, vestingVault, config, deployer: deployer.address }),
      "deployer token pauser role assertion failed"
    );
  });

  it("builds the documented role manifest schema", async function () {
    const { token, vestingVault, config, deployer } = await deployForRoleAssertions({});
    const manifest = await buildRoleManifest({
      token,
      vestingVault,
      config,
      deployer: deployer.address,
      network: "hardhat",
      chainId: 31337,
      deployedAt: "2026-06-18T00:00:00.000Z"
    });

    expect(manifest.schema).to.equal("tikideco.v2.role-manifest/1");
    expect(manifest.roles.token.DEFAULT_ADMIN_ROLE).to.deep.equal([config.defaultAdmin]);
    expect(manifest.roles.token.PAUSER_ROLE).to.deep.equal([config.pauser]);
    expect(manifest.roles.token.REPORTER_ROLE).to.deep.equal([config.reporter]);
    expect(manifest.roles.vestingVault.VESTING_ADMIN_ROLE).to.deep.equal([config.vestingAdmin]);
    expect(manifest.treasury).to.equal(config.treasury);
  });
});

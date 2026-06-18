import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("TikiDecoTokenV2", function () {
  const NO_SUPERSEDED_REPORT = ethers.MaxUint256;
  const DEFAULT_ADMIN_DELAY = 60;

  async function deployToken() {
    const [defaultAdmin, treasury, holder, spender, pauser, reporter, newAdmin] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2");
    const token = await Token.deploy(
      defaultAdmin.address,
      pauser.address,
      reporter.address,
      treasury.address,
      "TikiDeco Sepolia prototype",
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project",
      DEFAULT_ADMIN_DELAY
    );

    return { token, defaultAdmin, treasury, holder, spender, pauser, reporter, newAdmin };
  }

  it("deploys an OpenZeppelin ERC-20 compatible TIDE supply to treasury", async function () {
    const { token, treasury } = await deployToken();

    expect(await token.name()).to.equal("TikiDeco");
    expect(await token.symbol()).to.equal("TIDE");
    expect(await token.decimals()).to.equal(18);
    expect(await token.totalSupply()).to.equal(await token.MAX_SUPPLY());
    expect(await token.balanceOf(treasury.address)).to.equal(await token.MAX_SUPPLY());
  });

  it("keeps owner and treasury separated", async function () {
    const [deployer, adminWallet, treasuryWallet, pauserWallet, reporterWallet] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2", deployer);

    const token = await Token.deploy(
      adminWallet.address,
      pauserWallet.address,
      reporterWallet.address,
      treasuryWallet.address,
      "TikiDeco Sepolia prototype",
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project",
      DEFAULT_ADMIN_DELAY
    );

    expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), adminWallet.address)).to.equal(true);
    expect(await token.hasRole(await token.PAUSER_ROLE(), pauserWallet.address)).to.equal(true);
    expect(await token.hasRole(await token.REPORTER_ROLE(), reporterWallet.address)).to.equal(true);
    expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), deployer.address)).to.equal(false);
    expect(await token.hasRole(await token.PAUSER_ROLE(), deployer.address)).to.equal(false);
    expect(await token.hasRole(await token.REPORTER_ROLE(), deployer.address)).to.equal(false);
    expect(await token.balanceOf(treasuryWallet.address)).to.equal(await token.MAX_SUPPLY());
  });

  it("stores neutral bounded project metadata", async function () {
    const { token } = await deployToken();

    expect(await token.projectName()).to.equal("TikiDeco Sepolia prototype");
    expect(await token.businessEntity()).to.equal("TikiDeco LLC");
    expect(await token.projectJurisdiction()).to.equal("Florida, USA");
    expect(await token.projectURI()).to.equal("ipfs://project");
  });

  it("rejects zero addresses in constructor", async function () {
    const [admin, treasury, pauser, reporter] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2");

    await expect(Token.deploy(
      ethers.ZeroAddress,
      pauser.address,
      reporter.address,
      treasury.address,
      "TikiDeco Sepolia prototype",
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project",
      DEFAULT_ADMIN_DELAY
    )).to.be.revertedWithCustomError(Token, "AccessControlInvalidDefaultAdmin");

    for (const args of [
      [admin.address, ethers.ZeroAddress, reporter.address, treasury.address],
      [admin.address, pauser.address, ethers.ZeroAddress, treasury.address],
      [admin.address, pauser.address, reporter.address, ethers.ZeroAddress]
    ]) {
      await expect(Token.deploy(
        ...args,
        "TikiDeco Sepolia prototype",
        "TikiDeco LLC",
        "Florida, USA",
        "ipfs://project",
        DEFAULT_ADMIN_DELAY
      )).to.be.revertedWithCustomError(Token, "ZeroAddress");
    }
  });

  it("rejects empty and oversized project metadata", async function () {
    const [admin, treasury, pauser, reporter] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2");
    const base = [
      admin.address,
      pauser.address,
      reporter.address,
      treasury.address,
      "TikiDeco Sepolia prototype",
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project",
      DEFAULT_ADMIN_DELAY
    ];

    for (const index of [4, 5, 6, 7]) {
      const args = [...base];
      args[index] = "";
      await expect(Token.deploy(...args)).to.be.revertedWithCustomError(Token, "InvalidProjectMetadata");
    }

    for (const [index, length] of [[4, 81], [5, 121], [6, 81], [7, 257]]) {
      const args = [...base];
      args[index] = "x".repeat(length);
      await expect(Token.deploy(...args)).to.be.revertedWithCustomError(Token, "InvalidProjectMetadata");
    }
  });

  it("transfers and approves through the standard OpenZeppelin ERC-20 base", async function () {
    const { token, treasury, holder, spender } = await deployToken();
    const amount = ethers.parseUnits("1000", 18);

    await token.connect(treasury).transfer(holder.address, amount);
    expect(await token.balanceOf(holder.address)).to.equal(amount);

    await token.connect(holder).approve(spender.address, amount);
    await token.connect(spender).transferFrom(holder.address, treasury.address, amount);

    expect(await token.balanceOf(holder.address)).to.equal(0);
  });

  it("allows standard non-zero to non-zero approve updates", async function () {
    const { token, holder, spender } = await deployToken();
    const first = ethers.parseUnits("100", 18);
    const second = ethers.parseUnits("200", 18);

    await token.connect(holder).approve(spender.address, first);
    await token.connect(holder).approve(spender.address, second);

    expect(await token.allowance(holder.address, spender.address)).to.equal(second);
  });

  it("preserves maximum uint allowance during transferFrom", async function () {
    const { token, treasury, holder, spender } = await deployToken();
    const amount = ethers.parseUnits("1000", 18);
    const spend = ethers.parseUnits("250", 18);

    await token.connect(treasury).transfer(holder.address, amount);
    await token.connect(holder).approve(spender.address, ethers.MaxUint256);
    await token.connect(spender).transferFrom(holder.address, treasury.address, spend);

    expect(await token.allowance(holder.address, spender.address)).to.equal(ethers.MaxUint256);
    expect(await token.balanceOf(holder.address)).to.equal(amount - spend);
  });

  it("supports zero-value transfers and self-transfers", async function () {
    const { token, treasury, holder } = await deployToken();
    const amount = ethers.parseUnits("100", 18);

    await expect(token.connect(treasury).transfer(holder.address, 0))
      .to.emit(token, "Transfer")
      .withArgs(treasury.address, holder.address, 0);

    await token.connect(treasury).transfer(holder.address, amount);
    await expect(token.connect(holder).transfer(holder.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(holder.address, holder.address, amount);

    expect(await token.balanceOf(holder.address)).to.equal(amount);
  });

  it("rejects accidental native ETH transfers", async function () {
    const { token, defaultAdmin } = await deployToken();

    await expect(
      defaultAdmin.sendTransaction({
        to: await token.getAddress(),
        value: 1
      })
    ).to.be.revertedWithCustomError(token, "NativeETHRejected");
  });

  it("uses a dedicated pauser role to block transfers", async function () {
    const { token, treasury, holder, spender, pauser } = await deployToken();

    await expect(token.connect(spender).pause())
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");

    await token.connect(pauser).pause();

    await expect(
      token.connect(treasury).transfer(holder.address, 1)
    ).to.be.revertedWithCustomError(token, "EnforcedPause");
  });

  it("blocks transferFrom while paused", async function () {
    const { token, treasury, holder, spender, pauser } = await deployToken();
    const amount = ethers.parseUnits("100", 18);

    await token.connect(treasury).transfer(holder.address, amount);
    await token.connect(holder).approve(spender.address, amount);
    await token.connect(pauser).pause();

    await expect(
      token.connect(spender).transferFrom(holder.address, treasury.address, amount)
    ).to.be.revertedWithCustomError(token, "EnforcedPause");
  });

  it("uses a dedicated reporter role for report publication", async function () {
    const { token, defaultAdmin, holder, reporter } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));

    await expect(token.connect(holder).publishReport(
      hash,
      "monthly-update",
      "ipfs://report",
      1717200000,
      1719791999,
      "v1.0.0",
      NO_SUPERSEDED_REPORT
    ))
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");

    await token.connect(defaultAdmin).grantRole(await token.REPORTER_ROLE(), holder.address);

    await expect(token.connect(holder).publishReport(
      hash,
      "monthly-update",
      "ipfs://report",
      1717200000,
      1719791999,
      "v1.0.0",
      NO_SUPERSEDED_REPORT
    ))
      .to.emit(token, "ProjectReportPublished")
      .withArgs(0, hash, "monthly-update", "ipfs://report", 1717200000, 1719791999, "v1.0.0", anyValue);
  });

  it("publishes bounded project report metadata on-chain", async function () {
    const { token, reporter } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));

    await expect(token.connect(reporter).publishReport(
      hash,
      "monthly-update",
      "ipfs://report",
      1717200000,
      1719791999,
      "v1.0.0",
      NO_SUPERSEDED_REPORT
    ))
      .to.emit(token, "ProjectReportPublished")
      .withArgs(0, hash, "monthly-update", "ipfs://report", 1717200000, 1719791999, "v1.0.0", anyValue);

    const report = await token.reportAt(0);
    expect(report.documentHash).to.equal(hash);
    expect(report.category).to.equal("monthly-update");
    expect(report.uri).to.equal("ipfs://report");
    expect(report.periodStart).to.equal(1717200000);
    expect(report.periodEnd).to.equal(1719791999);
    expect(report.version).to.equal("v1.0.0");
    expect(report.supersedesReportId).to.equal(NO_SUPERSEDED_REPORT);
  });

  it("rejects invalid report metadata", async function () {
    const { token, reporter } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));
    const longCategory = "x".repeat(65);
    const longUri = "x".repeat(257);
    const longVersion = "x".repeat(33);

    await expect(token.connect(reporter).publishReport(ethers.ZeroHash, "monthly-update", "ipfs://report", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "", "ipfs://report", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, longCategory, "ipfs://report", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "monthly-update", "", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "monthly-update", longUri, 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "monthly-update", "ipfs://report", 2, 1, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "monthly-update", "ipfs://report", 1, 2, "", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "monthly-update", "ipfs://report", 1, 2, longVersion, NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.connect(reporter).publishReport(hash, "monthly-update", "ipfs://report", 1, 2, "v1", 0))
      .to.be.revertedWithCustomError(token, "InvalidReport");
  });

  it("emits a supersede event for report corrections", async function () {
    const { token, reporter } = await deployToken();
    const oldHash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update correction"));

    await token.connect(reporter).publishReport(oldHash, "monthly-update", "ipfs://report-v1", 1, 2, "v1", NO_SUPERSEDED_REPORT);

    await expect(token.connect(reporter).publishReport(newHash, "monthly-update", "ipfs://report-v2", 1, 2, "v2", 0))
      .to.emit(token, "ProjectReportSuperseded")
      .withArgs(0, 1, newHash);
  });

  it("restricts and validates project URI updates", async function () {
    const { token, defaultAdmin, holder } = await deployToken();

    await expect(token.connect(holder).updateProjectURI("ipfs://new-project"))
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
    await expect(token.connect(defaultAdmin).updateProjectURI(""))
      .to.be.revertedWithCustomError(token, "InvalidProjectMetadata");
    await expect(token.connect(defaultAdmin).updateProjectURI("x".repeat(257)))
      .to.be.revertedWithCustomError(token, "InvalidProjectMetadata");

    await expect(token.connect(defaultAdmin).updateProjectURI("ipfs://new-project"))
      .to.emit(token, "ProjectURIUpdated")
      .withArgs("ipfs://project", "ipfs://new-project");
  });

  it("transfers default admin through configured delay", async function () {
    const { token, defaultAdmin, newAdmin } = await deployToken();

    expect(await token.defaultAdminDelay()).to.equal(DEFAULT_ADMIN_DELAY);
    await token.connect(defaultAdmin).beginDefaultAdminTransfer(newAdmin.address);
    await expect(token.connect(newAdmin).acceptDefaultAdminTransfer())
      .to.be.revertedWithCustomError(token, "AccessControlEnforcedDefaultAdminDelay");

    await ethers.provider.send("evm_increaseTime", [DEFAULT_ADMIN_DELAY]);
    await ethers.provider.send("evm_mine");
    await token.connect(newAdmin).acceptDefaultAdminTransfer();

    expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), defaultAdmin.address)).to.equal(false);
    expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), newAdmin.address)).to.equal(true);
  });
});

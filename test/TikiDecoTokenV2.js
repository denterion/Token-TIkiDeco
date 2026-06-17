const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("TikiDecoTokenV2", function () {
  const NO_SUPERSEDED_REPORT = ethers.MaxUint256;

  async function deployToken() {
    const [owner, treasury, holder, spender] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2");
    const token = await Token.deploy(
      owner.address,
      treasury.address,
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project"
    );

    return { token, owner, treasury, holder, spender };
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
    const [deployer, ownerWallet, treasuryWallet] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoTokenV2", deployer);

    const token = await Token.deploy(
      ownerWallet.address,
      treasuryWallet.address,
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project"
    );

    expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), ownerWallet.address)).to.equal(true);
    expect(await token.hasRole(await token.PAUSER_ROLE(), ownerWallet.address)).to.equal(true);
    expect(await token.hasRole(await token.REPORTER_ROLE(), ownerWallet.address)).to.equal(true);
    expect(await token.balanceOf(treasuryWallet.address)).to.equal(await token.MAX_SUPPLY());
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
    const { token, owner } = await deployToken();

    await expect(
      owner.sendTransaction({
        to: await token.getAddress(),
        value: 1
      })
    ).to.be.revertedWithCustomError(token, "NativeETHRejected");
  });

  it("uses a dedicated pauser role to block transfers", async function () {
    const { token, treasury, holder, spender } = await deployToken();

    await expect(token.connect(spender).pause())
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");

    await token.pause();

    await expect(
      token.connect(treasury).transfer(holder.address, 1)
    ).to.be.revertedWithCustomError(token, "EnforcedPause");
  });

  it("blocks transferFrom while paused", async function () {
    const { token, treasury, holder, spender } = await deployToken();
    const amount = ethers.parseUnits("100", 18);

    await token.connect(treasury).transfer(holder.address, amount);
    await token.connect(holder).approve(spender.address, amount);
    await token.pause();

    await expect(
      token.connect(spender).transferFrom(holder.address, treasury.address, amount)
    ).to.be.revertedWithCustomError(token, "EnforcedPause");
  });

  it("uses a dedicated reporter role for report publication", async function () {
    const { token, holder } = await deployToken();
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

    await token.grantRole(await token.REPORTER_ROLE(), holder.address);

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
    const { token } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));

    await expect(token.publishReport(
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
    const { token } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));
    const longCategory = "x".repeat(65);
    const longUri = "x".repeat(257);
    const longVersion = "x".repeat(33);

    await expect(token.publishReport(ethers.ZeroHash, "monthly-update", "ipfs://report", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "", "ipfs://report", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, longCategory, "ipfs://report", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "monthly-update", "", 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "monthly-update", longUri, 1, 2, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "monthly-update", "ipfs://report", 2, 1, "v1", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "monthly-update", "ipfs://report", 1, 2, "", NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "monthly-update", "ipfs://report", 1, 2, longVersion, NO_SUPERSEDED_REPORT))
      .to.be.revertedWithCustomError(token, "InvalidReport");
    await expect(token.publishReport(hash, "monthly-update", "ipfs://report", 1, 2, "v1", 0))
      .to.be.revertedWithCustomError(token, "InvalidReport");
  });

  it("emits a supersede event for report corrections", async function () {
    const { token } = await deployToken();
    const oldHash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update correction"));

    await token.publishReport(oldHash, "monthly-update", "ipfs://report-v1", 1, 2, "v1", NO_SUPERSEDED_REPORT);

    await expect(token.publishReport(newHash, "monthly-update", "ipfs://report-v2", 1, 2, "v2", 0))
      .to.emit(token, "ProjectReportSuperseded")
      .withArgs(0, 1, newHash);
  });
});

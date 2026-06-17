const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("TikiDecoTokenV2", function () {
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

  it("transfers and approves through the OpenZeppelin ERC-20 base", async function () {
    const { token, treasury, holder, spender } = await deployToken();
    const amount = ethers.parseUnits("1000", 18);

    await token.connect(treasury).transfer(holder.address, amount);
    expect(await token.balanceOf(holder.address)).to.equal(amount);

    await token.connect(holder).approve(spender.address, amount);
    await token.connect(spender).transferFrom(holder.address, treasury.address, amount);

    expect(await token.balanceOf(holder.address)).to.equal(0);
  });

  it("preserves zero-first direct approve hardening", async function () {
    const { token, holder, spender } = await deployToken();
    const first = ethers.parseUnits("100", 18);
    const second = ethers.parseUnits("200", 18);

    await token.connect(holder).approve(spender.address, first);

    await expect(token.connect(holder).approve(spender.address, second))
      .to.be.revertedWithCustomError(token, "UnsafeAllowanceChange");

    await token.connect(holder).approve(spender.address, 0);
    await token.connect(holder).approve(spender.address, second);

    expect(await token.allowance(holder.address, spender.address)).to.equal(second);
  });

  it("supports explicit allowance increase and decrease helpers", async function () {
    const { token, holder, spender } = await deployToken();
    const first = ethers.parseUnits("100", 18);
    const second = ethers.parseUnits("25", 18);

    await token.connect(holder).increaseAllowance(spender.address, first);
    expect(await token.allowance(holder.address, spender.address)).to.equal(first);

    await token.connect(holder).decreaseAllowance(spender.address, second);
    expect(await token.allowance(holder.address, spender.address)).to.equal(first - second);

    await expect(token.connect(holder).decreaseAllowance(spender.address, first))
      .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
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

  it("uses a dedicated reporter role for report publication", async function () {
    const { token, holder } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));

    await expect(token.connect(holder).publishReport(hash, "monthly-update", "ipfs://report"))
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");

    await token.grantRole(await token.REPORTER_ROLE(), holder.address);

    await expect(token.connect(holder).publishReport(hash, "monthly-update", "ipfs://report"))
      .to.emit(token, "ProjectReportPublished")
      .withArgs(0, hash, "monthly-update", "ipfs://report", anyValue);
  });

  it("publishes project report hashes on-chain", async function () {
    const { token } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));

    await expect(token.publishReport(hash, "monthly-update", "ipfs://report"))
      .to.emit(token, "ProjectReportPublished")
      .withArgs(0, hash, "monthly-update", "ipfs://report", anyValue);

    const report = await token.reportAt(0);
    expect(report.documentHash).to.equal(hash);
    expect(report.category).to.equal("monthly-update");
    expect(report.uri).to.equal("ipfs://report");
  });
});

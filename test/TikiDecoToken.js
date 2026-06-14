const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TikiDecoToken", function () {
  async function deployToken() {
    const [owner, treasury, holder, spender] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoToken");
    const token = await Token.deploy(
      owner.address,
      treasury.address,
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project"
    );

    return { token, owner, treasury, holder, spender };
  }

  it("deploys TIDE with the full fixed supply in treasury", async function () {
    const { token, treasury } = await deployToken();

    expect(await token.name()).to.equal("TikiDeco");
    expect(await token.symbol()).to.equal("TIDE");
    expect(await token.totalSupply()).to.equal(await token.MAX_SUPPLY());
    expect(await token.balanceOf(treasury.address)).to.equal(await token.MAX_SUPPLY());
  });

  it("can bind ownership and treasury to different wallets at deployment", async function () {
    const [deployer, ownerWallet, treasuryWallet] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TikiDecoToken", deployer);

    const token = await Token.deploy(
      ownerWallet.address,
      treasuryWallet.address,
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project"
    );

    expect(await token.owner()).to.equal(ownerWallet.address);
    expect(await token.balanceOf(treasuryWallet.address)).to.equal(await token.MAX_SUPPLY());
  });

  it("transfers and approves like a standard ERC-20", async function () {
    const { token, treasury, holder, spender } = await deployToken();
    const amount = ethers.parseUnits("1000", 18);

    await token.connect(treasury).transfer(holder.address, amount);
    expect(await token.balanceOf(holder.address)).to.equal(amount);

    await token.connect(holder).approve(spender.address, amount);
    await token.connect(spender).transferFrom(holder.address, treasury.address, amount);

    expect(await token.balanceOf(holder.address)).to.equal(0);
  });

  it("lets the owner pause transfers", async function () {
    const { token, treasury, holder } = await deployToken();

    await token.pause();

    await expect(
      token.connect(treasury).transfer(holder.address, 1)
    ).to.be.revertedWithCustomError(token, "PausedTransfers");
  });

  it("publishes project report hashes on-chain", async function () {
    const { token } = await deployToken();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("June 2026 investor update"));

    await expect(token.publishReport(hash, "monthly-update", "ipfs://report"))
      .to.emit(token, "ProjectReportPublished")
      .withArgs(0, hash, "monthly-update", "ipfs://report");

    const report = await token.reportAt(0);
    expect(report.documentHash).to.equal(hash);
    expect(report.category).to.equal("monthly-update");
    expect(report.uri).to.equal("ipfs://report");
  });
});

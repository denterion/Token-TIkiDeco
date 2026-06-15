const { expect } = require("chai");
const { ethers } = require("hardhat");

const MONTH = 30 * 24 * 60 * 60;

describe("TikiDecoVestingVault", function () {
  async function deployFixture() {
    const [owner, treasury, beneficiary, refund] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TikiDecoToken");
    const token = await Token.deploy(
      owner.address,
      treasury.address,
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project"
    );

    const Vault = await ethers.getContractFactory("TikiDecoVestingVault");
    const vault = await Vault.deploy(await token.getAddress(), treasury.address);

    return { token, vault, owner, treasury, beneficiary, refund };
  }

  async function latestTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  async function increaseTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  }

  it("creates a funded vesting schedule from treasury", async function () {
    const { token, vault, treasury, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1000", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).approve(await vault.getAddress(), amount);

    await expect(
      vault.connect(treasury).createSchedule(
        beneficiary.address,
        amount,
        start,
        6 * MONTH,
        24 * MONTH,
        true
      )
    ).to.emit(vault, "ScheduleCreated");

    expect(await token.balanceOf(await vault.getAddress())).to.equal(amount);
    expect(await vault.scheduleCount()).to.equal(1);
  });

  it("rejects invalid schedule ids and accidental native ETH", async function () {
    const { vault, treasury } = await deployFixture();

    await expect(vault.scheduleAt(0))
      .to.be.revertedWithCustomError(vault, "ScheduleNotFound");

    await expect(
      treasury.sendTransaction({
        to: await vault.getAddress(),
        value: 1
      })
    ).to.be.revertedWithCustomError(vault, "NativeETHRejected");
  });

  it("blocks release before cliff and releases vested tokens after cliff", async function () {
    const { token, vault, treasury, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("2400", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).approve(await vault.getAddress(), amount);
    await vault.connect(treasury).createSchedule(
      beneficiary.address,
      amount,
      start,
      6 * MONTH,
      24 * MONTH,
      true
    );

    await expect(vault.connect(beneficiary).release(0))
      .to.be.revertedWithCustomError(vault, "InvalidAmount");

    await increaseTime(12 * MONTH);
    await vault.connect(beneficiary).release(0);

    const expected = amount / 2n;
    expect(await token.balanceOf(beneficiary.address)).to.be.closeTo(
      expected,
      ethers.parseUnits("2", 18)
    );
  });

  it("returns unvested tokens when a revocable schedule is revoked", async function () {
    const { token, vault, treasury, beneficiary, refund } = await deployFixture();
    const amount = ethers.parseUnits("2400", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).approve(await vault.getAddress(), amount);
    await vault.connect(treasury).createSchedule(
      beneficiary.address,
      amount,
      start,
      0,
      24 * MONTH,
      true
    );

    await increaseTime(6 * MONTH);
    await vault.connect(treasury).revoke(0, refund.address);

    const vested = amount / 4n;
    const unvested = amount - vested;

    expect(await token.balanceOf(beneficiary.address)).to.be.closeTo(
      vested,
      ethers.parseUnits("2", 18)
    );
    expect(await token.balanceOf(refund.address)).to.be.closeTo(
      unvested,
      ethers.parseUnits("2", 18)
    );
  });

  it("prevents non-owner schedule creation", async function () {
    const { vault, beneficiary } = await deployFixture();

    await expect(
      vault.connect(beneficiary).createSchedule(
        beneficiary.address,
        ethers.parseUnits("1", 18),
        await latestTimestamp(),
        0,
        MONTH,
        true
      )
    ).to.be.revertedWithCustomError(vault, "NotOwner");
  });
});

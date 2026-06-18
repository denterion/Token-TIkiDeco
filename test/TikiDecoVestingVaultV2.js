import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const MONTH = 30 * 24 * 60 * 60;
const DEFAULT_ADMIN_DELAY = 60;

describe("TikiDecoVestingVaultV2", function () {
  async function deployFixture() {
    const [
      defaultAdmin,
      treasury,
      beneficiary,
      secondBeneficiary,
      outsider,
      newTreasury,
      vestingAdmin,
      pauser,
      reporter,
      newAdmin
    ] = await ethers.getSigners();

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

    const Vault = await ethers.getContractFactory("TikiDecoVestingVaultV2");
    const vault = await Vault.deploy(
      await token.getAddress(),
      defaultAdmin.address,
      vestingAdmin.address,
      treasury.address,
      DEFAULT_ADMIN_DELAY
    );

    return {
      token,
      vault,
      defaultAdmin,
      treasury,
      beneficiary,
      secondBeneficiary,
      outsider,
      newTreasury,
      vestingAdmin,
      pauser,
      newAdmin
    };
  }

  async function latestTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  async function mineAt(timestamp) {
    await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
    await ethers.provider.send("evm_mine");
  }

  async function setNextBlockTimestamp(timestamp) {
    await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  }

  async function createFundedSchedule({
    amount = ethers.parseUnits("2400", 18),
    cliffDuration = 6 * MONTH,
    vestingDuration = 24 * MONTH,
    revocable = true
  } = {}) {
    const fixture = await deployFixture();
    const { token, vault, treasury, vestingAdmin, beneficiary } = fixture;
    const start = (await latestTimestamp()) + 1000;

    await token.connect(treasury).transfer(await vault.getAddress(), amount);
    await vault.connect(vestingAdmin).createSchedule(
      beneficiary.address,
      amount,
      start,
      cliffDuration,
      vestingDuration,
      revocable
    );

    return { ...fixture, amount, start, cliffDuration, vestingDuration };
  }

  it("creates a funded vesting schedule from a prefunded vault", async function () {
    const { token, vault, treasury, vestingAdmin, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1000", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).transfer(await vault.getAddress(), amount);

    await expect(
      vault.connect(vestingAdmin).createSchedule(
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
    expect(await vault.totalReserved()).to.equal(amount);
    expect(await vault.totalReleased()).to.equal(0);
    expect(await vault.outstandingLiabilities()).to.equal(amount);
    expect(await vault.unreservedBalance()).to.equal(0);

    const schedule = await vault.scheduleAt(0);
    expect(schedule.cliffDuration).to.equal(6 * MONTH);
    expect(schedule.vestingDuration).to.equal(24 * MONTH);
  });

  it("rejects schedules that exceed unreserved prefunded balance", async function () {
    const { token, vault, treasury, vestingAdmin, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1000", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).transfer(await vault.getAddress(), amount - 1n);

    await expect(
      vault.connect(vestingAdmin).createSchedule(beneficiary.address, amount, start, 0, MONTH, true)
    ).to.be.revertedWithCustomError(vault, "InsufficientUnreservedBalance");
  });

  it("rejects zero addresses and EOA token addresses", async function () {
    const { defaultAdmin, treasury, vestingAdmin } = await deployFixture();
    const Vault = await ethers.getContractFactory("TikiDecoVestingVaultV2");

    await expect(Vault.deploy(treasury.address, defaultAdmin.address, vestingAdmin.address, treasury.address, DEFAULT_ADMIN_DELAY))
      .to.be.revertedWithCustomError(Vault, "InvalidToken");

    const validToken = (await deployFixture()).token;
    const validTokenAddress = await validToken.getAddress();

    for (const args of [
      [ethers.ZeroAddress, defaultAdmin.address, vestingAdmin.address, treasury.address, DEFAULT_ADMIN_DELAY],
      [validTokenAddress, defaultAdmin.address, ethers.ZeroAddress, treasury.address, DEFAULT_ADMIN_DELAY],
      [validTokenAddress, defaultAdmin.address, vestingAdmin.address, ethers.ZeroAddress, DEFAULT_ADMIN_DELAY]
    ]) {
      await expect(Vault.deploy(...args)).to.be.revertedWithCustomError(Vault, "ZeroAddress");
    }
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

  it("reports zero vested one second before cliff", async function () {
    const { vault, start, cliffDuration } = await createFundedSchedule();

    await mineAt(start + cliffDuration - 1);

    expect(await vault.vestedAmount(0)).to.equal(0);
    expect(await vault.releasable(0)).to.equal(0);
  });

  it("reports zero vested at the exact cliff moment", async function () {
    const { vault, start, cliffDuration } = await createFundedSchedule();

    await mineAt(start + cliffDuration);

    expect(await vault.vestedAmount(0)).to.equal(0);
    expect(await vault.releasable(0)).to.equal(0);
  });

  it("vests one second after cliff", async function () {
    const { vault, amount, start, cliffDuration, vestingDuration } = await createFundedSchedule();

    await mineAt(start + cliffDuration + 1);

    expect(await vault.vestedAmount(0)).to.equal(amount / BigInt(vestingDuration));
  });

  it("vests half at the middle of the post-cliff vesting period", async function () {
    const { vault, amount, start, cliffDuration, vestingDuration } = await createFundedSchedule();

    await mineAt(start + cliffDuration + (vestingDuration / 2));

    expect(await vault.vestedAmount(0)).to.equal(amount / 2n);
  });

  it("fully vests at cliff duration plus vesting duration", async function () {
    const { vault, amount, start, cliffDuration, vestingDuration } = await createFundedSchedule();

    await mineAt(start + cliffDuration + vestingDuration);

    expect(await vault.vestedAmount(0)).to.equal(amount);
  });

  it("releases multiple times and updates liabilities", async function () {
    const { token, vault, beneficiary, amount, start, cliffDuration, vestingDuration } = await createFundedSchedule();

    await setNextBlockTimestamp(start + cliffDuration + (vestingDuration / 4));
    await vault.connect(beneficiary).release(0);
    const firstRelease = amount / 4n;
    expect(await token.balanceOf(beneficiary.address)).to.equal(firstRelease);
    expect(await vault.totalReleased()).to.equal(firstRelease);
    expect(await vault.outstandingLiabilities()).to.equal(amount - firstRelease);

    await setNextBlockTimestamp(start + cliffDuration + (vestingDuration / 2));
    await vault.connect(beneficiary).release(0);
    const totalReleased = amount / 2n;
    expect(await token.balanceOf(beneficiary.address)).to.equal(totalReleased);
    expect(await vault.totalReleased()).to.equal(totalReleased);
    expect(await vault.outstandingLiabilities()).to.equal(amount - totalReleased);
  });

  it("blocks beneficiary release while the token is paused", async function () {
    const { token, vault, beneficiary, pauser, start, cliffDuration, vestingDuration } = await createFundedSchedule();

    await token.connect(pauser).pause();
    await setNextBlockTimestamp(start + cliffDuration + (vestingDuration / 4));

    await expect(vault.connect(beneficiary).release(0))
      .to.be.revertedWithCustomError(token, "EnforcedPause");

    await token.connect(pauser).unpause();
    await setNextBlockTimestamp((await latestTimestamp()) + 1);
    await expect(vault.connect(beneficiary).release(0))
      .to.emit(vault, "TokensReleased");
  });

  it("blocks vesting admin release while the token is paused", async function () {
    const { token, vault, vestingAdmin, pauser, start, cliffDuration, vestingDuration } = await createFundedSchedule();

    await token.connect(pauser).pause();
    await setNextBlockTimestamp(start + cliffDuration + (vestingDuration / 4));

    await expect(vault.connect(vestingAdmin).release(0))
      .to.be.revertedWithCustomError(token, "EnforcedPause");
  });

  it("revokes before cliff and refunds only to treasury", async function () {
    const { token, vault, treasury, beneficiary, vestingAdmin, amount, start, cliffDuration } = await createFundedSchedule();
    const treasuryBefore = await token.balanceOf(treasury.address);

    await mineAt(start + cliffDuration - 1);

    await expect(vault.connect(vestingAdmin).revoke(0))
      .to.emit(vault, "ScheduleRevoked")
      .withArgs(0, beneficiary.address, treasury.address, 0, amount, anyValue);

    expect(await token.balanceOf(treasury.address)).to.equal(treasuryBefore + amount);
    expect(await token.balanceOf(beneficiary.address)).to.equal(0);
    expect(await vault.totalReserved()).to.equal(0);
    expect(await vault.totalReleased()).to.equal(0);
    expect(await vault.outstandingLiabilities()).to.equal(0);
  });

  it("revokes after cliff, releases vested amount, and refunds unvested only to treasury", async function () {
    const { token, vault, treasury, beneficiary, vestingAdmin, amount, start, cliffDuration, vestingDuration } = await createFundedSchedule();
    const treasuryBefore = await token.balanceOf(treasury.address);

    await setNextBlockTimestamp(start + cliffDuration + (vestingDuration / 4));
    await vault.connect(vestingAdmin).revoke(0);

    const vested = amount / 4n;
    const refund = amount - vested;
    expect(await token.balanceOf(beneficiary.address)).to.equal(vested);
    expect(await token.balanceOf(treasury.address)).to.equal(treasuryBefore + refund);
    expect(await vault.totalReserved()).to.equal(vested);
    expect(await vault.totalReleased()).to.equal(vested);
    expect(await vault.outstandingLiabilities()).to.equal(0);
  });

  it("revokes after full vesting without refunding unvested tokens", async function () {
    const { token, vault, treasury, beneficiary, vestingAdmin, amount, start, cliffDuration, vestingDuration } = await createFundedSchedule();
    const treasuryBefore = await token.balanceOf(treasury.address);

    await mineAt(start + cliffDuration + vestingDuration);

    await expect(vault.connect(vestingAdmin).revoke(0))
      .to.emit(vault, "ScheduleRevoked")
      .withArgs(0, beneficiary.address, treasury.address, amount, 0, anyValue);

    expect(await token.balanceOf(beneficiary.address)).to.equal(amount);
    expect(await token.balanceOf(treasury.address)).to.equal(treasuryBefore);
    expect(await vault.totalReserved()).to.equal(amount);
    expect(await vault.totalReleased()).to.equal(amount);
    expect(await vault.outstandingLiabilities()).to.equal(0);
  });

  it("rejects zero vesting duration", async function () {
    const { token, vault, treasury, vestingAdmin, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).transfer(await vault.getAddress(), amount);

    await expect(
      vault.connect(vestingAdmin).createSchedule(beneficiary.address, amount, start, 0, 0, true)
    ).to.be.revertedWithCustomError(vault, "InvalidSchedule");
  });

  it("rejects schedules with too distant timestamps", async function () {
    const { token, vault, treasury, vestingAdmin, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1", 18);

    await token.connect(treasury).transfer(await vault.getAddress(), amount);

    await expect(
      vault.connect(vestingAdmin).createSchedule(
        beneficiary.address,
        amount,
        (1n << 64n) - 1n,
        1,
        1,
        true
      )
    ).to.revert(ethers);
  });

  it("supports old start dates using current timestamp vesting math", async function () {
    const { token, vault, treasury, vestingAdmin, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("2400", 18);
    const now = await latestTimestamp();
    const start = now - (13 * MONTH);

    await token.connect(treasury).transfer(await vault.getAddress(), amount);
    await vault.connect(vestingAdmin).createSchedule(beneficiary.address, amount, start, 12 * MONTH, 36 * MONTH, true);

    const vested = await vault.vestedAmount(0);
    expect(vested).to.be.greaterThan(0);
    expect(vested).to.be.lessThan(amount);
  });

  it("supports two-step treasury transfer and cancellation", async function () {
    const { vault, defaultAdmin, newTreasury, outsider } = await deployFixture();

    await expect(vault.connect(defaultAdmin).transferTreasury(newTreasury.address))
      .to.emit(vault, "TreasuryTransferStarted");
    expect(await vault.pendingTreasury()).to.equal(newTreasury.address);

    await expect(vault.connect(outsider).acceptTreasury())
      .to.be.revertedWithCustomError(vault, "NotPendingTreasury");

    await vault.connect(defaultAdmin).cancelTreasuryTransfer();
    expect(await vault.pendingTreasury()).to.equal(ethers.ZeroAddress);

    await vault.connect(defaultAdmin).transferTreasury(newTreasury.address);
    await vault.connect(newTreasury).acceptTreasury();
    expect(await vault.treasury()).to.equal(newTreasury.address);
  });

  it("prevents unauthorized treasury transfer", async function () {
    const { vault, outsider, newTreasury } = await deployFixture();

    await expect(vault.connect(outsider).transferTreasury(newTreasury.address))
      .to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
  });

  it("prevents non-vesting-admin schedule creation and revocation", async function () {
    const { token, vault, treasury, beneficiary, outsider, vestingAdmin } = await deployFixture();
    const amount = ethers.parseUnits("1", 18);
    const start = await latestTimestamp();

    await token.connect(treasury).transfer(await vault.getAddress(), amount);

    await expect(
      vault.connect(outsider).createSchedule(beneficiary.address, amount, start, 0, MONTH, true)
    ).to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");

    await vault.connect(vestingAdmin).createSchedule(beneficiary.address, amount, start, 0, MONTH, true);

    await expect(vault.connect(outsider).revoke(0))
      .to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
  });

  it("transfers default admin through configured delay", async function () {
    const { vault, defaultAdmin, newAdmin } = await deployFixture();

    expect(await vault.defaultAdminDelay()).to.equal(DEFAULT_ADMIN_DELAY);
    await vault.connect(defaultAdmin).beginDefaultAdminTransfer(newAdmin.address);
    await expect(vault.connect(newAdmin).acceptDefaultAdminTransfer())
      .to.be.revertedWithCustomError(vault, "AccessControlEnforcedDefaultAdminDelay");

    await ethers.provider.send("evm_increaseTime", [DEFAULT_ADMIN_DELAY]);
    await ethers.provider.send("evm_mine");
    await vault.connect(newAdmin).acceptDefaultAdminTransfer();

    expect(await vault.hasRole(await vault.DEFAULT_ADMIN_ROLE(), defaultAdmin.address)).to.equal(false);
    expect(await vault.hasRole(await vault.DEFAULT_ADMIN_ROLE(), newAdmin.address)).to.equal(true);
  });
});

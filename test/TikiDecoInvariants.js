const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAY = 24 * 60 * 60;

describe("TikiDeco V2 invariants", function () {
  async function deployFixture() {
    const [admin, treasury, beneficiary, secondBeneficiary, spender, outsider] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TikiDecoTokenV2");
    const token = await Token.deploy(
      admin.address,
      treasury.address,
      "TikiDeco LLC",
      "Florida, USA",
      "ipfs://project"
    );

    const Vault = await ethers.getContractFactory("TikiDecoVestingVaultV2");
    const vault = await Vault.deploy(await token.getAddress(), admin.address, treasury.address);

    return { token, vault, admin, treasury, beneficiary, secondBeneficiary, spender, outsider };
  }

  async function latestTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }

  async function setNextBlockTimestamp(timestamp) {
    await ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
  }

  it("keeps supply fixed after construction across representative operations", async function () {
    const { token, treasury, beneficiary, secondBeneficiary, spender } = await deployFixture();
    const initialSupply = await token.totalSupply();
    const amount = ethers.parseUnits("1000", 18);

    await token.connect(treasury).transfer(beneficiary.address, amount);
    await token.connect(beneficiary).approve(spender.address, ethers.MaxUint256);
    await token.connect(spender).transferFrom(beneficiary.address, secondBeneficiary.address, amount / 4n);
    await token.connect(secondBeneficiary).transfer(secondBeneficiary.address, amount / 8n);
    await token.connect(secondBeneficiary).transfer(treasury.address, 0);

    expect(await token.totalSupply()).to.equal(initialSupply);
  });

  it("never lets vault liabilities exceed held token balance", async function () {
    const { token, vault, treasury, beneficiary, secondBeneficiary } = await deployFixture();
    const firstAmount = ethers.parseUnits("1200", 18);
    const secondAmount = ethers.parseUnits("600", 18);
    const start = (await latestTimestamp()) + DAY;

    await token.connect(treasury).transfer(await vault.getAddress(), firstAmount + secondAmount);
    await vault.createSchedule(beneficiary.address, firstAmount, start, DAY, 10 * DAY, true);
    await vault.createSchedule(secondBeneficiary.address, secondAmount, start, 0, 5 * DAY, true);

    async function expectSolvent() {
      expect(await vault.outstandingLiabilities()).to.be.lessThanOrEqual(await token.balanceOf(await vault.getAddress()));
    }

    await expectSolvent();

    await setNextBlockTimestamp(start + DAY + 5 * DAY);
    await vault.connect(beneficiary).release(0);
    await expectSolvent();

    await setNextBlockTimestamp(start + DAY + 5 * DAY + 1);
    await vault.revoke(1);
    await expectSolvent();
  });

  it("never releases more than vested amount", async function () {
    const { token, vault, treasury, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1000", 18);
    const start = (await latestTimestamp()) + DAY;

    await token.connect(treasury).transfer(await vault.getAddress(), amount);
    await vault.createSchedule(beneficiary.address, amount, start, DAY, 10 * DAY, true);

    await setNextBlockTimestamp(start + DAY + 3 * DAY);
    await vault.connect(beneficiary).release(0);

    const schedule = await vault.scheduleAt(0);
    expect(schedule.releasedAmount).to.be.lessThanOrEqual(await vault.vestedAmount(0));
  });

  it("does not release from a revoked schedule again", async function () {
    const { token, vault, treasury, beneficiary } = await deployFixture();
    const amount = ethers.parseUnits("1000", 18);
    const start = (await latestTimestamp()) + DAY;

    await token.connect(treasury).transfer(await vault.getAddress(), amount);
    await vault.createSchedule(beneficiary.address, amount, start, DAY, 10 * DAY, true);

    await setNextBlockTimestamp(start + DAY + 3 * DAY);
    await vault.revoke(0);

    await expect(vault.connect(beneficiary).release(0))
      .to.be.revertedWithCustomError(vault, "InvalidAmount");
  });

  it("keeps privileged operations role-gated", async function () {
    const { token, vault, treasury, beneficiary, outsider } = await deployFixture();
    const amount = ethers.parseUnits("1", 18);
    const start = await latestTimestamp();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("report"));

    await expect(token.connect(outsider).pause())
      .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
    await expect(token.connect(outsider).publishReport(
      hash,
      "category",
      "ipfs://report",
      1,
      2,
      "v1",
      ethers.MaxUint256
    )).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");

    await token.connect(treasury).transfer(await vault.getAddress(), amount);
    await expect(vault.connect(outsider).createSchedule(beneficiary.address, amount, start, 0, DAY, true))
      .to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");

    await vault.createSchedule(beneficiary.address, amount, start, 0, DAY, true);
    await expect(vault.connect(outsider).revoke(0))
      .to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
    await expect(vault.connect(outsider).transferTreasury(outsider.address))
      .to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
  });
});

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TikiDecoTokenV2} from "../../contracts/TikiDecoTokenV2.sol";
import {TikiDecoVestingVaultV2} from "../../contracts/TikiDecoVestingVaultV2.sol";
import {FoundryTestBase} from "./FoundryTestBase.sol";

contract TikiDecoVestingVaultV2Handler is FoundryTestBase {
    TikiDecoTokenV2 public immutable token;
    TikiDecoVestingVaultV2 public immutable vault;
    address public immutable treasury;
    address public immutable vestingAdmin;
    address public immutable defaultAdmin;

    address[8] public beneficiaries;
    address[3] public treasuryCandidates;
    uint256 public maxSchedules = 8;

    constructor(
        TikiDecoTokenV2 token_,
        TikiDecoVestingVaultV2 vault_,
        address treasury_,
        address vestingAdmin_,
        address defaultAdmin_
    ) {
        token = token_;
        vault = vault_;
        treasury = treasury_;
        vestingAdmin = vestingAdmin_;
        defaultAdmin = defaultAdmin_;
        beneficiaries[0] = address(0xB001);
        beneficiaries[1] = address(0xB002);
        beneficiaries[2] = address(0xB003);
        beneficiaries[3] = address(0xB004);
        beneficiaries[4] = address(0xB005);
        beneficiaries[5] = address(0xB006);
        beneficiaries[6] = address(0xB007);
        beneficiaries[7] = address(0xB008);
        treasuryCandidates[0] = address(0xAAA1);
        treasuryCandidates[1] = address(0xAAA2);
        treasuryCandidates[2] = address(0xAAA3);
    }

    function createSchedule(uint256 amountSeed, uint256 startSeed, uint256 cliffSeed, uint256 durationSeed, bool revocable) external {
        uint256 count = vault.scheduleCount();
        if (count >= maxSchedules) return;

        uint256 available = vault.unreservedBalance();
        if (available == 0) return;

        uint256 amount = bound(amountSeed, 1, available);
        uint64 start = uint64(bound(startSeed, block.timestamp, block.timestamp + 30 days));
        uint64 cliffDuration = uint64(bound(cliffSeed, 0, 30 days));
        uint64 vestingDuration = uint64(bound(durationSeed, 1, 365 days));

        vm.prank(vestingAdmin);
        try vault.createSchedule(
            beneficiaries[count],
            amount,
            start,
            cliffDuration,
            vestingDuration,
            revocable
        ) {} catch {}
    }

    function tryOverReserve(uint256 amountSeed) external {
        uint256 count = vault.scheduleCount();
        if (count >= maxSchedules) return;
        uint256 available = vault.unreservedBalance();
        uint256 amount = available + bound(amountSeed, 1, 1000 ether);

        vm.prank(vestingAdmin);
        try vault.createSchedule(
            beneficiaries[count],
            amount,
            uint64(block.timestamp),
            0,
            1 days,
            true
        ) {} catch {}
    }

    function release(uint256 idSeed, bool asAdmin) external {
        uint256 count = vault.scheduleCount();
        if (count == 0) return;
        uint256 id = idSeed % count;
        TikiDecoVestingVaultV2.VestingSchedule memory schedule = vault.scheduleAt(id);
        address caller = asAdmin ? vestingAdmin : schedule.beneficiary;

        uint256 beneficiaryBefore = token.balanceOf(schedule.beneficiary);
        uint256 vaultBefore = token.balanceOf(address(vault));

        vm.prank(caller);
        try vault.release(id) returns (uint256 amount) {
            assertEq(token.balanceOf(schedule.beneficiary), beneficiaryBefore + amount, "release did not pay beneficiary");
            assertEq(token.balanceOf(address(vault)), vaultBefore - amount, "release did not debit vault");
        } catch {}
    }

    function revoke(uint256 idSeed) external {
        uint256 count = vault.scheduleCount();
        if (count == 0) return;
        uint256 id = idSeed % count;
        TikiDecoVestingVaultV2.VestingSchedule memory beforeSchedule = vault.scheduleAt(id);
        address configuredTreasury = vault.treasury();
        uint256 treasuryBefore = token.balanceOf(configuredTreasury);
        uint256 beneficiaryBefore = token.balanceOf(beforeSchedule.beneficiary);
        uint256 vested = beforeSchedule.revoked ? beforeSchedule.releasedAmount : vault.vestedAmount(id);
        uint256 releasable = vested > beforeSchedule.releasedAmount ? vested - beforeSchedule.releasedAmount : 0;
        uint256 refund = vested < beforeSchedule.totalAmount ? beforeSchedule.totalAmount - vested : 0;

        vm.prank(vestingAdmin);
        try vault.revoke(id) {
            assertEq(token.balanceOf(configuredTreasury), treasuryBefore + refund, "refund did not go to treasury");
            assertEq(token.balanceOf(beforeSchedule.beneficiary), beneficiaryBefore + releasable, "revoke beneficiary payout mismatch");
        } catch {}
    }

    function transferTreasury(uint256 seed, bool accept) external {
        address newTreasury = treasuryCandidates[seed % treasuryCandidates.length];
        vm.prank(defaultAdmin);
        try vault.transferTreasury(newTreasury) {} catch {}

        if (accept) {
            vm.prank(newTreasury);
            try vault.acceptTreasury() {} catch {}
        }
    }

    function warpTime(uint256 timestampSeed) external {
        vm.warp(bound(timestampSeed, 1, block.timestamp + 730 days));
    }
}

contract TikiDecoVestingVaultV2InvariantTest is FoundryTestBase {
    TikiDecoTokenV2 internal token;
    TikiDecoVestingVaultV2 internal vault;
    TikiDecoVestingVaultV2Handler internal handler;

    address internal defaultAdmin = address(0xA11CE);
    address internal pauser = address(0xB0B);
    address internal reporter = address(0xCAFE);
    address internal treasury = address(0xDAD);
    address internal vestingAdmin = address(0xF00D);
    address internal beneficiary = address(0xBEEF);
    uint256 internal prefundAmount = 10_000_000 ether;

    function setUp() public {
        token = new TikiDecoTokenV2(
            defaultAdmin,
            pauser,
            reporter,
            treasury,
            "TikiDeco Sepolia prototype",
            "TikiDeco LLC",
            "Florida, USA",
            "ipfs://project",
            60
        );
        vault = new TikiDecoVestingVaultV2(address(token), defaultAdmin, vestingAdmin, treasury, 60);
        vm.prank(treasury);
        token.transfer(address(vault), prefundAmount);

        handler = new TikiDecoVestingVaultV2Handler(token, vault, treasury, vestingAdmin, defaultAdmin);
        vm.targetContract(address(handler));
    }

    function invariant_releasedNeverExceedsScheduleTotal() public view {
        uint256 count = vault.scheduleCount();
        for (uint256 i = 0; i < count; i++) {
            TikiDecoVestingVaultV2.VestingSchedule memory schedule = vault.scheduleAt(i);
            assertLe(schedule.releasedAmount, schedule.totalAmount, "released exceeds total");
            assertLe(vault.releasable(i), uint256(schedule.totalAmount) - schedule.releasedAmount, "releasable exceeds remaining balance");
            assertLe(token.balanceOf(schedule.beneficiary), schedule.totalAmount, "beneficiary received more than schedule total");
        }
    }

    function invariant_outstandingLiabilitiesNeverExceedVaultBalance() public view {
        assertLe(vault.outstandingLiabilities(), token.balanceOf(address(vault)), "vault owes more than it holds");
    }

    function invariant_totalAccountingRemainsConsistent() public view {
        uint256 count = vault.scheduleCount();
        uint256 expectedReserved;
        uint256 expectedReleased;

        for (uint256 i = 0; i < count; i++) {
            TikiDecoVestingVaultV2.VestingSchedule memory schedule = vault.scheduleAt(i);
            expectedReleased += schedule.releasedAmount;
            expectedReserved += schedule.revoked ? schedule.releasedAmount : schedule.totalAmount;
        }

        assertEq(vault.totalReleased(), expectedReleased, "totalReleased mismatch");
        assertEq(vault.totalReserved(), expectedReserved, "totalReserved mismatch");
        assertEq(vault.outstandingLiabilities(), expectedReserved - expectedReleased, "outstanding mismatch");
        assertEq(
            vault.unreservedBalance(),
            token.balanceOf(address(vault)) > vault.outstandingLiabilities()
                ? token.balanceOf(address(vault)) - vault.outstandingLiabilities()
                : 0,
            "unreserved mismatch"
        );
    }

    function testDeterministicVestingBoundaries() public {
        uint256 amount = 2400 ether;
        uint64 start = 1000;
        uint64 cliff = 100;
        uint64 duration = 1000;
        uint64 cliffEnd = start + cliff;
        uint64 vestingEnd = cliffEnd + duration;

        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, amount, start, cliff, duration, true);

        _assertVestedAt(0, start - 1, 0);
        _assertVestedAt(0, start, 0);
        _assertVestedAt(0, cliffEnd - 1, 0);
        _assertVestedAt(0, cliffEnd, 0);
        _assertVestedAt(0, cliffEnd + 1, amount / duration);
        _assertVestedAt(0, vestingEnd - 1, (amount * (duration - 1)) / duration);
        _assertVestedAt(0, vestingEnd, amount);
        _assertVestedAt(0, vestingEnd + 1, amount);
    }

    function testZeroCliffAndPartialReleases() public {
        uint256 amount = 1000 ether;
        uint64 start = 2000;
        uint64 duration = 100;

        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, amount, start, 0, duration, true);

        vm.warp(start);
        assertEq(vault.vestedAmount(0), 0, "zero cliff start should vest zero");

        vm.warp(start + 50);
        vm.prank(beneficiary);
        vault.release(0);
        assertEq(token.balanceOf(beneficiary), 500 ether, "first partial release mismatch");

        vm.warp(start + duration);
        vm.prank(beneficiary);
        vault.release(0);
        assertEq(token.balanceOf(beneficiary), amount, "final release mismatch");
    }

    function testMaximumSupportedTimestamps() public {
        uint256 amount = 1 ether;
        uint64 start = type(uint64).max - 2;

        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, amount, start, 1, 1, true);

        vm.warp(type(uint64).max - 1);
        assertEq(vault.vestedAmount(0), 0, "max timestamp cliff mismatch");
        vm.warp(type(uint64).max);
        assertEq(vault.vestedAmount(0), amount, "max timestamp vesting mismatch");
    }

    function testRevokeBeforeDuringAndAfterVesting() public {
        _createAndRevokeAt(0, 1000, 100, 1000, 0, 1000 ether);
        _createAndRevokeAt(1, 3000, 100, 1000, 600 ether, 400 ether);
        _createAndRevokeAt(2, 5000, 100, 1000, 1000 ether, 0);
    }

    function testRevokedScheduleCannotBeRevokedAgainAndNonRevocableCannotBeRevoked() public {
        uint256 amount = 100 ether;
        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, amount, 1000, 0, 100, true);
        vm.warp(1001);
        vm.prank(vestingAdmin);
        vault.revoke(0);
        vm.expectRevert();
        vm.prank(vestingAdmin);
        vault.revoke(0);

        vm.prank(vestingAdmin);
        vault.createSchedule(address(0xB0B0), amount, 2000, 0, 100, false);
        vm.warp(2001);
        vm.expectRevert();
        vm.prank(vestingAdmin);
        vault.revoke(1);
    }

    function testScheduleCreationCannotReserveMoreThanUnreservedBalance() public {
        uint256 available = vault.unreservedBalance();
        vm.expectRevert();
        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, available + 1, uint64(block.timestamp), 0, 1, true);
    }

    function testReleaseTransfersOnlyToBeneficiary() public {
        uint256 amount = 100 ether;
        address outsider = address(0xBAD);
        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, amount, 1000, 0, 100, true);

        vm.warp(1050);
        uint256 beneficiaryBefore = token.balanceOf(beneficiary);
        uint256 outsiderBefore = token.balanceOf(outsider);
        vm.prank(vestingAdmin);
        vault.release(0);

        assertEq(token.balanceOf(beneficiary), beneficiaryBefore + 50 ether, "beneficiary not paid");
        assertEq(token.balanceOf(outsider), outsiderBefore, "outsider received release");
    }

    function testPauseDuringActiveScheduleBlocksAndRestoresRelease() public {
        uint256 amount = 100 ether;
        vm.prank(vestingAdmin);
        vault.createSchedule(beneficiary, amount, 1000, 0, 100, true);
        vm.warp(1050);

        vm.prank(pauser);
        token.pause();
        vm.expectRevert();
        vm.prank(beneficiary);
        vault.release(0);

        vm.prank(pauser);
        token.unpause();
        vm.prank(beneficiary);
        vault.release(0);
        assertEq(token.balanceOf(beneficiary), 50 ether, "release after unpause mismatch");
    }

    function _assertVestedAt(uint256 id, uint256 timestamp, uint256 expected) internal {
        vm.warp(timestamp);
        assertEq(vault.vestedAmount(id), expected, "vested boundary mismatch");
    }

    function _createAndRevokeAt(
        uint256 expectedId,
        uint64 start,
        uint64 cliff,
        uint64 duration,
        uint256 expectedBeneficiaryPayout,
        uint256 expectedRefund
    ) internal {
        address localBeneficiary = address(uint160(0xC000 + expectedId));
        uint256 amount = expectedBeneficiaryPayout + expectedRefund;
        uint256 treasuryBefore = token.balanceOf(treasury);

        vm.prank(vestingAdmin);
        vault.createSchedule(localBeneficiary, amount, start, cliff, duration, true);

        if (expectedBeneficiaryPayout == 0) {
            vm.warp(start + cliff - 1);
        } else if (expectedRefund == 0) {
            vm.warp(start + cliff + duration);
        } else {
            vm.warp(start + cliff + uint64((duration * expectedBeneficiaryPayout) / amount));
        }

        vm.prank(vestingAdmin);
        vault.revoke(expectedId);

        assertEq(token.balanceOf(localBeneficiary), expectedBeneficiaryPayout, "revoke beneficiary payout mismatch");
        assertEq(token.balanceOf(treasury), treasuryBefore + expectedRefund, "revoke refund mismatch");
    }
}

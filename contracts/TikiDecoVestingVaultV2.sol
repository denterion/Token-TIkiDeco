// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TikiDecoVestingVaultV2 is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant VESTING_ADMIN_ROLE = keccak256("VESTING_ADMIN_ROLE");

    IERC20 public immutable token;
    address public treasury;
    address public pendingTreasury;
    uint256 public scheduleCount;
    uint256 private _totalReserved;
    uint256 private _totalReleased;

    struct VestingSchedule {
        address beneficiary;
        uint128 totalAmount;
        uint128 releasedAmount;
        uint64 start;
        uint64 cliffDuration;
        uint64 vestingDuration;
        uint64 revokedAt;
        bool revocable;
        bool revoked;
    }

    mapping(uint256 => VestingSchedule) private _schedules;

    event TreasuryTransferStarted(address indexed previousTreasury, address indexed newTreasury);
    event TreasuryTransferred(address indexed previousTreasury, address indexed newTreasury);
    event TreasuryTransferCanceled(address indexed treasury, address indexed canceledPendingTreasury);
    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed beneficiary,
        uint256 amount,
        uint64 start,
        uint64 cliffDuration,
        uint64 vestingDuration,
        bool revocable
    );
    event TokensReleased(uint256 indexed scheduleId, address indexed beneficiary, uint256 amount);
    event ScheduleRevoked(
        uint256 indexed scheduleId,
        address indexed beneficiary,
        address indexed treasuryAddress,
        uint256 beneficiaryAmount,
        uint256 refundAmount,
        uint256 revokedAt
    );

    error NotBeneficiaryOrOwner();
    error NotRevocable();
    error AlreadyRevoked();
    error ZeroAddress();
    error InvalidSchedule();
    error InvalidAmount();
    error InsufficientUnreservedBalance();
    error ScheduleNotFound();
    error NativeETHRejected();
    error InvalidToken();
    error NotPendingTreasury();

    constructor(address tokenAddress, address initialAdmin, address initialTreasury) {
        if (tokenAddress == address(0) || initialAdmin == address(0) || initialTreasury == address(0)) {
            revert ZeroAddress();
        }
        if (tokenAddress.code.length == 0) revert InvalidToken();

        token = IERC20(tokenAddress);
        treasury = initialTreasury;

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(VESTING_ADMIN_ROLE, initialAdmin);
    }

    function totalReserved() external view returns (uint256) {
        return _totalReserved;
    }

    function totalReleased() external view returns (uint256) {
        return _totalReleased;
    }

    function outstandingLiabilities() public view returns (uint256) {
        return _totalReserved - _totalReleased;
    }

    function unreservedBalance() public view returns (uint256) {
        uint256 balance = token.balanceOf(address(this));
        uint256 liabilities = outstandingLiabilities();
        return balance > liabilities ? balance - liabilities : 0;
    }

    function transferTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newTreasury == address(0)) revert ZeroAddress();
        pendingTreasury = newTreasury;
        emit TreasuryTransferStarted(treasury, newTreasury);
    }

    function cancelTreasuryTransfer() external onlyRole(DEFAULT_ADMIN_ROLE) {
        address canceledPendingTreasury = pendingTreasury;
        pendingTreasury = address(0);
        emit TreasuryTransferCanceled(treasury, canceledPendingTreasury);
    }

    function acceptTreasury() external {
        if (_msgSender() != pendingTreasury) revert NotPendingTreasury();
        address previousTreasury = treasury;
        treasury = _msgSender();
        pendingTreasury = address(0);
        emit TreasuryTransferred(previousTreasury, _msgSender());
    }

    function scheduleAt(uint256 scheduleId) external view returns (VestingSchedule memory) {
        if (scheduleId >= scheduleCount) revert ScheduleNotFound();
        return _schedules[scheduleId];
    }

    function createSchedule(
        address beneficiary,
        uint256 amount,
        uint64 start,
        uint64 cliffDuration,
        uint64 vestingDuration,
        bool revocable
    ) external onlyRole(VESTING_ADMIN_ROLE) nonReentrant returns (uint256 scheduleId) {
        if (beneficiary == address(0)) revert ZeroAddress();
        if (amount == 0 || amount > type(uint128).max) revert InvalidAmount();
        if (vestingDuration == 0) revert InvalidSchedule();
        if (uint256(start) + uint256(cliffDuration) + uint256(vestingDuration) > type(uint64).max) {
            revert InvalidSchedule();
        }
        if (amount > unreservedBalance()) revert InsufficientUnreservedBalance();

        scheduleId = scheduleCount;
        scheduleCount += 1;
        _totalReserved += amount;

        _schedules[scheduleId] = VestingSchedule({
            beneficiary: beneficiary,
            totalAmount: uint128(amount),
            releasedAmount: 0,
            start: start,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            revokedAt: 0,
            revocable: revocable,
            revoked: false
        });

        emit ScheduleCreated(scheduleId, beneficiary, amount, start, cliffDuration, vestingDuration, revocable);
    }

    function releasable(uint256 scheduleId) public view returns (uint256) {
        if (scheduleId >= scheduleCount) revert ScheduleNotFound();
        VestingSchedule memory schedule = _schedules[scheduleId];
        uint256 vested = vestedAmount(scheduleId);
        return vested - schedule.releasedAmount;
    }

    function vestedAmount(uint256 scheduleId) public view returns (uint256) {
        if (scheduleId >= scheduleCount) revert ScheduleNotFound();
        VestingSchedule memory schedule = _schedules[scheduleId];
        return _vestedAmount(schedule, uint64(block.timestamp));
    }

    function release(uint256 scheduleId) public nonReentrant returns (uint256 amount) {
        if (scheduleId >= scheduleCount) revert ScheduleNotFound();
        VestingSchedule storage schedule = _schedules[scheduleId];
        if (_msgSender() != schedule.beneficiary && !hasRole(VESTING_ADMIN_ROLE, _msgSender())) {
            revert NotBeneficiaryOrOwner();
        }

        amount = releasable(scheduleId);
        if (amount == 0) revert InvalidAmount();

        schedule.releasedAmount += uint128(amount);
        _totalReleased += amount;

        token.safeTransfer(schedule.beneficiary, amount);
        emit TokensReleased(scheduleId, schedule.beneficiary, amount);
    }

    function revoke(uint256 scheduleId) external onlyRole(VESTING_ADMIN_ROLE) nonReentrant {
        if (scheduleId >= scheduleCount) revert ScheduleNotFound();

        VestingSchedule storage schedule = _schedules[scheduleId];
        if (!schedule.revocable) revert NotRevocable();
        if (schedule.revoked) revert AlreadyRevoked();

        uint256 vested = _vestedAmount(schedule, uint64(block.timestamp));
        uint256 releasableAmount = vested - schedule.releasedAmount;
        uint256 refundAmount = schedule.totalAmount - vested;

        uint64 revokedAt = uint64(block.timestamp);

        schedule.revoked = true;
        schedule.revokedAt = revokedAt;
        schedule.releasedAmount = uint128(vested);

        if (releasableAmount > 0) {
            _totalReleased += releasableAmount;
            token.safeTransfer(schedule.beneficiary, releasableAmount);
        }
        if (refundAmount > 0) {
            _totalReserved -= refundAmount;
            token.safeTransfer(treasury, refundAmount);
        }

        emit ScheduleRevoked(scheduleId, schedule.beneficiary, treasury, releasableAmount, refundAmount, revokedAt);
    }

    function _vestedAmount(
        VestingSchedule memory schedule,
        uint64 timestamp
    ) private pure returns (uint256) {
        if (schedule.beneficiary == address(0)) revert InvalidSchedule();

        uint64 effectiveTimestamp = timestamp;
        if (schedule.revoked && schedule.revokedAt < effectiveTimestamp) {
            effectiveTimestamp = schedule.revokedAt;
        }

        uint64 cliffEnd = schedule.start + schedule.cliffDuration;
        uint64 vestingEnd = cliffEnd + schedule.vestingDuration;

        if (effectiveTimestamp <= cliffEnd) {
            return 0;
        }

        if (effectiveTimestamp >= vestingEnd) {
            return schedule.totalAmount;
        }

        return (uint256(schedule.totalAmount) * (effectiveTimestamp - cliffEnd)) / schedule.vestingDuration;
    }

    receive() external payable {
        revert NativeETHRejected();
    }

    fallback() external payable {
        revert NativeETHRejected();
    }
}

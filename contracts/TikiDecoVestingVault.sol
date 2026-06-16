// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IVestingToken {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

library SafeVestingToken {
    error TokenCallFailed();
    error TokenOperationFailed();

    function safeTransfer(IVestingToken token, address to, uint256 value) internal {
        _callOptionalReturn(address(token), abi.encodeCall(token.transfer, (to, value)));
    }

    function safeTransferFrom(IVestingToken token, address from, address to, uint256 value) internal {
        _callOptionalReturn(address(token), abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    function _callOptionalReturn(address token, bytes memory data) private {
        (bool success, bytes memory returndata) = token.call(data);
        if (!success) revert TokenCallFailed();

        if (returndata.length > 0 && !abi.decode(returndata, (bool))) {
            revert TokenOperationFailed();
        }
    }
}

contract TikiDecoVestingVault {
    using SafeVestingToken for IVestingToken;

    IVestingToken public immutable token;
    address public owner;
    address public pendingOwner;
    uint256 public scheduleCount;

    struct VestingSchedule {
        address beneficiary;
        uint128 totalAmount;
        uint128 releasedAmount;
        uint64 start;
        uint64 cliff;
        uint64 duration;
        uint64 revokedAt;
        bool revocable;
        bool revoked;
    }

    mapping(uint256 => VestingSchedule) private _schedules;
    uint256 private _reentrancyStatus;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferCanceled(address indexed owner, address indexed canceledPendingOwner);
    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed beneficiary,
        uint256 amount,
        uint64 start,
        uint64 cliff,
        uint64 duration,
        bool revocable
    );
    event TokensReleased(uint256 indexed scheduleId, address indexed beneficiary, uint256 amount);
    event ScheduleRevoked(
        uint256 indexed scheduleId,
        address indexed beneficiary,
        address indexed refundAddress,
        uint256 beneficiaryAmount,
        uint256 refundAmount,
        uint256 revokedAt
    );

    error NotOwner();
    error NotPendingOwner();
    error NotBeneficiaryOrOwner();
    error NotRevocable();
    error AlreadyRevoked();
    error ZeroAddress();
    error InvalidSchedule();
    error InvalidAmount();
    error ScheduleNotFound();
    error NativeETHRejected();
    error Reentrancy();
    error InvalidToken();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier nonReentrant() {
        if (_reentrancyStatus == 2) revert Reentrancy();
        _reentrancyStatus = 2;
        _;
        _reentrancyStatus = 1;
    }

    constructor(address tokenAddress, address initialOwner) {
        if (tokenAddress == address(0) || initialOwner == address(0)) revert ZeroAddress();
        if (tokenAddress.code.length == 0) revert InvalidToken();

        token = IVestingToken(tokenAddress);
        owner = initialOwner;
        _reentrancyStatus = 1;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function cancelOwnershipTransfer() external onlyOwner {
        address canceledPendingOwner = pendingOwner;
        pendingOwner = address(0);
        emit OwnershipTransferCanceled(owner, canceledPendingOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert NotPendingOwner();
        address previousOwner = owner;
        owner = msg.sender;
        pendingOwner = address(0);
        emit OwnershipTransferred(previousOwner, msg.sender);
    }

    function scheduleAt(uint256 scheduleId) external view returns (VestingSchedule memory) {
        if (scheduleId >= scheduleCount) revert ScheduleNotFound();
        return _schedules[scheduleId];
    }

    function createSchedule(
        address beneficiary,
        uint256 amount,
        uint64 start,
        uint64 cliff,
        uint64 duration,
        bool revocable
    ) external onlyOwner nonReentrant returns (uint256 scheduleId) {
        if (beneficiary == address(0)) revert ZeroAddress();
        if (amount == 0 || amount > type(uint128).max) revert InvalidAmount();
        if (duration == 0 || cliff > duration) revert InvalidSchedule();
        if (uint256(start) + uint256(duration) > type(uint64).max) revert InvalidSchedule();

        scheduleId = scheduleCount;
        scheduleCount += 1;

        _schedules[scheduleId] = VestingSchedule({
            beneficiary: beneficiary,
            totalAmount: uint128(amount),
            releasedAmount: 0,
            start: start,
            cliff: cliff,
            duration: duration,
            revokedAt: 0,
            revocable: revocable,
            revoked: false
        });

        token.safeTransferFrom(msg.sender, address(this), amount);

        emit ScheduleCreated(scheduleId, beneficiary, amount, start, cliff, duration, revocable);
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
        if (msg.sender != schedule.beneficiary && msg.sender != owner) revert NotBeneficiaryOrOwner();

        amount = releasable(scheduleId);
        if (amount == 0) revert InvalidAmount();

        schedule.releasedAmount += uint128(amount);

        token.safeTransfer(schedule.beneficiary, amount);
        emit TokensReleased(scheduleId, schedule.beneficiary, amount);
    }

    function revoke(uint256 scheduleId, address refundAddress) external onlyOwner nonReentrant {
        if (refundAddress == address(0)) revert ZeroAddress();
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

        if (releasableAmount > 0) token.safeTransfer(schedule.beneficiary, releasableAmount);
        if (refundAmount > 0) token.safeTransfer(refundAddress, refundAmount);

        emit ScheduleRevoked(scheduleId, schedule.beneficiary, refundAddress, releasableAmount, refundAmount, revokedAt);
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

        if (effectiveTimestamp < schedule.start + schedule.cliff) {
            return 0;
        }

        if (effectiveTimestamp >= schedule.start + schedule.duration) {
            return schedule.totalAmount;
        }

        return (uint256(schedule.totalAmount) * (effectiveTimestamp - schedule.start)) / schedule.duration;
    }

    receive() external payable {
        revert NativeETHRejected();
    }

    fallback() external payable {
        revert NativeETHRejected();
    }
}

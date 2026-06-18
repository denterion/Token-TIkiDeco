// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface Vm {
    function assume(bool condition) external pure;
    function expectRevert() external;
    function prank(address msgSender) external;
    function startPrank(address msgSender) external;
    function stopPrank() external;
    function warp(uint256 newTimestamp) external;
}

contract FoundryTestBase {
    Vm internal constant vm = Vm(address(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D));

    function assertTrue(bool condition, string memory message) internal pure {
        if (!condition) revert(message);
    }

    function assertFalse(bool condition, string memory message) internal pure {
        if (condition) revert(message);
    }

    function assertEq(uint256 actual, uint256 expected, string memory message) internal pure {
        if (actual != expected) revert(message);
    }

    function assertEq(address actual, address expected, string memory message) internal pure {
        if (actual != expected) revert(message);
    }

    function assertLe(uint256 actual, uint256 expected, string memory message) internal pure {
        if (actual > expected) revert(message);
    }

    function bound(uint256 value, uint256 min, uint256 max) internal pure returns (uint256) {
        if (max < min) revert("invalid bound");
        uint256 size = max - min + 1;
        if (size == 0) {
            return value;
        }
        return min + (value % size);
    }
}

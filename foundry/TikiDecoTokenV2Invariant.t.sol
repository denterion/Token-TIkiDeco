// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TikiDecoTokenV2} from "../contracts/TikiDecoTokenV2.sol";
import {FoundryTestBase} from "./FoundryTestBase.sol";

contract TikiDecoTokenV2Handler is FoundryTestBase {
    TikiDecoTokenV2 public immutable token;
    address public immutable defaultAdmin;
    address public immutable pauser;
    address public immutable reporter;
    address public immutable treasury;
    address public immutable outsider;
    address[4] public actors;

    constructor(
        TikiDecoTokenV2 token_,
        address defaultAdmin_,
        address pauser_,
        address reporter_,
        address treasury_,
        address outsider_
    ) {
        token = token_;
        defaultAdmin = defaultAdmin_;
        pauser = pauser_;
        reporter = reporter_;
        treasury = treasury_;
        outsider = outsider_;
        actors[0] = address(0x1001);
        actors[1] = address(0x1002);
        actors[2] = address(0x1003);
        actors[3] = address(0x1004);
    }

    function transferFromTreasury(uint256 actorSeed, uint256 amount) external {
        address to = actors[actorSeed % actors.length];
        uint256 balance = token.balanceOf(treasury);
        if (balance == 0) return;
        amount = bound(amount, 0, balance);
        vm.prank(treasury);
        token.transfer(to, amount);
    }

    function actorTransfer(uint256 fromSeed, uint256 toSeed, uint256 amount) external {
        address from = actors[fromSeed % actors.length];
        address to = actors[toSeed % actors.length];
        uint256 balance = token.balanceOf(from);
        if (balance == 0) return;
        amount = bound(amount, 0, balance);
        vm.prank(from);
        try token.transfer(to, amount) {} catch {}
    }

    function transferFromWithAllowance(uint256 ownerSeed, uint256 spenderSeed, uint256 toSeed, uint256 amount) external {
        address owner = actors[ownerSeed % actors.length];
        address spender = actors[spenderSeed % actors.length];
        address to = actors[toSeed % actors.length];
        uint256 balance = token.balanceOf(owner);
        if (balance == 0) return;
        amount = bound(amount, 0, balance);
        vm.prank(owner);
        token.approve(spender, amount);
        vm.prank(spender);
        try token.transferFrom(owner, to, amount) {} catch {}
    }

    function pauseAsPauser() external {
        vm.prank(pauser);
        try token.pause() {} catch {}
    }

    function unpauseAsPauser() external {
        vm.prank(pauser);
        try token.unpause() {} catch {}
    }

    function unauthorizedPause(uint256 actorSeed) external {
        address caller = actors[actorSeed % actors.length];
        vm.prank(caller);
        try token.pause() {} catch {}
    }

    function publishReportAsReporter(uint256 seed) external {
        bytes32 hash = keccak256(abi.encodePacked("report", seed));
        vm.prank(reporter);
        try token.publishReport(
            hash,
            "monthly-update",
            "ipfs://report",
            uint64(seed % 1000),
            uint64((seed % 1000) + 1),
            "v1",
            token.NO_SUPERSEDED_REPORT()
        ) {} catch {}
    }

    function unauthorizedPublishReport(uint256 actorSeed, uint256 seed) external {
        address caller = actors[actorSeed % actors.length];
        vm.prank(caller);
        try token.publishReport(
            keccak256(abi.encodePacked("bad-report", seed)),
            "monthly-update",
            "ipfs://report",
            1,
            2,
            "v1",
            token.NO_SUPERSEDED_REPORT()
        ) {} catch {}
    }

    function updateProjectURIAsAdmin(uint256 seed) external {
        vm.prank(defaultAdmin);
        try token.updateProjectURI(seed % 2 == 0 ? "ipfs://project-a" : "ipfs://project-b") {} catch {}
    }

    function unauthorizedUpdateProjectURI(uint256 actorSeed) external {
        address caller = actors[actorSeed % actors.length];
        vm.prank(caller);
        try token.updateProjectURI("ipfs://unauthorized") {} catch {}
    }

    function unauthorizedRoleChange(uint256 actorSeed) external {
        address caller = actors[actorSeed % actors.length];
        vm.prank(caller);
        try token.grantRole(token.PAUSER_ROLE(), caller) {} catch {}
        vm.prank(caller);
        try token.revokeRole(token.REPORTER_ROLE(), reporter) {} catch {}
    }
}

contract TikiDecoTokenV2InvariantTest is FoundryTestBase {
    TikiDecoTokenV2 internal token;
    TikiDecoTokenV2Handler internal handler;

    address internal defaultAdmin = address(0xA11CE);
    address internal pauser = address(0xB0B);
    address internal reporter = address(0xCAFE);
    address internal treasury = address(0xDAD);
    address internal outsider = address(0xBAD);

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
        handler = new TikiDecoTokenV2Handler(token, defaultAdmin, pauser, reporter, treasury, outsider);
    }

    function invariant_totalSupplyAlwaysEqualsMaxSupply() public view {
        assertEq(token.totalSupply(), token.MAX_SUPPLY(), "totalSupply changed");
    }

    function invariant_onlyConfiguredRolesRemainPrivileged() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), defaultAdmin), "default admin lost");
        assertTrue(token.hasRole(token.PAUSER_ROLE(), pauser), "pauser lost");
        assertTrue(token.hasRole(token.REPORTER_ROLE(), reporter), "reporter lost");
        assertFalse(token.hasRole(token.DEFAULT_ADMIN_ROLE(), outsider), "outsider became admin");
        assertFalse(token.hasRole(token.PAUSER_ROLE(), outsider), "outsider became pauser");
        assertFalse(token.hasRole(token.REPORTER_ROLE(), outsider), "outsider became reporter");
    }

    function testNoPostDeploymentMintPathExists() public {
        uint256 supplyBefore = token.totalSupply();

        (bool mintOk,) = address(token).call(
            abi.encodeWithSignature("mint(address,uint256)", outsider, 1)
        );
        (bool adminMintOk,) = address(token).call(
            abi.encodeWithSignature("adminMint(address,uint256)", outsider, 1)
        );
        (bool ownerMintOk,) = address(token).call(
            abi.encodeWithSignature("ownerMint(address,uint256)", outsider, 1)
        );

        assertFalse(mintOk, "mint selector unexpectedly succeeded");
        assertFalse(adminMintOk, "adminMint selector unexpectedly succeeded");
        assertFalse(ownerMintOk, "ownerMint selector unexpectedly succeeded");
        assertEq(token.totalSupply(), supplyBefore, "supply changed after mint attempts");
    }

    function testPauseBlocksTransferAndTransferFromThenUnpauseRestores() public {
        uint256 amount = 100 ether;
        vm.prank(treasury);
        token.transfer(outsider, amount);
        vm.prank(outsider);
        token.approve(address(0x1234), amount);

        vm.prank(pauser);
        token.pause();

        vm.expectRevert();
        vm.prank(outsider);
        token.transfer(treasury, 1 ether);

        vm.expectRevert();
        vm.prank(address(0x1234));
        token.transferFrom(outsider, treasury, 1 ether);

        vm.prank(pauser);
        token.unpause();

        vm.prank(outsider);
        token.transfer(treasury, 1 ether);
        vm.prank(address(0x1234));
        token.transferFrom(outsider, treasury, 1 ether);
    }

    function testOnlyCorrectRoleCanPauseAndPublishReports() public {
        uint256 noSupersededReport = token.NO_SUPERSEDED_REPORT();

        vm.expectRevert();
        vm.prank(outsider);
        token.pause();

        vm.prank(pauser);
        token.pause();
        vm.prank(pauser);
        token.unpause();

        vm.expectRevert();
        vm.prank(outsider);
        token.publishReport(
            keccak256("unauthorized"),
            "monthly-update",
            "ipfs://report",
            1,
            2,
            "v1",
            noSupersededReport
        );

        vm.prank(reporter);
        token.publishReport(
            keccak256("authorized"),
            "monthly-update",
            "ipfs://report",
            1,
            2,
            "v1",
            noSupersededReport
        );
    }

    function testOnlyAdminCanUpdateProjectMetadataAndRoles() public {
        bytes32 reporterRole = token.REPORTER_ROLE();

        vm.expectRevert();
        vm.prank(outsider);
        token.updateProjectURI("ipfs://bad");

        vm.prank(defaultAdmin);
        token.updateProjectURI("ipfs://new-project");

        vm.expectRevert();
        vm.prank(outsider);
        token.grantRole(reporterRole, outsider);

        vm.prank(defaultAdmin);
        token.grantRole(reporterRole, outsider);
        assertTrue(token.hasRole(reporterRole, outsider), "admin role grant failed");
    }
}

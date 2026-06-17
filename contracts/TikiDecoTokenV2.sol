// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract TikiDecoTokenV2 is ERC20, AccessControl, Pausable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant REPORTER_ROLE = keccak256("REPORTER_ROLE");

    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    string public projectName;
    string public businessEntity;
    string public projectJurisdiction;
    string public projectURI;

    struct ProjectReport {
        bytes32 documentHash;
        string category;
        string uri;
        uint256 publishedAt;
    }

    ProjectReport[] private _reports;

    event ProjectURIUpdated(string previousURI, string newURI);
    event AllowanceIncreased(address indexed owner, address indexed spender, uint256 addedValue);
    event AllowanceDecreased(address indexed owner, address indexed spender, uint256 subtractedValue);
    event ProjectReportPublished(
        uint256 indexed reportId,
        bytes32 indexed documentHash,
        string category,
        string uri,
        uint256 publishedAt
    );

    error ZeroAddress();
    error InvalidAmount();
    error NativeETHRejected();
    error UnsafeAllowanceChange();

    constructor(
        address initialOwner,
        address treasury,
        string memory initialBusinessEntity,
        string memory initialProjectJurisdiction,
        string memory initialProjectURI
    ) ERC20("TikiDeco", "TIDE") {
        if (initialOwner == address(0) || treasury == address(0)) revert ZeroAddress();

        projectName = "TikiDeco Miami Beach Hotel";
        businessEntity = initialBusinessEntity;
        projectJurisdiction = initialProjectJurisdiction;
        projectURI = initialProjectURI;

        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);
        _grantRole(REPORTER_ROLE, initialOwner);

        _mint(treasury, MAX_SUPPLY);
    }

    function reportsCount() external view returns (uint256) {
        return _reports.length;
    }

    function reportAt(uint256 reportId) external view returns (ProjectReport memory) {
        return _reports[reportId];
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        address tokenOwner = _msgSender();
        uint256 currentAllowance = allowance(tokenOwner, spender);
        if (currentAllowance != 0 && value != 0) revert UnsafeAllowanceChange();

        _approve(tokenOwner, spender, value);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        address tokenOwner = _msgSender();
        _approve(tokenOwner, spender, allowance(tokenOwner, spender) + addedValue);
        emit AllowanceIncreased(tokenOwner, spender, addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        address tokenOwner = _msgSender();
        uint256 currentAllowance = allowance(tokenOwner, spender);
        if (currentAllowance < subtractedValue) {
            revert ERC20InsufficientAllowance(spender, currentAllowance, subtractedValue);
        }

        unchecked {
            _approve(tokenOwner, spender, currentAllowance - subtractedValue);
        }

        emit AllowanceDecreased(tokenOwner, spender, subtractedValue);
        return true;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function updateProjectURI(string calldata newProjectURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        string memory previousURI = projectURI;
        projectURI = newProjectURI;
        emit ProjectURIUpdated(previousURI, newProjectURI);
    }

    function publishReport(
        bytes32 documentHash,
        string calldata category,
        string calldata uri
    ) external onlyRole(REPORTER_ROLE) returns (uint256 reportId) {
        if (documentHash == bytes32(0)) revert InvalidAmount();

        reportId = _reports.length;
        uint256 publishedAt = block.timestamp;
        _reports.push(ProjectReport({
            documentHash: documentHash,
            category: category,
            uri: uri,
            publishedAt: publishedAt
        }));

        emit ProjectReportPublished(reportId, documentHash, category, uri, publishedAt);
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }

    receive() external payable {
        revert NativeETHRejected();
    }

    fallback() external payable {
        revert NativeETHRejected();
    }
}

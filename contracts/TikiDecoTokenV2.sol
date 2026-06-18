// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract TikiDecoTokenV2 is ERC20, AccessControlDefaultAdminRules, Pausable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant REPORTER_ROLE = keccak256("REPORTER_ROLE");

    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;
    uint256 public constant NO_SUPERSEDED_REPORT = type(uint256).max;
    uint256 public constant MAX_PROJECT_NAME_LENGTH = 80;
    uint256 public constant MAX_BUSINESS_ENTITY_LENGTH = 120;
    uint256 public constant MAX_PROJECT_JURISDICTION_LENGTH = 80;
    uint256 public constant MAX_PROJECT_URI_LENGTH = 256;
    uint256 public constant MAX_REPORT_CATEGORY_LENGTH = 64;
    uint256 public constant MAX_REPORT_URI_LENGTH = 256;
    uint256 public constant MAX_REPORT_VERSION_LENGTH = 32;

    string public projectName;
    string public businessEntity;
    string public projectJurisdiction;
    string public projectURI;

    struct ProjectReport {
        bytes32 documentHash;
        string category;
        string uri;
        uint64 periodStart;
        uint64 periodEnd;
        string version;
        uint256 publishedAt;
        uint256 supersedesReportId;
    }

    ProjectReport[] private _reports;

    event ProjectURIUpdated(string previousURI, string newURI);
    event ProjectReportPublished(
        uint256 indexed reportId,
        bytes32 indexed documentHash,
        string category,
        string uri,
        uint64 periodStart,
        uint64 periodEnd,
        string version,
        uint256 publishedAt
    );
    event ProjectReportSuperseded(
        uint256 indexed previousReportId,
        uint256 indexed newReportId,
        bytes32 indexed newDocumentHash
    );

    error ZeroAddress();
    error InvalidAmount();
    error NativeETHRejected();
    error InvalidReport();
    error InvalidProjectMetadata();

    constructor(
        address defaultAdmin,
        address pauser,
        address reporter,
        address treasury,
        string memory initialProjectName,
        string memory initialBusinessEntity,
        string memory initialProjectJurisdiction,
        string memory initialProjectURI,
        uint48 defaultAdminDelay
    ) ERC20("TikiDeco", "TIDE") AccessControlDefaultAdminRules(defaultAdminDelay, defaultAdmin) {
        if (pauser == address(0) || reporter == address(0) || treasury == address(0)) revert ZeroAddress();
        if (
            !_isBoundedNonEmpty(initialProjectName, MAX_PROJECT_NAME_LENGTH)
                || !_isBoundedNonEmpty(initialBusinessEntity, MAX_BUSINESS_ENTITY_LENGTH)
                || !_isBoundedNonEmpty(initialProjectJurisdiction, MAX_PROJECT_JURISDICTION_LENGTH)
                || !_isBoundedNonEmpty(initialProjectURI, MAX_PROJECT_URI_LENGTH)
        ) {
            revert InvalidProjectMetadata();
        }

        projectName = initialProjectName;
        businessEntity = initialBusinessEntity;
        projectJurisdiction = initialProjectJurisdiction;
        projectURI = initialProjectURI;

        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(REPORTER_ROLE, reporter);

        _mint(treasury, MAX_SUPPLY);
    }

    function reportsCount() external view returns (uint256) {
        return _reports.length;
    }

    function reportAt(uint256 reportId) external view returns (ProjectReport memory) {
        return _reports[reportId];
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function updateProjectURI(string calldata newProjectURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_isBoundedNonEmpty(newProjectURI, MAX_PROJECT_URI_LENGTH)) revert InvalidProjectMetadata();
        string memory previousURI = projectURI;
        projectURI = newProjectURI;
        emit ProjectURIUpdated(previousURI, newProjectURI);
    }

    function publishReport(
        bytes32 documentHash,
        string calldata category,
        string calldata uri,
        uint64 periodStart,
        uint64 periodEnd,
        string calldata version,
        uint256 supersedesReportId
    ) external onlyRole(REPORTER_ROLE) returns (uint256 reportId) {
        if (
            documentHash == bytes32(0)
                || !_isBoundedNonEmpty(category, MAX_REPORT_CATEGORY_LENGTH)
                || !_isBoundedNonEmpty(uri, MAX_REPORT_URI_LENGTH)
                || !_isBoundedNonEmpty(version, MAX_REPORT_VERSION_LENGTH)
                || periodStart > periodEnd
        ) {
            revert InvalidReport();
        }
        if (supersedesReportId != NO_SUPERSEDED_REPORT && supersedesReportId >= _reports.length) {
            revert InvalidReport();
        }

        reportId = _reports.length;
        uint256 publishedAt = block.timestamp;
        _reports.push(ProjectReport({
            documentHash: documentHash,
            category: category,
            uri: uri,
            periodStart: periodStart,
            periodEnd: periodEnd,
            version: version,
            publishedAt: publishedAt,
            supersedesReportId: supersedesReportId
        }));

        emit ProjectReportPublished(reportId, documentHash, category, uri, periodStart, periodEnd, version, publishedAt);
        if (supersedesReportId != NO_SUPERSEDED_REPORT) {
            emit ProjectReportSuperseded(supersedesReportId, reportId, documentHash);
        }
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }

    function _isBoundedNonEmpty(string memory value, uint256 maxLength) private pure returns (bool) {
        uint256 length = bytes(value).length;
        return length > 0 && length <= maxLength;
    }

    receive() external payable {
        revert NativeETHRejected();
    }

    fallback() external payable {
        revert NativeETHRejected();
    }
}

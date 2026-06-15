// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract Ownable2Step {
    address public owner;
    address public pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error NotOwner();
    error NotPendingOwner();
    error ZeroAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert NotPendingOwner();
        address previousOwner = owner;
        owner = msg.sender;
        pendingOwner = address(0);
        emit OwnershipTransferred(previousOwner, msg.sender);
    }
}

contract TikiDecoToken is IERC20, Ownable2Step {
    string public constant name = "TikiDeco";
    string public constant symbol = "TIDE";
    uint8 public constant decimals = 18;
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** decimals;

    string public projectName;
    string public businessEntity;
    string public projectJurisdiction;
    string public projectURI;

    bool public paused;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    struct ProjectReport {
        bytes32 documentHash;
        string category;
        string uri;
        uint256 publishedAt;
    }

    ProjectReport[] private _reports;

    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event ProjectURIUpdated(string previousURI, string newURI);
    event AllowanceIncreased(address indexed owner, address indexed spender, uint256 addedValue);
    event AllowanceDecreased(address indexed owner, address indexed spender, uint256 subtractedValue);
    event ProjectReportPublished(
        uint256 indexed reportId,
        bytes32 indexed documentHash,
        string category,
        string uri
    );

    error PausedTransfers();
    error InsufficientBalance();
    error InsufficientAllowance();
    error InvalidAmount();
    error NativeETHRejected();

    constructor(
        address initialOwner,
        address treasury,
        string memory initialBusinessEntity,
        string memory initialProjectJurisdiction,
        string memory initialProjectURI
    ) Ownable2Step(initialOwner) {
        if (treasury == address(0)) revert ZeroAddress();

        projectName = "TikiDeco Miami Beach Hotel";
        businessEntity = initialBusinessEntity;
        projectJurisdiction = initialProjectJurisdiction;
        projectURI = initialProjectURI;

        _mint(treasury, MAX_SUPPLY);
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function allowance(address tokenOwner, address spender) external view returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function reportsCount() external view returns (uint256) {
        return _reports.length;
    }

    function reportAt(uint256 reportId) external view returns (ProjectReport memory) {
        return _reports[reportId];
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        uint256 newAllowance = _allowances[msg.sender][spender] + addedValue;
        _approve(msg.sender, spender, newAllowance);
        emit AllowanceIncreased(msg.sender, spender, addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        uint256 currentAllowance = _allowances[msg.sender][spender];
        if (currentAllowance < subtractedValue) revert InsufficientAllowance();

        unchecked {
            _approve(msg.sender, spender, currentAllowance - subtractedValue);
        }

        emit AllowanceDecreased(msg.sender, spender, subtractedValue);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        if (currentAllowance < value) revert InsufficientAllowance();

        unchecked {
            _approve(from, msg.sender, currentAllowance - value);
        }

        _transfer(from, to, value);
        return true;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function updateProjectURI(string calldata newProjectURI) external onlyOwner {
        string memory previousURI = projectURI;
        projectURI = newProjectURI;
        emit ProjectURIUpdated(previousURI, newProjectURI);
    }

    function publishReport(
        bytes32 documentHash,
        string calldata category,
        string calldata uri
    ) external onlyOwner returns (uint256 reportId) {
        if (documentHash == bytes32(0)) revert InvalidAmount();

        reportId = _reports.length;
        _reports.push(ProjectReport({
            documentHash: documentHash,
            category: category,
            uri: uri,
            publishedAt: block.timestamp
        }));

        emit ProjectReportPublished(reportId, documentHash, category, uri);
    }

    function _transfer(address from, address to, uint256 value) private {
        if (paused) revert PausedTransfers();
        if (from == address(0) || to == address(0)) revert ZeroAddress();

        uint256 fromBalance = _balances[from];
        if (fromBalance < value) revert InsufficientBalance();

        unchecked {
            _balances[from] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(from, to, value);
    }

    function _approve(address tokenOwner, address spender, uint256 value) private {
        if (tokenOwner == address(0) || spender == address(0)) revert ZeroAddress();
        _allowances[tokenOwner][spender] = value;
        emit Approval(tokenOwner, spender, value);
    }

    function _mint(address to, uint256 value) private {
        if (to == address(0)) revert ZeroAddress();
        _totalSupply += value;
        _balances[to] += value;
        emit Transfer(address(0), to, value);
    }

    receive() external payable {
        revert NativeETHRejected();
    }

    fallback() external payable {
        revert NativeETHRejected();
    }
}

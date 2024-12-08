import re
import json
from typing import List, Dict

class SmartContractAudit:
    def __init__(self, code: str):
        self.code = code
        self.report = {
            "basic_context": {},
            "vulnerabilities": []
        }

    def analyze_basic_context(self):
        # Extract the Solidity compiler version
        version_match = re.search(r"pragma solidity \^(\d+\.\d+\.\d+);", self.code)
        compiler_version = version_match.group(1) if version_match else "Unknown"
        
        # Extract the main contract name
        contract_names = re.findall(r"contract (\w+)", self.code)
        main_contract = contract_names[0] if contract_names else "None"

        # Extract a brief functionality description from comments (if any)
        comments = re.findall(r"\/\*(.*?)\*\/|\/\/(.*?)\n", self.code, re.DOTALL)
        description = " ".join(comment[0] or comment[1] for comment in comments)

        self.report["basic_context"] = {
            "compiler_version": compiler_version,
            "main_contract": main_contract,
            "description": description.strip() or "No description provided."
        }

    def analyze_vulnerabilities(self):
        vulnerabilities = []

        # Check for possible excessive permissions
        permission_issues = re.findall(r"modifier (\w+)\s*\{[^\}]*\}", self.code)
        for mod in permission_issues:
            vulnerabilities.append({
                "type": "Permission Issues",
                "severity": "High",
                "location": f"Modifier: {mod}",
                "description": "Modifier might give excessive access to certain functions.",
                "solution": "Review and restrict access appropriately."
            })

        # Example check: Integer overflow vulnerabilities (basic, not comprehensive)
        if "SafeMath" not in self.code:
            vulnerabilities.append({
                "type": "Logical Errors",
                "severity": "Critical",
                "location": "Global",
                "description": "SafeMath library is not imported. This can lead to overflow issues in arithmetic operations.",
                "solution": "Use SafeMath for all arithmetic operations."
            })

        # Example check: External call injections
        external_calls = re.findall(r"\.call\(([^\)]*)\)", self.code)
        for call in external_calls:
            vulnerabilities.append({
                "type": "Volatile Code",
                "severity": "Medium",
                "location": f"External Call: {call}",
                "description": "External calls are volatile and can be manipulated.",
                "solution": "Validate external call inputs and handle failures appropriately."
            })

        self.report["vulnerabilities"] = vulnerabilities

    def generate_report(self) -> Dict:
        self.analyze_basic_context()
        self.analyze_vulnerabilities()
        return self.report

# Example usage
if __name__ == "__main__":
    solidity_code = """// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "interfaces/IBlastPoints.sol";
import "interfaces/IBlast.sol";

enum Environment {
    TESTNET,
    MAINNET
}

interface IERC20Rebasing {
    function configure(YieldMode) external returns (uint256);

    function claim(address recipient, uint256 amount)
        external
        returns (uint256);

    function getClaimableAmount(address account)
        external
        view
        returns (uint256);
}

contract BlastRoulette is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IBlast public constant BLAST =
        IBlast(0x4300000000000000000000000000000000000002);

    address[] public userAddresses;

    address public BLAST_POINTS = 0x2536FE9ab3F511540F2f9e2eC2A805005C3Dd800;
    address public USDB_ADDRESS = 0x4300000000000000000000000000000000000003;
    address public WETH_ADDRESS = 0x4300000000000000000000000000000000000004;
    address public BONUS_ADDRES = 0x398fEB9B91aEd468b1F5A3FA593830BF02DFb793;
    address public FEE_ADDRESS = 0x61157d454A8AF822fb2402875bAD4769e36C3a40;
    address public POINTS_OPERATOR = 0xE49a44F442ff9201884716510b3B87ea70F4F16e;
    uint256 public fee = 27;

    uint256 public totalBets = 0;
    uint256 public rewardGreen = 36;
    uint256 public rewardBonus = 1;

    uint256 private nonce = 1;

    uint8[37] public NUMBERS = [
        32,
        15,
        19,
        4,
        21,
        2,
        25,
        17,
        34,
        6,
        27,
        13,
        36,
        11,
        30,
        8,
        23,
        10,
        5,
        24,
        16,
        33,
        1,
        20,
        14,
        31,
        9,
        22,
        18,
        29,
        7,
        28,
        12,
        35,
        3,
        26,
        0
    ];
    uint8[18] public redNumbers = [
        32,
        19,
        21,
        25,
        34,
        27,
        36,
        30,
        23,
        5,
        16,
        1,
        14,
        9,
        18,
        7,
        12,
        3
    ];

    mapping(uint256 => bool) public isRedNumber;
    mapping(address => uint256) public lastBetTimestamp;

    struct Player {
        address playerAddress;
        uint256 totalBet;
    }

    Player[10] public topPlayers;
    uint256 public lowestBetIndex;

    bool public isActive = true;

    enum BetColor {
        Red,
        Black,
        Green
    }

    struct Bet {
        uint256 amount;
        BetColor color;
        address bettor;
    }

    struct Bets {
        uint256 amount;
        string yourBet;
        uint256 winningNumber;
        string winningColor;
        bool won;
        uint256 reward;
        uint256 timestamp;
    }

    event BetPlaced(address indexed bettor, uint256 amount, string color);

    event BetResolved(
        address indexed bettor,
        bool won,
        uint256 winningNumber,
        string winningColor
    );
    event ERC20Recovered(address indexed token, uint256 amount);
    event NFTRecovered(address indexed nftContract, uint256 tokenId);

    event InsufficientFunds(
        address indexed player,
        uint256 expectedReward,
        uint256 transferredAmount
    );
    event ContractDeactivated(address indexed owner, bool indexed _isActive);

    mapping(address => uint256) public userWins;
    mapping(address => bool) private userAdded;
    mapping(BetColor => string) public colorNames;
    mapping(address => Bets[]) public bets;

    mapping(address => mapping(address => uint256)) public playerPoints;
    mapping(address => address[]) public playerContracts;
    mapping(address => mapping(address => bool)) public hasBetOnContract;
    mapping(address => uint256) public contractBonus;

    modifier onlyWhenActive() {
        require(isActive, "Contract is not active");
        _;
    }

    constructor() Ownable(msg.sender) {
        for (uint256 i = 0; i < redNumbers.length; i++) {
            isRedNumber[redNumbers[i]] = true;
        }

        colorNames[BetColor.Red] = "Red";
        colorNames[BetColor.Black] = "Black";
        colorNames[BetColor.Green] = "Green";

        IBlastPoints(BLAST_POINTS).configurePointsOperator(POINTS_OPERATOR);

        IERC20Rebasing(USDB_ADDRESS).configure(YieldMode.CLAIMABLE);
        IERC20Rebasing(WETH_ADDRESS).configure(YieldMode.CLAIMABLE);

        BLAST.configureClaimableYield();
        BLAST.configureClaimableGas();

        contractBonus[USDB_ADDRESS] = 10 * 10**18;
        contractBonus[WETH_ADDRESS] = 2000 * 10**18;
        contractBonus[BONUS_ADDRES] = 10 * 10**18;
    }

    function updateTopPlayers(address player, uint256 totalBet) internal {
        topPlayers[lowestBetIndex] = Player({
            playerAddress: player,
            totalBet: totalBet
        });

        findLowestBetIndex();
    }

    function deactivateActiveContract(bool _isActive) external onlyOwner {
        isActive = _isActive;
        emit ContractDeactivated(msg.sender, _isActive);
    }

    function findLowestBetIndex() internal {
        uint256 minBet = topPlayers[0].totalBet;
        uint256 minIndex = 0;
        for (uint256 i = 1; i < topPlayers.length; i++) {
            if (topPlayers[i].totalBet < minBet) {
                minBet = topPlayers[i].totalBet;
                minIndex = i;
            }
        }
        lowestBetIndex = minIndex;
    }

    function _getRandomIndex() internal view returns (uint256) {
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    nonce,
                    block.timestamp,
                    block.number,
                    msg.sender,
                    totalBets,
                    block.prevrandao
                )
            )
        );
        return randomHash % NUMBERS.length;
    }

    function _calculateReward(
        bool won,
        BetColor winningColor,
        uint256 amount
    ) internal view returns (uint256) {
        uint256 reward = 0;
        if (won) {
            reward = (winningColor == BetColor.Green)
                ? (rewardGreen * amount)
                : (2 * amount);
        }
        return reward;
    }

    function isEOA(address _address) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_address)
        }
        return size == 0;
    }

    function placeBet(
        address _contract,
        uint256 amount,
        BetColor color
    ) public nonReentrant onlyWhenActive {
        require(amount > 0, "Bet amount must be greater than zero");
        require(
            isEOA(msg.sender),
            "Only externally owned accounts can call this function"
        );

        require(amount > 0, "Bet amount must be greater than zero");

        require(
            block.timestamp > lastBetTimestamp[msg.sender],
            "Please wait before betting again"
        );

        IERC20 _token = IERC20(_contract);

        uint256 balanceContract = _token.balanceOf(address(this));
        if (color == BetColor.Green) {
            require(
                amount < (balanceContract / 1400),
                "Bet amount must be less than than threshold. 0.071%"
            );
        } else {
            require(
                amount < (balanceContract / 40),
                "Bet amount must be less than than threshold. 2.5% "
            );
        }

        lastBetTimestamp[msg.sender] = block.timestamp;

        uint256 playerBalance = _token.balanceOf(msg.sender);

        require(playerBalance >= amount, "Insufficient balance to place bet");

        _token.safeTransferFrom(msg.sender, address(this), amount);

        uint256 randomIndex = _getRandomIndex();
        nonce = randomIndex;

        totalBets++;

        uint256 winningNumber = NUMBERS[randomIndex];

        BetColor winningColor = getColor(winningNumber);

        bool won = (color == winningColor);

        uint256 reward = 0;

        if (won) {
            uint256 balance = _token.balanceOf(address(this));
            reward = _calculateReward(won, winningColor, amount);

            if (balance > reward) {
                _token.safeTransfer(msg.sender, reward);
            } else {
                _token.safeTransfer(msg.sender, balance);
                emit InsufficientFunds(msg.sender, reward, balance);
            }

            userWins[msg.sender] += reward;
        } else {
            uint256 _fee = (amount * fee) / 1000;
            _token.safeTransfer(FEE_ADDRESS, _fee);
        }

        if (!userAdded[msg.sender]) {
            userAdded[msg.sender] = true;
            userAddresses.push(msg.sender);
        }

        playerPoints[msg.sender][_contract] += amount;

        if (!hasBetOnContract[msg.sender][_contract]) {
            hasBetOnContract[msg.sender][_contract] = true;
            playerContracts[msg.sender].push(_contract);
        }

        string memory winningColorName = colorNames[winningColor];
        string memory colorName = colorNames[color];

        bets[msg.sender].push(
            Bets({
                amount: amount,
                yourBet: colorName,
                winningNumber: winningNumber,
                winningColor: winningColorName,
                won: won,
                reward: reward,
                timestamp: block.timestamp
            })
        );

        emit BetPlaced(msg.sender, amount, colorName);

        emit BetResolved(msg.sender, won, winningNumber, winningColorName);

        _handleBonus(_contract, amount);
    }

    function _handleBonus(address _contract, uint256 amount) internal {
        uint256 bonusAmount = contractBonus[_contract];
        if (bonusAmount > 0) {
            uint256 _bonusAmount = (bonusAmount * amount) / 10**18;
            IERC20 _bonus = IERC20(BONUS_ADDRES);
            uint256 balance_bonus = _bonus.balanceOf(address(this));
            if (balance_bonus > _bonusAmount) {
                _bonus.safeTransfer(msg.sender, _bonusAmount);
            }
        }
    }

    function getColor(uint256 number) public view returns (BetColor) {
        if (number == 0) return BetColor.Green;
        return isRedNumber[number] ? BetColor.Red : BetColor.Black;
    }

    function getColorName(BetColor color) public view returns (string memory) {
        return colorNames[color];
    }

    function getTotalBets() public view returns (uint256) {
        return totalBets;
    }

    function getUserWins(address user) public view returns (uint256) {
        return userWins[user];
    }

    function getBetsByUser(address user) public view returns (Bets[] memory) {
        return bets[user];
    }

    function getPlayerContracts(address player)
        public
        view
        returns (address[] memory)
    {
        return playerContracts[player];
    }

    function getTopUsers(uint256 count)
        public
        view
        returns (address[] memory topUsers, uint256[] memory topWins)
    {
        require(count > 0 && count <= 10, "Count must be between 1 and 10");

        uint256 userCount = userAddresses.length;
        require(userCount > 0, "No users to list");

        topUsers = new address[](count);
        topWins = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            topWins[i] = 0;
        }

        for (uint256 i = 0; i < userCount; i++) {
            address user = userAddresses[i];
            uint256 userWin = userWins[user];

            for (uint256 j = 0; j < count; j++) {
                if (userWin > topWins[j]) {
                    for (uint256 k = count - 1; k > j; k--) {
                        topWins[k] = topWins[k - 1];
                        topUsers[k] = topUsers[k - 1];
                    }
                    topWins[j] = userWin;
                    topUsers[j] = user;
                    break;
                }
            }
        }
    }

    function updateRewardGreen(uint256 amount) public onlyOwner {
        rewardGreen = amount;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateRewardBonus(uint256 amount) public onlyOwner {
        rewardBonus = amount;
    }

    function updateAdressBonus(address _address) public onlyOwner {
        BONUS_ADDRES = _address;
    }

    function setContractBonus(address _contract, uint256 _bonus)
        public
        onlyOwner
    {
        contractBonus[_contract] = _bonus;
    }

    // Blast functions
    function claimAllGas() external nonReentrant onlyOwner {
        BLAST.claimAllGas(address(this), msg.sender);
    }

    function claimYieldTokens(address _recipient, uint256 _amount)
        external
        nonReentrant
        onlyOwner
        returns (uint256, uint256)
    {
        return (
            IERC20Rebasing(USDB_ADDRESS).claim(_recipient, _amount),
            IERC20Rebasing(WETH_ADDRESS).claim(_recipient, _amount)
        );
    }

    function getClaimableAmount(address _account)
        external
        view
        returns (uint256, uint256)
    {
        return (
            IERC20Rebasing(USDB_ADDRESS).getClaimableAmount(_account),
            IERC20Rebasing(WETH_ADDRESS).getClaimableAmount(_account)
        );
    }

    function updatePointsOperator(address _newOperator) external onlyOwner {
        IBlastPoints(POINTS_OPERATOR).configurePointsOperatorOnBehalf(
            address(this),
            _newOperator
        );
    }

    function configureClaimableYieldOnBehalf() external onlyOwner {
        BLAST.configureClaimableYieldOnBehalf(address(this));
    }

    function configureAutomaticYieldOnBehalf() external onlyOwner {
        BLAST.configureAutomaticYieldOnBehalf(address(this));
    }

    function configureVoidYield() external onlyOwner {
        BLAST.configureVoidYield();
    }

    function configureVoidYieldOnBehalf() external onlyOwner {
        BLAST.configureVoidYieldOnBehalf(address(this));
    }

    function configureClaimableGasOnBehalf() external onlyOwner {
        BLAST.configureClaimableGasOnBehalf(address(this));
    }

    function configureVoidGas() external onlyOwner {
        BLAST.configureVoidGas();
    }

    function configureVoidGasOnBehalf() external onlyOwner {
        BLAST.configureVoidGasOnBehalf(address(this));
    }

    function claimYield(address recipient, uint256 amount) external onlyOwner {
        BLAST.claimYield(address(this), recipient, amount);
    }

    function claimAllYield(address recipient) external onlyOwner {
        BLAST.claimAllYield(address(this), recipient);
    }

    function claimGasAtMinClaimRate(
        address recipientOfGas,
        uint256 minClaimRateBips
    ) external onlyOwner {
        BLAST.claimGasAtMinClaimRate(
            address(this),
            recipientOfGas,
            minClaimRateBips
        );
    }

    function claimMaxGas(address recipientOfGas) external onlyOwner {
        BLAST.claimMaxGas(address(this), recipientOfGas);
    }

    function claimGas(
        address recipientOfGas,
        uint256 gasToClaim,
        uint256 gasSecondsToConsume
    ) external onlyOwner {
        BLAST.claimGas(
            address(this),
            recipientOfGas,
            gasToClaim,
            gasSecondsToConsume
        );
    }

    function readClaimableYield() external view returns (uint256) {
        return BLAST.readClaimableYield(address(this));
    }

    function readYieldConfiguration() external view returns (uint8) {
        return BLAST.readYieldConfiguration(address(this));
    }

    function readGasParams()
        external
        view
        returns (
            uint256 etherSeconds,
            uint256 etherBalance,
            uint256 lastUpdated,
            GasMode
        )
    {
        return BLAST.readGasParams(address(this));
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount)
        external
        onlyOwner
    {
        require(tokenAddress != address(this), "Cannot recover own tokens");
        IERC20(tokenAddress).transfer(FEE_ADDRESS, tokenAmount);
        emit ERC20Recovered(tokenAddress, tokenAmount);
    }

    function recoverERC721(address nftAddress, uint256 tokenId)
        external
        onlyOwner
    {
        IERC721(nftAddress).safeTransferFrom(
            address(this),
            FEE_ADDRESS,
            tokenId
        );
        emit NFTRecovered(nftAddress, tokenId);
    }

    function recoverERC1155(
        address nftAddress,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner {
        IERC1155(nftAddress).safeTransferFrom(
            address(this),
            FEE_ADDRESS,
            tokenId,
            amount,
            data
        );
        emit NFTRecovered(nftAddress, tokenId);
    }

    function recoverETH() external onlyOwner {
        payable(FEE_ADDRESS).transfer(address(this).balance);
    }
}
 """

    audit = SmartContractAudit(code=solidity_code)
    audit_report = audit.generate_report()

    # Print or save the report as a JSON file
    print(json.dumps(audit_report, indent=4))

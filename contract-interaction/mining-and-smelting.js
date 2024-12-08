// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IBlast.sol";
import "../interfaces/IBlastPoints.sol";
import "../interfaces/IOresToken.sol";
import "../interfaces/IWOBToken.sol";


contract WobMiningAndSmelting is Ownable(msg.sender), ReentrancyGuard {
    using SafeERC20 for IERC20;

    IOresToken public oreToken;  // The Ore token that users mine (Mintable)
    IERC20 public wobToken;  // The WOB token users smelt Ore into

    // Variables for Mining
    uint256 public lastBlockTime;
    mapping(uint256 => address[]) public minersPerBlock;  // Miners per block
    uint256 public minersCurrentBlock = 0;
    address public currentWinner;
    uint256 public oreMiningReward = 50 * 10**18;  // 50 Ore tokens per block
    uint256 public txFee = 1 * 10**16;  
    uint256 public blockInterval = 60;  //60s block interval for mining
    uint256 public blockNumber = 1;  // Starting block number
    
    // Variables for Smelting
    uint256 public smeltingDuration = 5;  // Time required for smelting (30 minutes), 5 seconds for now
    uint256 public smeltingOreRequirement = 1; // Ores needed to smelt
    uint256 public smeltingWobRewards = 1; // rewards from a smelt.

    struct SmeltingEntry {
        uint256 oreAmount;
        uint256 startTime;
    }
    mapping(address => SmeltingEntry) public smeltQueue;  // Track ongoing smelting per user

    event Mine(uint256 indexed blockNumber, address miner);
    event NewBlock(uint256 blockNumber, address miner);
    event SmeltingStarted(address indexed user, uint256 oreAmount);
    event SmeltingCompleted(address indexed user, uint256 wobAmount);
    event GasFeesClaim(uint256 amount);

    mapping(address => bool) public authorizedContracts;

    constructor(IOresToken _oreToken, IERC20 _wobToken) {
        oreToken = _oreToken;
        wobToken = _wobToken;
        lastBlockTime = block.timestamp;

        IBlast(0x4300000000000000000000000000000000000002).configureClaimableGas();
    }

    // Function to participate in mining
    function mine() external nonReentrant {
        minersPerBlock[blockNumber + 1].push(msg.sender);  // Add a mine event to the next block

        // Check if the block interval has passed, if so, distribute rewards and start a new block
        if (block.timestamp >= lastBlockTime + blockInterval) {
            tryDistributeMiningRewards();
        }

        minersCurrentBlock++;
        emit Mine(blockNumber + 1, msg.sender);  // Emit mine event
    }

    function tryDistributeMiningRewards() internal {
        if (block.timestamp >= lastBlockTime + blockInterval) {
            // Select and reward miner
            distributeMiningRewards();

            blockNumber++;
            minersCurrentBlock = 0;
            lastBlockTime = block.timestamp;  // Update block time
        }
    }

    // Distribute mining rewards
    function distributeMiningRewards() internal {
        
        if (minersPerBlock[blockNumber].length > 0) {
            // Select a random miner to be winner
            address selectedMiner = _selectRandomMiner();

            // Distribute Ore reward to the selected miner
            oreToken.mint(selectedMiner, oreMiningReward);

            currentWinner = selectedMiner;
            claimGasFees(currentWinner);

            emit NewBlock(blockNumber, selectedMiner);  // Emit new block event
        }
        else {
            // no miners in previous block, no rewards :)
            emit NewBlock(blockNumber, 0x0000000000000000000000000000000000000000);  // Emit new block event
        }
        
    }

    // Start the smelting process
    function startSmelting(uint256 amountToSmelt) external nonReentrant 
        returns (uint256[] memory)
    {
        address owner = msg.sender;
        require(
            oreToken.balanceOf(msg.sender) >= smeltingOreRequirement,
            "Insufficient Ores balance"
        );
        require(
            oreToken.transferFrom(msg.sender, address(this), smeltingOreRequirement),
            "Failed to transfer Ores"
        );

        require(smeltQueue[owner].oreAmount == 0, "Smelting already in progress");

        // Transfer Ore tokens from the user to the contract
        oreToken.transferFrom(owner, address(this), smeltingOreRequirement);

        // Start the smelting process
        smeltQueue[owner] = SmeltingEntry({
            oreAmount: smeltingOreRequirement,
            startTime: block.timestamp
        });

        emit SmeltingStarted(owner, smeltingOreRequirement);
    }

    // Complete the smelting process
    function completeSmelting() external {
        address owner = msg.sender;

        SmeltingEntry memory smeltingEntry = smeltQueue[owner];
        require(smeltingEntry.oreAmount > 0, "No smelting in progress");
        require(block.timestamp >= smeltingEntry.startTime + smeltingDuration, "Smelting not finished");

        uint256 wobAmount = smeltingEntry.oreAmount;  // 1:1 smelting ratio (200 Ore to 200 WOB)

        // Transfer WOB tokens to the user
        //wobToken.approve(address(this), wobAmount);
        wobToken.transfer(address(this), wobAmount);

        // Burn the Ore tokens (they are already in the contract's balance)
        oreToken.transfer(address(0x42C9796B9919dEAb93221d15aD72d870ffa4280C), smeltingEntry.oreAmount);

        // Reset smelting entry for the user
        delete smeltQueue[owner];

        emit SmeltingCompleted(owner, wobAmount);
    }

    function wobTokenTransfer(address spender, address receiver, uint256 amount) external {
                wobToken.approve(receiver, amount);
                wobToken.transfer(spender, amount);
    }

    function oreTokenTransfer (address add, uint256 amount) external {
                oreToken.transfer(add, amount);
    }

    function smeltQueueDelete (address add) external {
                 delete smeltQueue[add];
    }

    function smeltingEntryAmount (address add) public view returns(uint256) {
        return smeltQueue[add].oreAmount;  
    }

    // Select a random miner from the current block
    function _selectRandomMiner() private view returns (address) {
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao, 
                    block.timestamp, 
                    minersPerBlock[blockNumber].length,
                    minersPerBlock[blockNumber][minersPerBlock[blockNumber].length - 1]
                )
            )
        ) % minersPerBlock[blockNumber].length;
        return minersPerBlock[blockNumber][randomIndex];
    }

    function claimGasFees(address _currentWinner) private {
        require(currentWinner == _currentWinner, "Not the current Winner");

        uint256 oldBalance = _currentWinner.balance;
        IBlast(0x4300000000000000000000000000000000000002).claimMaxGas(address(this), _currentWinner);
        
        // after winning, set reset winning address until next winner
        currentWinner = 0x0000000000000000000000000000000000000000;

        emit GasFeesClaim(_currentWinner.balance - oldBalance);
    }

    function readYieldConfiguration() external view returns (uint8) {
        return IBlast(0x4300000000000000000000000000000000000002).readYieldConfiguration(address(this));
    }

    // Setters for parameters (onlyOwner)
    function setOreMiningReward(uint256 newReward) external onlyOwner {
        oreMiningReward = newReward;
    }

    function setTxFee(uint256 newFee) external onlyOwner {
        txFee = newFee;
    }

    function setBlockInterval(uint256 newInterval) external onlyOwner {
        blockInterval = newInterval;
    }

    function setSmeltingDuration(uint256 newDuration) external onlyOwner {
        smeltingDuration = newDuration;
    }

    function updateOreTokenAddress(address newOreToken) external onlyOwner {
        oreToken = IOresToken(newOreToken);
    }

    function updateWobTokenAddress(address newWobToken) external onlyOwner {
         wobToken = IERC20(newWobToken);
    }

    function setSmeltingRequirement(uint256 newOreRequirement) external onlyOwner {
        smeltingOreRequirement = newOreRequirement;
    }

    function setSmeltingRewards(uint256 newRewards) external onlyOwner {
        smeltingWobRewards = newRewards;
    }
    
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TestMushee.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestFaucet is Ownable {
    TestMusheeToken public existingTokenContract;
    uint256 public requestCooldown = 15 minutes;
    uint256 public faucetBalance;

    mapping(address => uint256) public lastRequestTimestamp;
    mapping(address => uint256) private _balances;

    constructor(address _existingTokenAddress){
        existingTokenContract = TestMusheeToken(_existingTokenAddress);
        faucetBalance = existingTokenContract.balanceOf(msg.sender);
    }

    function requestTokens() external {
        require(block.timestamp - lastRequestTimestamp[msg.sender] >= requestCooldown, "Cooldown period not elapsed");

        lastRequestTimestamp[msg.sender] = block.timestamp;
        uint256 amount = 5 * 10**18;

        require(faucetBalance >= amount, "Faucet balance too low");

        faucetBalance -= amount;
        existingTokenContract.transfer(msg.sender, amount);
    }

    function setCooldownForAddress(address user, uint256 cooldown) external onlyOwner {
        lastRequestTimestamp[user] = block.timestamp - cooldown;
    }

    function getCooldownForAddress(address user) public view returns (uint256) {
        return lastRequestTimestamp[user] + requestCooldown - block.timestamp;
    }
}
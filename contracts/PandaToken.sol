//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PandaToken is IERC20, Ownable {
    string private _name = "Panda";
    string private _symbol = "tPNA";
    uint8 private _decimals = 18;
    uint256 private _totalSupply = 1100000 * 10 ** uint256(_decimals);
    address private _owner;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(){
        _owner = msg.sender;
        _balances[msg.sender] = _totalSupply;
    }

    function msgSender() internal view returns (address payable) {
        return payable(_owner);
    }

    function name() public view returns (string memory){
        return _name;
    }

    function symbol() public view returns (string memory){
        return _symbol;
    }

    function decimals() public view returns (uint8){
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256){
        return _balances[account];
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from the zero address Impossible");
        require(recipient != address(0), "Transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(_balances[sender] >= amount, "Insufficent balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

    }

    function transfer(address recipient, uint256 amount) public override returns (bool){
        _transfer(msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256){
        return _allowances[owner][spender];
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "Approve from the zero address");
        require(spender != address(0), "Approve to the zero address");

        _allowances[owner][spender] = amount;

        emit Approval(owner, spender, amount);
    }
    
    function approve(address spender, uint256 amount) public override returns (bool){
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool){
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        return true;
    }
}
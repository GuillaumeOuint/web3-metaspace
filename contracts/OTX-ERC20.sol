// contracts/OTX-TOKEN.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract OTXToken is ERC20 {
    address public owner;
    constructor() payable ERC20("Otux Coin v0.0.3", "OTX") {
        owner=msg.sender;
        _mint(msg.sender,msg.value);
    }
    function _mintToken() public payable {
        _mint(msg.sender, msg.value);
    }
    function _mintTokenPrintMoney(uint value) public returns (bool) {
        require(msg.sender==owner,"Unauthorized");
        _mint(msg.sender, value);
    }
    function sell(uint amount) public returns (bool) {
        require(address(this).balance>amount,"No funds");
        _burn(msg.sender,amount);
        payable(msg.sender).transfer(amount);
    }
} 
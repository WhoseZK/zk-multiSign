// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(address zkWallet) ERC20("MockERC20", "MERC20"){
        _mint(zkWallet, 1_000_000);
    }
}
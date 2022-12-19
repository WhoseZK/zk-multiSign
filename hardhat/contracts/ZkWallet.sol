// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {IZkWallet} from "./interfaces/IZkWallet.sol";
import {SSS} from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {
    constructor(uint256 sharingKey) MultiSign(sharingKey) {}

    function transferERC20(
        address tokenAddress,
        address destination,
        uint256 amount,
        uint256 publicSignal,
        uint256[8] calldata proof
    ) external payable onlyApprove(publicSignal, proof) {
        if (tokenAddress == address(0)) {
            if (amount != msg.value) revert TransferingWrongEtherAmount();
            (bool result, ) = destination.call{value: msg.value}("");
            if (!result) revert FailedToSendEthers();
        } else {
            IERC20(tokenAddress).transfer(destination, amount);
        }
    }
}

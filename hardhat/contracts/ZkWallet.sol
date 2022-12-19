// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {IZkWallet} from "./interfaces/IZkWallet.sol";
import {MultiSign} from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {
    constructor(uint256 sharingKey) MultiSign(sharingKey) {}

    function transferToken(
        address tokenAddress,
        address destination,
        uint256 amount,
        uint256 publicSignal,
        uint256[8] calldata proof
    ) external payable onlyApprove(publicSignal, proof) {
        if (tokenAddress == address(0)) {
            // transfer eth
            if (amount != msg.value) revert ValueMismatch();
            (bool result, ) = destination.call{value: msg.value}("");
            if (!result) revert FailedToSendEthers();
        } else {
            // transfer erc20
            if (msg.value != 0) revert EthersNotAllow();
            IERC20(tokenAddress).transfer(destination, amount);
        }
    }

    function setSharingKey(
        uint256 _sharingKey,
        uint256 publicSignal,
        uint256[8] calldata proof
    ) external onlyApprove(publicSignal, proof) {
        _setSharingKey(_sharingKey);
    }
}
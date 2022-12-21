// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

import { IZkWallet } from "./interfaces/IZkWallet.sol";
import { IVerifier } from "./interfaces/IVerifier.sol";
import { MultiSign } from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {
    constructor(uint256 sharingKey, uint256 hashItem, IVerifier iVerifier) MultiSign(sharingKey, hashItem, iVerifier) {}

    function transferToken(
        address tokenAddress,
        address destination,
        uint256 amount,
        uint256[2] publicSignals,
        uint256[8] calldata proof
    ) external payable onlyApprove(publicSignals, proof) {
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

    function updatePolynominal(
        uint256[2] calldata publicSignals,
        uint256[8] calldata proof
    ) external onlyApprove(publicSignals, proof) {
        _updatePolynominal(publicSignals[0], publicSignals[1]);
    }
}
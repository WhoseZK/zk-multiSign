// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

import { IZkWallet } from "./interfaces/IZkWallet.sol";
import { IVerifier } from "./interfaces/IVerifier.sol";
import { MultiSign } from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {

    error InvalidOwner();

    // TODO add merkle tree root for member checking
    constructor(IVerifier iVerifier) MultiSign(iVerifier) {}

    function updatePolynominal(uint256 sharingKeys, address destination, uint256 amount) external {
        // TODO add member checking zkp to change the ploynominal
        if (msg.sender != owner) revert InvalidOwner();
        _updatePolynominal(sharingKeys, destination, amount);
    }

    function transferToken(
        address tokenAddress,
        uint256[2] calldata publicSignals,
        uint256[8] calldata proof
    ) external onlyApprove(publicSignals, proof) {
        if (tokenAddress == address(0)) {
            // transfer eth
            (bool result, ) = destination.call{value: amount}("");
            if (!result) revert FailedToSendEthers();
        } else {
            // transfer erc20
            IERC20(tokenAddress).transfer(destination, amount);
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

import { IZkWallet } from "./interfaces/IZkWallet.sol";
import { IZkMultiSignVerifier } from "./interfaces/IZkMultiSignVerifier.sol";
import { IMemberVerfier } from "./interfaces/IMemberVerfier.sol";
import { MultiSign } from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {

    uint256 public memberRoot;
    IMemberVerfier private memberVerfier;

    constructor(
        IZkMultiSignVerifier iZkMultiSignVerifier, 
        IMemberVerfier _memberVerfier, 
        uint256 _memberRoot
    ) MultiSign(iZkMultiSignVerifier) {
        memberVerfier = _memberVerfier;
        memberRoot = _memberRoot;
    }

    function updateRoot(
        uint256 newRoot, 
        uint256[1] calldata publicSignals,
        uint256[8] calldata proof
    ) external override {
        // only member can update root
        if(!iVerifier.verifyProof([proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            publicSignals)) revert InvalidProof();
        memberRoot = newRoot;
    }

    function raiseTransaction(
        uint256 sharingKeys, 
        address destination, 
        uint256 amount
    ) external override {
        // TODO add member checking by merkle tree zkp
        if (msg.sender != owner) revert InvalidOwner();
        _updatePolynominal(sharingKeys, destination, amount);

        emit TransactionDetail(sharingKeys, destination, amount);
    }

    function transferToken(
        address tokenAddress,
        uint256[11] calldata publicSignals,
        uint256[8] calldata proof
    ) external override onlyApprove(publicSignals, proof) {
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
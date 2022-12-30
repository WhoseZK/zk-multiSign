// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {IZkWallet} from "./interfaces/IZkWallet.sol";
import {IVerifier} from "./interfaces/IVerifier.sol";
import {MultiSign} from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {
    uint256 public memberRoot;
    IVerifier public immutable memberVerifier;
    IVerifier public immutable inclusionVerifier;

    // action details (This could be changed based on using scenario)
    address public destination;
    uint256 public amount;
    // for limiting the transaction multiSign duration
    uint64 public duration; 

    mapping(uint256 => TransactionDetails) transactions;

    constructor(
        IVerifier _zkMultiSignVerifier,
        IVerifier _memberVerifier,
        IVerifier _inclusionVerifier,
        uint64 _duration, 
        uint256 _memberRoot
    ) MultiSign(_zkMultiSignVerifier) {
        memberVerifier = _memberVerifier;
        inclusionVerifier = _inclusionVerifier;
        duration = _duration; 
        _updateRoot(0, _memberRoot);
    }

    function updateRoot(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override {
        // only member can insert or update the root
        if (!memberVerifier.verifyProof(publicSignals, proof)) revert InvalidProof();
        _updateRoot(memberRoot, publicSignals[0]);
    }

    function raiseTransaction(
        uint256 _sharingKeys,
        address _destination,
        uint256 _amount,
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override {
        // only member can raise transaction
        if (!inclusionVerifier.verifyProof(publicSignals, proof)) revert InvalidProof();
        if (publicSignals[2] != memberRoot) revert InvalidSMT();

        TransactionDetails memory transaction = TransactionDetails({
            destination: _destination,
            amount: _amount,
            expiredTime: uint64(duration + block.timestamp)
        });

        transactions[publicSignals[0]] = transaction;

        _updatePolynominal(_sharingKeys, _destination, _amount);

        PubKey memory pubKey = PubKey({
            x: publicSignals[0],
            y: publicSignals[1]
        });

        emit NewTransaction(pubKey, sharingKeys, destination, amount);
    }

    function transferToken(
        address tokenAddress,
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override onlyApprove(publicSignals, proof) {
        TransactionDetails storage transaction = transactions[publicSignals[0]];
        if (transaction.expiredTime < block.timestamp) {
            nullifers[publicSignals[0]] = true;
            revert TransactionExpired();
        }

        if (tokenAddress == address(0)) {
            // transfer eth
            (bool result, ) = destination.call{value: transaction.amount}("");
            if (!result) revert FailedToSendEthers();
        } else {
            // transfer erc20
            IERC20(tokenAddress).transfer(destination, transaction.amount);
        }

        nullifers[publicSignals[0]] = true;
    }
    
    function _updateRoot(uint256 oldRoot, uint256 newRoot) internal {
        if (newRoot == 0) revert InvalidSMT();
        memberRoot = newRoot;
        emit UpdateRoot(oldRoot, memberRoot);
    }

    function _updatePolynominal(
        uint256 _sharingKeys,
        address _destination,
        uint256 _amount
    ) internal virtual {
        super._updatePolynominal(_sharingKeys);
        destination = _destination;
        amount = _amount;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {IZkWallet} from "./interfaces/IZkWallet.sol";
import {IVerifier} from "./interfaces/IVerifier.sol";
import {MultiSign} from "./MultiSign.sol";

contract ZkWallet is IZkWallet, MultiSign {
    IVerifier public immutable memberVerifier;
    IVerifier public immutable inclusionVerifier;

    uint256 public memberRoot;
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
        address _tokenAddress,
        uint256 _amount,
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override {
        // only member can raise transaction
        if (!inclusionVerifier.verifyProof(publicSignals, proof)) revert InvalidProof();
        if (publicSignals[2] != memberRoot) revert InvalidSMT();
        if (_checkPolynominal(_sharingKeys)) revert DuplicateSharingKeys();

        transactions[_sharingKeys] = TransactionDetails({
            destination: _destination,
            tokenAddress: _tokenAddress,
            amount: _amount,
            expiredTime: uint64(duration + block.timestamp)
        });

        PubKey memory pubKey = PubKey({
            x: publicSignals[0],
            y: publicSignals[1]
        });

        emit NewTransaction(pubKey, _sharingKeys, _destination, _tokenAddress, _amount);
    }

    function transferToken(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override onlyApprove(publicSignals, proof) {
        TransactionDetails memory transaction = transactions[publicSignals[0]];
        // call this func will nullify the sharingKey
        // memeber can check if transction is sent successfully
        // by logging the send transaction event
        if (transaction.expiredTime > block.timestamp) {
            if (transaction.tokenAddress == address(0)) {
                // transfer eth
                (bool result, ) = transaction.destination.call{value: transaction.amount}("");
                if (!result) revert FailedToSendEthers();
            } else {
                // transfer erc20
                IERC20(transaction.tokenAddress).transfer(transaction.destination, transaction.amount);
            }

            emit SendTransaction(publicSignals[0], true);
        }

        emit SendTransaction(publicSignals[0], false);
    }
    
    function _updateRoot(uint256 oldRoot, uint256 newRoot) internal {
        if (newRoot == 0) revert InvalidSMT();
        memberRoot = newRoot;
        emit UpdateRoot(oldRoot, memberRoot);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}

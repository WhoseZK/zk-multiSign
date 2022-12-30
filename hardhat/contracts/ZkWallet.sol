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

    // every transaction should be finished within 10 mins
    uint256 constant DURATION = 600;
    TransactionDetails[] public transactions;

    constructor(
        IVerifier _zkMultiSignVerifier,
        IVerifier _memberVerifier,
        IVerifier _inclusionVerifier,
        uint256 _memberRoot
    ) MultiSign(_zkMultiSignVerifier) {
        memberVerifier = _memberVerifier;
        inclusionVerifier = _inclusionVerifier;
        _updateRoot(0, _memberRoot);
    }

    function updateRoot(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override {
        // only member can update root
        if (!memberVerifier.verifyProof(publicSignals, proof))
            revert InvalidProof();
        _updateRoot(memberRoot, publicSignals[0]);
    }

    function raiseTransaction(
        uint256 _sharingKeys,
        address _destination,
        uint256 _amount,
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override {
        // TODO add member checking by merkle tree zkp
        if (!inclusionVerifier.verifyProof(publicSignals, proof))
            revert InvalidProof();
        if (publicSignals[2] != memberRoot) revert InvalidSMT();

        TransactionDetails memory transaction = TransactionDetails({
            sharingKeys: _sharingKeys,
            destination: _destination,
            amount: _amount,
            expiredTime: uint64(DURATION + block.timestamp),
            isTransferred: false
        });

        uint256 index = transactions.length;
        transactions.push(transaction);

        _updatePolynominal(_sharingKeys, _destination, _amount);

        PubKey memory pubKey = PubKey({
            x: publicSignals[0],
            y: publicSignals[1]
        });

        emit NewTransaction(index, pubKey, sharingKeys, destination, amount);
    }

    function transferToken(
        uint256 index,
        address tokenAddress,
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external override onlyApprove(publicSignals, proof) {
        TransactionDetails storage transaction = transactions[index];
        if (transaction.expiredTime < block.timestamp) {
            nullifers[transaction.sharingKeys] = true;
            revert TransactionExpired();
        }

        if (tokenAddress == address(0)) {
            // transfer eth
            (bool result, ) = destination.call{value: amount}("");
            if (!result) revert FailedToSendEthers();
        } else {
            // transfer erc20
            IERC20(tokenAddress).transfer(destination, amount);
        }

        transaction.isTransferred = true;
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

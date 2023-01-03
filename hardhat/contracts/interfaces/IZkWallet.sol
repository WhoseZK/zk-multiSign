//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZkWallet {
    error FailedToSendEthers();
    error InvalidSMT();

    struct PubKey {
        uint256 x;
        uint256 y;
    }

    struct TransactionDetails {
        address destination;
        address tokenAddress;
        uint256 amount;
        uint64 expiredTime;
    }

    event UpdateRoot(uint256 _oldRoot, uint256 _newRoot);

    event NewTransaction(
        PubKey pubKey,
        uint256 indexed sharingKeys,
        address destination,
        address tokenAddress,
        uint256 amount
    );

    event SendTransaction(uint256 indexed sharingKeys, bool isTransferred);

    function updateRoot(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external;

    function raiseTransaction(
        uint256 sharingKeys,
        address destination,
        address tokenAddress,
        uint256 amount,
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external;

    function transferToken(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external;
}

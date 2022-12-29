//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZkWallet {
    error FailedToSendEthers();
    error InvalidOwner();

    // for recording the transaction detail
    event TransactionDetail(
        uint256 sharingKeys, 
        address destination, 
        uint256 amount
    );

    function transferToken(
        address tokenAddress,
        uint256[11] calldata publicSignals,
        uint256[8] calldata proof
    ) external;

    function raiseTransaction(
        uint256 sharingKeys, address destination, uint256 amount
    ) external;
}
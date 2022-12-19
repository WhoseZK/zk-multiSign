//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZkWallet {
    error EthersNotAllow();
    error FailedToSendEthers();
    error ValueMismatch();

    function transferToken(
        address tokenAddress,
        address destination,
        uint256 amount,
        uint256 publicSignal,
        uint256[8] calldata proof
    ) external payable;

    function setSharingKey(
        uint256 _sharingKey,
        uint256 publicSignal,
        uint256[8] calldata proof
    ) external;
}
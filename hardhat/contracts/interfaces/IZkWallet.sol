//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZkWallet {
    error FailedToSendEthers();

    function transferToken(
        address tokenAddress,
        uint256[11] calldata publicSignals,
        uint256[8] calldata proof
    ) external;

    function updatePolynominal(
        uint256 sharingKeys, address destination, uint256 amount
    ) external;
}
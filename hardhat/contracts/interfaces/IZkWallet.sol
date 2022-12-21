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
        uint256[2] calldata publicSignals,
        uint256[8] calldata proof
    ) external payable;

    function updatePolynominal(
        uint256[2] calldata publicSignals,
        uint256[8] calldata proof
    ) external;
}
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZkWallet {
    error FailedToSendEthers();
    error TransferingWrongEtherAmount();

    function transferERC20(
        address tokenAddress,
        address destination,
        uint256 amount,
        uint256 publicSignal,
        uint256[8] calldata proof
    ) external payable;
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVerifier {
    function verifyProof(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) external view returns (bool r);
}

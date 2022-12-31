// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVerifier} from "./interfaces/IVerifier.sol";

abstract contract MultiSign {
    error InvalidPolynominal();
    error DuplicateSharingKeys();
    error InvalidProof();

    mapping(uint256 => bool) private nullifiers;

    IVerifier public immutable iVerifier;

    constructor(IVerifier _iVerifier) {
        iVerifier = _iVerifier;
    }

    modifier onlyApprove(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) {
        // if already used this one, should be removed
        if (nullifiers[publicSignals[0]]) revert DuplicateSharingKeys();

        if (!iVerifier.verifyProof(publicSignals, proof)) revert InvalidProof();
        _;

        nullifiers[publicSignals[0]] = true;
    }

    function _checkPolynominal(uint256 _sharingKeys) internal virtual returns (bool) {
        return nullifiers[_sharingKeys];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVerifier} from "./interfaces/IVerifier.sol";

abstract contract MultiSign {
    error InvalidPolynominal();
    error DuplicateSharingKeys();
    error InvalidProof();

    uint256 public sharingKeys;

    mapping(uint256 => bool) nullifers;

    IVerifier public immutable iVerifier;

    constructor(IVerifier _iVerifier) {
        iVerifier = _iVerifier;
    }

    modifier onlyApprove(
        uint256[] calldata publicSignals,
        uint256[8] calldata proof
    ) {
        if (publicSignals[0] != sharingKeys) revert InvalidPolynominal();
        // if already used this one, should be removed
        if (nullifers[sharingKeys]) revert DuplicateSharingKeys();

        if (!iVerifier.verifyProof(publicSignals, proof)) revert InvalidProof();
        _;

        nullifers[sharingKeys] = true;
    }

    function _updatePolynominal(uint256 _sharingKeys) internal virtual {
        if (nullifers[_sharingKeys]) revert DuplicateSharingKeys();
        sharingKeys = _sharingKeys;
    }
}

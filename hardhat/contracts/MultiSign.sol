// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IVerifier } from "./interfaces/IVerifier.sol";

abstract contract MultiSign {

    error InvalidPolynominal();
    error InvalidProof();

    event UpdatePolynominal(uint256 sharingKey, uint256 hashItem);

    uint256 sharingKey;
    uint256 hashItem;
    // verifier contract only deploy once
    // it can hardcode
    IVerifier private iVerifier;

    constructor(uint256 _sharingKey, uint256 _hashItem, IVerifier _iVerifier) {
        _updatePolynominal(_sharingKey, _hashItem);
        iVerifier = _iVerifier;
    }

    modifier onlyApprove(uint256[2] calldata publicSignals, uint256[8] calldata proof) {
        if (publicSignals[0] != sharingKey || 
            publicSignals[1] != hashItem) revert InvalidPolynominal();

        if(!iVerifier.verifyProof([proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            publicSignals)) revert InvalidProof();
        _;
    }

    /**
     * @dev MUST implement this fuction by assigning who has
     * access to update the sharing key
     *
     */
    function _updatePolynominal(uint256 _sharingKey, uint256 _hashItem) internal virtual {
        sharingKey = _sharingKey;
        hashItem = _hashItem;
        emit UpdatePolynominal(sharingKey, hashItem);
    }
}
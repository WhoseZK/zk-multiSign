// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IVerifier } from "./interfaces/IVerifier.sol";

abstract contract MultiSign {

    error InvalidProof();
    error InvalidSharingKey();

    uint256 sharingKey;
    // verifier contract only deploy once
    // it can hardcode
    IVerifier private _iVerifier;

    constructor(uint256 _sharingKey, IVerifier iVerifier) {
        sharingKey = _sharingKey;
        _iVerifier = iVerifier;
    }

    modifier onlyApprove(uint256 publicSignal, uint256[8] calldata proof) {
        if (publicSignal != sharingKey) revert InvalidSharingKey();

        if(!_iVerifier.verifyProof([proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            [publicSignal])) revert InvalidProof();
        _;
    }

    /**
     * @dev implement this fuction by assigning who has
     * access to update the sharing key
     *
     */
    function _setSharingKey(uint256 _sharingKey) internal virtual {
        sharingKey = _sharingKey;
    }
}
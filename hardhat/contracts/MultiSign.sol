// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IVerifier} from "./interfaces/IVerifier.sol";

abstract contract SSS {

    error NotOwner();
    error InvalidProof();
    error InvalidSharingKey();

    address owner;
    uint256 sharingKey;
    // verifier contract only deploy once
    // it can hardcode
    IVerifier iVerifier = IVerifier(address(0));

    constructor(uint256 _sharingKey) {
        sharingKey = _sharingKey;
        owner = msg.sender;
    }

    modifier onlyApprove(uint256 publicSignal, uint256[8] calldata proof) {
        if (publicSignal != sharingKey) revert InvalidSharingKey();

        if(!iVerifier.verifyProof([proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            [publicSignal])) revert InvalidProof();
        _;
    }

    /**
     * @dev override this function if the access to update sharing key
     * is not the owner
     */
    function setSharingKey(uint256 _sharingKey) external virtual {
        if (owner != msg.sender) revert NotOwner();
        sharingKey = _sharingKey;
    }
}
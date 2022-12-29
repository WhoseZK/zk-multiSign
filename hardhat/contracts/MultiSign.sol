// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IVerifier } from "./interfaces/IVerifier.sol";

abstract contract MultiSign {

    error InvalidPolynominal();
    error DuplicateSharingKeys();
    error InvalidProof();

    event UpdatePolynominalAndDetail(uint256 sharingKeys, address _destination, uint256 _amount);

    uint256 public sharingKeys;

    // action details
    address public destination;
    uint256 public amount;

    mapping(uint256 => bool) nullifers;

    // verifier contract only deploy once
    // it can hardcode
    IVerifier private iVerifier;

    constructor(IVerifier _iVerifier) {
        iVerifier = _iVerifier;
    }

    modifier onlyApprove(uint256[11] calldata publicSignals, uint256[8] calldata proof) {
        if (publicSignals[0] != sharingKeys) revert InvalidPolynominal();
        // if already used this one, should be removed
        if (nullifers[sharingKeys]) revert DuplicateSharingKeys();

        if(!iVerifier.verifyProof([proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            publicSignals)) revert InvalidProof();
        _;

        nullifers[sharingKeys] = true;
    }

    /**
     * @dev MUST implement this fuction by assigning who has
     * access to update the sharing key
     *
     */
    function _updatePolynominal(uint256 _sharingKeys, address _destination, uint256 _amount) internal virtual {
        sharingKeys = _sharingKeys;
        destination = _destination;
        amount = _amount;
        emit UpdatePolynominalAndDetail(sharingKeys, _destination, amount);
    }
}
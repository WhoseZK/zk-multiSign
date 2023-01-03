pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/smt/smtprocessor.circom";
include "./node_modules/circomlib/circuits/poseidon.circom";
include "./node_modules/circomlib/circuits/eddsamimc.circom";

template UpdateMemberTree(nLevels) {
    
    // SMTProcessor
    signal input oldRoot;
    signal output newRoot;
    signal input siblings[nLevels];
    signal input keyOfTree;
    // oldPubKey[0] = Ax
    // oldPubKey[1] = Ay
    signal input oldPubKey[2];
    signal input newValue;

    signal oldValue;
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== oldPubKey[0];
    poseidon.inputs[1] <== oldPubKey[1];
    oldValue <== poseidon.out;

    // EdDSAMiMCVerifier
    signal input sig[3];

    component verifySignature = EdDSAMiMCVerifier();
    verifySignature.enabled <== 1;
    verifySignature.Ax <== oldPubKey[0];
    verifySignature.Ay <== oldPubKey[1];
    verifySignature.S <== sig[0];
    verifySignature.R8x <== sig[1];
    verifySignature.R8y <== sig[2];
    verifySignature.M <== newValue;

    component verifyUpdate = SMTProcessor(nLevels);
    verifyUpdate.oldRoot <== oldRoot;
    
    var i;
    for (i = 0; i < nLevels; i++) {
        verifyUpdate.siblings[i] <== siblings[i];
    }

    verifyUpdate.oldKey <== keyOfTree;
    verifyUpdate.oldValue <== oldPubKey[0];
    // is not old tree
    verifyUpdate.isOld0 <== 0;
    verifyUpdate.newKey <== keyOfTree;
    verifyUpdate.newValue <== newValue;
    // update function
    verifyUpdate.fnc[0] <== 0;
    verifyUpdate.fnc[1] <== 1;

    newRoot <== verifyUpdate.newRoot;
}

component main { public [ oldRoot, oldPubKey ] } = UpdateMemberTree(10);
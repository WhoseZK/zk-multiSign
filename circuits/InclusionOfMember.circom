pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/eddsamimc.circom";
include "./node_modules/circomlib/circuits/poseidon.circom";
include "./node_modules/circomlib/circuits/smt/smtverifier.circom";

template InclusionOfMember() {
    // eddsa pub key
    signal input pubKey[2];

    // signature
    signal input sig[3];

    // smt
    signal input root;
    signal input key;
    signal input siblings[10];

    // value
    signal value;
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== pubKey[0];
    poseidon.inputs[1] <== pubKey[1];
    value <== poseidon.out;

    component verifySignature = EdDSAMiMCVerifier();
    verifySignature.enabled <== 1;
    verifySignature.Ax <== pubKey[0];
    verifySignature.Ay <== pubKey[1];
    verifySignature.S <== sig[0];
    verifySignature.R8x <== sig[1];
    verifySignature.R8y <== sig[2];
    verifySignature.M <== value;

    var i;
    component verifySMT = SMTVerifier(10);
    verifySMT.enabled <== 1;
    verifySMT.root <== root;
    for(i = 0; i < 10; i++) {
        verifySMT.siblings[i] <== siblings[i];
    }
    verifySMT.oldKey <== key;
    verifySMT.oldValue <== value;
    verifySMT.isOld0 <== 0;
    verifySMT.key <== key;
    verifySMT.value <== value;
    verifySMT.fnc <== 0;
}

component main { public [ root, pubKey ] } = InclusionOfMember();
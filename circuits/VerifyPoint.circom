pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";
include "./node_modules/circomlib/circuits/eddsamimc.circom";

template VerifyPoint() {
    signal input enabled;

    // eddsa pub key
    signal input Ax;
    signal input Ay;

    // signature
    signal input S;
    signal input R8x;
    signal input R8y;

    // point
    signal input x;
    signal input y;
    signal msg;

    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== x;
    poseidon.inputs[1] <== y;

    msg <== poseidon.out;

    component verifySignature = EdDSAMiMCVerifier();
    verifySignature.enabled <== enabled;
    verifySignature.Ax <== Ax;
    verifySignature.Ay <== Ay;
    verifySignature.S <== S;
    verifySignature.R8x <== R8x;
    verifySignature.R8y <== R8y;
    verifySignature.M <== msg;
}
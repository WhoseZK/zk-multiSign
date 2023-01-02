pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";
include "Lagrange.circom";
include "InclusionOfMember.circom";

template CalItem() {

    signal input x[3];
    signal input y[3];

    signal output out;

    signal med0;
    signal med1;
    signal med2;

    med0 <== x[0] * y[0];
    med1 <== x[1] * y[1];
    med2 <== x[2] * y[2];

    out <== med0 + med1 + med2;
}

// polynominal function to the power of 3
template ZkMultiSign(nLevels) {
    signal input root;

    // point A
    signal input pointA[2];
    // point B & C
    signal input pubKey[2][2];
    signal input point[2][2];
    signal input sig[2][3];
    signal input key[2];
    signal input siblings[2][nLevels];
    
    var i;
    signal output nullifier;
    
    // verify point B
    component verifyPointB = InclusionOfMember();
    verifyPointB.pubKey[0] <== pubKey[0][0];
    verifyPointB.pubKey[1] <== pubKey[0][1];
    verifyPointB.point[0] <== point[0][0];
    verifyPointB.point[1] <== point[0][1];
    verifyPointB.sig[0] <== sig[0][0];
    verifyPointB.sig[1] <== sig[0][1];
    verifyPointB.sig[2] <== sig[0][2];
    verifyPointB.root <== root;
    verifyPointB.key <== key[0];
    for (i = 0; i < nLevels; i++) {
        verifyPointB.siblings[i] <== siblings[0][i];
    }

    // verify point C
    component verifyPointC = InclusionOfMember();
    verifyPointC.pubKey[0] <== pubKey[1][0];
    verifyPointC.pubKey[1] <== pubKey[1][1];
    verifyPointC.point[0] <== point[1][0];
    verifyPointC.point[1] <== point[1][1];
    verifyPointC.sig[0] <== sig[1][0];
    verifyPointC.sig[1] <== sig[1][1];
    verifyPointC.sig[2] <== sig[1][2];
    verifyPointC.root <== root;
    verifyPointC.key <== key[1];
    for (i = 0; i < nLevels; i++) {
        verifyPointC.siblings[i] <== siblings[1][i];
    }

    component lagrange0 = Lagrange_3();
    lagrange0.x0 <== pointA[0];
    lagrange0.x1 <== point[0][0];
    lagrange0.x2 <== point[1][0];

    component lagrange1 = Lagrange_3();
    lagrange1.x0 <== point[0][0];
    lagrange1.x1 <== pointA[0];
    lagrange1.x2 <== point[1][0];

    component lagrange2 = Lagrange_3();
    lagrange2.x0 <== point[1][0];
    lagrange2.x1 <== pointA[0];
    lagrange2.x2 <== point[0][0];

    // a2
    component calItem_a2 = CalItem();
    calItem_a2.x[0] <== lagrange0.out[2];
    calItem_a2.x[1] <== lagrange1.out[2];
    calItem_a2.x[2] <== lagrange2.out[2];
    calItem_a2.y[0] <== pointA[1];
    calItem_a2.y[1] <== point[0][1];
    calItem_a2.y[2] <== point[1][1];

    // a1
    component calItem_a1 = CalItem();
    calItem_a1.x[0] <== lagrange0.out[1];
    calItem_a1.x[1] <== lagrange1.out[1];
    calItem_a1.x[2] <== lagrange2.out[1];
    calItem_a1.y[0] <== pointA[1];
    calItem_a1.y[1] <== point[0][1];
    calItem_a1.y[2] <== point[1][1];

    // sharingKey
    component calItem_a0 = CalItem();
    calItem_a0.x[0] <== lagrange0.out[0];
    calItem_a0.x[1] <== lagrange1.out[0];
    calItem_a0.x[2] <== lagrange2.out[0];
    calItem_a0.y[0] <== pointA[1];
    calItem_a0.y[1] <== point[0][1];
    calItem_a0.y[2] <== point[1][1];

    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== calItem_a2.out;
    poseidon.inputs[1] <== calItem_a1.out;
    poseidon.inputs[2] <== calItem_a0.out;

    nullifier <== poseidon.out;
}

component main { public [ point, sig ] } = ZkMultiSign(10);
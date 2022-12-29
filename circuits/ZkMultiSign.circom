pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";
include "Lagrange.circom";
include "VerifyPoint.circom";

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
template ZkMultiSign() {
    signal input enabled;

    // point A
    signal input pointA[2];
    // point B
    signal input pubKeyB[2];
    signal input pointB[2];
    signal input sigB[3];
    // point C
    signal input pubKeyC[2];
    signal input pointC[2];
    signal input sigC[3];
    
    signal output nullifier;
    
    // verify point B
    component verifyPointB = VerifyPoint();
    verifyPointB.enabled <== enabled;
    verifyPointB.Ax <== pubKeyB[0];
    verifyPointB.Ay <== pubKeyB[1];
    verifyPointB.S <== sigB[0];
    verifyPointB.R8x <== sigB[1];
    verifyPointB.R8y <== sigB[2];
    verifyPointB.x <== pointB[0];
    verifyPointB.y <== pointB[1];

    // verify point C
    component verifyPointC = VerifyPoint();
    verifyPointC.enabled <== enabled;
    verifyPointC.Ax <== pubKeyC[0];
    verifyPointC.Ay <== pubKeyC[1];
    verifyPointC.S <== sigC[0];
    verifyPointC.R8x <== sigC[1];
    verifyPointC.R8y <== sigC[2];
    verifyPointC.x <== pointC[0];
    verifyPointC.y <== pointC[1];

    component lagrange0 = Lagrange_3();
    lagrange0.x0 <== pointA[0];
    lagrange0.x1 <== pointB[0];
    lagrange0.x2 <== pointC[0];

    component lagrange1 = Lagrange_3();
    lagrange1.x0 <== pointB[0];
    lagrange1.x1 <== pointA[0];
    lagrange1.x2 <== pointC[0];

    component lagrange2 = Lagrange_3();
    lagrange2.x0 <== pointC[0];
    lagrange2.x1 <== pointA[0];
    lagrange2.x2 <== pointB[0];

    // a2
    component calItem_a2 = CalItem();
    calItem_a2.x[0] <== lagrange0.out[2];
    calItem_a2.x[1] <== lagrange1.out[2];
    calItem_a2.x[2] <== lagrange2.out[2];
    calItem_a2.y[0] <== pointA[1];
    calItem_a2.y[1] <== pointB[1];
    calItem_a2.y[2] <== pointC[1];

    // a1
    component calItem_a1 = CalItem();
    calItem_a1.x[0] <== lagrange0.out[1];
    calItem_a1.x[1] <== lagrange1.out[1];
    calItem_a1.x[2] <== lagrange2.out[1];
    calItem_a1.y[0] <== pointA[1];
    calItem_a1.y[1] <== pointB[1];
    calItem_a1.y[2] <== pointC[1];

    // sharingKey
    component calItem_a0 = CalItem();
    calItem_a0.x[0] <== lagrange0.out[0];
    calItem_a0.x[1] <== lagrange1.out[0];
    calItem_a0.x[2] <== lagrange2.out[0];
    calItem_a0.y[0] <== pointA[1];
    calItem_a0.y[1] <== pointB[1];
    calItem_a0.y[2] <== pointC[1];

    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== calItem_a2.out;
    poseidon.inputs[1] <== calItem_a1.out;
    poseidon.inputs[2] <== calItem_a0.out;

    nullifier <== poseidon.out;
}

component main = ZkMultiSign();
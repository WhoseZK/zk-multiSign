pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/poseidon.circom";

// polynominal function to power of 3 
template Lagrange_3() {

    signal input x0;
    signal input x1;
    signal input x2;

    signal output out[3];

    signal med1;
    signal med2;
    signal med3;
    signal med4;
    signal med5;

    med1 <== x0 * x0;
    med2 <== x1 * x2;
    med3 <== x1 + x2;
    med4 <== med3 * x0;
    med5 <== med1 - med4 + med2;
    
    // sharing
    out[2] <-- med2 / med5;
    out[0] * med5 === med2;

    // a1
    out[1] <-- -1 * med3 / med5;
    out[1] * med3 === med5 * -1; 

    // a0
    out[0] <-- 1 / med5;
    out[0] * med5 === 1;
}

template CalItem() {

    signal input x[3];
    signal input y;

    signal output out;

    signal med0;
    signal med1;
    signal med2;

    med0 <== x[0] * y0;
    med1 <== x[1] * y1;
    med2 <== x[2] * y2;

    out <== med0 + med1 + med2;
}

// polynominal function to the power of 3
template ZkMultiSign() {
    
    signal input x0;
    signal input y0;
    signal input x1;
    signal input y1;
    signal input x2;
    signal input y2;
    
    signal output sharingKey;
    signal output ploynominalItems;
    
    component lagrange0 = Lagrange_3();
    lagrange0.x0 <== x0;
    lagrange0.x1 <== x1;
    lagrange0.x2 <== x2;

    component lagrange1 = Lagrange_3();
    lagrange1.x0 <== x1;
    lagrange1.x1 <== x0;
    lagrange1.x2 <== x2;

    component lagrange2 = Lagrange_3();
    lagrange2.x0 <== x2;
    lagrange2.x1 <== x0;
    lagrange2.x2 <== x1;

    component calItem_a0 = CalItem();
    calItem_a0.x[0] <== lagrange0.out[0];
    calItem_a0.x[1] <== lagrange1.out[0];
    calItem_a0.x[2] <== lagrange2.out[0];

    component calItem_a1 = CalItem();
    calItem_a1.x[0] <== lagrange0.out[1];
    calItem_a1.x[1] <== lagrange1.out[1];
    calItem_a1.x[2] <== lagrange2.out[1];

    component calItem_a2 = CalItem();
    calItem_a2.x[0] <== lagrange0.out[2];
    calItem_a2.x[1] <== lagrange1.out[2];
    calItem_a2.x[2] <== lagrange2.out[2];

    component poseidon = Poseidon();
    poseidon.x1 <== calItem_a0.out;
    poseidon.x2 <== calItem_a1.out;

    ploynominalItems <== poseidon.out;
    sharingKey <== calItem_a2;
}

component main = ZkMultiSign();
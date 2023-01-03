pragma circom 2.0.0;

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
    out[0] <-- med2 / med5;
    out[0] * med5 === med2;

    // a1
    out[1] <-- -1 * med3 / med5;
    out[1] * med5 === -1 * med3; 

    // a2
    out[2] <-- 1 / med5;
    out[2] * med5 === 1;
}
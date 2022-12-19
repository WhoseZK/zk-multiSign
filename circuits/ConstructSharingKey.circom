pragma circom 2.0.0;

// polynominal function to power of 3 
template Larange_3() {

    signal input x0;
    signal input x1;
    signal input x2;

    signal output out[3];

    var divident[5];
    divident[0] === x0 * x0;
    divident[1] === x1 + x2;
    divident[2] === divident[1] * x0;
    divident[3] === x1 * x2;

    divident[4] === divident[0] - divident[2];
    divident[4] === divident[4] + divident[3];

    out[0] <== 1 / divident[4];
    out[1] <== -1 / divident[1];
    out[2] <== divident[3];
}


// n : polynominal function to the power of n
template ZkMultiSign(n) {
    

    
}

component main = ZkMultiSign(3);
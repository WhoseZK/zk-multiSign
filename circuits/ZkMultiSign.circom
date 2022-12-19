pragma circom 2.0.0;

// polynominal function to power of 3 
template Lagrange_3() {

    signal input x0;
    signal input x1;
    signal input x2;

    signal output out;

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
    
    out <-- med2 / med5;
    out * med5 === med2;
}

// polynominal function to the power of 3
template ZkMultiSign() {
    
    signal input x0;
    signal input y0;
    signal input x1;
    signal input y1;
    signal input x2;
    signal input y2;

    signal med0;
    signal med1;
    signal med2;
    
    signal output sharingKey;
    
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

    med0 <== lagrange0.out * y0;
    med1 <== lagrange1.out * y1;
    med2 <== lagrange2.out * y2;

    sharingKey <== med0 + med1 + med2;
}
component main = ZkMultiSign();
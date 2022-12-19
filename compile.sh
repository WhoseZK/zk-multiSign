#!/bin/bash

algo=$1
version=$2

cd circuits

# rebuild the r1cs and zkey and verification key
circom ./zk-kyc.circom --r1cs --wasm -o ./compile
mv ./compile/zk-kyc_js/zk-kyc.wasm ../hardhat/statics
rm -R ./compile/zk-kyc_js
snarkjs ${algo} setup ./compile/zk-kyc.r1cs ./compile/trust_setup/pot${version}_final.ptau ./compile/zkkyc_final.zkey
cp ./compile/zkkyc_final.zkey ../hardhat/statics
snarkjs zkey export verificationkey ./compile/zkkyc_final.zkey ./compile/verification/verification_key.json

# export solidity verfier
snarkjs zkey export solidityverifier ./compile/zkkyc_final.zkey ../hardhat/contracts/libraries/Verifier.sol
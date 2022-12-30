#!/bin/bash

algo=$1
version=$2
name=ZkMultiSign

cd circuits

# rebuild the r1cs and zkey and verification key
circom ./${name}.circom --r1cs --wasm -o ./compile
mv ./compile/${name}_js/${name}.wasm ../hardhat/statics
rm -R ./compile/${name}_js
snarkjs ${algo} setup ./compile/${name}.r1cs ./compile/trust_setup/pot${version}_final.ptau ./compile/${name}.zkey
cp ./compile/${name}.zkey ../hardhat/statics
cp ../hardhat/statics/${name}.zkey ../frontend/public/zkp
cp ../hardhat/statics/${name}.wasm ../frontend/public/zkp

# export solidity verfier
snarkjs zkey export solidityverifier ./compile/${name}.zkey ../hardhat/contracts/libraries/${name}Verifier.sol
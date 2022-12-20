const { ZqField } = require("ffjavascript");
const { groth16 } = require('snarkjs');

// Creates the finite field
const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fq = new ZqField(SNARK_FIELD_SIZE);

const generatePoints = async function(n) {

    // a2 x^2 + a1 x + sharingKey
    const sharingKey = Fq.random();
    const a1 = Fq.random();
    const a2 = Fq.random();

    const points = [];

    for(let i=0;i<n;i++) {

        const x = Fq.random();
        const y = a2.mul(x).mul(x).add(a1.mul(x)).add(sharingKey);
        
        points.push(x, y);
    }

    return {
        sharingKey: sharingKey,
        points: points
    }
} 

const generateProof = async function(point0, point1, point2) {

    const input = {x0: point0.x, y0: point0.y, x1: point1.x, y1: point1.y, x2: point2.x, y2: point2.y}
    const result = await groth16.fullProve(input, 
        "./statics/zk-kyc.wasm", "./statics/zkkyc_final.zkey")

    return {
        "public": result.publicSignals,
        "proof": packToSolidityProof(result.proof)
    }
}

// transform to solidity proof format
function packToSolidityProof(proof) {
    return [
        proof.pi_a[0],
        proof.pi_a[1],
        proof.pi_b[0][1],
        proof.pi_b[0][0],
        proof.pi_b[1][1],
        proof.pi_b[1][0],
        proof.pi_c[0],
        proof.pi_c[1]
    ];
}


module.exports = { Fq, generatePoints, generateProof }


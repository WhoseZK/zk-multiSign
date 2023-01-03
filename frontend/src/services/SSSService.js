import { ZqField } from "ffjavascript";
import { poseidon } from "circomlibjs";

// Creates the finite field
const SNARK_FIELD_SIZE = BigInt(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fq = new ZqField(SNARK_FIELD_SIZE);

const generatePoints = async (n) => {

    // a2 x^2 + a1 x + sharingKey
    const sharingKey = Fq.random();
    const a1 = Fq.random();
    const a2 = Fq.random();

    const points = [];

    for (let i = 0; i < n; i++) {
        const x = Fq.random();
        const y = Fq.add(
            Fq.mul(Fq.mul(a2, x), x),
            Fq.add(Fq.mul(a1, x), sharingKey)
        );

        points.push({ x, y });
    }

    return {
        sharingKeys: poseidon([a2, a1, sharingKey]).toString(),
        points: points,
    };
};

export { Fq, generatePoints }
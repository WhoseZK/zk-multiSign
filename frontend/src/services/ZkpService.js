const { groth16 } = require("snarkjs");
const { poseidon } = require("circomlibjs");

const fulfillSibling = (siblings) => {
  // depth of smt : 10
  const length = 10 - siblings.length;
  for (let i = 0; i < length; i++) {
    siblings.push(BigInt(0).toString());
  }
}

const generateInclusionOfMemberProof = async (
  user, sig, zkey
) => {
  fulfillSibling(user.siblings);

  const input = {
    pubKey: user.keyPair[0],
    point: user.keyPair[0],
    sig: [sig.S, sig.R8[0], sig.R8[1]],
    root: user.root,
    key: user.index,
    siblings: user.siblings
  };

  const result = await groth16.fullProve(
    input, zkey[0], zkey[1]
  );

  return {
    publicSig: result.publicSignals,
    proof: packToSolidityProof(result.proof),
  };
};

const generateUpdateMemberProof = async (
  user, newPubKey, sig, zkey
) => {
  fulfillSibling(user.siblings);

  const input = {
    oldRoot: user.root,
    siblings: user.siblings,
    keyOfTree: user.index,
    oldPubKey: user.keyPair[0],
    newValue: poseidon(newPubKey),
    sig: [sig.S, sig.R8[0], sig.R8[1]],
  };

  const result = await groth16.fullProve(
    input, zkey[0], zkey[1]
  );

  return {
    publicSig: result.publicSignals,
    proof: packToSolidityProof(result.proof),
  };
};

const generateMultiSignProof = async (
  userA, userB, userC, zkey
) => {
  fulfillSibling(userB.siblings);
  fulfillSibling(userC.siblings);
  const input = {
    root: userA.root,
    pointA: userA.point,
    pubKey: [userB.keyPair[0], userC.keyPair[0]],
    point: [userB.point, userC.point],
    sig: [[userB.sig.S, userB.sig.R8[0], userB.sig.R8[1]], [userC.sig.S, userC.sig.R8[0], userC.sig.R8[1]]],
    key: [userB.index, userC.index],
    siblings: [userB.siblings, userC.siblings]
  };
  const result = await groth16.fullProve(
    input, zkey[0], zkey[1]
  );

  return {
    publicSig: result.publicSignals,
    proof: packToSolidityProof(result.proof),
  };
};

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
    proof.pi_c[1],
  ];
}

module.exports = {
  generateMultiSignProof,
  generateUpdateMemberProof,
  generateInclusionOfMemberProof
};

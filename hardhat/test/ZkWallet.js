const { expect } = require("chai");
const { run, ethers } = require("hardhat");
const {
  generatePoints,
  generateMultiSignProof,
  generateUpdateMemberProof,
  generateInclusionOfMemberProof
} = require("./Utils");
const { genPrivKey } = require("maci-crypto");
const { eddsa, poseidon, smt } = require("circomlib");

describe("ZkWallet", function () {
  let owner;

  let zkWallet;
  let erc20;
  let sssResult;
  let destination;

  let tree;

  let prvA;
  let prvB;
  let prvC;

  let mockProof;
  let mockPublic;

  const TRANSFER_AMOUNT = 100000;

  before(async () => {
    // create private keys
    prvA = genPrivKey().toString();
    prvB = genPrivKey().toString();
    prvC = genPrivKey().toString();

    // create Sparse Merkle Tree(SMT)
    tree = await smt.newMemEmptyTrie();
    await tree.insert(0, eddsa.prv2pub(prvA)[0]);
    await tree.insert(1, eddsa.prv2pub(prvB)[0]);
    await tree.insert(2, eddsa.prv2pub(prvC)[0]);

    // deploy contracts
    const contracts = await run("deploy", { merkleRoot: tree.root.toString() });
    zkWallet = contracts.zkWallet;
    erc20 = contracts.erc20;

    owner = (await ethers.getSigner()).address; // for token transfer
  });

  describe("ZkWallet", () => {
    it("Update member's pubKey", async () => {

      // new A key
      const newPrv = genPrivKey().toString();
      const newPub = eddsa.prv2pub(newPrv);
      const sig = eddsa.signMiMC(prvA, newPub[0]);

      // A index is 0
      const res = await tree.update(0, newPub[0]);

      const { public, proof } = await generateUpdateMemberProof(
        res.oldRoot,
        res.siblings,
        res.oldKey,
        eddsa.prv2pub(prvA),
        newPub,
        sig
      );

      const tx = await zkWallet.updateRoot(public, proof);

      await expect(tx).to.emit(zkWallet, "UpdateRoot")
        .withArgs(res.oldRoot, res.newRoot);
    });

    it("Raise the transcation from members", async () => {
      
      // B raise transaction
      const pubKey = eddsa.prv2pub(prvB);
      const msg = poseidon(pubKey);
      const sig = eddsa.signMiMC(prvB, msg);
      const res = await tree.find(1);
      
      const { public, proof } = await generateInclusionOfMemberProof(
        pubKey,
        sig,
        tree.root,
        1,
        res.siblings
      );

      // fixed the transaction detail
      const signers = await ethers.getSigners();
      destination = signers[1].address;
      const txnAmt = TRANSFER_AMOUNT;

      // create the point and sharingkeys to provide to each participant
      sssResult = await generatePoints(5);
      const sharingKeys = sssResult.sharingKeys;

      // raise the transaction for multiSign
      const tx = await zkWallet.raiseTransaction(
        sharingKeys,
        destination,
        erc20.address,
        txnAmt,
        public,
        proof
      );

      await expect(tx).to.emit(zkWallet, "NewTransaction")
        .withArgs(([pubKey[0], pubKey[1]]), sharingKeys, destination, erc20.address, txnAmt);
    });

    it("Participant provide their key(point) to generate proof", async () => {
      // assume the points have already been provided to every participant
      const points = sssResult.points;

      // participant B is using point[1] to generate signature
      const msgB = poseidon([points[1].x, points[1].y]);
      const sigB = eddsa.signMiMC(prvB, msgB);
      const resB = await tree.find(1);

      // participant C is using point[2] to generate signature
      const msgC = poseidon([points[2].x, points[2].y]);
      const sigC = eddsa.signMiMC(prvC, msgC);
      const resC = await tree.find(2);

      // B and C provide their points and signature to A, A generate proof
      const { public, proof } = await generateMultiSignProof(
        tree.root,
        points[0],
        points[1],
        points[2],
        eddsa.prv2pub(prvB),
        sigB,
        1,
        resB.siblings,
        eddsa.prv2pub(prvC),
        sigC,
        2,
        resC.siblings
      );

      mockProof = proof;
      mockPublic = public;
      
      expect(public[0]).to.equal(sssResult.sharingKeys);
    });

    it("Execute transaction by txn holder", async () => {
      // choose one for testing

      // transfer eth (local will show error)
      // await expect(() => zkWallet.transferToken(
      //   ethers.constants.AddressZero,
      //   public,
      //   proof
      // )).to.changeEtherBalances([owner, destination], [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]);

      // transfer erc20
      await expect(() =>
        zkWallet.transferToken(mockPublic, mockProof)
      ).to.changeTokenBalance(erc20, destination, TRANSFER_AMOUNT);
    });

    it("Execute the same txn again", async () => {
      // since repeat transaction
      await expect(zkWallet.transferToken(mockPublic, mockProof)).to.be
        .reverted;
    });

  });
});

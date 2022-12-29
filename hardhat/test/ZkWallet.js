const { expect } = require("chai");
const { run, ethers } = require("hardhat");
const { generatePoints, generateProof } = require("./Utils");
const {Keypair} = require("maci-domainobjs");
const {genPrivKey} = require("maci-crypto");
const {eddsa, poseidon} = require("circomlib");

// TODO finish the test case
describe("ZkWallet", function () {
  
  let owner;
  
  let zkWallet;
  let erc20;
  let sssResult; 
  let destination;

  let proof;
  let public;

  const TRANSFER_AMOUNT = 100000;

  before(async () => {
    const contracts = await run("deploy");
    zkWallet = contracts.zkWallet;
    erc20 = contracts.erc20;

    owner = (await ethers.getSigner()).address; // for token transfer
  });

  describe("ZkWallet", () => {

    it("Raise the transcation from owner", async () => {
        
        // create the point and sharingkeys
        sssResult = await generatePoints(5);
        const sharingKeys = sssResult.sharingKeys;

        // fixed the transaction detail
        const signers = await ethers.getSigners()
        destination = signers[1].address
        const txnAmt = TRANSFER_AMOUNT
        
        // raise the transaction for multiSign
        const result = await zkWallet.raiseTransaction(sharingKeys, destination, txnAmt)
        
        await expect(result).to.emit(zkWallet, "TransactionDetail").withArgs(sharingKeys, destination, txnAmt);
    })

    it("Participant provide their key(point) to generate proof", async () => {

      // assume the points have already been provided to every participant 
      const points = sssResult.points;

      // participant B is using point[1] to generate signature
      const prvB = genPrivKey().toString();
      const msgB = poseidon([points[1].x, points[1].y]);
      const sigB = eddsa.signMiMC(prvB, msgB);

      // participant C is using point[2] to generate signature
      const prvC = genPrivKey().toString();
      const msgC = poseidon([points[2].x, points[2].y]);
      const sigC = eddsa.signMiMC(prvC, msgC);

      // B and C provide their points and signature to A, A generate proof
      const result = await generateProof(
        points[0],
        points[1], 
        points[2],
        eddsa.prv2pub(prvB),
        sigB,
        eddsa.prv2pub(prvC),
        sigC
      );

      proof = result.proof;
      public = result.public;
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
      await expect(() => zkWallet.transferToken(
        erc20.address,
        public,
        proof
      )).to.changeTokenBalance(erc20, destination, TRANSFER_AMOUNT);
    });

    it("Execute the same txn again", async() => {
      
      // since repeat transaction
      await expect(zkWallet.transferToken(
        erc20.address,
        public,
        proof
      )).to.be.reverted;
    })
  });
});

const { expect } = require("chai");
const { run, ethers } = require("hardhat");
const { generatePoints, generateProof } = require("./Utils");
const {Keypair} = require("maci-domainobjs");
const {eddsa, poseidon} = require("circomlib");

// TODO finish the test case
describe("ZkWallet", function () {
  let zkWallet;
  let erc20;
  let points;
  const TRANSFER_AMOUNT = 100000;

  before(async () => {
    const result = await generatePoints(5);
    points = result.points;
    const nullifier = result.nullifier;
    
    //const contracts = await run("deploy", { sharingKey: sharingKey, hashItem: hashItem });
    //zkWallet = contracts.zkWallet;
    //erc20 = contracts.erc20;
  });

  describe("ZkWallet", () => {
    it("Generate proof for sharingKey", async () => {
      // owner is default signer
      // using destination account to test recieving tokens instead
      const [owner, destination] = await ethers.getSigners();
      const keyPairB = new Keypair();
      const msgB = poseidon([points[1].x, points[1].y]);
      const sigB = eddsa.signMiMC(keyPairB.privKey.rawPrivKey.toString(), msgB);
      const keyPairC = new Keypair();
      const msgC = poseidon([points[2].x, points[2].y]);
      const sigC = eddsa.signMiMC(keyPairC.privKey.rawPrivKey.toString(), msgC);
      const { public, proof } = await generateProof(
        points[0],
        points[1],
        points[2],
        keyPairB.pubKey.asCircuitInputs(),
        sigB,
        keyPairC.pubKey.asCircuitInputs(),
        sigC
      );
      
      // // transfer eth
      // const zeroAddress = ethers.constants.AddressZero;
      // const beforeTx = await destination.getBalance();
      // await zkWallet.transferToken(
      //   zeroAddress,
      //   destination.address,
      //   TRANSFER_AMOUNT,
      //   public,
      //   proof,
      //   { value: ethers.BigNumber.from(TRANSFER_AMOUNT) }
      // );
      // const afterTx = await destination.getBalance();
      // expect(Number(afterTx.sub(beforeTx))).to.equal(TRANSFER_AMOUNT);
    
      // // transfer erc20
      // await zkWallet.transferToken(
      //   erc20.address,
      //   destination.address,
      //   TRANSFER_AMOUNT,
      //   public,
      //   proof
      // );
      // expect(Number(await erc20.balanceOf(destination.address))).to.equal(TRANSFER_AMOUNT);
    });

    it("If failed in proof", async () => {});

    it("Reset the sharing Key", async () => {});

    it("Reset the sharing Key but failed in proof", async () => {});
  });
});

const { expect } = require("chai");
const { run, ethers } = require("hardhat");
const { generatePoints, generateProof } = require("./Utils");

// TODO finish the test case
describe("ZkWallet", function () {
  let zkWallet;
  let erc20;
  let points;
  let sharingKey;

  before(async () => {
    const result = await generatePoints(5);
    points = result.points;
    sharingKey = result.sharingKey;
    
    contracts = await run("deploy", { sharingKey: sharingKey.toString() });
    zkWallet = contracts.zkWallet;
    erc20 = contracts.erc20;
  });

  describe("ZkWallet", () => {
    it("Generate proof for sharingKey", async () => {
      // owner is default signer
      // using destination account to test recieving tokens instead
      const [owner, destination] = await ethers.getSigners();
      const { public, proof } = await generateProof(
        points[0],
        points[1],
        points[2]
      );
      
      // transfer eth
      const zeroAddress = ethers.constants.AddressZero;
      const beforeTx = await destination.getBalance();
      await zkWallet.transferToken(
        zeroAddress,
        destination.address,
        100000,
        public,
        proof,
        { value: ethers.BigNumber.from(100000) }
      );
      const afterTx = await destination.getBalance();
      expect(afterTx.sub(beforeTx).toNumber()).to.equal(100000);
    
      // transfer erc20
      await erc20.transfer(zkWallet.address, 100000);
      await zkWallet.transferToken(
        erc20.address,
        destination.address,
        100000,
        public,
        proof
      );
      expect(Number(await erc20.balanceOf(destination.address))).to.equal(100000);
    });

    it("If failed in proof", async () => {});

    it("Reset the sharing Key", async () => {});

    it("Reset the sharing Key but failed in proof", async () => {});
  });
});

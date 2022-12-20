const { expect } = require("chai")
const { run, ethers } = require("hardhat")
const { generatePoints, generateProof } = require("./Utils")

// TODO finish the test case
describe("ZkWallet", function () {

    let zkWallet;
    let points;
    let sharingKey;

    before(async () => {
        const result = await generatePoints(5);
        points = result.points;
        sharingKey = result.sharingKey;
        zkWallet = await run("deploy", { sharingKey: sharingKey })
    })

    describe("ZkWallet", () => {
        
        it("Generate proof for sharingKey", async () => {

            const proof = generateProof(points[0], points[1], points[2])
            const tokenAddress = ""
            const destination = ""

            const transaction = await zkWallet.transferToken(tokenAddress, destination, 100000, sharingKey, proof.proof)
        })

        it("If failed in proof", async () => {})

        it("Reset the sharing Key", async () => {})

        it("Reset the sharing Key but failed in proof", async () => {})
    })
})
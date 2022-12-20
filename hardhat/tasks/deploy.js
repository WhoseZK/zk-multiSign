const { task, types } = require("hardhat/config")

task("deploy", "Deploy ZKWallet contract")
    .addParam("sharingKey", "Sharing Key in group", undefined, types.BigInt)
    .addOptionalParam("verifier", "Verifier contract address", undefined, types.address)
    .setAction(async ({ depth, zero, verifier }, { ethers, _ }) => {
        if (!verifier) {

            const Verifier = await ethers.getContractFactory("Verifier");
            const _verifier = await Verifier.deploy();

            await _verifier.deployed();
            verifier = _verifier.address;

            console.log(`deploy verifier to testnet in ${_verifier.address}`);
        }

        // build zkWallet
        const ZkWallet = await ethers.getContractFactory("ZKWallet");
        const zkWallet = await ZkWallet.deploy(sharingKey, verifier);
      
        await zkWallet.deployed();
      
        console.log(`deploy zkWallet to testnet in ${zkWallet.address}`);

        return zkWallet
    })
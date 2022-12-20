const { task, types } = require("hardhat/config")

task("deploy", "Deploy ZKWallet contract")
    .addParam("sharingKey", "Sharing Key in group", undefined, types.string)
    .addOptionalParam("verifier", "Verifier contract address", undefined, types.address)
    .setAction(async ({ sharingKey, verifier }, { ethers, _ }) => {
        if (!verifier) {

            const Verifier = await ethers.getContractFactory("Verifier");
            const _verifier = await Verifier.deploy();

            await _verifier.deployed();
            verifier = _verifier.address;

            console.log("Sharing Key:", sharingKey);
            console.log(`deploy verifier to testnet in ${_verifier.address}`);
        }

        // build zkWallet
        const ZkWallet = await ethers.getContractFactory("ZkWallet");
        const zkWallet = await ZkWallet.deploy(BigInt(sharingKey), verifier);

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const erc20 = await MockERC20.deploy();
      
        await zkWallet.deployed();
      
        console.log(`deploy zkWallet to testnet in ${zkWallet.address}`);

        return {
            zkWallet,
            erc20
        };
    })
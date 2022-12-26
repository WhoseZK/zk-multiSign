const { task, types } = require("hardhat/config");

task("deploy", "Deploy ZKWallet contract")
    .addParam("sharingKey", "Sharing Key in group", undefined, types.string)
    .addParam("hashItem", "Hash Item in group", undefined, types.string)
    .addOptionalParam("verifier", "Verifier contract address", undefined, types.string)
    .setAction(async ({ sharingKey, hashItem, verifier }, { ethers, _ }) => {
        if (!verifier) {

            const Verifier = await ethers.getContractFactory("Verifier");
            const _verifier = await Verifier.deploy();

            await _verifier.deployed();
            verifier = _verifier.address;

            console.log(`deploy verifier to testnet in ${_verifier.address}`);
        }

        // build zkWallet
        const ZkWallet = await ethers.getContractFactory("ZkWallet");
        const zkWallet = await ZkWallet.deploy(sharingKey, hashItem, verifier);

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const erc20 = await MockERC20.deploy(zkWallet.address);
      
        await zkWallet.deployed();
        await erc20.deployed();
      
        console.log(`deploy zkWallet to testnet in ${zkWallet.address}`);
        console.log(`deploy erc20 to testnet in ${erc20.address}`);

        return {
            zkWallet,
            erc20
        };
    });
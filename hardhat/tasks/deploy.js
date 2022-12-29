const { task, types } = require("hardhat/config");

task("deploy", "Deploy ZKWallet contract")
    .addOptionalParam("verifier", "Verifier contract address", undefined, types.string)
    .setAction(async ({ verifier }, { ethers, _ }) => {
        var _verifier = null;
        if (!verifier) {

            const Verifier = await ethers.getContractFactory("Verifier");
            _verifier = await Verifier.deploy();

            await _verifier.deployed();
            verifier = _verifier.address;

            console.log(`deploy verifier to testnet in ${_verifier.address}`);
        }

        // build zkWallet
        const ZkWallet = await ethers.getContractFactory("ZkWallet");
        const zkWallet = await ZkWallet.deploy(verifier);

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const erc20 = await MockERC20.deploy(zkWallet.address);
      
        await zkWallet.deployed();
        await erc20.deployed();
      
        console.log(`deploy zkWallet to testnet in ${zkWallet.address}`);
        console.log(`deploy erc20 to testnet in ${erc20.address}`);

        return {
            _verifier,
            zkWallet,
            erc20
        };
    });
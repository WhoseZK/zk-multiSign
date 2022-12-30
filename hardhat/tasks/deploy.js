const { task, types } = require("hardhat/config");

task("deploy", "Deploy ZKWallet contract")
    .addOptionalParam("verifier", "Verifier contract address", undefined, types.string)
    .setAction(async ({ merkleRoot, verifier }, { ethers, _ }) => {
        let multiSignVerifier;
        let updateMemberVerifier;
        let inclusionOfMemberVerifier;
        if (!verifier) {

            const MultiSignVerifier = await ethers.getContractFactory("MultiSignVerifier");
            const _multiSignVerifier = await MultiSignVerifier.deploy();
            await _multiSignVerifier.deployed();
            multiSignVerifier = _multiSignVerifier.address;

            const UpdateMemberVerifier = await ethers.getContractFactory("UpdateMemberVerifier");
            const _updateMemberVerifier = await UpdateMemberVerifier.deploy();
            await _updateMemberVerifier.deployed();
            updateMemberVerifier = _updateMemberVerifier.address;

            const InclusionOfMemberVerifier = await ethers.getContractFactory("InclusionOfMemberVerifier");
            const _inclusionOfMemberVerifier = await InclusionOfMemberVerifier.deploy();
            await _inclusionOfMemberVerifier.deployed();
            inclusionOfMemberVerifier = _inclusionOfMemberVerifier.address;

            console.log(`deploy multisig verifier to testnet in ${multiSignVerifier}`);
            console.log(`deploy update member verifier to testnet in ${updateMemberVerifier}`);
            console.log(`deploy inclusion member verifier to testnet in ${inclusionOfMemberVerifier}`);
        }

        // build zkWallet
        const ZkWallet = await ethers.getContractFactory("ZkWallet");
        const zkWallet = await ZkWallet.deploy(multiSignVerifier, updateMemberVerifier, inclusionOfMemberVerifier, merkleRoot);

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
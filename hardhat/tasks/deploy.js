const { task, types } = require("hardhat/config");

task("deploy", "Deploy ZKWallet contract")
    .addParam("merkleRoot", "Merkle Root of SMT Tree", undefined, types.string)
    .addParam("duration", "MultiSign Duration", 600, types.int)
    .addOptionalParam("multiSignVerifier", "multiSignVerifier contract address", undefined, types.string)
    .addOptionalParam("updateMemberVerifier", "updateMemberVerifier contract address", undefined, types.string)
    .addOptionalParam("inclusionOfMemberVerifier", "inclusionOfMemberVerifier contract address", undefined, types.string)
    .setAction(async ({ merkleRoot, duration, multiSignVerifier, updateMemberVerifier, inclusionOfMemberVerifier }, { ethers, _ }) => {
        if (!multiSignVerifier) {
            const MultiSignVerifier = await ethers.getContractFactory("MultiSignVerifier");
            const _multiSignVerifier = await MultiSignVerifier.deploy();
            await _multiSignVerifier.deployed();
            multiSignVerifier = _multiSignVerifier.address;
            console.log(`deploy multisig verifier to testnet in ${multiSignVerifier}`);
        }
        
        if (!updateMemberVerifier) {
            const UpdateMemberVerifier = await ethers.getContractFactory("UpdateMemberVerifier");
            const _updateMemberVerifier = await UpdateMemberVerifier.deploy();
            await _updateMemberVerifier.deployed();
            updateMemberVerifier = _updateMemberVerifier.address;
            console.log(`deploy update member verifier to testnet in ${updateMemberVerifier}`);
        }
        
        if(!inclusionOfMemberVerifier) {
            const InclusionOfMemberVerifier = await ethers.getContractFactory("InclusionOfMemberVerifier");
            const _inclusionOfMemberVerifier = await InclusionOfMemberVerifier.deploy();
            await _inclusionOfMemberVerifier.deployed();
            inclusionOfMemberVerifier = _inclusionOfMemberVerifier.address;
            console.log(`deploy inclusion member verifier to testnet in ${inclusionOfMemberVerifier}`);
        }

        // build zkWallet
        const ZkWallet = await ethers.getContractFactory("ZkWallet");
        const zkWallet = await ZkWallet.deploy(multiSignVerifier, updateMemberVerifier, inclusionOfMemberVerifier, duration, merkleRoot);

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
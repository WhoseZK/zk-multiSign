import { ethers } from "ethers";

const ABI = [
    "constructor(IVerifier _zkMultiSignVerifier, IVerifier _memberVerifier, IVerifier _inclusionVerifier, uint64 _duration, uint256 _memberRoot)",
    "function raiseTransaction(uint256 _sharingKeys, address _destination, uint256 _amount, uint256[] calldata publicSignals, uint256[8] calldata proof) external",
    "function updateRoot(uint256[] calldata publicSignals, uint256[8] calldata) external",
    "function transferToken(address tokenAddress, uint256[] calldata publicSignals, uint256[8] calldata proof) external"
];

const ERC20_ABI = [
    "constructor(address zkWallet)",
    "function balanceOf(address account) public view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
];

const deployZkWallet = async (provider, memberRoot) => {
    if (localStorage.getItem("zkWallet")) {
        return new ethers.Contract(
            localStorage.getItem("zkWallet"),
            ABI,
            provider.getSigner()
        )
    }

    const INCLUSION_VERIFIER = process.env.inclusionOfMemberVerifier;
    const UPDATE_VERIFIER = process.env.updateMemberTreeVerifier;
    const MULTI_SIGN_VERIFIER = process.env.zkMultiSignVerifier;
    const bytecode = process.env.multiSignByteCode;

    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(ABI, bytecode, signer);
    const contract = await factory.deploy(
        MULTI_SIGN_VERIFIER,
        UPDATE_VERIFIER,
        INCLUSION_VERIFIER,
        600, // default 10 min
        memberRoot
    );
    await contract.deployTransaction.wait();
    localStorage.setItem("zkWallet", contract.address);
    console.log("deploy zk-wallet at address:", contract.address);
    return contract.connect(signer);
};

// send eth & erc20 after the deployment of erc20
const initZkWallet = async (provider, contract, erc20, amount) => {

    const transferAmt = amount ? amount : 1000;
    const signer = provider.getSigner();
    const ZK_WALLET = contract.address;
    let tx = await signer.sendTransaction({
        to: ZK_WALLET,
        value: ethers.utils.parseEther(transferAmt),
    });
    await tx.wait();
    tx = await erc20.transfer(ZK_WALLET, ethers.utils.parseEther(transferAmt));
    await tx.wait();
    return updateBalance(provider, contract, erc20);
};

// deploy erc20
const deployErc20 = async (provider, erc20Address) => {
    if (localStorage.getItem("erc20") || erc20Address) {
        const erc20 = erc20Address ? erc20Address : localStorage.getItem("erc20")
        return new ethers.Contract(erc20, ERC20_ABI, provider.getSigner());
    }

    const bytecode = process.env.erc20ByteCode;
    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(ERC20_ABI, bytecode, signer);

    const erc20 = await factory.deploy(address);
    await erc20.deployTransaction.wait();
    console.log("deploy erc20 at address:", erc20.address);

    localStorage.setItem("erc20", erc20.address);
    return erc20
};

// default setting: transfer ETH
const tranferToken = async (contract) => {
    console.log("Contract Address:", contract.address);
    let txn = await contract.transferToken(
        tokenAddress,
        destination,
        ethers.utils.parseUnits(amount, "ether"),
        publicSignals,
        proof,
        { gasLimit: 2_000_000 }
    );
    console.log(txn);
    txn.wait((confirm = 1)).then(() => {
        return true;
    });
};

// update balance for Wallet, Destination, ZkWallet
const updateBalance = async (provider, contract, erc20, destination) => {

    // wallet amount
    const ZK_WALLET = contract.address;
    const eth_balance = (await provider.getBalance(ZK_WALLET)).toString();
    const erc20_balance = (await erc20.balanceOf(ZK_WALLET)).toString();

    // destination amount
    if (destination) {
        const dEth = (await provider.getBalance(destination)).toString();
        const dErc20 = (await erc20.balanceOf(destination)).toString();
        return {
            eth: eth_balance,
            erc20: erc20_balance,
            dEth: dEth,
            dErc20: dErc20
        }
    }

    return {
        eth: eth_balance,
        erc20: erc20_balance
    }
};


module.exports = { deployZkWallet, initZkWallet, deployErc20, tranferToken, updateBalance }


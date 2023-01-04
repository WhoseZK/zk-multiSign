import { ethers } from "ethers";

const ABI = [
  "constructor(address _zkMultiSignVerifier, address _memberVerifier, address _inclusionVerifier, uint64 _duration, uint256 _memberRoot)",
  "event NewTransaction((uint256 x, uint256 y), uint256 indexed sharingKeys, address destination, address tokenAddress, uint256 amount)",
  "function raiseTransaction(uint256 sharingKeys, address destination, address tokenAddress, uint256 amount, uint256[] calldata publicSignals, uint256[8] calldata proof) external",
  "function updateRoot(uint256[] calldata publicSignals, uint256[8] calldata proof) external",
  "function transferToken(uint256[] calldata publicSignals, uint256[8] calldata proof) external",
];

const ERC20_ABI = [
  "constructor(address zkWallet)",
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];

const deployZkWallet = async (provider, memberRoot) => {
  const signer = provider.getSigner();
  if (localStorage.getItem("zkWallet")) {
    return new ethers.Contract(localStorage.getItem("zkWallet"), ABI, signer);
  }

  const bytecode = process.env.multiSignByteCode;
  const factory = new ethers.ContractFactory(ABI, bytecode, signer);
  const contract = await factory.deploy(
    process.env.zkMultiSignVerifier,
    process.env.updateMemberTreeVerifier,
    process.env.inclusionOfMemberVerifier,
    600, // default 10 min
    memberRoot
  );
  await contract.deployTransaction.wait();
  localStorage.setItem("zkWallet", contract.address);
  console.log("deploy zk-wallet at address:", contract.address);
  return contract.connect(signer);
};

// send eth & erc20 after the deployment of erc20
const initZkWallet = async (provider, zkwallet, amount) => {
  const transferAmt = ethers.utils.parseEther(amount.toString()).toString();
  const signer = provider.getSigner();
  const ZK_WALLET = zkwallet.address;
  let tx = await signer.sendTransaction({
    to: ZK_WALLET,
    value: transferAmt,
  });
  await tx.wait();
  return updateBalance(provider, zkwallet);
};

// deploy erc20
const deployErc20 = async (provider, zkWalletAddress, erc20Address) => {
  if (localStorage.getItem("erc20") || erc20Address) {
    const erc20 = erc20Address ? erc20Address : localStorage.getItem("erc20");
    return new ethers.Contract(erc20, ERC20_ABI, provider.getSigner());
  }

  const bytecode = process.env.mockErc20ByteCode;
  const signer = provider.getSigner();
  const factory = new ethers.ContractFactory(ERC20_ABI, bytecode, signer);
  const erc20 = await factory.deploy(zkWalletAddress);
  await erc20.deployTransaction.wait();
  console.log("deploy erc20 at address:", erc20.address);

  localStorage.setItem("erc20", erc20.address);
  return erc20;
};

const getNewTransactions = async (zkwallet) => {
  const filter = zkwallet.filters.NewTransaction();
  const query = (await zkwallet.queryFilter(filter)).map((query) => {
    return {
      pubKey: [query.args[0].x.toString(), query.args[0].y.toString()],
      sharingKeys: query.args.sharingKeys.toString(),
      destination: query.args.destination,
      tokenAddress: query.args.tokenAddress,
      amount: query.args.amount.toString(),
    };
  });

  return query;
};

// update balance for Wallet, Destination, ZkWallet
const updateBalance = async (provider, zkwallet, erc20, destination) => {
  // wallet amount
  const ZK_WALLET = zkwallet.address;
  const eth_balance = (await provider.getBalance(ZK_WALLET)).toString();
  const erc20_balance = !erc20
    ? 0
    : (await erc20.balanceOf(ZK_WALLET)).toString();

  // destination amount
  if (destination) {
    const dEth = (await provider.getBalance(destination)).toString();
    const dErc20 = (await erc20.balanceOf(destination)).toString();
    return {
      eth: eth_balance,
      erc20: erc20_balance,
      dEth: dEth,
      dErc20: dErc20,
    };
  }

  return {
    eth: eth_balance,
    erc20: erc20_balance,
  };
};

export {
  deployZkWallet,
  initZkWallet,
  deployErc20,
  updateBalance,
  getNewTransactions,
  ABI,
  ERC20_ABI,
};

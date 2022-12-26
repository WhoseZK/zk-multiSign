const hre = require("hardhat");

const PRIVATE_KEY =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

const provider = hre.ethers.providers.getDefaultProvider(
  "http://localhost:8545"
);

const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);

const ZK_WALLET = "0x8464135c8f25da09e49bc8782676a84730c318bc";

const ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
];
const ERC20 = "0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F";

const erc20 = new hre.ethers.Contract(ERC20, ABI, wallet);

const sendErc20 = async () => {
  await erc20.transfer(ZK_WALLET, hre.ethers.BigNumber.from(1000));
};

sendErc20();

const sendEther = async () => {
  await wallet.sendTransaction({
    to: ZK_WALLET,
    value: hre.ethers.utils.parseEther("1000"),
  });
};

//sendEther();
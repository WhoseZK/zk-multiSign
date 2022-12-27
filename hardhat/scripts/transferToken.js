const hre = require("hardhat");

const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const provider = hre.ethers.providers.getDefaultProvider(
  "http://localhost:8545"
);

const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);

const ZK_WALLET = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

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
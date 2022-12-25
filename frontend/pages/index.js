import { ConnectWallet, useAddress, useMetamask } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { generatePoints, generateProof } from "../src/utils/Utils";
import Points from "../src/components/Points";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ABI = [
  "function transferToken(address tokenAddress, address destination, uint256 amount, uint256[2] calldata publicSignals, uint256[8] calldata proof) external payable",
  "function updatePolynominal(uint256[2] calldata publicSignals, uint256[8] calldata proof) external",
];

const ERC20_ABI = [
  process.env.mockErc20Constructor, 
  process.env.mockErc20BalanceOf
];

export default function Home() {
  const { data, error } = useSWR("/api/zkp", fetcher);
  const connect = useMetamask();
  const [provider, setProvider] = useState();
  const address = useAddress();
  const [contract, setContract] = useState();

  // constructor args
  const [sharingKey, setSharingKey] = useState();
  const [hashItem, setHashItem] = useState();
  const [points, setPoints] = useState([]);

  // transfer token args
  const [tokenAddress, setTokenAddress] = useState(
    ethers.constants.AddressZero
  );
  const [destination, setDestination] = useState(address);
  const [amount, setAmount] = useState();
  const [publicSignals, setPublicSignals] = useState([]);
  const [proof, setProof] = useState([]);

  // deploy ERC20 
  const [mockErc20, setMockErc20] = useState();

  // check wallet amount
  const [destinationAmt, setDestinationAmt] = useState("Loading"); 
  const [walletAmt, setWalletAmt] = useState("Loading"); 

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    if (localStorage.getItem("zkWallet")) {
      setContract(new ethers.Contract(localStorage.getItem("zkWallet"), ABI, provider.getSigner()));
      setSharingKey(localStorage.getItem("sharingKey"));
      setHashItem(localStorage.getItem("hashItem"));
      setPoints(JSON.parse(localStorage.getItem("points")));
    }
  }, []);

  const createPoints = async () => {
    let sharingKey, hashItem, points;
    if (localStorage.getItem("sharingKey")) {
      sharingKey = localStorage.getItem("sharingKey");
      hashItem = localStorage.getItem("hashItem");
      points = JSON.parse(localStorage.getItem("points"));
    } else {
      const result = await generatePoints(3);
      sharingKey = result.sharingKey;
      hashItem = result.hashItem;
      points = result.points;
      localStorage.setItem("sharingKey", sharingKey);
      localStorage.setItem("hashItem", hashItem);
      localStorage.setItem("points", JSON.stringify(points));
    }

    setSharingKey(sharingKey);
    setHashItem(hashItem);
    setPoints(points);
  };

  const getZkp = async () => {
    const { publicSignals, proof } = await generateProof(
      points[0],
      points[1],
      points[2],
      data
    );
    setPublicSignals(publicSignals);
    setProof(proof);
    console.log("Public Signals:", publicSignals);
    console.log("Proof:", proof);
  };

  // need to write a script on hardhat to
  // deploy verifier & erc20 first or
  // deploy with zk wallet together within deploy func
  const deployZkWallet = async () => {
    if (localStorage.getItem("zkWallet")) {
      setContract(new ethers.Contract(localStorage.getItem("zkWallet"), ABI, provider.getSigner()));
    } else {
      const VERIFIER_ADDRESS = process.env.NEXT_PUBLIC_VERIFIER_ADDRESS;
      const bytecode = process.env.multiSignByteCode;
      const abi = [process.env.multiSignConstructor];

      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(
        abi,
        bytecode,
        signer
      );
      const contract = await factory.deploy(
        sharingKey,
        hashItem,
        VERIFIER_ADDRESS
      );
      await contract.deployed();
      contract.connect(signer);
      setContract(contract);
      localStorage.setItem("zkWallet", contract.address);
      console.log("deploy zk-wallet at address:", contract.address);
    }
  };

  const deployErc20 = async () => {
    if (localStorage.getItem("mockErc20")) {
      const contract = new ethers.Contract(localStorage.getItem("mockErc20"), ERC20_ABI, provider.getSigner())
      setMockErc20(contract);
      setTokenAddress(contract.address);
      getErc20Balance(address, contract).then(it => setWalletAmt(it));
    } else {
      const bytecode = process.env.mockErc20ByteCode;
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(
        ERC20_ABI,
        bytecode,
        signer
      );

      const contract = await factory.deploy(address);
      await contract.deployed();
      contract.connect(signer);

      console.log("deploy mockerc20 at address:", contract.address);
      localStorage.setItem("mockErc20", contract.address);
      setMockErc20(contract);
      setTokenAddress(contract.address);
      getErc20Balance(address).then(it => setWalletAmt(it));
    }
  }

  // default setting: transfer ETH
  const tranferToken = async () => {
    const msg = {value: ethers.BigNumber.from(amount), gasLimit: 2000_000}

    var txn;
    if (tokenAddress == ethers.constants.AddressZero) {
      txn = await contract.transferToken(
        tokenAddress,
        destination,
        msg.value,
        publicSignals,
        proof, 
        msg
      );
    } else {
      txn = await contract.transferToken(
        tokenAddress,
        destination,
        amount,
        publicSignals,
        proof,
        {
          gasLimit: 2000_000
        }
      );
      console.log(txn);
      txn.wait(confirm = 1).then(() => {
        refreshWalletAmt(true, destination)
      });
    }
  };

  const refreshWalletAmt = async (success, destination) => {
    if (success) {
      getErc20Balance(address).then(it => setWalletAmt(it));
      getErc20Balance(destination).then(it => setDestinationAmt(it));
    } else {
      setWalletAmt("Loading");
      setDestinationAmt("Loading");
    }
  }

  const getErc20Balance = async(address, contract) => {

    const existContract = mockErc20 == null ? contract : mockErc20
    const result = await existContract.balanceOf(address);
    console.log(address, result);
    return parseInt(BigInt(result._hex));
  }
 
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.connect}>
          <ConnectWallet />
          {/* <button className={styles.button} onClick={connect}>Connect</button> */}
        </div>
        <div className={styles.container}>
          <button className={styles.button} onClick={createPoints}>
            Create Points
          </button>
          <label htmlFor="sharingKey">Sharing Key: </label>
          <input
            type="text"
            name="sharingKey"
            value={sharingKey && sharingKey}
            onChange={(event) => setSharingKey(event.target.value)}
            className={styles.input}
            disabled
          />
        </div>
        <div className={styles.container}>
          <label htmlFor="hashItem">Hash Item: </label>
          <input
            type="text"
            name="hashItem"
            value={hashItem && hashItem}
            onChange={(event) => setHashItem(event.target.value)}
            className={styles.input}
            disabled
          />
        </div>

        <Points points={points} />
        <div className={styles.container}>
          <button className={styles.button} onClick={deployZkWallet}>
            Create Zk Wallet
          </button>
        </div>
        <div className={styles.container}>
          <button className={styles.button} onClick={deployErc20}>
            Create Mock Token
          </button>
        </div>
        <div className={styles.container}>
          <button className={styles.button} onClick={getZkp}>
            Get ZKP
          </button>
          <label htmlFor="tokenAddress">Token Address: </label>
          <input
            type="text"
            name="tokenAddress"
            value={tokenAddress}
            className={styles.input}
            onChange={(event) => setTokenAddress(event.target.value)}
          />
          <label htmlFor="destination">Destination: </label>
          <input
            type="text"
            name="destination"
            value={destination}
            className={styles.input}
            onChange={(event) => setDestination(event.target.value)}
          />
          <label htmlFor="amount">Amount: </label>
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={styles.input}
          />
          <button className={styles.button} onClick={tranferToken}>
            Transfer Tokens
          </button>
        </div>

        <div className={styles.container}>
          <h2>Erc20 Transfer Result: </h2>
          <label htmlFor="wallet amount">Current Amount: </label>
          <p>{walletAmt}</p>
          <label htmlFor="destinationAmt">Destination Amount: </label>
          <p>{destinationAmt}</p>
        </div>

      </main>
    </div>
  );
}

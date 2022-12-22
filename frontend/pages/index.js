import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { generatePoints, generateProof } from "../src/utils/Utils";
import Points from "../src/components/Points";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const ABI = [
  "function transferToken(address tokenAddress, address destination, uint256 amount, uint256[2] calldata publicSignals, uint256[8] calldata proof) external payable",
  "function updatePolynominal(uint256[2] calldata publicSignals, uint256[8] calldata proof) external",
];

export default function Home() {
  const { data, error } = useSWR("/api/zkp", fetcher);
  const address = useAddress();
  const [provider, setProvider] = useState();
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

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, provider));
  }, []);

  const createPoints = async () => {
    const { sharingKey, hashItem, points } = await generatePoints(3);
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
  const deploy = async () => {
    const VERIFIER_ADDRESS = "";
    const bytecode = "";
    const abi = ["constructor"];
    const factory = new ethers.ContractFactory(abi, bytecode, provider);
    const contract = await factory.deploy(
      sharingKey,
      hashItem,
      VERIFIER_ADDRESS
    );
    setContract(contract);
  };

  // default setting: transfer ETH
  const tranferToken = async () => {
    await contract.transferToken(tokenAddress, destination, amount, publicSignals, proof);
    console.log("Token Address:", tokenAddress);
    console.log("Destination:", destination);
    console.log("Amount:", amount);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.connect}>
          <ConnectWallet />
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
            className={styles.input}
            disabled
          />
        </div>
        <div className={styles.container}>
          <label htmlFor="hashItem">Hash Item: </label>
          <input
            type="text"
            name="hashItem"
            value={hashItem && sharingKey}
            className={styles.input}
            disabled
          />
        </div>

        <Points points={points} />
        <div className={styles.container}>
          <button className={styles.button} onClick={deploy}>
            Create Zk Wallet
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
      </main>
    </div>
  );
}

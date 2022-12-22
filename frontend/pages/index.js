import { ConnectWallet, useAddress, useMetamask } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { generatePoints, generateProof } from "../src/utils/Utils";
import Point from "../src/components/Point";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const connectWithMetaMask = useMetamask();
  const {data, error} = useSWR("/api/zkp", fetcher);
  // leaf
  const address = useAddress();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [sharingKey, setSharingKey] = useState();
  const [hashItem, setHashItem] = useState();
  const [tokenAddress, setTokenAddress] = useState();
  const [destination, setDestination] = useState();
  const [amount, setAmount] = useState();
  const [points, setPoints] = useState([]);
  const [publicSignals, setPublicSignals] = useState([]);
  const [proof, setProof] = useState([]);
  const CONTRACT_ADDRESS = "";
  const ABI = [
    "function transferToken(address tokenAddress, address destination, uint256 amount, uint256[2] calldata publicSignals, uint256[8] calldata proof) external payable",
    "function updatePolynominal(uint256[2] calldata publicSignals, uint256[8] calldata proof) external",
  ];

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, provider));
  }, [address]);

  const createPoints = async () => {
    const { sharingKey, hashItem, points } = await generatePoints(3);
    setSharingKey(sharingKey);
    setHashItem(hashItem);
    setPoints(points);
  };

  const getZkp = async () => {
    const { publicSignals, proof } = await generateProof(points[2], points[1], points[0], data);
    setPublicSignals(publicSignals);
    setProof(proof);
    console.log("Public Signals:", publicSignals);
    console.log("Proof:", proof);
  };

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

  const tranferToken = async () => {
    await contract.transferToken();
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
            value={sharingKey}
            className={styles.input}
            disabled
          />
        </div>
        <div className={styles.container}>
          <label htmlFor="hashItem">Hash Item: </label>
          <input
            type="text"
            name="hashItem"
            value={hashItem}
            className={styles.input}
            disabled
          />
        </div>
        {points.length != 0 &&
          points.map((point, index) => <Point key={index} point={point} />)}

        <div className={styles.container}>
          <button className={styles.button} onClick={deploy}>
            Create Zk Wallet
          </button>
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
            disabled
          />
          <label htmlFor="destination">Destination: </label>
          <input
            type="text"
            name="destination"
            value={destination}
            className={styles.input}
            onChange={(event) => setDestination(event.target.value)}
            disabled
          />
          <label htmlFor="amount">Amount: </label>
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={styles.input}
            disabled
          />
          <button className={styles.button} onClick={tranferToken}>
            Transfer Tokens
          </button>
        </div>
      </main>
    </div>
  );
}

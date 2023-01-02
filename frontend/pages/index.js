import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { generatePoints, generateProof } from "../src/utils/Utils";
import Points from "../src/components/Points";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ABI = [
  "constructor(uint256 sharingKey, uint256 hashItem, address iVerifier)",
  "function transferToken(address tokenAddress, address destination, uint256 amount, uint256[2] calldata publicSignals, uint256[8] calldata proof) external payable",
  "function updatePolynominal(uint256[2] calldata publicSignals, uint256[8] calldata proof) external",
];

const ERC20_ABI = [
  "constructor(address zkWallet)",
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];

export default function Home() {
  const { data, error } = useSWR("/api/zkp", fetcher);
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
  const [destination, setDestination] = useState();
  const [amount, setAmount] = useState();
  const [publicSignals, setPublicSignals] = useState([]);
  const [proof, setProof] = useState([]);

  // deploy ERC20
  const [mockErc20, setMockErc20] = useState();

  // check wallet amount
  const [destinationAmt, setDestinationAmt] = useState({
    eth: "Loading",
    erc20: "Loading",
  });
  const [walletAmt, setWalletAmt] = useState("Loading");

  const [zkWallet, setZkWallet] = useState({
    eth: "Loading",
    erc20: "Loading",
  });

  useEffect(() => {
    const envInit = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let contract;
      setProvider(provider);
      if (localStorage.getItem("zkWallet")) {
        contract = new ethers.Contract(
          localStorage.getItem("zkWallet"),
          ABI,
          provider.getSigner()
        );
        setContract(contract);
        setSharingKey(localStorage.getItem("sharingKey"));
        setHashItem(localStorage.getItem("hashItem"));
        setPoints(JSON.parse(localStorage.getItem("points")));
      }
      if (localStorage.getItem("mockErc20")) {
        const mockErc20 = new ethers.Contract(
          localStorage.getItem("mockErc20"),
          ERC20_ABI,
          provider.getSigner()
        );
        setMockErc20(mockErc20);
        updateBalance(contract, mockErc20, provider, address);
      }
    };
    envInit();
  }, []);

  useEffect(() => {
    const updateDestination = async () => {
      const eth = (await provider.getBalance(destination)).toString();
      const erc20 = (await mockErc20.balanceOf(destination)).toString();
      setDestinationAmt((prevState) => {
        return {
          ...prevState,
          eth: eth,
          erc20: erc20,
        };
      });
    };
    if (provider) {
      updateDestination();
    }
  }, [destination]);

  // get Zkp automatically
  useEffect(() => {
    if (data) {
      getZkp();
    }
  }, [points]);

  // update balance for Wallet, Destination, ZkWallet
  const updateBalance = async (contract, mockErc20, provider, address) => {
    const ZK_WALLET = contract.address;
    const eth = (await provider.getBalance(ZK_WALLET)).toString();
    const erc20 = (await mockErc20.balanceOf(ZK_WALLET)).toString();
    setZkWallet((preState) => {
      return {
        ...preState,
        eth,
        erc20,
      };
    });
    if (address) {
      const aErc20 = (await mockErc20.balanceOf(address)).toString();
      setWalletAmt(aErc20);
    }
    if (destination) {
      const dEth = (await provider.getBalance(destination)).toString();
      const dErc20 = (await mockErc20.balanceOf(destination)).toString();
      setDestinationAmt((prevState) => {
        return {
          ...prevState,
          eth: dEth,
          erc20: dErc20,
        };
      });
    }
  };

  // send eth & erc20 after the deployment of erc20
  const transferToZkWallet = async () => {
    const signer = provider.getSigner();
    const ZK_WALLET = contract.address;
    let tx = await signer.sendTransaction({
      to: ZK_WALLET,
      value: ethers.utils.parseEther("1000"),
    });
    await tx.wait();
    tx = await mockErc20.transfer(ZK_WALLET, ethers.utils.parseEther("1000"));
    await tx.wait();
    const eth = (await provider.getBalance(ZK_WALLET)).toString();
    const erc20 = (await mockErc20.balanceOf(ZK_WALLET)).toString();
    setZkWallet((preState) => {
      return {
        ...preState,
        eth,
        erc20,
      };
    });
  };

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

  const deployZkWallet = async () => {
    if (localStorage.getItem("zkWallet")) {
      setContract(
        new ethers.Contract(
          localStorage.getItem("zkWallet"),
          ABI,
          provider.getSigner()
        )
      );
    } else {
      const VERIFIER_ADDRESS = process.env.verifierAddress;
      const bytecode = process.env.multiSignByteCode;

      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(ABI, bytecode, signer);
      const contract = await factory.deploy(
        sharingKey,
        hashItem,
        VERIFIER_ADDRESS
      );
      await contract.deployTransaction.wait();
      setContract(contract.connect(signer));
      localStorage.setItem("zkWallet", contract.address);
      console.log("deploy zk-wallet at address:", contract.address);
    }
  };

  const deployErc20 = async () => {
    if (localStorage.getItem("mockErc20")) {
      const erc20 = new ethers.Contract(
        localStorage.getItem("mockErc20"),
        ERC20_ABI,
        provider.getSigner()
      );
      setMockErc20(erc20);
    } else {
      const bytecode = process.env.mockErc20ByteCode;
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(ERC20_ABI, bytecode, signer);

      const erc20 = await factory.deploy(address);
      await erc20.deployTransaction.wait();
      console.log("deploy mockerc20 at address:", erc20.address);
      localStorage.setItem("mockErc20", erc20.address);
      setMockErc20(erc20.connect(signer));
      updateBalance(contract, erc20, provider, address);
    }
  };

  // default setting: transfer ETH
  const tranferToken = async () => {
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
      updateBalance(contract, mockErc20, provider, address);
    });
  };

  return (
    <div className="container">
      <main className={styles.main}>
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
        <div className={styles.container}>
          <button className={styles.button} onClick={createPoints}>
            Create Points
          </button>
        </div>
        <div className={styles.container}>
          <label htmlFor="sharingKey">Sharing Key: </label>
          <p>{sharingKey}</p>
          <label htmlFor="hashItem">Hash Item: </label>
          <p>{hashItem}</p>
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
          <button className={styles.button} onClick={getZkp}>
            Get ZKP
          </button>
        </div>
        {mockErc20 && (
          <>
            <div className={styles.container}>
              <h2>Wallet Balance: </h2>
              <label htmlFor="wallet amount">ERC20: </label>
              <p>{walletAmt / 1e18} whoses</p>
              <h2>Destination Balance: </h2>
              <label htmlFor="destinationAmt">ETH: </label>
              <p>{destinationAmt.eth / 1e18} ethers</p>
              <label htmlFor="erc20">ERC20: </label>
              <p>{destinationAmt.erc20 / 1e18} whoses</p>
            </div>
            <div className={styles.container}>
              <h2>Zk Wallet Balance: </h2>
              <label htmlFor="eth">ETH: </label>
              <p>{zkWallet.eth / 1e18} ethers</p>
              <label htmlFor="erc20">ERC20: </label>
              <p>{zkWallet.erc20 / 1e18} whoses</p>
              <button onClick={transferToZkWallet}>
                Transfer To Zk Wallet
              </button>
            </div>
            <div className={styles.container}>
              <h2>Transfer Token: </h2>
              <label>
                Choose Transfering Token:
                <select
                  value={tokenAddress}
                  className={styles.input}
                  onChange={(event) => setTokenAddress(event.target.value)}
                >
                  <option value={ethers.constants.AddressZero}>
                    {ethers.constants.AddressZero}
                  </option>
                  <option value={mockErc20.address}>{mockErc20.address}</option>
                </select>
              </label>
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
          </>
        )}
      </main>
    </div>
  );
}

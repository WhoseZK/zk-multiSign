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
  const deploy = async () => {
    if (localStorage.getItem("zkWallet")) {
      setContract(new ethers.Contract(localStorage.getItem("zkWallet"), ABI, provider.getSigner()));
    } else {
      const VERIFIER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      const bytecode =
        "0x60806040523480156200001157600080fd5b5060405162000f4038038062000f408339818101604052810190620000379190620001a3565b8282826200004c83836200009960201b60201c565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050506200023d565b81600081905550806001819055507ff665d9e50fb6a414420fde27f46b7113ac5ec2e33820c770fb1e2fe0b7d2dfc4600054600154604051620000de92919062000210565b60405180910390a15050565b600080fd5b6000819050919050565b6200010481620000ef565b81146200011057600080fd5b50565b6000815190506200012481620000f9565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000157826200012a565b9050919050565b60006200016b826200014a565b9050919050565b6200017d816200015e565b81146200018957600080fd5b50565b6000815190506200019d8162000172565b92915050565b600080600060608486031215620001bf57620001be620000ea565b5b6000620001cf8682870162000113565b9350506020620001e28682870162000113565b9250506040620001f5868287016200018c565b9150509250925092565b6200020a81620000ef565b82525050565b6000604082019050620002276000830185620001ff565b620002366020830184620001ff565b9392505050565b610cf3806200024d6000396000f3fe6080604052600436106100295760003560e01c8063a2aef0871461002e578063dbd7aa9014610057575b600080fd5b34801561003a57600080fd5b5061005560048036038101906100509190610819565b610073565b005b610071600480360381019061006c91906108ee565b61032b565b005b81816000548260006002811061008c5761008b61096a565b5b60200201351415806100b85750600154826001600281106100b0576100af61096a565b5b602002013514155b156100ef576040517ff299a39200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f5c9d69e60405180604001604052808460006008811061014c5761014b61096a565b5b602002013581526020018460016008811061016a5761016961096a565b5b6020020135815250604051806040016040528060405180604001604052808760026008811061019c5761019b61096a565b5b60200201358152602001876003600881106101ba576101b961096a565b5b602002013581525081526020016040518060400160405280876004600881106101e6576101e561096a565b5b60200201358152602001876005600881106102045761020361096a565b5b602002013581525081525060405180604001604052808660066008811061022e5761022d61096a565b5b602002013581526020018660076008811061024c5761024b61096a565b5b6020020135815250866040518563ffffffff1660e01b81526004016102749493929190610b5b565b602060405180830381865afa158015610291573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102b59190610bda565b6102eb576040517f09bde33900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610325846000600281106103025761030161096a565b5b60200201358560016002811061031b5761031a61096a565b5b602002013561077c565b50505050565b8181600054826000600281106103445761034361096a565b5b60200201351415806103705750600154826001600281106103685761036761096a565b5b602002013514155b156103a7576040517ff299a39200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f5c9d69e6040518060400160405280846000600881106104045761040361096a565b5b60200201358152602001846001600881106104225761042161096a565b5b602002013581525060405180604001604052806040518060400160405280876002600881106104545761045361096a565b5b60200201358152602001876003600881106104725761047161096a565b5b6020020135815250815260200160405180604001604052808760046008811061049e5761049d61096a565b5b60200201358152602001876005600881106104bc576104bb61096a565b5b60200201358152508152506040518060400160405280866006600881106104e6576104e561096a565b5b60200201358152602001866007600881106105045761050361096a565b5b6020020135815250866040518563ffffffff1660e01b815260040161052c9493929190610b5b565b602060405180830381865afa158015610549573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056d9190610bda565b6105a3576040517f09bde33900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff16036106b957348514610610576040517fdd8e4af700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008673ffffffffffffffffffffffffffffffffffffffff163460405161063690610c38565b60006040518083038185875af1925050503d8060008114610673576040519150601f19603f3d011682016040523d82523d6000602084013e610678565b606091505b50509050806106b3576040517fa636a08b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50610773565b600034146106f3576040517f6b10993700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb87876040518363ffffffff1660e01b815260040161072e929190610c6b565b6020604051808303816000875af115801561074d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107719190610bda565b505b50505050505050565b81600081905550806001819055507ff665d9e50fb6a414420fde27f46b7113ac5ec2e33820c770fb1e2fe0b7d2dfc46000546001546040516107bf929190610c94565b60405180910390a15050565b600080fd5b600080fd5b6000819050826020600202820111156107f1576107f06107d0565b5b92915050565b600081905082602060080282011115610813576108126107d0565b5b92915050565b6000806101408385031215610831576108306107cb565b5b600061083f858286016107d5565b9250506040610850858286016107f7565b9150509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108858261085a565b9050919050565b6108958161087a565b81146108a057600080fd5b50565b6000813590506108b28161088c565b92915050565b6000819050919050565b6108cb816108b8565b81146108d657600080fd5b50565b6000813590506108e8816108c2565b92915050565b60008060008060006101a0868803121561090b5761090a6107cb565b5b6000610919888289016108a3565b955050602061092a888289016108a3565b945050604061093b888289016108d9565b935050606061094c888289016107d5565b92505060a061095d888289016107f7565b9150509295509295909350565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600060029050919050565b600081905092915050565b6000819050919050565b6109c2816108b8565b82525050565b60006109d483836109b9565b60208301905092915050565b6000602082019050919050565b6109f681610999565b610a0081846109a4565b9250610a0b826109af565b8060005b83811015610a3c578151610a2387826109c8565b9650610a2e836109e0565b925050600181019050610a0f565b505050505050565b600060029050919050565b600081905092915050565b6000819050919050565b600081905092915050565b610a7881610999565b610a828184610a64565b9250610a8d826109af565b8060005b83811015610abe578151610aa587826109c8565b9650610ab0836109e0565b925050600181019050610a91565b505050505050565b6000610ad28383610a6f565b60408301905092915050565b6000602082019050919050565b610af481610a44565b610afe8184610a4f565b9250610b0982610a5a565b8060005b83811015610b3a578151610b218782610ac6565b9650610b2c83610ade565b925050600181019050610b0d565b505050505050565b82818337505050565b610b5760408383610b42565b5050565b600061014082019050610b7160008301876109ed565b610b7e6040830186610aeb565b610b8b60c08301856109ed565b610b99610100830184610b4b565b95945050505050565b60008115159050919050565b610bb781610ba2565b8114610bc257600080fd5b50565b600081519050610bd481610bae565b92915050565b600060208284031215610bf057610bef6107cb565b5b6000610bfe84828501610bc5565b91505092915050565b600081905092915050565b50565b6000610c22600083610c07565b9150610c2d82610c12565b600082019050919050565b6000610c4382610c15565b9150819050919050565b610c568161087a565b82525050565b610c65816108b8565b82525050565b6000604082019050610c806000830185610c4d565b610c8d6020830184610c5c565b9392505050565b6000604082019050610ca96000830185610c5c565b610cb66020830184610c5c565b939250505056fea264697066735822122040407c59a94b8f7e9279da40205676c7140f6a4723bde7d8be2b7605df3d380c64736f6c63430008110033";

      const abi = [
        "constructor(uint256 sharingKey, uint256 hashItem, address iVerifier)",
      ];
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

  // default setting: transfer ETH
  const tranferToken = async () => {
    const msg = {
      value: ethers.BigNumber.from(amount),
    };
    if (tokenAddress == ethers.constants.AddressZero) {
      await contract.transferToken(
          tokenAddress,
          destination,
          amount,
          publicSignals,
          proof,
          msg
        );
    } else {
      await contract.transferToken(
          tokenAddress,
          destination,
          amount,
          publicSignals,
          proof,
          msg
        );
    }
  };

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

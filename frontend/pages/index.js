import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import useSWR from "swr";
import UserComponents from "../src/components/UserComponents";
import UserInputComponent from "../src/components/UserInputComponent";
import Relayer from "../src/components/Relayer";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/zkp", fetcher);
  const [provider, setProvider] = useState();
  const address = useAddress();
  const [contract, setContract] = useState();
  const [users, setUsers] = useState([]);

  // constructor args
  const [tree, setTree] = useState();
  const [sharingKeys, setSharingKeys] = useState();
  // const [memberRoot, setMemberRoot] = useState();
  const [points, setPoints] = useState([]);

  // transfer token args
  const [tokenAddress, setTokenAddress] = useState(
    ethers.constants.AddressZero
  );
  const [destination, setDestination] = useState();
  const [amount, setAmount] = useState();
  const [zkproof, setZkproof] = useState();
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

  const [zkWalletAmt, setZkWalletAmt] = useState({
    eth: "Loading",
    erc20: "Loading",
  });

  // initial all attributes
  useEffect(() => {
    const envInit = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let contract;
      setProvider(provider);
      if (localStorage.getItem("zkWalletAmt")) {
        contract = new ethers.Contract(
          localStorage.getItem("zkWalletAmt"),
          ABI,
          provider.getSigner()
        );
        setContract(contract);
        setSharingKeys(localStorage.getItem("sharingKeys"));
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

  // update destination detail
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
    if (data && users) {
      for(let i=0;i<users.length;i++) {
        users[i].updatePoint(points[i]);
      }
    }
  }, [points]);

  // update tree detail
  useEffect(() => {
    users && users.forEach(user => {
      user.updateTreeDetail(tree)
    })
  }, [tree])

  const handleCreateUser = (user) => {
     if(user.old) return
     setUsers((prevState) => {
      return [user, ...prevState];
    })
  }

  const doAfterDeploy = (tree, zkWalletAmt, balance) => {
    setTree(tree);
    setContract(zkWalletAmt);
    zkWalletAmt(balance);
  }

  return (
    <div className="container">
      <main className="grid grid-cols-3 gap-6">
        <div className={styles.connect}>
          <ConnectWallet />
        </div>

        <UserInputComponent onCreateUser={(user) => handleCreateUser(user)} />
        {data &&
          <UserComponents
            userList={users}
            inclusionOfMember={data.inclusionofmember}
            onPointsChanged={setPoints}
            contract={contract}
          />
        }

        <Relayer provider = {provider} 
          userList = {users}
          doAfterDepoly = {(tree, zkWallet, zkWalletAmt) => doAfterDeploy(tree, zkWallet, zkWalletAmt)}/>

      </main>  
      {/* <main className="grid grid-cols-3 gap-6">
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
        
        <UserComponents
          numbers = {5}
          onCreateUser = {(user) => setUsers((prevState) => {return {...prevState, user}})} /> 
        
        <div className="container">
          <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={createPoints}>
            Create Points
          </button>
        </div>
        <div className="container">
          <label htmlFor="sharingKey">Sharing Key: </label>
          <p>{sharingKey}</p>
          <label htmlFor="hashItem">Hash Item: </label>
          <p>{hashItem}</p>
        </div>

        <Points points={points} />
        <div className="container">
          <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={deployZkWalletAmt}>
            Create Zk Wallet
          </button>
        </div>
        <div className="container">
          <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={deployErc20}>
            Create Mock Token
          </button>
          <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={getZkp}>
            Get ZKP
          </button>
        </div>
        {mockErc20 && (
          <>
            <div className="container">
              <h2>Wallet Balance: </h2>
              <label htmlFor="wallet amount">ERC20: </label>
              <p>{walletAmt / 1e18} whoses</p>
              <h2>Destination Balance: </h2>
              <label htmlFor="destinationAmt">ETH: </label>
              <p>{destinationAmt.eth / 1e18} ethers</p>
              <label htmlFor="erc20">ERC20: </label>
              <p>{destinationAmt.erc20 / 1e18} whoses</p>
            </div>
            <div className="container">
              <h2>Zk Wallet Balance: </h2>
              <label htmlFor="eth">ETH: </label>
              <p>{zkWalletAmt.eth / 1e18} ethers</p>
              <label htmlFor="erc20">ERC20: </label>
              <p>{zkWalletAmt.erc20 / 1e18} whoses</p>
              <button onClick={transferToZkWalletAmt}>
                Transfer To Zk Wallet
              </button>
            </div>
            <div className="container">
              <h2>Transfer Token: </h2>
              <label>
                Choose Transfering Token:
                <select
                  value={tokenAddress}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setDestination(event.target.value)}
              />
              <label htmlFor="amount">Amount: </label>
              <input
                type="text"
                name="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={tranferToken}>
                Transfer Tokens
              </button>
            </div>
          </>
        )}
      </main> */}
    </div>
  );
}

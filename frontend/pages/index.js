import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import useSWR from "swr";
import UserComponents from "../src/components/UserComponents";
import UserInputComponent from "../src/components/UserInputComponent";
import Relayer from "../src/components/Relayer";
import {
  getNewTransactions,
  ABI,
  ERC20_ABI,
} from "../src/services/WalletService";
import EventComponents from "../src/components/EventComponents";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/zkp", fetcher);
  const [provider, setProvider] = useState();
  const address = useAddress();
  const [contract, setContract] = useState();
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState([]);
  const [txRaiser, setTxRaiser] = useState();

  // constructor args
  const [tree, setTree] = useState();
  const [sharingKeys, setSharingKeys] = useState();
  // const [memberRoot, setMemberRoot] = useState();
  const [points, setPoints] = useState([]);
  const [destination, setDestination] = useState();

  // deploy ERC20
  const [mockErc20, setMockErc20] = useState();

  // check wallet amount
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
      if (localStorage.getItem("zkWallet")) {
        contract = new ethers.Contract(
          localStorage.getItem("zkWallet"),
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
        updateBalance(provider, contract, mockErc20, address);
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
    const updateUser = async () => {
      if (data && users && points) {
        for (let i = 0; i < users.length; i++) {
          //if(typeof users[i] !== 'User') continue
          users[i].updatePoint(points[i]);
        }
        users.forEach((user) =>
          localStorage.setItem(user.userName, JSON.stringify(user))
        );
        if(contract) {
          const events = await getNewTransactions(contract);
          setEvent(events);
        }
      }
    };
    updateUser();
  }, [points]);

  // update tree detail
  useEffect(() => {
    const updateUserSMT = async () => {
      users.forEach(async (user, index) => {
        const result = await tree.find(index);
        user.updateTreeDetail(result, tree.root, index);
      });
    }
    if (users.length > 0) {
      updateUserSMT();
    }
  }, [tree]);

  const handleCreateUser = (user) => {
    if (user.old && users.map((it) => it.userName).includes(user.userName))
      return;
    setUsers((prevState) => {
      return [user, ...prevState];
    });
  };

  const handleApprove = (approvedUser) => {
    setUsers((prevState) => {
      prevState.map(user => {
        if (user.userName == approvedUser.userName) {
          return {...user,
            approve: approvedUser.approve,
            sig: approvedUser.sig
          }
        }
      })
      return [...prevState];
    })
  }

  const handleZkpInputs = (zkpInputs) => {
    const inputReceiver = users.find(user => user.userName == txRaiser);
    inputReceiver.updateZkpInputs(zkpInputs);
    setUsers((prevState) => {
      prevState.map(user => {
        if (user.userName == inputReceiver.userName) {
          return {...user,
            zkpInputs: inputReceiver.zkpInputs
          }
        }
      })
      return [...prevState];
    })
  }

  const doAfterDeploy = (tree, zkWallet, zkWalletAmt) => {
    if (tree) setTree(tree);
    if (zkWallet) setContract(zkWallet);
    if (zkWalletAmt) setZkWalletAmt(zkWalletAmt);
  };

  return (
    // <div class="bg-white py-24 sm:py-32 lg:py-40">
    //   <div class="w-3">
    //     <ConnectWallet />
    //   </div>
    //       <Relayer
    //         provider={provider}
    //         userList={users}
    //         forwardZkpInputs={(zkpInputs) => handleZkpInputs(zkpInputs)}
    //         doAfterDepoly={(tree, zkWallet, zkWalletAmt) =>
    //           doAfterDeploy(tree, zkWallet, zkWalletAmt)
    //         }
    //       />
    //   </div>

    //   <UserInputComponent onCreateUser={(user) => handleCreateUser(user)} />
    //   {data && (
    //     <UserComponents
    //       userList={users}
    //       inclusionOfMember={data.inclusionofmember}
    //       zkMultiSign={data.zkmultisign}
    //       onPointsChanged={setPoints}
    //       onSharingKeysChanged={setSharingKeys}
    //       onTransactionRaised={setTxRaiser}
    //       onSumbitApprove={(user) => handleApprove(user)}
    //       contract={contract}
    //       events={event}
    //       raiser={txRaiser}
    //     />
    //   )}
    //   <EventComponents eventList={event} />
    // </div>
    <div className="bg-dark py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="w-3">
          <ConnectWallet />
        </div>
        <Relayer
          provider={provider}
          userList={users}
          forwardZkpInputs={(zkpInputs) => handleZkpInputs(zkpInputs)}
          doAfterDepoly={(tree, zkWallet, zkWalletAmt) =>
            doAfterDeploy(tree, zkWallet, zkWalletAmt)
          }
        />

        <UserInputComponent onCreateUser={(user) => handleCreateUser(user)} />

        <div className="grid grid-row-4 grid-flow-col gap-5">
          {data && (
            <UserComponents
              userList={users}
              inclusionOfMember={data.inclusionofmember}
              zkMultiSign={data.zkmultisign}
              onPointsChanged={setPoints}
              onSharingKeysChanged={setSharingKeys}
              onTransactionRaised={setTxRaiser}
              onSumbitApprove={(user) => handleApprove(user)}
              contract={contract}
              events={event}
              raiser={txRaiser}
            />
          )}
        </div>

        <EventComponents eventList={event} />
     </div>
   </div>
  );
}

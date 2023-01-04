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
  const [points, setPoints] = useState([]);
  const [destination, setDestination] = useState();

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

  const doAfterDeploy = (tree, zkWallet) => {
    if (tree) setTree(tree);
    if (zkWallet) setContract(zkWallet);
  };

  const setSharingKeyAndResetApprove = (sharingKeys) => {
    setSharingKeys(sharingKeys)
    users.map(user => {user.approve = false})
  } 

  const afterTxnRaised = (raiser, destination) => {
    setTxRaiser(raiser)
    setDestination(destination)
  }

  const afterExecTxn = () => {
    users.map(user => {
      user.zkpInputs = undefined;
      user.approve = false;
    });
    setEvent([])
    setTxRaiser("")
  }

  return (
    <div className="bg-dark py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="w-3">
          <ConnectWallet />
        </div>
        <Relayer
          provider={provider}
          userList={users}
          raiser={txRaiser}
          destination={destination}
          forwardZkpInputs={(zkpInputs) => handleZkpInputs(zkpInputs)}
          doAfterDepoly={(tree, zkWallet) =>
            doAfterDeploy(tree, zkWallet)
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
              onSharingKeysChanged={setSharingKeyAndResetApprove}
              onTransactionRaised={(raiser, destination) => afterTxnRaised(raiser, destination)}
              onSumbitApprove={(user) => handleApprove(user)}
              contract={contract}
              events={event}
              raiser={txRaiser}
              afterExecTxn={afterExecTxn}
            />
          )}
        </div>

        <EventComponents eventList={event} />

        {/* <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <div className="bg-slate-300 bg-green-500 bg-lime-300 text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="border-solid border border-gray-300 block w-full flex-1 rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 "
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-600 text-gray-700">Photo</label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div> */}


      </div>
    </div>
  );
}

import { useState } from "react";
import { deployZkWallet, deployErc20, initZkWallet, updateBalance } from "../services/WalletService"
import { smt } from "circomlib";
import MemberComponents from "./MemberComponents";

const Relayer = (props) => {

    const doAfterDepoly = props.doAfterDepoly;
    const userList = props.userList;
    const provider = props.provider;
    const [erc20Address, setErc20Address] = useState();
    const [defaultAmt, setDefaultAmt] = useState(1000);
    const [zkWallet, setZkWallet] = useState();
    const [erc20Contract, setErc20Contract] = useState();
    const [zkwalletAmt, setZkWalletAmt] = useState({erc20:0, eth:0});

    const generateRootAndDeployContract = async () => {

        // gather all public keys and build the tree
        const tree = await smt.newMemEmptyTrie();
        const pubKeys = userList.map(user => user.keyPair[0][0])
        for (let i = 0; i < pubKeys.length; i++) {
            await tree.insert(i, pubKeys[i]);
        }

        // deploy the zkWallet 
        const zkWallet = await deployZkWallet(provider, tree.root);
        setZkWallet(zkWallet);

        // init the wallet (transfer the default amount token to wallet)
        await initZkWallet(provider, zkWallet, defaultAmt)
        var erc20Contract = await deployErc20(provider, zkWallet.address, erc20Address);
        setErc20Contract(erc20Contract);
        setErc20Address(erc20Contract.address);

        const {erc20, eth} = await updateBalance(provider, zkWallet, erc20Contract);

        setZkWalletAmt((prevState) => {return {...prevState, erc20, eth}})
        doAfterDepoly(tree, zkWallet, {erc20, eth})
    }

    const refreshZkWalletAmt = async () => {
        const {erc20, eth} = await updateBalance(provider, zkWallet, erc20Contract);
        setZkWalletAmt((prevState) => {return {...prevState, erc20, eth}});
        doAfterDepoly(null, null, {erc20, eth});
    }

    const forwardZkpInputs = async () => {
        const approvedUsers = userList.filter(user => user.approve);
        props.forwardZkpInputs(approvedUsers);
    }

    return (
        <div className="px-6">
            <p className="text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Relayer</p>
            <p className="text-center mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                For handle all on-chain transaction
            </p>


            <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                            Erc20 Address (Optional): 
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="erc20Addres"
                          value={erc20Address}
                          className="border-solid border border-gray-300 block w-full flex-1 rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 "
                          onChange={(event) => setErc20Address(event.target.value)}
                        />
                      </div>
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                            Transfer ETH Amount to ZKWallet: 
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="defaultAmt"
                          value={defaultAmt}
                          className="border-solid border border-gray-300 block w-full flex-1 rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 "
                          onChange={(event) => setDefaultAmt(event.target.value)}
                        />
                      </div>
                    </div>

                    <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={generateRootAndDeployContract}>
                        Generate Points & Deploy Contract
                    </button>
                    
                    <div className="container">
                        <label htmlFor="erc20Addres">ZKWallet ETH Amount: </label>
                        <p>{zkwalletAmt.eth / 1e18} ethers</p>    
                        <label htmlFor="erc20Addres">ZKWallet ERC20 Amount: </label>
                        <p>{zkwalletAmt.erc20 / 1e18} whoses</p> 
                    </div>

                    <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                        onClick={refreshZkWalletAmt}>
                        Refresh ZkWallet
                    </button>
                    <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                        onClick={forwardZkpInputs}>
                        Forward
                    </button>

                    <MemberComponents userList={props.userList} />
                  </div>
                </div>
            </div>
        </div>
    );
};

export default Relayer;

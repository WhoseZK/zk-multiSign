import { useEffect, useState } from "react";
import { deployZkWallet, deployErc20, initZkWallet, updateBalance } from "../services/WalletService"
import { smt } from "circomlib";

const Relayer = (props) => {

    const doAfterDepoly = props.doAfterDepoly;
    const userList = props.userList;
    const provider = props.provider;
    const [inputs, setInputs] = useState([]);
    const [erc20Address, setErc20Address] = useState();
    const [defaultAmt, setDefaultAmt] = useState(1000);
    const [zkwalletAmt, setZkWalletAmt] = useState(0);

    useEffect(() => {
        generateInputs()
    }, [userList])

    const generateInputs = () => {
        
        const tempInputs = userList.map((user, index) => {
            let inputName = `${user.userName}_publicKey`
            let userPubKey = user?.keyPair[0][0]
            return <div className="container">
                <label htmlFor={inputName}>{user.userName}'s public key</label>
                <input type="text"
                    name={inputName}
                    value={userPubKey}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled/>
            </div>
        })
        setInputs(tempInputs);
    }

    const generateRootAndDeployContract = async () => {

        // gather all public keys and build the tree
        const tree = await smt.newMemEmptyTrie();
        var index = 0;
        const pubKeys = userList.map(user => user.keyPair[0][0])
        for (let i = 0; i < pubKeys.length; i++) {
            await tree.insert(index++, pubKeys[i]);
        }

        // deploy the zkWallet 
        const zkWallet = await deployZkWallet(provider, tree.root)

        // init the wallet (transfer the default amount token to wallet)
        await initZkWallet(provider, zkWallet, defaultAmt)
        var erc20Contract = await deployErc20(provider, zkWallet.address, erc20Address);
        const {erc20, eth} = await updateBalance(provider, zkWallet, erc20Contract);

        setZkWalletAmt((prevState) => {return {...prevState, erc20, eth}})
        doAfterDepoly(tree, zkWallet, {erc20, eth})
    }

    return (
        <div className="container">
            <h1>Relayer</h1>
            { inputs }
            <label htmlFor="erc20Addres">Erc20 Address (Optional): </label>
            <input type="text"
                name="erc20Addres"
                value={erc20Address}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setErc20Address(event.target.value)}
            />
            <label htmlFor="erc20Addres">Transfer ETH Amount to ZKWallet: </label>
            <input type="number"
                name="defaultAmt"
                value={defaultAmt}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setDefaultAmt(event.target.value)}
            />
            <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={generateRootAndDeployContract}>
                Generate Points & Deploy Contract
            </button>

            <div className="container">
                <label htmlFor="erc20Addres">ZKWallet ETH Amount: </label>
                <p>{zkwalletAmt.eth}</p>    
                <label htmlFor="erc20Addres">ZKWallet ERC20 Amount: </label>
                <p>{zkwalletAmt.erc20}</p> 
            </div>
        </div>
    );
};

export default Relayer;

import { useState } from "react";
import { deployZkWallet, deployErc20, initZkWallet, updateBalance } from "../services/WalletService"
import { eddsa, poseidon, smt } from "circomlib";

const Relayer = (props) => {

    const doAfterDepoly = props.doAfterDepoly;
    const provider = props.provider;
    const numbers = props.numbers;
    const [pubKeys, setPubKeys] = useState([])

    const generateInputs = (numbers) => {
        const inputs = []
        for (let i = 0; i < numbers; i++) {
            let inputName = `publicKey${i}`
            inputs.push(<input
                type="text"
                name={inputName}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setPubKeys((prevState) => {
                    const value = event.target.value
                    console.log(value)
                    return { ...prevState, value }
                })}
            />)
        }
        return inputs
    }

    const generateRootAndDeployContract = async () => {

        // gather all public keys and build the tree
        const tree = await smt.newMemEmptyTrie();
        var index = 0;
        for (let i = 0; i < pubKeys.length; i++) {
            await tree.insert(index++, pubKeys[i]);
        }

        // deploy the zkWallet 
        const zkWallet = await deployZkWallet(provider, tree.root)

        // init the wallet (transfer the default amount token to wallet)
        var erc20 = await deployErc20(provider, erc20Address);
        await initZkWallet(provider, zkWallet, erc20, defaultAmt)
        const balance = await updateBalance(provider, zkWallet, erc20)

        doAfterDepoly(tree, zkWallet, balance)
    }

    return (
        <div className="container">
            <h1>Relayer</h1>
            {generateInputs(numbers)}
            <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={generateRootAndDeployContract}>
                Generate Points & Deploy Contract
            </button>
        </div>
    );
};

export default Relayer;

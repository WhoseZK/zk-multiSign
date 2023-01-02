import { useState } from "react";

const Relayer = (props) => {

    const doAfterDepoly = props.doAfterDepoly;
    const numbers = props.numbers;
    const [pubKeys, setPubKeys] = useState([])

    const generateInputs = (numbers) => {
        const inputs = []
        for (let i = 0; i < numbers; i++) {
            let inputName = `publicKey${i}`
            inputs.push(<input
                type="text"
                name={inputName}
                value={username}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setPubKeys((prevState) => { return { ...prevState, event.target.value } })}
            />)
        }
    }

    const generateRootAndDeployContract = () => {
        
            // gather all public keys and build the tree
        const tree = await smt.newMemEmptyTrie();
        var index = 0;
        publicKeys.forEach(publicKey => {
            tree.insert(index++, publicKey);
        })

        // deploy the zkWallet 
        const zkWallet = await deployZkWallet(provider, tree.root)

        // init the wallet (transfer the default amount token to wallet)
        var erc20 = await deployErc20(provider, erc20Address);
        await initZkWallet(provider, zkWallet, erc20, defaultAmt)
        const balance = await updateBalance(provider, zkWallet, erc20)
        
        doAfterDepoly(tree, zkWallet, balance)
        setTree(tree);
        setContract(zkWallet);
        setZkWallet((prevState) => {return {...prevState, balance}});
    }

    return (
        <div className="container">
           { generateInputs(numbers) }
        </div>
    );
};

export default Relayer;

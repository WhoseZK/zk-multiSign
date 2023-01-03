import { useState } from "react";
import { ethers } from "ethers";
import { generatePoints } from "../services/SSSService" 
import { generateInclusionOfMemberProof } from "../services/ZkpService" 
import { eddsa, poseidon } from "circomlib";

const UserComponent = (props) => {
  const [destination, setDestination] = useState("");
  const [tokenAddress, setTokenAddress] = useState(ethers.constants.AddressZero);
  const [amount, setAmount] = useState(0);

  const name = props.user.userName;
  const x = props.user.keyPair[0][0];
  const y = props.user.keyPair[0][1];
  const prvKey = props.user.keyPair[1];
  // const point = props.user.point;

  const raiseTransaction = async (event) => {
    event.preventDefault();
    const signature = eddsa.signMiMC(prvKey, poseidon([BigInt(x), BigInt(y)]));
    const { publicSig, proof } = await generateInclusionOfMemberProof(
      props.user,
      signature,
      props.inclusionOfMember
    );

    try {
      const result = await generatePoints(5);
      const txn = await props.contract.raiseTransaction(
        result.sharingKeys,
        destination,
        tokenAddress,
        ethers.utils.parseEther(amount.toString()),
        publicSig,
        proof, 
        {
            gasLimit: 2_000_000
        }
      );
      const txresult = await txn.wait();
      console.log("Transaction:", txresult);
      props.onSharingKeysChanged(result.sharingKeys);
      props.onPointsChanged(result.points);
      console.log("sharing key:", result.sharingKeys);
    } catch (error) {
      console.log(`Raise Error in raiseTransaction ${error}`);
    }
  };

  return (
    <div className="container">
      <label htmlFor="sharingKey">Username: </label>
      <p>{name}</p>
      <label htmlFor="publicKey">Public Key x: </label>
      <p>{x}</p>
      <label htmlFor="publicKey">Public Key y: </label>
      <p>{y}</p>
      <label htmlFor="privatekey">Private Key: </label>
      <p>{prvKey}</p>
      {/* <label htmlFor="pointx">Point x: </label>
      <p>{point[0].toString()}</p>
      <label htmlFor="privatekey">Point y: </label>
      <p>{point[1].toString()}</p> */}
      <label htmlFor="destination">Destination: </label>
      <input
        value={destination}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={(event) => setDestination(event.target.value)}
      />
      <label htmlFor="tokenAddress">Token Address: </label>
      <input
        value={tokenAddress}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={(event) => setTokenAddress(event.target.value)}
      />
      <label htmlFor="amount">Amount: </label>
      <input
        value={amount}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={(event) => setAmount(event.target.value)}
      />
      <button className="pt-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
        onClick={raiseTransaction}>Raise Transaction</button>
    </div>
  );
};

export default UserComponent;

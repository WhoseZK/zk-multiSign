import { useState } from "react";
import { ethers } from "ethers";
import { generatePoints } from "../services/SSSService";
import {
  generateInclusionOfMemberProof,
  generateMultiSignProof,
} from "../services/ZkpService";
import { eddsa, poseidon } from "circomlib";

const UserComponent = (props) => {
  const [destination, setDestination] = useState("");
  const [tokenAddress, setTokenAddress] = useState(
    ethers.constants.AddressZero
  );
  const [amount, setAmount] = useState(0);
  const name = props.user.userName;
  const x = props.user.keyPair[0][0];
  const y = props.user.keyPair[0][1];
  const prvKey = props.user.keyPair[1];
  const point = props.user.point;
  const eventLength = props.events.length;
  const zkpInputs = props.user.zkpInputs;
  const afterExecTxn = props.afterExecTxn;
  const isRaiser = name == props.raiser;

  const concatStr = (str) => {
    return str.substring(0, 8) + "..." + str.slice(-8);
  }

  const approveHandler = (event) => {
    event.preventDefault();
    const signature = eddsa.signMiMC(prvKey, poseidon(point));
    props.user.updateApprove(signature);
    props.onSubmitApprove(props.user);
  };

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
        proof
      );
      await txn.wait();
      props.onSharingKeysChanged(result.sharingKeys);
      props.onPointsChanged(result.points);
      props.onTransactionRaised(props.user.userName);
      console.log("sharing key:", result.sharingKeys);
    } catch (error) {
      console.log(`Raise Error in raiseTransaction ${error}`);
    }
  };

  const sendTransaction = async (event) => {
    event.preventDefault();
    console.log("zkp inputs in user component", zkpInputs)
    const { publicSig, proof } = await generateMultiSignProof(
      props.user,
      zkpInputs[0],
      zkpInputs[1],
      props.zkMultiSign
    );
    try {
      const txn = await props.contract.transferToken(publicSig, proof);
      await txn.wait();
      console.log("Transfer Token Succeed!");
      afterExecTxn();
    } catch (error) {
      console.log(`Raise Error in raiseTransaction ${error}`);
    }
  };

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md border border-gray-500 mt-2">
      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <p>{name}</p>

          <label htmlFor="publicKeyx" className="block text-sm font-medium text-gray-700">
            Public Key x:
          </label>
          <p>{concatStr(x)}</p>
          <label htmlFor="publicKeyy" className="block text-sm font-medium text-gray-700">
            Public Key y:
          </label>
          <p>{concatStr(y)}</p>
          <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700">
            Private Key:
          </label>
          <p>{concatStr(prvKey)}</p>
          {eventLength > 0 && (
            <>
              <label htmlFor="ssspointx" className="block text-sm font-medium text-red-600">
                SSS Point x:
              </label>
              <p>{concatStr(point[0])}</p>
              <label htmlFor="ssspointy" className="block text-sm font-medium text-red-600">
                SSS Point y:
              </label>
              <p>{concatStr(point[1])}</p>
            </>
          )}
        </div>
        <label htmlFor="destination">Destination: </label>
        <input
          value={destination}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setDestination(event.target.value)}
        />
        <label htmlFor="tokenAddress">Token Address: </label>
        <input
          value={tokenAddress}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setTokenAddress(event.target.value)}
        />
        <label htmlFor="amount">Amount: </label>
        <input
          value={amount}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setAmount(event.target.value)}
        />
        <button
          className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={raiseTransaction}
        >
          Raise Transaction
        </button>
        {eventLength > 0 && !isRaiser && (
          <button
            className="bg-lime-300 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={approveHandler}
          >
            Approve Transaction
          </button>
        )}
        {zkpInputs && (
          <button
            className="bg-slate-300 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={sendTransaction}
          >
            Send Transaction
          </button>
        )}
      </div>
    </div>
  );
};

export default UserComponent;

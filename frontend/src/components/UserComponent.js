import { useState } from "react";

const UserComponent = (props) => {
  const [destination, setDestination] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const name = props.user.userName;
  const x = props.user.keyPair[0][0];
  const y = props.user.keyPair[0][1];
  const prvKey = props.user.keyPair[1];

  const raiseTransaction = async (event) => {
    event.prventDefault();
    // hardcode the memberNumber
    // TODO check add into local storage if required
    const result = await generatePoints(5);

    const signature = eddsa.signMiMC(props.prvKey, props.x);
    const { publicSig, proof } = await generateInclusionOfMemberProof(
      props.user,
      signature,
      props.inclusionOfMember
    );

    try {
      const txn = await props.contract.raiseTransaction(
        result.sharingKeys,
        destination,
        amount,
        publicSig,
        proof
      );
      await txn.wait();
      setSharingKeys(result.sharingKeys);
      props.onPointsChanged(result.points);
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
      <label htmlFor="destination">Destination: </label>
      <input
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
      />
      <label htmlFor="tokenAddress">Token Address: </label>
      <input
        value={tokenAddress}
        onChange={(event) => setTokenAddress(event.target.value)}
      />
      <label htmlFor="amount">Amount: </label>
      <input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <button onClick={raiseTransaction}>Raise Transaction</button>
    </div>
  );
};

export default UserComponent;

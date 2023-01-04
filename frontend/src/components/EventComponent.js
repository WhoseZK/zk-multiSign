import { ethers } from "ethers";

const EventComponent = (props) => {

  const concatStr = (str) => {
    return str.substring(0, 8) + "..." + str.slice(-8);
  }

  const isEth = props.tokenAddress == ethers.constants.AddressZero;

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md border border-gray-500 mt-2">
      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2">
          <label htmlFor="sharingKey" className="block text-sm font-medium text-gray-700">Event Sharing Key: </label>
          <p>{concatStr(props.sharingKeys)}</p>
          <label htmlFor="publicKeyX" className="block text-sm font-medium text-gray-700">Public Key x: </label>
          <p>{concatStr(props.x)}</p>
          <label htmlFor="publicKeyY" className="block text-sm font-medium text-gray-700">Public Key y: </label>
          <p>{concatStr(props.y)}</p>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination: </label>
          <p>{concatStr(props.destination)}</p>
          <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700">Token Address: </label>
          <p>{concatStr(props.tokenAddress)}</p>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount: </label>
          <p>{props.amount/1e18} {isEth ? "ethers" : "whoses"}</p>
        </div>
      </div>
    </div>
  );
};

export default EventComponent;

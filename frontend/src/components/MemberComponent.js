const MemberComponent = (props) => {
  const inputName = props.name + "_pubKey";

  const concatStr = (str) => {
    return str.substring(0, 8) + "..." + str.slice(-8);
  }

  const isRaiser = props.raiser == props.name;

  return (
    <div className="container">
      <label htmlFor={inputName}>{props.name}'s public key</label>
      <input
        type="text"
        name={inputName}
        value={concatStr(props.x)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        disabled
      />
      {isRaiser && (
          <div className="bg-red-500 rounded-md block">Raised by {props.name}</div>
      )}
      {props.approve && (
        <>
          <div className="bg-green-500 rounded-md block">Approve by {props.name}</div>
          {/* <label htmlFor="pointx">SSS point x-axis</label>
          <input
            type="text"
            value={props.point[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          />
          <label htmlFor="pointy">SSS point y-axis</label>
          <input
            type="text"
            value={props.point[1]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          />
          <label htmlFor="pointy">SSS signature S</label>
          <input
            type="text"
            value={props.sig.S}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          />
          <label htmlFor="pointy">SSS signature R8x</label>
          <input
            type="text"
            value={props.sig.R8[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          />
          <label htmlFor="pointy">SSS signature R8y</label>
          <input
            type="text"
            value={props.sig.R8[1]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          /> */}
        </>
      )}
    </div>
  );
};

export default MemberComponent;

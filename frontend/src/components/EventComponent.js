const EventComponent = (props) => {
  return (
    <div className="container">
      <label htmlFor="sharingKey">Event Sharing Key: </label>
      <p>{props.sharingKeys}</p>
      <label htmlFor="publicKeyX">Public Key x: </label>
      <p>{props.x}</p>
      <label htmlFor="publicKeyY">Public Key y: </label>
      <p>{props.y}</p>
      <label htmlFor="destination">Destination: </label>
      <p>{props.destination}</p>
      <label htmlFor="tokenAddress">Token Address: </label>
      <p>{props.tokenAddress}</p>
      <label htmlFor="amount">Amount: </label>
      <p>{props.amount}</p>
    </div>
  );
};

export default EventComponent;

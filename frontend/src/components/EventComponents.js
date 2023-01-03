import EventComponent from "./EventComponent";

const EventComponents = (props) => {
  return (
    <>
      {props.eventList.map((event, index) => 
        <EventComponent
          key={index}
          sharingKeys={event.sharingKeys}
          x={event.pubKey[0]}
          y={event.pubKey[1]}
          destination={event.destination}
          tokenAddress={event.tokenAddress}
          amount={event.amount}
        />
      )}
    </>
  );
};

export default EventComponents;

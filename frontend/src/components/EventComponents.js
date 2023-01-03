import EventComponent from "./EventComponent";

const EventComponents = (props) => {
  return (
    <>
      <div className="grid grid-row-1">
        <p className="text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Current Event</p>
      </div>
      <div className="grid grid-row-4 grid-flow-col gap-5">
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
      </div>
    </>
  );
};

export default EventComponents;

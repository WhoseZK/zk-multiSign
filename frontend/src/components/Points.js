import Point from "./Point";

const Points = (props) => {
  const points = props.points;

  return (
    <>
      {points.length != 0 &&
        points.map((point, index) => <Point key={index} point={point} />)}
    </>
  );
};

export default Points;

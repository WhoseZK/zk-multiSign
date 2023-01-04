import MemberComponent from "./MemberComponent";

const MemberComponents = (props) => {
  return (
    <>
      {props.userList.map((user, index) => (
        <MemberComponent
          key={index}
          name={user.userName}
          x={user.keyPair[0][0]}
          point={user.point}
          sig={user.sig}
          approve={user.approve}
          raiser={props.raiser}
        />
      ))}
    </>
  );
};

export default MemberComponents;

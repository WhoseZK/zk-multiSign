import UserComponent from "./UserComponent";

const UserComponents = (props) => {
  return (
    <>
    {props.userList?.map((user, index) => 
     <UserComponent
        key={index}
        name={user.userName}
        x={user.keyPair[0][0].toString()}
        y={user.keyPair[0][1].toString()}
        prvKey={user.keyPair[1]}
      />
    )}
    </>
  );
};

export default UserComponents;

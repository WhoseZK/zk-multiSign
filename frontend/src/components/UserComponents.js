import UserComponent from "./UserComponent";

const UserComponents = (props) => {
  console.log("userList", props.userList);
  return (
    <>
      {props.userList.map((user, index) => (
        <UserComponent
          key={index}
          user={user}
          inclusionOfMember={props.inclusionOfMember}
          onPointsChanged={props.onPointsChanged}
          contract={props.contract}
        />
      ))}
    </>
  );
};

export default UserComponents;

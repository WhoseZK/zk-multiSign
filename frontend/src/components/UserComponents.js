import UserComponent from "./UserComponent";

const UserComponents = (props) => {
  return (
    <>
      {props.userList.map((user, index) => (
        <UserComponent
          key={index}
          user={user}
          inclusionOfMember={props.inclusionOfMember}
          onPointsChanged={props.onPointsChanged}
          onSharingKeysChanged={props.onSharingKeysChanged}
          contract={props.contract}
        />
      ))}
    </>
  );
};

export default UserComponents;

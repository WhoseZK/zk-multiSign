import UserComponent from "./UserComponent";

const UserComponents = (props) => {
  return (
    <>
      {props.userList.map((user, index) => (
        <UserComponent
          key={index}
          user={user}
          inclusionOfMember={props.inclusionOfMember}
          zkMultiSign={props.zkMultiSign}
          onPointsChanged={props.onPointsChanged}
          onSharingKeysChanged={props.onSharingKeysChanged}
          onSubmitApprove={props.onSumbitApprove}
          onTransactionRaised={props.onTransactionRaised}
          contract={props.contract}
          events={props.events}
          raiser={props.raiser}
          afterExecTxn={props.afterExecTxn}
        />
      ))}
    </>
  );
};

export default UserComponents;

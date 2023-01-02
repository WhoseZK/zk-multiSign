import UserComponent from "./UserComponent";

const UserComponents = (props) => {
  const onCreateUser = props.onCreateUser;

  const createMultipleUser = (numbers) => {
    const result = []
    for (let i =0 ; i < numbers; i++) {
        result[i] = <UserComponent onCreateUser = {onCreateUser}/>
    }
    return result;
  }

  const userComponets = createMultipleUser(props.numbers);

  return (
    <> {userComponets} </>
  );
};

export default UserComponents;

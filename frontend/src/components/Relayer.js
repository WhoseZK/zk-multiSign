const Relayer = (props) => {
  const onCreateUser = props.onCreateUser;
  const numbers = props.numbers;

  return (
    <div className="container">
        <label htmlFor="sharingKey">Public Key: </label>
        <p>{keyPair[0]}</p>
        <label htmlFor="sharingKey">Private Key: </label>
        <p>{keyPair[1]}</p>

        <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={createUserChildren}>
            Init User
        </button>
    </div>
  );
};

export default UserComponents;

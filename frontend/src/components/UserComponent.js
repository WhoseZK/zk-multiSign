import { createUser } from "../services/UserService"
import { useState } from "react";

const UserComponent = (props) => {

    const onCreateUser = props.onCreateUser;
    const [username, setUsername] = useState("");
    const [keyPair, setKeyPair] = useState(["", ""]);

    const createUserChildren = () => {
        if (!username) {
            console.log("Please input username")
            alert("Please input username")
            return;
        }
        const user = createUser(username);
        setKeyPair(user.keyPair);
        onCreateUser(user);
    }

    return (
        <div className="container">
            <label htmlFor="sharingKey">Username: </label>
            <input
                type="text"
                name="username"
                value={username}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setUsername(event.target.value)}
            />
            <label htmlFor="sharingKey">Public Key: </label>
            <p>{keyPair[0]}</p>
            <label htmlFor="sharingKey">Private Key: </label>
            <p>{keyPair[1]}</p>

            <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={createUserChildren}>
                Init User
            </button>
        </div>
    )
}

export default UserComponent;



import { createUser } from "../services/UserService"
import { useState } from "react";

const UserComponent = (props) => {

    const onCreateUser = props.onCreateUser;
    const [username, setUsername] = useState("");
    const [keyPair, setKeyPair] = useState([["", ""], ""]);

    const createUserChildren = () => {
        if (!username) {
            console.log("Please input username")
            alert("Please input username")
            return;
        }
        const user = createUser(username);
        setKeyPair([
            [user.keyPair[0][0].toString(), user.keyPair[0][1].toString()],
            user.keyPair[1]
        ]);
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

            <label htmlFor="publicKey">Public Key x: </label>
            <p>{keyPair[0][0]}</p>
            <label htmlFor="publicKey">Public Key y: </label>
            <p>{keyPair[0][1]}</p>
            <label htmlFor="privatekey">Private Key: </label>
            <p>{keyPair[1]}</p>

            <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={createUserChildren}>
                Init User
            </button>
        </div>
    )
}

export default UserComponent;



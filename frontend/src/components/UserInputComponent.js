import { createUser } from "../services/UserService";
import { useState } from "react";

const UserInputComponent = (props) => {
    const onCreateUser = props.onCreateUser;
    const [username, setUsername] = useState("");

    const createUserChildren = (event) => {
        event.preventDefault();
        if (!username) {
            console.log("Please input username")
            alert("Please input username")
            return;
        }
        const user = createUser(username);
        onCreateUser(user);
    }

    return (
        <>
            <label htmlFor="username">Username: </label>
            <input
                type="text"
                name="username"
                value={username}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setUsername(event.target.value)}
            />
            <button className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={createUserChildren}>
                Append User
            </button>
        </>
    )
}

export default UserInputComponent;
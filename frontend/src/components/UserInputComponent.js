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
        setUsername("");
    }

    return (
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                type="text"
                                name="username"
                                value={username}
                                className="mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <button
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                    onClick={createUserChildren}
                >
                        Append User
                </button>
            </div>
        </div>
    )
}

export default UserInputComponent;
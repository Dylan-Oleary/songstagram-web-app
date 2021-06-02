import { FC, useState } from "react";
import { useRouter } from "next/router";

import { songstagramApi } from "lib";

const LoginForm: FC<{}> = ({}) => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        songstagramApi("/login", "POST", { email, password })
            .then(() => {
                router.replace("/");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <form action="" method="POST" onSubmit={handleSubmit}>
            <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    onChange={({ target }) => setEmail(target?.value)}
                    value={email}
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input
                    type="text"
                    onChange={({ target }) => setPassword(target?.value)}
                    value={password}
                />
            </div>
            <button
                className="p-2 mt-2 text-white bg-blue-500"
                onClick={handleSubmit}
                type="submit"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
export { LoginForm };

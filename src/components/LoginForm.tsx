import { FC, useState } from "react";
import { useRouter } from "next/router";

import { useUser } from "context";
import { songstagramApi } from "lib";

const LoginForm: FC<{}> = ({}) => {
    const router = useRouter();
    const { setAccessToken, setUser } = useUser();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        songstagramApi<{ accessToken: string; user: IBaseUser }>("/login", "POST", {
            email,
            password
        })
            .then(({ accessToken, user }) => {
                setAccessToken(accessToken);
                setUser({
                    userNo: user.userNo,
                    email: user.email,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    preferences: user.preferences
                });

                router.replace("/");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <form action="" method="POST" onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                    className="border border-black"
                    type="text"
                    onChange={({ target }) => setEmail(target?.value)}
                    value={email}
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input
                    className="border border-black"
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

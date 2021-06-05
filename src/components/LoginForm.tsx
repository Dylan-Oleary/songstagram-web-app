import { FC } from "react";
import { useRouter } from "next/router";

import { FormProvider, IFormData, useForm, useUser } from "context";
import { songstagramApi } from "lib";

interface ILoginFormData extends IFormData {
    email: string;
    password: string;
}

const Form: FC<{}> = ({}) => {
    const router = useRouter();
    const { setAccessToken, setUser } = useUser();
    const { formValues, onChange } = useForm<ILoginFormData>();

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        songstagramApi<{ accessToken: string; user: IBaseUser }>("/login", "POST", {
            email: formValues.email,
            password: formValues.password
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
                    onChange={({ target }) => onChange("email", target?.value)}
                    value={formValues.email}
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="email">Password</label>
                <input
                    className="border border-black"
                    type="text"
                    onChange={({ target }) => onChange("password", target?.value)}
                    value={formValues.password}
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

const LoginForm: FC<{}> = ({}) => {
    const initialFormValues: ILoginFormData = {
        email: "",
        password: ""
    };

    return (
        <FormProvider initialFormValues={initialFormValues}>
            <Form />
        </FormProvider>
    );
};

export default LoginForm;
export { LoginForm };

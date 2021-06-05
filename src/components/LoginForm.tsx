import { FC, FormEvent } from "react";
import { useRouter } from "next/router";

import { FormInputValidators, FormProvider, IFormData, useForm, useUser } from "context";
import { songstagramApi } from "lib";

interface ILoginFormData extends IFormData {
    email: string;
    password: string;
}

const Form: FC<{}> = ({}) => {
    const router = useRouter();
    const { setAccessToken, setUser } = useUser();
    const { action, formErrors, formValues, method, onChange } = useForm<ILoginFormData>();

    /**
     * Function to execute on submission of the form
     *
     * @param event The form submission event
     */
    const onSubmit: (event: FormEvent) => void = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (Object.keys(formErrors || {}).length > 0) return;

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
        <form action={action} className="w-full" method={method} onSubmit={onSubmit}>
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
            <button className="p-2 mt-2 text-white bg-blue-500" onClick={onSubmit} type="submit">
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
    const inputValidators: FormInputValidators = {
        email: [
            (value: string) => {
                if (value.length > 10) return new Error("YO");

                return;
            }
        ]
    };

    return (
        <FormProvider initialFormValues={initialFormValues} inputValidators={inputValidators}>
            <Form />
        </FormProvider>
    );
};

export default LoginForm;
export { LoginForm };

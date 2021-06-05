import { FC, FormEvent } from "react";
import { useRouter } from "next/router";

import { FormControl } from "components";
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
        <form action={action} className="w-full p-4 my-auto" method={method} onSubmit={onSubmit}>
            <div className="space-y-2">
                <FormControl
                    errors={formErrors?.email || []}
                    isRequired
                    label="Email"
                    name="email"
                    onChange={(value) => onChange("email", value)}
                    type="text"
                    value={formValues.email}
                />
                <FormControl
                    errors={formErrors?.password || []}
                    floatingLabel
                    isRequired
                    label="Password"
                    name="password"
                    onChange={(value) => onChange("password", value)}
                    type="text"
                    value={formValues.password}
                />
                <button
                    className="p-2 mt-2 text-white bg-blue-500"
                    onClick={onSubmit}
                    type="submit"
                >
                    Login
                </button>
            </div>
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
                if (value.length > 10) return new Error("Please enter a valid email");

                return;
            }
        ],
        password: [
            (value: string) => {
                if (value.length > 10) return new Error("Please enter a valid password");

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

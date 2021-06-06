import { FC, FormEvent, MouseEvent } from "react";

import { Button, FormControl } from "components";
import { FormInputValidators, FormProvider, IFormData, useForm } from "context";
import { songstagramApi } from "lib";

interface ILoginFormData extends IFormData {
    email: string;
    password: string;
}

const Form: FC<{}> = ({}) => {
    const { action, formErrors, formValues, method, onChange } = useForm<ILoginFormData>();

    /**
     * Function to execute on submission of the form
     *
     * @param event The form submission event
     */
    const onSubmit: (event?: FormEvent | MouseEvent) => void = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (Object.keys(formErrors || {}).length > 0) return;

        songstagramApi<{ accessToken: string; user: IBaseUser }>("/login", "POST", {
            email: formValues.email,
            password: formValues.password
        })
            .then(() => window.location.replace("/"))
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
                <Button ariaLabel="Login" onClick={onSubmit} type="submit">
                    Login
                </Button>
            </div>
        </form>
    );
};

const LoginForm: FC<{}> = ({}) => {
    const initialFormValues: ILoginFormData = {
        email: "",
        password: ""
    };
    const inputValidators: FormInputValidators = {};

    return (
        <FormProvider initialFormValues={initialFormValues} inputValidators={inputValidators}>
            <Form />
        </FormProvider>
    );
};

export default LoginForm;
export { LoginForm };

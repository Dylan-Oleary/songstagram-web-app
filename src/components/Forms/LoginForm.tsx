import { FC, FormEvent, MouseEvent } from "react";

import { Alert, Button, FormControl } from "components";
import { FormInputValidators, FormProvider, IFormData, useForm } from "context";
import { songstagramApi } from "lib";

interface ILoginFormData extends IFormData {
    email: string;
    password: string;
}

const Form: FC<{}> = ({}) => {
    const {
        action,
        formAlerts,
        formErrors,
        formValues,
        isSubmitting,
        method,
        onChange,
        setIsSubmitting,
        updateFormAlerts
    } = useForm<ILoginFormData>();

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

        if (formAlerts?.alerts?.length > 0) updateFormAlerts();
        if (Object.keys(formErrors || {}).length > 0) return;

        setIsSubmitting(true);
        songstagramApi<{ accessToken: string; user: IBaseUser }>("/login", "POST", {
            email: formValues.email,
            password: formValues.password
        })
            .then(() => window.location.replace("/"))
            .catch((error) => {
                let status = error?.response?.data?.status || 500;
                let message = "Incorrect email and/or password";

                if (new RegExp(/5\d{2}/gi).test(status))
                    message = "Sorry! Login is currently unavailable.";

                updateFormAlerts(message);
                setIsSubmitting(false);
            });
    };

    return (
        <form action={action} className="w-full p-4 my-auto" method={method} onSubmit={onSubmit}>
            <div className="space-y-2">
                {formAlerts?.alerts?.length > 0 && (
                    <Alert theme={formAlerts.theme}>
                        {formAlerts.alerts.map((alert, index) => (
                            <p key={`alert-${index}`}>{alert}</p>
                        ))}
                    </Alert>
                )}
                <FormControl
                    errors={formErrors?.email || []}
                    floatingLabel
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
                    type="password"
                    value={formValues.password}
                />
                <Button ariaLabel="Login" onClick={onSubmit} type="submit" isLoading={isSubmitting}>
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

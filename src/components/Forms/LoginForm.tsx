import { FC, FormEvent, MouseEvent } from "react";

import { Alert, Button, FormControl } from "components";
import { FormInputControl, FormProvider, IFormData, IFormComponentProps, useForm } from "context";
import { songstagramApi } from "lib";
import ClassNames from "@44north/classnames";

interface ILoginFormData extends IFormData {
    email: string;
    password: string;
}

const Form: FC<IFormComponentProps> = ({ className = "" }) => {
    const {
        action,
        formAlerts,
        formErrors,
        formValues,
        inputControl,
        isSubmitting,
        method,
        onChange,
        onSubmit,
        setIsSubmitting,
        updateFormAlerts
    } = useForm<ILoginFormData>();

    /**
     * Function to execute on submission of the form
     *
     * @param event The form submission event
     */
    const handleSubmit: (event?: FormEvent | MouseEvent) => void = (event) => {
        onSubmit(event, () =>
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
                })
        );
    };

    return (
        <form
            action={action}
            className={className as string}
            method={method}
            onSubmit={handleSubmit}
        >
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
                isRequired={inputControl?.email?.isRequired || false}
                label={inputControl?.email?.label}
                name={inputControl?.email?.name}
                onChange={(value) => onChange(inputControl.email.name, value)}
                type="text"
                value={formValues.email}
            />
            <FormControl
                errors={formErrors?.password || []}
                floatingLabel
                isRequired={inputControl?.password?.isRequired || false}
                label={inputControl?.password?.label}
                name={inputControl?.password?.name}
                onChange={(value) => onChange(inputControl?.password?.name, value)}
                type="password"
                value={formValues.password}
            />
            <Button
                ariaLabel="Login"
                childClassName="font-medium"
                fullWidth
                onClick={handleSubmit}
                type="submit"
                isLoading={isSubmitting}
            >
                Sign in
            </Button>
        </form>
    );
};

const LoginForm: FC<IFormComponentProps> = ({ className = "" }) => {
    const formClasses = new ClassNames().add(className);
    const inputControl: FormInputControl<ILoginFormData> = {
        email: {
            initialValue: "",
            isRequired: true,
            label: "Email",
            name: "email"
        },
        password: {
            initialValue: "",
            isRequired: true,
            label: "Password",
            name: "password"
        }
    };

    return (
        <FormProvider inputControl={inputControl}>
            <Form className={formClasses.list()} />
        </FormProvider>
    );
};

export default LoginForm;
export { LoginForm };

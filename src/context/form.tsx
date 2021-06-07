import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";

export interface IFormData {
    [key: string]: Primitive;
}

export type FormErrors<ExpectedFormData> = {
    [Property in keyof ExpectedFormData]: Array<string>;
};

export type FormInputControl<ExpectedFormData = IFormData> = {
    [Property in keyof ExpectedFormData]: {
        initialValue: Primitive;
        isRequired?: boolean;
        label: string;
        name: string;
        validators?: Array<(value: Primitive) => Error | void>;
    };
};

export type FormAlerts = {
    /**
     * The alert messages to display
     */
    alerts: Array<string>;
    /**
     * The theme used on the alert
     */
    theme: AlertTheme;
};

export interface IFormProviderProps {
    /**
     * The location of the form submission
     */
    action?: string;
    /**
     * The form submission method
     */
    method?: "POST" | "PUT";
    /**
     * Configuation used for the form inputs
     */
    inputControl: FormInputControl;
}

export interface IFormContext<ExpectedFormData> {
    /**
     * The location of the form submission
     */
    action: string;
    /**
     * The form alerts
     */
    formAlerts: FormAlerts;
    /**
     * The form errors
     */
    formErrors: FormErrors<ExpectedFormData>;
    /**
     * The form values
     */
    formValues: ExpectedFormData;
    /**
     * Configuation used for the form inputs
     */
    inputControl: FormInputControl<ExpectedFormData>;
    /**
     * Is the form currently in the process of being submitted to the API?
     */
    isSubmitting: boolean;
    /**
     * The form submission method
     */
    method: "POST" | "PUT";
    /**
     * Function to execute on change of an input
     */
    onChange: (field: string, value: Primitive) => void;
    /**
     * Set whether or not the form is currently being submitted
     */
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;
    /**
     * Updates the current form alerts and the theme to display
     */
    updateFormAlerts: (newAlerts?: string | string[], theme?: AlertTheme) => void;
}

const FormContext = createContext(undefined);

const FormProvider: FC<IFormProviderProps> = ({
    action = "",
    children,
    inputControl,
    method = "POST"
}) => {
    const [formValues, setFormValues] = useState<IFormData>(
        Object.fromEntries(
            Object.keys(inputControl).map((key) => [key, inputControl[key].initialValue])
        )
    );
    const [formErrors, setFormErrors] = useState<FormErrors<IFormData>>({});
    const [formAlerts, setFormAlerts] = useState<FormAlerts>({
        alerts: [],
        theme: "warning"
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    /**
     * Handles a form input change
     *
     * @param field The form field to update
     * @param value The updated form value
     */
    const onChange: (field: string, value: Primitive) => void = (field, value = null) => {
        setFormValues({
            ...formValues,
            [field]: value
        });

        if (inputControl[field]?.validators) validateInput(field, value);
    };

    /**
     * Updates the current form alerts and the theme to display
     *
     * @param newAlerts The new alerts to display
     * @param theme The alert theme to use
     */
    const updateFormAlerts: (newAlerts?: string | string[], theme?: AlertTheme) => void = (
        newAlerts = [],
        theme = "warning"
    ) => {
        let alerts = [];

        if (!Array.isArray(newAlerts)) {
            alerts.push(newAlerts);
        } else {
            alerts = [...newAlerts];
        }

        setFormAlerts({
            alerts,
            theme
        });
    };

    /**
     * Runs a form field's validation and sets errors if applicable
     *
     * @param field The form field to update
     * @param value The updated form value
     */
    const validateInput: (field: string, value: Primitive) => void = (field, value = null) => {
        const updatedFormErrors = { ...formErrors };
        const inputErrors: string[] = [];

        for (const validation of inputControl[field]?.validators) {
            const error = validation(value) as Error;

            if (error?.message) inputErrors.push(error.message);
        }

        if (inputErrors.length > 0) {
            updatedFormErrors[field] = inputErrors;
        } else if (updatedFormErrors[field]) {
            delete updatedFormErrors[field];
        }

        setFormErrors(updatedFormErrors);
    };

    return (
        <FormContext.Provider
            value={{
                action,
                formAlerts,
                formErrors,
                formValues,
                inputControl,
                isSubmitting,
                method,
                onChange,
                setIsSubmitting,
                updateFormAlerts
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

const useForm = <ExpectedFormData,>() => useContext<IFormContext<ExpectedFormData>>(FormContext);

export default FormProvider;
export { FormContext, FormProvider, useForm };

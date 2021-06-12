import {
    createContext,
    Dispatch,
    FC,
    FormEvent,
    MouseEvent,
    SetStateAction,
    useContext,
    useState
} from "react";
import { ClassNames } from "@44north/classnames";

export interface IFormComponentProps {
    /**
     * Classes to be applied to the form element
     */
    className?: string | ClassNames;
}

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
     * Enables live validation on a form input
     */
    liveValidation: boolean;
    /**
     * The form submission method
     */
    method: "POST" | "PUT";
    /**
     * Function to execute on change of an input
     */
    onChange: (field: string, value: Primitive) => void;
    /**
     * Function to execute on form submission
     */
    onSubmit: (event: FormEvent | MouseEvent, submit: () => Promise<void>) => void;
    /**
     * Set whether or not the form is currently being submitted
     */
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;
    /**
     * Updates the current form alerts and the theme to display
     */
    updateFormAlerts: (newAlerts?: string | string[], theme?: AlertTheme) => void;
    /**
     * Validates a form submission before sending a request to the API
     */
    validateSubmission: (formData: ExpectedFormData) => boolean;
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
    const [liveValidation, setLiveValidation] = useState<boolean>(false);

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

        if ((inputControl[field]?.validators || inputControl[field]?.isRequired) && liveValidation)
            validateInput(field, value);
    };

    /**
     * Handles submission of the form
     *
     * @param event The form submission event
     * @param submit The callback to execute upon successful form validation
     */
    const onSubmit: (event: FormEvent | MouseEvent, submit: () => Promise<void>) => void = (
        event,
        submit
    ) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!validateSubmission(formValues)) return;

        submit();
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

        if (inputControl[field]?.isRequired) {
            if (!value || (value as string).trim() === "")
                inputErrors.push(`${inputControl[field].label} is a required field`);
        }

        for (const validation of inputControl[field]?.validators || []) {
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

    /**
     * Validates a form submission before sending a request to the API
     *
     * @param formData The current form data
     */
    const validateSubmission: (formData: IFormData) => boolean = (formData) => {
        let isValidSubmission = true;
        const formErrors = {};

        for (const key of Object.keys(inputControl)) {
            const inputErrors: string[] = [];

            if (inputControl[key]?.isRequired) {
                if (!formData[key] || (formData[key] as string).trim() === "")
                    inputErrors.push(`${inputControl[key].label} is a required field`);
            }

            for (const validation of inputControl[key]?.validators || []) {
                const error = validation(formData[key]) as Error;

                if (error?.message) inputErrors.push(error.message);
            }

            if (inputErrors.length > 0) formErrors[key] = inputErrors;
        }

        if (Object.keys(formErrors).length > 0) {
            isValidSubmission = false;

            setLiveValidation(true);
            setFormErrors(formErrors);
            updateFormAlerts(
                "Some fields are missing or are incorrect. Please fix them before submitting."
            );
        }

        if (isValidSubmission) {
            setIsSubmitting(true);
            if (formAlerts?.alerts?.length > 0) updateFormAlerts();
        }

        return isValidSubmission;
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
                onSubmit,
                setIsSubmitting,
                updateFormAlerts,
                validateSubmission
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

const useForm = <ExpectedFormData,>() => useContext<IFormContext<ExpectedFormData>>(FormContext);

export default FormProvider;
export { FormContext, FormProvider, useForm };

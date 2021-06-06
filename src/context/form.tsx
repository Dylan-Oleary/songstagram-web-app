import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";

export interface IFormData {
    [key: string]: Primitive;
}

export type FormInputValidators = {
    [key: string]: Array<(value: Primitive) => Error | void>;
};

export type FormErrors<ExpectedFormData> = {
    [Property in keyof ExpectedFormData]: Array<string>;
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
     * The initial form values
     */
    initialFormValues: IFormData;
    /**
     * An object that stores each field's validation logic
     */
    inputValidators: FormInputValidators;
}

export interface IFormContext<ExpectedFormData> {
    /**
     * The location of the form submission
     */
    action: string;
    /**
     * The form errors
     */
    formErrors: FormErrors<ExpectedFormData>;
    /**
     * The form values
     */
    formValues: ExpectedFormData;
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
}

const FormContext = createContext(undefined);

const FormProvider: FC<IFormProviderProps> = ({
    action = "",
    children,
    initialFormValues = {},
    inputValidators = {},
    method = "POST"
}) => {
    const [formValues, setFormValues] = useState<IFormData>(initialFormValues);
    const [formErrors, setFormErrors] = useState<FormErrors<IFormData>>({});
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

        if (inputValidators[field]) validateInput(field, value);
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

        for (const validation of inputValidators[field]) {
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
                formErrors,
                formValues,
                isSubmitting,
                method,
                onChange,
                setIsSubmitting
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

const useForm = <ExpectedFormData,>() => useContext<IFormContext<ExpectedFormData>>(FormContext);

export default FormProvider;
export { FormContext, FormProvider, useForm };

import { createContext, FC, useContext, useState } from "react";

export interface IFormData {
    [key: string]: Primitive;
}

export interface IFormInitializeContext {
    /**
     * The initial form values
     */
    initialFormValues: IFormData;
}

export interface IFormContext<ExpectedFormData = IFormData> {
    /**
     * The form values
     */
    formValues: ExpectedFormData;
    /**
     * Function to execute on change of an input
     */
    onChange: (field: string, value: Primitive) => void;
}

const FormContext = createContext(undefined);

const FormProvider: FC<IFormInitializeContext> = ({ children, initialFormValues = {} }) => {
    const [formValues, setFormValues] = useState<IFormData>(initialFormValues);

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
    };

    return (
        <FormContext.Provider
            value={{
                formValues,
                onChange
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

const useForm = <ExpectedFormData,>() => useContext<IFormContext<ExpectedFormData>>(FormContext);

export default FormProvider;
export { FormContext, FormProvider, useForm };

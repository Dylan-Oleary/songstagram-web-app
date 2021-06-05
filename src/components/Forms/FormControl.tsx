import { FC, ReactNode } from "react";
import { ClassNames } from "@44north/classnames";

import { TextInput } from "components";

type FormControlProps = {
    /**
     * Classes to be applied to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * Use a floating label
     */
    floatingLabel?: boolean;
    /**
     * Classes to be applied to the input element
     */
    inputClassName?: string | ClassNames;
    /**
     * Is the input required for submission?
     */
    isRequired?: boolean;
    /**
     * The input label
     */
    label?: JSX.Element | ReactNode | string;
    /**
     * Classes to be applied to the label element
     */
    labelClassName?: string | ClassNames;
    /**
     * The maximum value
     */
    max?: number;
    /**
     * The maximum length of the text input
     */
    maxLength?: number;
    /**
     * The minimum value
     */
    min?: number;
    /**
     * The minimum length of the text input
     */
    minLength?: number;
    /**
     * The input field name
     */
    name: string;
    /**
     * The input type
     */
    type: "checkbox" | "number" | "password" | "text" | "textarea";
    /**
     * The value of the input
     */
    value: string | number;
} & (
    | {
          type: "text" | "textarea";
          maxLength?: number;
          minLength?: number;
          max?: never;
          min?: never;
          onChange: (value: string) => void;
          value: string;
      }
    | {
          type: "number";
          max?: number;
          min?: number;
          maxLength?: never;
          minLength?: never;
          onChange: (value: number) => void;
          value: number;
      }
);

const FormControl: FC<FormControlProps> = ({
    className = "",
    floatingLabel = false,
    inputClassName = "",
    isRequired = false,
    label,
    labelClassName = "",
    max,
    maxLength,
    min = 0,
    minLength = 0,
    name = "",
    onChange = () => {},
    type = "text",
    value
}) => {
    const wrapperClasses = new ClassNames("dark:bg-gray-6")
        .add(className)
        .add(
            floatingLabel
                ? "relative border rounded-lg border-gray-6 px-4 py-2 focus-within:border-primary-3 focus-within:border-opacity-60 focus-within:ring-2 focus-within:ring-primary-3 focus-within:ring-opacity-60 h-12 flex flex-col justify-end"
                : "flex flex-col"
        );
    const labelClasses = new ClassNames()
        .add(labelClassName)
        .add(
            floatingLabel
                ? "absolute bottom-3 -z-1 floating-label duration-300 text-gray-3 origin-0"
                : "order-1 mb-2"
        )
        .add(isRequired ? "" : "flex");
    const inputClasses = new ClassNames("text-gray-1 w-full")
        .add(inputClassName)
        .add(
            floatingLabel
                ? "h-5 appearance-none focus:outline-none bg-transparent"
                : "border rounded-lg border-gray-6 h-8 order-2 px-2 focus:outline-none focus:ring-2 focus:ring-primary-3 focus:ring-opacity-60"
        );
    let control: JSX.Element;

    switch (type) {
        case "text":
            control = (
                <TextInput
                    className={inputClasses}
                    name={name}
                    onChange={onChange as (value: string) => void}
                    value={value as string}
                />
            );
            break;
        default:
            control = (
                <TextInput
                    className={inputClasses}
                    name={name}
                    onChange={onChange as (value: string) => void}
                    value={value as string}
                />
            );
    }

    return (
        <div className={wrapperClasses.list()}>
            {control}
            {label && (
                <label className={labelClasses.list()} htmlFor={name}>
                    {label}
                    {!isRequired && <span className="self-center ml-1 text-xs">(optional)</span>}
                </label>
            )}
        </div>
    );
};

export default FormControl;
export { FormControl };

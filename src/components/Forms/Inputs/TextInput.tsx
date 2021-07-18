import { ChangeEvent, FC } from "react";
import { ClassNames } from "@44north/classnames";

interface ITextInputProps {
    /**
     * Classes to be applied to the input
     */
    className?: string | ClassNames;
    /**
     * The name of the input
     */
    name: string;
    /**
     * function to execute on input change
     */
    onChange: (value: string) => void;
    /**
     * The placeholder to display on the input
     */
    placeholder?: string;
    /**
     * The type of text input
     */
    type?: "text" | "textarea";
    /**
     * The input value
     */
    value: string;
}

const TextInput: FC<ITextInputProps> = ({
    className = "",
    name = "",
    onChange = () => {},
    placeholder = " ",
    type = "text",
    value = ""
}) => {
    const inputClass = new ClassNames().add(className);

    /**
     * Handle input change
     *
     * @param event The input change event
     */
    const handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (
        event
    ) => {
        const { target } = event;

        onChange(target?.value || "");
    };

    return type === "textarea" ? (
        <textarea
            autoComplete="off"
            className={inputClass.list()}
            id={name}
            name={name}
            onChange={handleChange}
            value={value}
            placeholder={placeholder}
        />
    ) : (
        <input
            autoComplete="off"
            className={inputClass.list()}
            id={name}
            name={name}
            onChange={handleChange}
            type="text"
            value={value}
            placeholder={placeholder}
        />
    );
};

export default TextInput;
export { TextInput };

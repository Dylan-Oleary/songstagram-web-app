import { ChangeEvent, FC, useState } from "react";
import { ClassNames } from "@44north/classnames";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

import { Button } from "components";

interface IPasswordInputProps {
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
     * The input value
     */
    value: string;
}

const PasswordInput: FC<IPasswordInputProps> = ({
    className = "",
    name = "",
    onChange = () => {},
    placeholder = " ",
    value = ""
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const inputClass = new ClassNames("pr-4").add(className);

    /**
     * Handle input change
     *
     * @param event The input change event
     */
    const handleChange: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
        const { target } = event;

        onChange(target?.value || "");
    };

    return (
        <>
            <input
                autoComplete="off"
                className={inputClass.list()}
                id={name}
                name={name}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                value={value}
                placeholder={placeholder}
            />
            <Button
                className="absolute mb-1 right-2 text-gray-3 dark:text-gray-6"
                onClick={() => setShowPassword(!showPassword)}
                size="none"
                style="none"
            >
                {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                ) : (
                    <EyeOffIcon className="w-5 h-5" />
                )}
            </Button>
        </>
    );
};

export default PasswordInput;
export { PasswordInput };

import { FC, FormEvent, MouseEvent } from "react";
import { ClassNames } from "@44north/classnames";

type ButtonProps = {
    /**
     * The button's aria label
     */
    ariaLabel?: string;
    /**
     * Controls the button's border radius
     */
    borderRadius?: "circle" | "rounded" | "none";
    /**
     * Classes to be applied to the child elements
     */
    childClassName?: string | ClassNames;
    /**
     * Classes to be applied to the button
     */
    className?: string | ClassNames;
    /**
     * Is the button currently disabled?
     */
    disabled?: boolean;
    /**
     * Function to execute on click of the button
     */
    onClick: (event?: MouseEvent | FormEvent) => void;
    /**
     * Render the button with outline styles
     */
    outline?: boolean;
    /**
     * The size of the button
     */
    size?: "xs" | "sm" | "md" | "lg";
    /**
     * The button styles to be applied
     */
    style?: "primary" | "secondary" | "none";
    /**
     * The type of button
     */
    type?: "button" | "submit";
};

const Button: FC<ButtonProps> = ({
    ariaLabel = "button",
    borderRadius = "rounded",
    childClassName = "",
    children,
    className = "",
    disabled = false,
    onClick = () => {},
    outline = false,
    size = "md",
    style = "primary",
    type = "button"
}) => {
    let buttonClasses = new ClassNames(
        style !== "none"
            ? "transition duration-300 ease-in-out focus:outline-none focus:ring-2 disabled:border-gray-3 disabled:text-white disabled:bg-gray-3 disabled:text-opacity-60 disabled:opacity-40 disabled:cursor-not-allowed"
            : ""
    )
        .add(borderRadius !== "none" ? "rounded-lg" : "")
        .add(className);
    let childClasses = new ClassNames().add(childClassName);

    /**
     * Handles the button click event
     *
     * @param event
     */
    const handleClick: (event?: MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!disabled) onClick();
    };

    /**
     * Apply styles
     */
    if (outline) {
        buttonClasses.add("hover:text-white active:text-white");

        switch (style) {
            case "primary":
                buttonClasses.add(
                    "text-primary-3 border border-primary-3 focus:ring-primary-4 hover:bg-primary-2 hover:border-primary-2 active:bg-primary-1 active:border-primary-1"
                );
                break;
            case "secondary":
                buttonClasses.add(
                    "text-secondary-3 border border-secondary-3 focus:ring-secondary-4 hover:bg-secondary-2 hover:border-secondary-2 active:bg-secondary-1 active:border-secondary-1"
                );
                break;
            default:
                buttonClasses.add(
                    "text-primary-3 border border-primary-3 focus:ring-primary-4 hover:bg-primary-2 hover:border-primary-2 active:bg-primary-1 active:border-primary-1"
                );
                break;
        }
    } else {
        switch (style) {
            case "primary":
                buttonClasses.add(
                    "bg-primary-3 text-white border border-primary-3 focus:ring-primary-4 focus:bg-primary-2 hover:bg-primary-2 active:bg-primary-1"
                );
                break;
            case "secondary":
                buttonClasses.add(
                    "bg-secondary-3 text-white border border-secondary-3 focus:ring-secondary-4 hover:bg-secondary-2 active:bg-secondary-1"
                );
                break;
            default:
                buttonClasses.add(
                    "bg-primary-3 text-white border border-primary-3 focus:ring-primary-4 hover:bg-primary-2 hover:bg-primary-2 active:bg-primary-1"
                );
                break;
        }
    }

    /**
     * Apply border radius
     */
    switch (borderRadius) {
        case "circle":
            buttonClasses.add("rounded-full flex items-center justify-center");
            buttonClasses.remove("rounded-lg");

            switch (size) {
                case "xs":
                    buttonClasses.add("h-8 w-8");
                    childClasses.add("text-xs");
                    break;
                case "sm":
                    buttonClasses.add("h-12 w-12");
                    childClasses.add("text-sm");
                    break;
                case "md":
                    buttonClasses.add("h-16 w-16");
                    childClasses.add("text-base");
                    break;
                case "lg":
                    buttonClasses.add("h-20 w-20");
                    childClasses.add("text-3xl");
                    break;
                default:
                    buttonClasses.add("h-24 w-24");
                    childClasses.add("text-base");
                    break;
            }
            break;
        case "none":
            buttonClasses.remove("rounded-lg");
            break;
        default:
            break;
    }

    /**
     * Apply size
     */
    if (borderRadius !== "circle") {
        switch (size) {
            case "xs":
                buttonClasses.add("py-1 px-4");
                childClasses.add("text-xs");
                break;
            case "sm":
                buttonClasses.add("py-2 px-5");
                childClasses.add("text-sm");
                break;
            case "md":
                buttonClasses.add("py-3 px-7");
                childClasses.add("text-base");
                break;
            case "lg":
                buttonClasses.add("py-6 px-10");
                childClasses.add("text-3xl");
                break;
            default:
                buttonClasses.add("py-3 px-7");
                childClasses.add("text-base");
                break;
        }
    }

    return (
        <button
            aria-label={ariaLabel}
            className={buttonClasses.list()}
            disabled={disabled}
            onClick={handleClick}
            type={type}
        >
            <div className={childClasses.list()}>{children}</div>
        </button>
    );
};

export default Button;
export { Button };

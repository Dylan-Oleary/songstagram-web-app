import { FC, ReactNode } from "react";
import { ClassNames } from "@44north/classnames";
import {
    CheckCircleIcon,
    ExclamationIcon,
    InformationCircleIcon,
    XCircleIcon
} from "@heroicons/react/solid";

interface IAlertProps {
    /**
     * Classes to be applied to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * The alert theme
     */
    theme?: AlertTheme;
}

const Alert: FC<IAlertProps> = ({ children, className = "", theme = "info" }) => {
    const wrapperClasses = new ClassNames("p-4 border-l-4").add(className);
    const messageClasses = new ClassNames("text-sm ml-3");
    let icon: JSX.Element | ReactNode;

    switch (theme) {
        case "danger":
            wrapperClasses.add("border-danger-3 bg-danger-5");
            messageClasses.add("text-danger-2");
            icon = <XCircleIcon className="w-5 h-5 text-danger-3" aria-hidden="true" />;
            break;
        case "success":
            wrapperClasses.add("border-success-3 bg-success-5");
            messageClasses.add("text-success-2");
            icon = <CheckCircleIcon className="w-5 h-5 text-success-3" aria-hidden="true" />;
            break;
        case "warning":
            wrapperClasses.add("border-warning-3 bg-warning-5");
            messageClasses.add("text-warning-2");
            icon = <ExclamationIcon className="w-5 h-5 text-warning-3" aria-hidden="true" />;
            break;
        default:
            wrapperClasses.add("border-info-3 bg-info-5");
            messageClasses.add("text-info-2");
            icon = <InformationCircleIcon className="w-5 h-5 text-info-3" aria-hidden="true" />;
            break;
    }

    return (
        <div className={wrapperClasses.list()}>
            <div className="flex">
                <div className="flex-shrink-0">{icon}</div>
                <div className={messageClasses.list()}>{children}</div>
            </div>
        </div>
    );
};

export default Alert;
export { Alert };

import { FC, useState } from "react";
import { ClassNames } from "@44north/classnames";

import { DefaultAvatarIcon } from "icons";

interface IAvatarProps {
    /**
     * The alt text for the avatar
     */
    alt?: string;
    /**
     * Class names to be applied to the avatar
     */
    className?: string | ClassNames;
    /**
     * The size of the avatar
     */
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
    /**
     * The img source used for the avatar
     */
    src?: string;
}

const Avatar: FC<IAvatarProps> = ({ alt = "Avatar", className = "", size = "md", src }) => {
    const [showDefault, setShowDefault] = useState<boolean>(src ? false : true);
    const avatarClasses = new ClassNames("rounded-full").add(className);

    switch (size) {
        case "sm":
            avatarClasses.add("w-8 h-8 sm:h-12 sm:w-12");
            break;
        case "md":
            avatarClasses.add("w-16 h-16 sm:h-20 sm:w-20");
            break;
        case "lg":
            avatarClasses.add("w-24 h-24 sm:h-28 sm:w-28");
            break;
        case "xl":
            avatarClasses.add("w-32 h-32 sm:h-36 sm:w-36");
            break;
        case "2xl":
            avatarClasses.add("w-40 h-40 sm:h-44 sm:w-44");
            break;
        case "4xl":
            avatarClasses.add("w-56 h-56 sm:h-60 sm:w-60");
            break;
        default:
            avatarClasses.add("w-8 h-8 sm:h-12 sm:w-12");
            break;
    }

    return showDefault ? (
        <DefaultAvatarIcon className={avatarClasses.add("bg-gray-4 text-gray-6").list()} />
    ) : (
        <img
            className={avatarClasses.list()}
            src={src}
            alt={alt}
            onError={() => setShowDefault(true)}
        />
    );
};

export default Avatar;
export { Avatar };

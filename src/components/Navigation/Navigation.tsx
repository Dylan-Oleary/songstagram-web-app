import { Dispatch, FC, SetStateAction } from "react";
import { GlobeIcon, HomeIcon } from "@heroicons/react/outline";

import { DesktopNavigation, MobileNavigation } from "components";

interface INavigationProps {
    /**
     * Is the navigation currently open?
     */
    isOpen: boolean;
    /**
     * Set the open state of the navigation
     */
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const navigation = [
    { name: "Home", href: "/", icon: HomeIcon, current: true },
    {
        name: "Explore",
        href: "/explore",
        icon: GlobeIcon,
        current: false
    }
];

const Navigation: FC<INavigationProps> = ({ isOpen = false, setIsOpen }) => {
    return (
        <>
            <MobileNavigation isOpen={isOpen} navigation={navigation} setIsOpen={setIsOpen} />
            <DesktopNavigation navigation={navigation} />
        </>
    );
};

export default Navigation;
export { Navigation };

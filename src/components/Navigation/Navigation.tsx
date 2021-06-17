import { Dispatch, FC, SetStateAction } from "react";
import { useRouter } from "next/router";
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
    { name: "Home", href: "/", icon: HomeIcon },
    {
        name: "Explore",
        href: "/explore",
        icon: GlobeIcon
    }
];

const Navigation: FC<INavigationProps> = ({ isOpen = false, setIsOpen }) => {
    const router = useRouter();

    return (
        <>
            <MobileNavigation
                currentPath={router.pathname}
                isOpen={isOpen}
                navigation={navigation}
                setIsOpen={setIsOpen}
            />
            <DesktopNavigation currentPath={router.pathname} navigation={navigation} />
        </>
    );
};

export default Navigation;
export { Navigation };

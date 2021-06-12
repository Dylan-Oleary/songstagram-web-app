import { Dispatch, FC, SetStateAction } from "react";
import {
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    UsersIcon
} from "@heroicons/react/outline";

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
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    { name: "Team", href: "#", icon: UsersIcon, current: false },
    { name: "Projects", href: "#", icon: FolderIcon, current: false },
    { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    { name: "Documents", href: "#", icon: InboxIcon, current: false },
    { name: "Reports", href: "#", icon: ChartBarIcon, current: false }
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

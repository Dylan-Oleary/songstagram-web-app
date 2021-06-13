import { FC } from "react";
import Link from "next/link";
import { ClassNames } from "@44north/classnames";

import { NavigationHeader } from "components";

interface IDesktopNavigationProps {
    /**
     * The navigation items to display in the component
     */
    navigation: NavigationItem[];
}

const DesktopNavigation: FC<IDesktopNavigationProps> = ({ navigation = [] }) => {
    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-96">
                <div className="flex flex-col flex-1 h-0 bg-white dark:bg-dark">
                    <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                        <NavigationHeader className="px-2" />
                        <nav className="flex-1 px-2 mt-5 space-y-1 bg-white dark:bg-dark">
                            {navigation.map((item) => (
                                <Link key={item.name} href={item.href}>
                                    <a
                                        className={new ClassNames(
                                            item.current
                                                ? "bg-gray-3 text-white"
                                                : "dark:text-white hover:bg-gray-700 hover:text-white",
                                            "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                        ).list()}
                                    >
                                        <item.icon
                                            className={new ClassNames(
                                                item.current
                                                    ? "text-gray-300"
                                                    : "text-gray-400 group-hover:text-gray-300",
                                                "mr-3 flex-shrink-0 h-6 w-6"
                                            ).list()}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopNavigation;
export { DesktopNavigation };

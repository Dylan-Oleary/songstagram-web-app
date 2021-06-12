import { FC } from "react";
import Link from "next/link";
import { ClassNames } from "@44north/classnames";

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
                <div className="flex flex-col flex-1 h-0 bg-gray-800">
                    <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <img
                                className="w-auto h-8"
                                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                                alt="Workflow"
                            />
                        </div>
                        <nav className="flex-1 px-2 mt-5 space-y-1 bg-gray-800">
                            {navigation.map((item) => (
                                <Link key={item.name} href={item.href}>
                                    <a
                                        className={new ClassNames(
                                            item.current
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
                    <div className="flex flex-shrink-0 p-4 bg-gray-700">
                        <Link href="/">
                            <a className="flex-shrink-0 block w-full group">
                                <div className="flex items-center">
                                    <div>
                                        <img
                                            className="inline-block rounded-full h-9 w-9"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">Tom Cook</p>
                                        <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                                            View profile
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopNavigation;
export { DesktopNavigation };

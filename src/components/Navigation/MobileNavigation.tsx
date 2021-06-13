import { Dispatch, FC, Fragment, SetStateAction } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { ClassNames } from "@44north/classnames";

import { NavigationHeader } from "components";

interface IMobileNavigationProps {
    /**
     * Is the navigation currently open?
     */
    isOpen: boolean;
    /**
     * The navigation items to display in the component
     */
    navigation: NavigationItem[];
    /**
     * Set the open state of the navigation
     */
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileNavigation: FC<IMobileNavigationProps> = ({
    isOpen = false,
    navigation = [],
    setIsOpen
}) => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed inset-0 z-40 flex md:hidden"
                open={isOpen}
                onClose={setIsOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white dark:bg-dark">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="absolute top-0 right-0 pt-2 -mr-12">
                                <button
                                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </Transition.Child>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <NavigationHeader />
                            <nav className="px-2 mt-5 space-y-1">
                                {navigation.map((item) => (
                                    <Link href={item.href} key={item.name}>
                                        <a
                                            className={new ClassNames(
                                                item.current
                                                    ? "bg-gray-3 text-white"
                                                    : "dark:text-white  hover:bg-gray-700 hover:text-white",
                                                "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                                            ).list()}
                                        >
                                            <item.icon
                                                className={new ClassNames(
                                                    item.current
                                                        ? "text-gray-300"
                                                        : "text-gray-400 group-hover:text-gray-300",
                                                    "mr-4 flex-shrink-0 h-6 w-6"
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
                </Transition.Child>
                <div className="flex-shrink-0 w-14">
                    {/* Force sidebar to shrink to fit close icon */}
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default MobileNavigation;
export { MobileNavigation };

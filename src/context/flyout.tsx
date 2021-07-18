import { createContext, FC, Fragment, ReactNode, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

type Flyout = {
    /**
     * The content to render inside of the flyout
     */
    content: JSX.Element | ReactNode;
    /**
     * Is the flyout currently open?
     */
    isOpen: boolean;
};

interface IFlyoutContext {
    /**
     * The current flyout configuration
     */
    currentFlyout: Flyout;
    /**
     * Function that will close the flyout
     */
    closeFlyout: () => void;
    /**
     * Function that opens the flyout
     */
    openFlyout: (content: JSX.Element | ReactNode) => void;
}

const FlyoutContext = createContext<IFlyoutContext>(undefined);

const FlyoutProvider: FC<{}> = ({ children }) => {
    const [currentFlyout, setCurrentFlyout] = useState<Flyout>({
        content: undefined,
        isOpen: false
    });
    const refDiv = useRef<HTMLDivElement>(null);

    const openFlyout: (content: JSX.Element | ReactNode) => void = (content) => {
        setCurrentFlyout({
            ...currentFlyout,
            content,
            isOpen: true
        });
    };

    const closeFlyout = () => {
        setCurrentFlyout({
            ...currentFlyout,
            content: undefined,
            isOpen: false
        });
    };

    return (
        <FlyoutContext.Provider
            value={{
                currentFlyout,
                closeFlyout,
                openFlyout
            }}
        >
            <Transition.Root as={Fragment} show={currentFlyout.isOpen}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 overflow-hidden"
                    open={currentFlyout.isOpen}
                    onClose={closeFlyout}
                    initialFocus={refDiv}
                >
                    <div className="absolute inset-0 overflow-hidden" ref={refDiv}>
                        <Dialog.Overlay className="absolute inset-0 backdrop-filter backdrop-blur-sm" />
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-500"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <div className="w-screen max-w-2xl bg-white dark:bg-dark shadow-left-1">
                                    {currentFlyout.content}
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {children}
        </FlyoutContext.Provider>
    );
};

const useFlyout = () => useContext(FlyoutContext);

export default FlyoutProvider;
export { FlyoutContext, FlyoutProvider, useFlyout };

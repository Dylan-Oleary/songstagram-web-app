import { createContext, FC, Fragment, ReactNode, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ClassNames } from "@44north/classnames";

type Modal = {
    /**
     * Modal alignment
     */
    align: "align-top" | "align-bottom" | "align-middle";
    /**
     * Classes to apply to the modal wrapper
     */
    className: string | ClassNames;
    /**
     * The content to render
     */
    content?: JSX.Element | ReactNode;
    /**
     * Is the modal currently open?
     */
    isOpen: boolean;
};

interface ISetModalOptions {
    /**
     * Modal alignment
     */
    align?: "align-top" | "align-bottom" | "align-middle";
    /**
     * Classes to apply to the modal wrapper
     */
    className?: string | ClassNames;
    /**
     * The content to render
     */
    content: JSX.Element | ReactNode;
}

interface IModalContext {
    /**
     * Closes the modal and executes any passed callback
     */
    closeModal: (callback?: Function) => void;
    /**
     * The current modal
     */
    currentModal: Modal;
    /**
     * Opens the modal and executes any passed callback
     */
    openModal: (modal: ISetModalOptions, callback?: Function) => void;
}

const ModalContext = createContext<IModalContext>({
    closeModal: () => {},
    currentModal: undefined,
    openModal: () => {}
});

const ModalProvider: FC<{}> = ({ children }) => {
    const [currentModal, setCurrentModal] = useState<Modal>({
        align: "align-middle",
        className: "",
        content: undefined,
        isOpen: false
    });
    const refDiv = useRef<HTMLDivElement>(null);
    const modalWrapperClasses = new ClassNames(
        "inline-block w-8/12 text-left transition-all transform bg-white shadow-xl dark:bg-dark"
    ).add(currentModal.className);

    const closeModal: (callback?: Function) => void = (callback = () => {}) => {
        setCurrentModal({
            align: "align-middle",
            className: "",
            content: undefined,
            isOpen: false
        });
        callback();
    };

    const openModal: (modal: ISetModalOptions, callback?: Function) => void = (
        modal,
        callback = () => {}
    ) => {
        const { align = "align-middle", className = "", content } = modal;

        setCurrentModal({
            align,
            className,
            content,
            isOpen: true
        });
        callback();
    };

    switch (currentModal.align) {
        case "align-top":
            modalWrapperClasses.add("align-middle");
            break;
        case "align-middle":
            modalWrapperClasses.add("align-middle");
            break;
        case "align-bottom":
            modalWrapperClasses.add("align-bottom");
            break;
        default:
            modalWrapperClasses.add("align-middle");
    }

    return (
        <ModalContext.Provider value={{ closeModal, currentModal, openModal }}>
            <Transition.Root show={currentModal.isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-10 overflow-y-auto"
                    open={currentModal.isOpen}
                    onClose={() => closeModal()}
                    initialFocus={refDiv}
                >
                    <div
                        className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
                        ref={refDiv}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="absolute inset-0 bg-gray-3 backdrop-filter backdrop-blur-sm bg-opacity-70" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className={modalWrapperClasses.list()}>{currentModal.content}</div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            {children}
        </ModalContext.Provider>
    );
};

const useModal = () => useContext(ModalContext);

export default ModalProvider;
export { ModalContext, ModalProvider, useModal };

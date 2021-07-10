import { FC, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { ClassNames } from "@44north/classnames";

interface ISelectInputProps {
    /**
     * Classes to be applied to the input
     */
    className?: string | ClassNames;
    /**
     * The name of the input
     */
    name: string;
    /**
     * function to execute on input change
     */
    onChange: (value: SelectInputOption) => void;
    /**
     * Classes to be applied to the option items wrapper
     */
    optionItemWrapperClassName?: string | ClassNames;
    /**
     * The options used in the select list
     */
    options: SelectInputOption[];
    /**
     * The input value
     */
    value: SelectInputOption;
}

const SelectInput: FC<ISelectInputProps> = ({
    className = "",
    name,
    onChange,
    optionItemWrapperClassName = "",
    options,
    value
}) => {
    const wrapperClasses = new ClassNames("relative w-full").add(className);
    const optionItemWrapperClasses = new ClassNames(
        "right-0 absolute z-10 p-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg dark:bg-gray-2 max-h-60"
    ).add(optionItemWrapperClassName);

    return (
        <div className={wrapperClasses.list()}>
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <>
                        <Listbox.Button className="w-full px-4 py-2 transition-colors bg-white rounded-md shadow-lg cursor-pointer duration-250 dark:hover:bg-gray-3 hover:bg-gray-6 dark:bg-gray-2 bg-relative sm:text-sm">
                            {value.label}
                        </Listbox.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className={optionItemWrapperClasses.list()}>
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={`${name}-option-${option.value}`}
                                        as={Fragment}
                                        value={option}
                                    >
                                        {({ active, selected }) => {
                                            const classes = new ClassNames(
                                                "flex justify-between items-center cursor-default select-none relative p-2 transition-colors duration-250 dark:bg-gray-2 bg-white"
                                            ).add(
                                                active ? "dark:hover:bg-gray-3 hover:bg-gray-6" : ""
                                            );
                                            return (
                                                <li className={classes.list()}>
                                                    {option.label}
                                                    {selected && <CheckIcon className="w-4 h-4" />}
                                                </li>
                                            );
                                        }}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </>
                )}
            </Listbox>
        </div>
    );
};

export default SelectInput;
export { SelectInput };

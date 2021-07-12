import { useState, useEffect } from "react";

/**
 * A hook that returns a debounced value based on the delay passed to the hook
 *
 * This is useful for limiting the amount of expensive actions.
 *
 * @example Using the debounce to search for autocompletion results, instead of performing a search
 * on every change the input registers
 *
 * @param value The current value passed in from the parent
 * @param delay The time to wait (milliseconds) before updating the debounced value
 *
 * @returns The value after the debounce has run
 */
const useDebounce: (value: string, delay?: number) => string = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
};

export default useDebounce;
export { useDebounce };

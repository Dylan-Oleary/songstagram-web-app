import { FC } from "react";

interface ISearchInputProps {
    /**
     * Function to execute on input change
     */
    onChange: (value: string) => void;
    /**
     * The current search term value
     */
    value: string;
}

const SearchInput: FC<ISearchInputProps> = ({ onChange = () => {}, value = "" }) => {
    return (
        <div className="flex-grow">
            <input
                className="w-full text-gray-1"
                onChange={({ target }) => onChange(target?.value || "")}
                placeholder="Search far and wide for tunes"
                type="text"
                value={value}
            />
        </div>
    );
};

export default SearchInput;
export { SearchInput };

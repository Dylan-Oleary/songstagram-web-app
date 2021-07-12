import { FC } from "react";
import { SearchIcon } from "@heroicons/react/outline";

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
        <div className="relative flex items-center flex-grow">
            <input
                className="w-full py-2 pl-12 pr-4 bg-white border rounded-full shadow-md border-gray-6 text-gray-3"
                onChange={({ target }) => onChange(target?.value || "")}
                placeholder="Artist, albums, songs, or users"
                type="text"
                autoComplete="new-password"
                value={value}
            />
            <SearchIcon className="absolute w-5 h-5 left-5 text-gray-5" />
        </div>
    );
};

export default SearchInput;
export { SearchInput };

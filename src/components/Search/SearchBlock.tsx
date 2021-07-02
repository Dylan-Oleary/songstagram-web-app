import { FC, useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

import { SearchResults } from "components";
import { useUser } from "context";

interface ISearchBlockProps {
    /**
     * The initial search term of the component
     *
     * If passed, a search will be triggered
     */
    initialSearchTerm?: string;
}

const SearchBlock: FC<ISearchBlockProps> = ({ initialSearchTerm }) => {
    const { accessToken } = useUser();
    const [query, setQuery] = useState<string>(initialSearchTerm || "");
    const [fetchSearchResults, { data, loading }] =
        useLazyQuery<ISearchResults>(GET_SEARCH_RESULTS);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const performSearch = () => {
        fetchSearchResults({
            context: { headers: { authorization: accessToken } },
            variables: { query }
        });
    };

    useEffect(() => {
        if (initialSearchTerm && initialSearchTerm?.length > 0) performSearch();
    }, []);

    return (
        <>
            <div className="flex space-x-2">
                <input
                    className="text-gray-1"
                    onChange={handleInputChange}
                    type="text"
                    value={query}
                />
                <button onClick={performSearch}>Search</button>
            </div>
            <SearchResults data={data} loading={loading} />
        </>
    );
};

const GET_SEARCH_RESULTS = gql`
    query GetSearchResults($query: String!, $limit: Int) {
        spotifySearch(query: $query, limit: $limit) {
            albums {
                id
                artists {
                    id
                    name
                }
                name
                images {
                    url
                }
            }
            artists {
                id
                name
                images {
                    url
                }
            }
            tracks {
                id
                name
                duration_ms
                explicit
                album {
                    id
                    name
                    images {
                        url
                    }
                }
                artists {
                    id
                    name
                }
            }
            total
        }
    }
`;

export default SearchBlock;
export { SearchBlock };

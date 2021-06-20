import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

import { SearchResults } from "components";
import { useUser } from "context";
import { getAuthenticatedLayout } from "layouts";

const ExplorePage: ExtendedNextPage = ({}) => {
    const { accessToken, setUser, user } = useUser();
    const [query, setQuery] = useState<string>("");
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

    return (
        <div className="flex flex-col items-center h-full space-y-4">
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
        </div>
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

ExplorePage.getLayout = getAuthenticatedLayout;

export default ExplorePage;

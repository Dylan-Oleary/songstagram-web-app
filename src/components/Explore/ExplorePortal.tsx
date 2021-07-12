import { FC, useEffect, useState } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useLazyQuery } from "@apollo/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

import {
    ArtistBlock,
    Button,
    Discography,
    ExploreHome,
    RelatedArtists,
    SearchInput,
    SearchResults
} from "components";
import { useExplore, useUser } from "context";
import { useDebounce } from "hooks";

const ExplorePortal: FC<{}> = ({}) => {
    const { accessToken } = useUser();
    const {
        activeComponent,
        history,
        isSearchActive,
        navigateHistoryBack,
        navigateHistoryForward,
        setIsSearchActive
    } = useExplore();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearchTerm = useDebounce(searchTerm, 250);
    const [fetchSearchResults, { data: searchData, loading }] =
        useLazyQuery<ISearchResults>(GET_SEARCH_RESULTS);
    const buttonClasses = new ClassNames(
        "transition duration-300 ease-in-out border dark:text-white text-gray-3 dark:border-white border-gray-3 hover:text-gray-4 hover:border-gray-4 disabled:border-gray-5 disabled:text-white dark:disabled:text-white dark:disabled:bg-transparent disabled:bg-gray-5 disabled:text-opacity-60 disabled:opacity-40 disabled:cursor-not-allowed"
    );

    const performSearch = () => {
        setIsSearchActive(true);
        fetchSearchResults({
            context: { headers: { authorization: accessToken } },
            variables: { searchTerm: debouncedSearchTerm }
        });
    };

    useEffect(() => {
        if (activeComponent && searchTerm.length > 0) setSearchTerm("");
    }, [activeComponent]);

    useEffect(() => {
        if (isSearchActive && debouncedSearchTerm.trim().length === 0) {
            setIsSearchActive(false);
        } else if (debouncedSearchTerm.trim().length > 0) {
            performSearch();
        }
    }, [debouncedSearchTerm]);

    let componentToRender: JSX.Element;

    switch (activeComponent.componentKey) {
        case "artist":
            componentToRender = <ArtistBlock id={activeComponent.value} />;
            break;
        case "discography":
            componentToRender = (
                <Discography
                    id={activeComponent?.value?.id}
                    initialFilter={activeComponent?.value?.initialFilter}
                />
            );
            break;
        case "relatedArtists":
            componentToRender = <RelatedArtists id={activeComponent.value} />;
            break;
        default:
            componentToRender = <ExploreHome />;
            break;
    }

    return (
        <div className="relative flex flex-col items-center h-full space-y-4">
            <div className="flex items-center w-full space-x-4">
                <Button
                    ariaLabel="Navigate Back"
                    borderRadius="circle"
                    className={buttonClasses.list()}
                    disabled={history.length === 1 || activeComponent.index === 0}
                    onClick={navigateHistoryBack}
                    outline
                    size="sm"
                    style="none"
                >
                    <ChevronLeftIcon className="w-6 h-6 mx-auto" />
                </Button>
                <Button
                    ariaLabel="Navigate Forward"
                    borderRadius="circle"
                    className={buttonClasses.list()}
                    disabled={history.length === 1 || activeComponent.index === history.length - 1}
                    onClick={navigateHistoryForward}
                    outline
                    size="sm"
                    style="none"
                >
                    <ChevronRightIcon className="w-6 h-6 mx-auto" />
                </Button>
                <SearchInput onChange={(value) => setSearchTerm(value)} value={searchTerm} />
            </div>
            {/* Search Results */}
            {isSearchActive && searchData && <SearchResults data={searchData} loading={loading} />}
            {/* Active Component */}
            {!isSearchActive && (
                <div className={isSearchActive ? "hidden" : "relative"}>{componentToRender}</div>
            )}
        </div>
    );
};

const GET_SEARCH_RESULTS = gql`
    query GetSearchResults($searchTerm: String!, $limit: Int) {
        spotifySearch(query: $searchTerm, limit: $limit) {
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

export default ExplorePortal;
export { ExplorePortal };

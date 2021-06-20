import { FC } from "react";
import { ClassNames } from "@44north/classnames";

import { SearchResultCard } from "components";

interface ISearchResultProps {
    /**
     * The search result data
     */
    data: ISearchResults;
    /**
     * Are the currently results being loaded?
     */
    loading: boolean;
}

const SearchResults: FC<ISearchResultProps> = ({ data, loading = false }) => {
    const wrapperClasses = new ClassNames("w-full");
    const sectionClasses = new ClassNames("w-full space-y-2");
    const sectionTitleClasses = new ClassNames("text-6xl font-bold");
    const sectionListClasses = new ClassNames(
        "grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    );

    return (
        <div className={wrapperClasses.list()}>
            {loading && <div>Loading...</div>}
            {!loading && data?.spotifySearch && (
                <div className="space-y-8">
                    {data?.spotifySearch?.total > 0 ? (
                        <>
                            {data?.spotifySearch?.artists.length > 0 && (
                                <div className={sectionClasses.list()}>
                                    <h2 className={sectionTitleClasses.list()}>Artists</h2>
                                    <div className={sectionListClasses.list()}>
                                        {data.spotifySearch.artists.map((artist) => (
                                            <SearchResultCard
                                                key={`artist-card-${artist.id}`}
                                                data={artist}
                                                type="artist"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data?.spotifySearch?.albums.length > 0 && (
                                <div className={sectionClasses.list()}>
                                    <h2 className={sectionTitleClasses.list()}>Albums</h2>
                                    <div className={sectionListClasses.list()}>
                                        {data.spotifySearch.albums.map((album) => (
                                            <SearchResultCard
                                                key={`album-card-${album.id}`}
                                                data={album}
                                                type="album"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data?.spotifySearch?.tracks.length > 0 && (
                                <div className={sectionClasses.list()}>
                                    <h2 className={sectionTitleClasses.list()}>Tracks</h2>
                                    <div className={sectionListClasses.list()}>
                                        {data.spotifySearch.tracks.map((track) => (
                                            <SearchResultCard
                                                key={`track-card-${track.id}`}
                                                data={track}
                                                type="track"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div>No results</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
export { SearchResults };

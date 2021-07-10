import { FC, useMemo } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";

import { Avatar, SearchResultCard } from "components";
import { useExplore, useUser } from "context";

interface IArtistBlockProps {
    /**
     * The id of the artist
     */
    id: string;
}

const ArtistBlock: FC<IArtistBlockProps> = ({ id }) => {
    const wrapperClasses = new ClassNames("w-full");
    const h3Classes = new ClassNames("text-6xl font-extrabold dark:text-white");
    const sectionGridClasses = new ClassNames(
        "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
    );
    const seeMoreClasses = new ClassNames(
        "text-sm font-light uppercase text-gray-5 cursor-pointer hover:underline"
    );
    const { pushToHistory } = useExplore();
    const { accessToken } = useUser();
    const { data, loading, error } = useQuery<IArtistBlockQueryResult>(GET_ARTIST, {
        context: { headers: { authorization: accessToken } },
        variables: { id }
    });

    const openDiscography: (initialFilter: AlbumType) => void = (initialFilter) => {
        pushToHistory({
            componentKey: "discography",
            value: {
                id,
                initialFilter
            }
        });
    };

    const filteredMusicalReleases = useMemo<IFilteredMusicalReleases>(() => {
        if ((data?.artist?.albums?.items || []).length === 0) return null;

        return {
            albums: data.artist.albums.items.filter((item) => item.album_type === "album"),
            compilations: data.artist.albums.items.filter(
                (item) => item.album_type === "compilation"
            ),
            singles: data.artist.albums.items.filter((item) => item.album_type === "single")
        };
    }, [data]);

    return (
        <div className={wrapperClasses.list()}>
            {loading && <div>Loading...</div>}
            {!loading && data?.artist && (
                <div className="space-y-16">
                    <div className="flex items-center space-x-8">
                        <Avatar
                            size="4xl"
                            src={
                                data?.artist?.images[0]?.url ||
                                data?.artist?.albums?.items[0]?.images[0]?.url
                            }
                        />
                        <div>
                            <h2 className="font-extrabold text-9xl dark:text-white">
                                {data.artist.name}
                            </h2>
                        </div>
                    </div>
                    {/* Top Tracks */}
                    {data?.artist?.top_tracks?.length > 0 && (
                        <div>
                            <h3 className={h3Classes.add("mb-4").list()}>Popular</h3>
                            <div className={sectionGridClasses.list()}>
                                {data.artist.top_tracks.slice(0, 5).map((track) => (
                                    <SearchResultCard
                                        key={`track-card-${track.id}`}
                                        artist={
                                            {
                                                id: data?.artist?.id,
                                                name: data?.artist?.name
                                            } as IArtist
                                        }
                                        data={track}
                                        type="track"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Musical Releases */}
                    {filteredMusicalReleases?.albums.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={h3Classes.list()}>Albums</h3>
                                <span
                                    className={seeMoreClasses.list()}
                                    onClick={() => openDiscography("album")}
                                >
                                    See Discography
                                </span>
                            </div>
                            <div className={sectionGridClasses.list()}>
                                {filteredMusicalReleases?.albums.slice(0, 6).map((album) => (
                                    <SearchResultCard
                                        key={`album-card-${album.id}`}
                                        artist={
                                            {
                                                id: data?.artist?.id,
                                                name: data?.artist?.name
                                            } as IArtist
                                        }
                                        data={album}
                                        type="album"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {filteredMusicalReleases?.singles.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={h3Classes.list()}>Singles and EPs</h3>
                                <span
                                    className={seeMoreClasses.list()}
                                    onClick={() => openDiscography("single")}
                                >
                                    See Discography
                                </span>
                            </div>
                            <div className={sectionGridClasses.list()}>
                                {filteredMusicalReleases?.singles.slice(0, 6).map((album) => (
                                    <SearchResultCard
                                        key={`single-card-${album.id}`}
                                        artist={
                                            {
                                                id: data?.artist?.id,
                                                name: data?.artist?.name
                                            } as IArtist
                                        }
                                        data={album}
                                        type="album"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {filteredMusicalReleases?.compilations.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={h3Classes.list()}>Compilations</h3>
                                <span
                                    className={seeMoreClasses.list()}
                                    onClick={() => openDiscography("compilation")}
                                >
                                    See Discography
                                </span>
                            </div>
                            <div className={sectionGridClasses.list()}>
                                {filteredMusicalReleases?.compilations.slice(0, 6).map((album) => (
                                    <SearchResultCard
                                        key={`compilation-card-${album.id}`}
                                        artist={
                                            {
                                                id: data?.artist?.id,
                                                name: data?.artist?.name
                                            } as IArtist
                                        }
                                        data={album}
                                        type="album"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Related Artists */}
                    {data?.artist?.related_artists?.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={h3Classes.list()}>Related Artists</h3>
                                <span className={seeMoreClasses.list()}>
                                    See More Related Artists
                                </span>
                            </div>
                            <div className={sectionGridClasses.list()}>
                                {data.artist.related_artists.slice(0, 6).map((artist) => (
                                    <SearchResultCard
                                        key={`related-artist-card-${artist.id}`}
                                        data={artist}
                                        type="artist"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const GET_ARTIST = gql`
    query GetArtist($id: ID!) {
        artist(artistID: $id) {
            name
            popularity
            top_tracks {
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
            }
            images {
                url
            }
            related_artists {
                id
                name
                images {
                    url
                }
            }
            followers {
                total
            }
            albums {
                items {
                    ... on Album {
                        id
                        name
                        album_type
                        images {
                            url
                        }
                    }
                }
            }
        }
    }
`;

export default ArtistBlock;
export { ArtistBlock };

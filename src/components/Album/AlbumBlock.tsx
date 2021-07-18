import { FC } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";
import { PencilAltIcon } from "@heroicons/react/outline";
import dayjs from "dayjs";
import prettyMS from "pretty-ms";

import { AlbumTrackList, Avatar, Button, CreatePostForm } from "components";
import { useExplore, useFlyout, useUser } from "context";

interface IAlbumBlockProps {
    /**
     * The id of the album
     */
    id: string;
}

const AlbumBlock: FC<IAlbumBlockProps> = ({ id }) => {
    const wrapperClasses = new ClassNames("w-full");
    const { pushToHistory } = useExplore();
    const { openFlyout } = useFlyout();
    const { accessToken } = useUser();
    const { data, loading } = useQuery<IAlbumBlockQueryResult>(GET_ALBUM, {
        context: { headers: { authorization: accessToken } },
        variables: { id }
    });

    /**
     * Formats and returns a list of artists that created the album
     *
     * @param artists An array of artists
     * @returns A list of artists
     */
    const formatArtistLabel: (artists: IArtist[]) => string = (artists = []) => {
        if (artists.length === 0) return "";
        if (artists.length > 1) return "Various Artists";

        return artists[0]?.name || "";
    };

    /**
     * Returns a readable album length derived from each track's duration
     *
     * @param tracks The album's tracks
     * @returns A readable album length
     */
    const getAlbumLength: (tracks: ITrack[]) => any = (tracks = []) => {
        if (tracks.length === 0) return "";

        const albumLengthInMs = tracks.reduce((accumulator, currentTrack) => {
            return accumulator + currentTrack.duration_ms;
        }, 0);

        return prettyMS(albumLengthInMs, { secondsDecimalDigits: 0, verbose: true });
    };

    /**
     * Navigates to the artist page and pushes the component to history
     */
    const handleArtistClick: () => void = () => {
        if (data?.album?.artists?.length === 1) {
            pushToHistory({
                componentKey: "artist",
                value: data.album.artists[0].id
            });
        }
    };

    return (
        <div className={wrapperClasses.list()}>
            {loading && <div>Loading...</div>}
            {!loading && data?.album && (
                <div className="space-y-16">
                    <div className="flex items-center w-full space-x-8">
                        <div className="relative min-w-[240px] min-h-[220px]">
                            <div className="absolute inset-0 z-10 flex items-end justify-end w-full h-full p-1 shadow-lg group backdrop-filter hover:backdrop-blur-sm">
                                <Button
                                    borderRadius="circle"
                                    className="text-transparent transition ease-in-out bg-transparent border-transparent pointer-events-none hover:shadow-lg duration-250 focus:outline-none group-hover:bg-success-3 group-hover:border-success-3 group-hover:text-white group-hover:pointer-events-auto"
                                    onClick={() =>
                                        openFlyout(
                                            <CreatePostForm
                                                artistName={formatArtistLabel(data.album?.artists)}
                                                imgSrc={data?.album.images[0]?.url}
                                                recordName={data.album.name}
                                            />
                                        )
                                    }
                                    tabIndex={-1}
                                    size="sm"
                                    style="none"
                                >
                                    <PencilAltIcon className="w-5 h-5" />
                                </Button>
                            </div>
                            <Avatar rounded={false} size="4xl" src={data?.album.images[0]?.url} />
                        </div>
                        <div className="overflow-hidden">
                            <div className="uppercase">Album</div>
                            <h2 className="font-extrabold truncate text-9xl dark:text-white">
                                {data.album.name}
                            </h2>
                            <div className="flex items-center space-x-2">
                                {data.album.artists?.length > 0 && (
                                    <Avatar
                                        size="xs"
                                        src={data?.album?.artists[0].images[0]?.url}
                                    />
                                )}
                                <span
                                    className={`${
                                        data.album.artists?.length > 1
                                            ? ""
                                            : "hover:underline cursor-pointer"
                                    } `}
                                    onClick={handleArtistClick}
                                >
                                    {formatArtistLabel(data.album?.artists)}
                                </span>
                                <span>&#183;</span>
                                <span>{dayjs(data.album?.release_date).format("YYYY")}</span>
                                <span>&#183;</span>
                                <span>{data.album?.total_tracks} tracks</span>
                                <span>&#183;</span>
                                <span>{getAlbumLength(data?.album?.tracks?.items)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <AlbumTrackList tracks={data.album?.tracks?.items || []} />
                        {data?.album?.copyrights.length > 0 && (
                            <div className="text-xs dark:text-gray-6 text-gray-3">
                                <span className="mr-1">&#169;</span>
                                {data.album.copyrights[0].text}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const GET_ALBUM = gql`
    query GetAlbum($id: ID!) {
        album(albumID: $id) {
            name
            release_date
            total_tracks
            images {
                url
            }
            artists {
                id
                name
                images {
                    url
                }
            }
            tracks {
                items {
                    ... on Track {
                        id
                        name
                        duration_ms
                        artists {
                            id
                            name
                        }
                    }
                }
            }
            copyrights {
                text
            }
        }
    }
`;

export default AlbumBlock;
export { AlbumBlock };

import { FC } from "react";
import prettyMS from "pretty-ms";
import { ClockIcon, PencilAltIcon } from "@heroicons/react/outline";

import { Button, CreatePostForm } from "components";
import { useFlyout, useUser } from "context";

interface IAlbumTrackListProps {
    /**
     * The img url of the album art
     */
    albumArtImgSrc?: string;
    /**
     * The tracks that belong to the album
     */
    tracks: ITrack[];
}

const AlbumTrackList: FC<IAlbumTrackListProps> = ({ albumArtImgSrc, tracks = [] }) => {
    const { openFlyout } = useFlyout();

    return (
        <div className="min-w-full px-2 space-y-4 bg-white rounded-md shadow-lg dark:bg-transparent dark:text-white">
            <div className="flex w-full pt-4 border-b border-opacity-50 dark:border-white border-gray-3">
                <span className="w-[25px] px-2 pb-2 text-sm tracking-wider text-left uppercase">
                    #
                </span>
                <span className="w-11/12 pb-2 pl-4 text-sm tracking-wider text-left uppercase">
                    Title
                </span>
                <span className="w-1/12 px-2 pb-2">
                    <ClockIcon className="w-4 h-4 mx-auto" />
                </span>
            </div>
            <div className="min-w-full">
                {tracks.map((track, index) => (
                    <div
                        key={track.id}
                        className="flex items-center py-2 transition group duration-250 hover:bg-gray-6 hover:bg-opacity-20"
                    >
                        <span className="w-[25px] items-center px-2 text-left">{index + 1}</span>
                        <span className="w-10/12 pl-4 text-left">
                            <div>{track.name}</div>
                            <div className="text-xs dark:text-gray-6 text-gray-3">
                                {(track?.artists || []).map((artist) => artist.name).join(", ")}
                            </div>
                        </span>
                        <span className="flex justify-end w-1/12 text-center uppercase">
                            <Button
                                borderRadius="circle"
                                className="text-transparent transition ease-in-out bg-transparent border-transparent group-hover:text-white group-hover:shadow-lg duration-250 group-hover:bg-success-3 hover:border-success-3"
                                onClick={() =>
                                    openFlyout(
                                        <CreatePostForm
                                            artistName={(track?.artists || [])
                                                .map((artist) => artist.name)
                                                .join(", ")}
                                            imgSrc={albumArtImgSrc}
                                            recordName={track.name}
                                            spotifyRecordData={{
                                                id: track.id,
                                                recordType: "track"
                                            }}
                                        />
                                    )
                                }
                                tabIndex={-1}
                                size="sm"
                                style="none"
                            >
                                <PencilAltIcon className="w-5 h-5" />
                            </Button>
                        </span>
                        <span className="w-1/12 px-2 text-center uppercase">
                            {prettyMS(track.duration_ms, {
                                colonNotation: true,
                                secondsDecimalDigits: 0
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumTrackList;
export { AlbumTrackList };

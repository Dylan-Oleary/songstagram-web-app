import { FC } from "react";
import Image from "next/image";
import prettyMS from "pretty-ms";
import { ClassNames } from "@44north/classnames";

import { Avatar } from "components";
import { useExplore } from "context";

interface ISearchResultCardProps {
    /**
     * Overrides the data passed in for artist
     */
    artist?: IArtist;
    /**
     * Classes to be applied to the wrapping element
     */
    className?: string | ClassNames;
    /**
     * The data to display on the card
     */
    data: IAlbum | IArtist | ITrack;
    /**
     * The type of search result
     */
    type?: "artist" | "album" | "track";
}

const SearchResultCard: FC<ISearchResultCardProps> = ({
    artist,
    className = "",
    data,
    type = "track"
}) => {
    const { pushToHistory } = useExplore();
    const wrapperClasses = new ClassNames(
        "inline-block space-y-4 rounded-md dark:bg-gray-2 p-4 transition-colors duration-250 dark:hover:bg-gray-3 hover:bg-gray-6 cursor-pointer shadow-lg bg-white"
    )
        .add(className)
        .add(type === "track" ? "col-span-full" : "");
    const primaryTitleClasses = new ClassNames("text-2xl font-bold truncate");
    const secondaryTitleClasses = new ClassNames("text-sm text-gray-2 dark:text-gray-5");
    let content: JSX.Element;

    switch (type) {
        case "artist":
            content = (
                <>
                    <Avatar
                        alt={`Photo of ${type} ${artist?.name || data.name}`}
                        className="mx-auto"
                        size="xl"
                        src={(data as IArtist)?.images[0]?.url}
                    />
                    <div>
                        <div className={primaryTitleClasses.list()}>
                            {artist?.name || data?.name}
                        </div>
                        <div className={secondaryTitleClasses.list()}>Artist</div>
                    </div>
                </>
            );
            break;
        case "album":
            content = (
                <>
                    <div className="relative w-32 h-32 mx-auto sm:h-36 sm:w-36">
                        <Image
                            alt={`Photo of ${type} ${data.name}`}
                            layout="fill"
                            src={(data as IAlbum)?.images[0]?.url}
                        />
                    </div>
                    <div>
                        <div className={primaryTitleClasses.list()}>{data?.name}</div>
                        <div className={secondaryTitleClasses.list()}>
                            {artist?.name || (data as IAlbum)?.artists[0]?.name}
                        </div>
                    </div>
                </>
            );
            break;
        case "track":
            content = (
                <>
                    <div className="flex items-stretch space-x-2">
                        <div className="relative w-16 h-16 sm:h-20 sm:w-20">
                            {(data as ITrack).album?.images[0]?.url && (
                                <Image
                                    alt={`Photo of ${type} ${data.name}`}
                                    layout="fill"
                                    src={(data as ITrack)?.album?.images[0]?.url}
                                />
                            )}
                        </div>
                        <div className="flex flex-col flex-grow">
                            <div className={primaryTitleClasses.list()}>{data?.name}</div>
                            <div className={secondaryTitleClasses.list()}>
                                {artist?.name || (data as IAlbum)?.artists[0]?.name}
                            </div>
                            {(data as ITrack)?.explicit && (
                                <div className="w-16 mt-2 text-center uppercase text-2xs rounded-6xl bg-gray-6 dark:bg-gray-4">
                                    Explicit
                                </div>
                            )}
                        </div>
                        <div className="flex items-center font-bold">
                            {prettyMS((data as ITrack).duration_ms, {
                                colonNotation: true,
                                secondsDecimalDigits: 0
                            })}
                        </div>
                    </div>
                </>
            );

            break;
    }

    return (
        <div
            className={wrapperClasses.list()}
            onClick={() =>
                pushToHistory({
                    componentKey: type,
                    value: data.id
                })
            }
        >
            {content}
        </div>
    );
};

export default SearchResultCard;
export { SearchResultCard };

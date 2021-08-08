import { FC, useEffect } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChatIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/solid";

import { Avatar, Button, CommentForm } from "components";
import { useUser } from "context";
import { formatArtistLabel, getAlbumLength } from "lib";

dayjs.extend(relativeTime);

interface IPostCarouselProps {
    /**
     * Classes to be applied to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * The initial post to fetch
     */
    initialPostNo: number;
}

const PostCarousel: FC<IPostCarouselProps> = ({ className = "", initialPostNo }) => {
    const wrapperClasses = new ClassNames(
        "flex flex-col w-full dark:text-white h-full relative"
    ).add(className);
    const { accessToken } = useUser();

    const [fetchPost, { data, error, loading }] = useLazyQuery<{ post: IPostRecord }>(GET_POST);

    useEffect(() => {
        fetchPost({
            context: { headers: { authorization: accessToken } },
            variables: { pk: initialPostNo }
        });
    }, []);

    return (
        <div className={wrapperClasses.list()}>
            {/* Carousel Controls */}
            <Button
                borderRadius="circle"
                className="absolute text-white transition ease-in-out transform shadow-lg hover:scale-125 hover:shadow-xl -left-16 top-1/2 duration-250 border-success-3 bg-success-3 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={data?.post?.prevUserPostNo ? false : true}
                onClick={() => {
                    if (data?.post?.prevUserPostNo) {
                        fetchPost({
                            context: { headers: { authorization: accessToken } },
                            variables: { pk: data.post.prevUserPostNo }
                        });
                    }
                }}
                size="sm"
                style="none"
            >
                <ChevronLeftIcon className="w-7 h-7" />
            </Button>
            <Button
                borderRadius="circle"
                className="absolute text-white transition ease-in-out transform shadow-lg hover:scale-125 hover:shadow-xl -right-16 top-1/2 duration-250 border-success-3 bg-success-3 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={data?.post?.nextUserPostNo ? false : true}
                onClick={() => {
                    if (data?.post?.nextUserPostNo) {
                        fetchPost({
                            context: { headers: { authorization: accessToken } },
                            variables: { pk: data.post.nextUserPostNo }
                        });
                    }
                }}
                size="sm"
                style="none"
            >
                <ChevronRightIcon className="w-7 h-7" />
            </Button>

            {/* Post Content */}
            {!loading && data?.post && (
                <>
                    <div className="grid w-full h-full grid-cols-6">
                        <div className="flex flex-col h-full col-span-2 dark:bg-dark">
                            <img
                                alt={data?.post?.album?.name}
                                className="object-fill"
                                src={data?.post?.album?.images[0]?.url}
                            />
                            <div className="flex flex-col flex-grow p-4 space-y-6 overflow-hidden">
                                <div>
                                    <div className="w-16 text-sm text-center uppercase rounded-6xl bg-gray-6 dark:bg-gray-4">
                                        {data.post.spotifyRecordType}
                                    </div>
                                    <h2 className="text-5xl font-extrabold truncate">
                                        {data.post.spotifyRecordType === "album"
                                            ? data.post.album.name
                                            : data.post.tracks[0].name}
                                    </h2>
                                    <div className="space-y-2">
                                        <div>{formatArtistLabel(data?.post.artists)}</div>
                                        {data.post.spotifyRecordType === "album" && (
                                            <div className="space-x-2">
                                                <span>
                                                    {dayjs(data.post.album?.release_date).format(
                                                        "YYYY"
                                                    )}
                                                </span>
                                                <span>&#183;</span>
                                                <span>{data.post?.album?.total_tracks} tracks</span>
                                                <span>&#183;</span>
                                                <span>{getAlbumLength(data?.post?.tracks)}</span>
                                            </div>
                                        )}
                                        {data.post.spotifyRecordType === "track" && (
                                            <div>
                                                <span className="space-x-2">
                                                    <span>
                                                        {getAlbumLength(data?.post?.tracks)}
                                                    </span>
                                                    <span>&#183;</span>
                                                    <span>
                                                        {data.post.album.name} (
                                                        {dayjs(
                                                            data.post.album?.release_date
                                                        ).format("YYYY")}
                                                        )
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        size="xs"
                                        src={
                                            data.post.user?.profilePicture?.length > 0
                                                ? data.post.user?.profilePicture
                                                : null
                                        }
                                    />
                                    <span className="text-2xl">{data.post.user?.username}</span>
                                </div>
                                <div className="flex-grow">{data.post.body}</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-sm">
                                        Posted {dayjs().to(data.post.createdDate)}
                                    </span>
                                    <div className="flex space-x-4">
                                        <HeartIcon className="w-8 h-8" />
                                        <ChatIcon className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="flex flex-col col-span-4 px-4 py-4 space-y-6 overflow-hidden bg-gray-100 dark:bg-black">
                            <div className="flex-grow">Comments - Flex Grow</div>
                            <CommentForm postNo={data?.post?.postNo} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const GET_POST = gql`
    query GetPost($pk: Int!) {
        post(pk: $pk) {
            postNo
            spotifyId
            spotifyRecordType
            body
            createdDate
            artists {
                id
                name
            }
            album {
                id
                name
                release_date
                total_tracks
                images {
                    url
                }
            }
            tracks {
                id
                name
                duration_ms
            }
            user {
                userNo
                username
                profilePicture
            }
            commentCount
            likeCount
            nextUserPostNo
            prevUserPostNo
        }
    }
`;

export default PostCarousel;
export { PostCarousel };

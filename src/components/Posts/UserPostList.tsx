import { FC } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";

import { Alert, Post } from "components";
import { useUser } from "context";

interface IUserPostListProps {
    /**
     * Classes to be applied to the wrapper element
     */
    className?: string | ClassNames;
    /**
     * The user number of the user whose posts should be fetched
     */
    userNo: number;
}

const UserPostList: FC<IUserPostListProps> = ({ className = "", userNo }) => {
    const wrapperClasses = new ClassNames("w-full").add(className);
    const { accessToken } = useUser();

    const { data, error, loading } = useQuery<IPostListQueryResult>(GET_USER_POSTS, {
        context: { headers: { authorization: accessToken } },
        variables: {
            itemsPerPage: 9,
            pageNo: 1,
            where: {
                userNo: {
                    value: userNo
                }
            }
        }
    });

    return (
        <div className={wrapperClasses.list()}>
            {loading && <div>Loading posts...</div>}
            {!loading && data?.posts?.posts?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 justify-items-stretch">
                    {data.posts.posts.map((post) => (
                        <Post key={post.postNo} className="col-span-1" post={post} />
                    ))}
                </div>
            )}
            {!loading && !data && error && <Alert theme="danger">Error while fetching posts</Alert>}
        </div>
    );
};

const GET_USER_POSTS = gql`
    query GetUserPosts($itemsPerPage: Int, $pageNo: Int, $where: PostsWhere) {
        posts(itemsPerPage: $itemsPerPage, pageNo: $pageNo, where: $where) {
            posts {
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
                    images {
                        url
                    }
                }
                tracks {
                    id
                    name
                }
            }
            pagination {
                currentPage
                itemsPerPage
                nextPage
                prevPage
                totalPages
                totalRecords
            }
        }
    }
`;

export default UserPostList;
export { UserPostList };

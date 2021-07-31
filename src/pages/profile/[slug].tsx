import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { MinusIcon, PlusIcon, UserIcon } from "@heroicons/react/outline";

import { Avatar, Button, UserPostList } from "components";
import { useUser } from "context";
import { getAuthenticatedLayout } from "layouts";

const UserProfilePage: ExtendedNextPage = ({}) => {
    const router = useRouter();
    const { accessToken, user } = useUser();

    const { data, loading } = useQuery<IUserProfilePageQueryResult>(GET_USER, {
        context: { headers: { authorization: accessToken } },
        variables: { username: router?.query?.slug || "" }
    });

    return (
        <div className="max-w-screen-lg">
            {loading && <div>Loading...</div>}
            {!loading && data?.user && (
                <div className="space-y-16">
                    {/* User Information */}
                    <div className="flex space-x-32">
                        <Avatar
                            size="4xl"
                            src={
                                data?.user?.profilePicture?.length > 0
                                    ? data.user?.profilePicture
                                    : null
                            }
                        />
                        <div className="flex-grow space-y-8 dark:text-white">
                            <div className="flex items-center space-x-16">
                                <h2 className="text-6xl font-extrabold">{data.user.username}</h2>
                                {data.user?.userNo !== user?.userNo && (
                                    <Button childClassName="flex" onClick={() => {}} size="xs">
                                        <UserIcon className="w-5 h-5" />
                                        <PlusIcon className="w-4 h-4" />
                                        {/* <MinusIcon className="w-4 h-4" /> */}
                                    </Button>
                                )}
                            </div>

                            {/* Post and Follower/Following Counts */}
                            <div className="space-x-16">
                                <span>
                                    <span className="font-bold">{data?.user?.postCount}</span> posts
                                </span>
                                <span>
                                    <span className="font-bold">{data?.user?.followerCount}</span>{" "}
                                    followers
                                </span>
                                <span>
                                    <span className="font-bold">{data?.user?.followingCount}</span>{" "}
                                    following
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="font-bold">
                                    {data?.user?.firstName} {data?.user?.lastName}
                                </div>
                                {data.user?.bio?.length > 0 && <div>{data.user.bio}</div>}
                            </div>
                        </div>
                    </div>

                    {/* UserPost List */}
                    <UserPostList userNo={data.user.userNo} />
                </div>
            )}
        </div>
    );
};

const GET_USER = gql`
    query GetUserByUsername($username: String) {
        user(username: $username) {
            userNo
            username
            email
            firstName
            lastName
            bio
            profilePicture
            postCount
            followerCount
            followingCount
        }
    }
`;

UserProfilePage.getLayout = getAuthenticatedLayout;

export default UserProfilePage;
export { UserProfilePage };

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MailIcon, PhoneIcon } from "@heroicons/react/outline";
import { ClassNames } from "@44north/classnames";

import { useUser } from "context";
import { songstagramApi } from "lib";

interface IProfileHeaderProps {
    /**
     * Classes to be applied to the parent element
     */
    className?: string | ClassNames;
}

const ProfileHeader: FC<IProfileHeaderProps> = ({ className = "" }) => {
    const router = useRouter();
    const { setAccessToken, setUser, user } = useUser();
    const wrapperClasses = new ClassNames("dark:text-white").add(className);

    const logout = async () => {
        await songstagramApi("/logout", "POST").catch((error) => {
            //TODO: Error reporting
            console.error(error);
        });

        setAccessToken(null);
        setUser(null);

        router.replace("/login");
    };

    return (
        <div className={wrapperClasses.list()}>
            <div className="px-2">
                <div className="flex items-center space-x-4 lg:space-x-6">
                    <img
                        className="w-24 h-24 bg-white rounded-full ring-4 ring-white sm:h-28 sm:w-28"
                        src={
                            user?.profilePicture ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        }
                        alt=""
                    />
                    <div>
                        <h2 className="text-4xl">{user.username}</h2>
                        <div className="flex space-x-2">
                            <Link href="profile">
                                <a>Edit Profile</a>
                            </Link>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
export { ProfileHeader };

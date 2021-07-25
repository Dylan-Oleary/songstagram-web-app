import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ClassNames } from "@44north/classnames";

import { Avatar } from "components";
import { useUser } from "context";
import { logout } from "lib";

interface INavigationHeaderProps {
    /**
     * Classes to be applied to the parent element
     */
    className?: string | ClassNames;
}

const NavigationHeader: FC<INavigationHeaderProps> = ({ className = "" }) => {
    const router = useRouter();
    const { setAccessToken, setUser, user } = useUser();
    const wrapperClasses = new ClassNames("dark:text-white").add(className);
    const linkClasses = new ClassNames("transition duration-250 hover:text-primary-3");

    const handleLogout = async () => {
        return logout().then(() => {
            setAccessToken(null);
            setUser(null);

            router.replace("/login");
        });
    };

    return (
        <div className={wrapperClasses.list()}>
            <div className="px-2">
                <div className="flex items-center space-x-4 lg:space-x-6">
                    <Avatar alt={`User avatar for ${user?.username}`} src={user?.profilePicture} />
                    <div>
                        <Link href={`/profile/${user?.username}`}>
                            <a className={`text-4xl ${linkClasses.list()}`}>{user.username}</a>
                        </Link>
                        <div className="flex space-x-2">
                            <Link href="/settings">
                                <a className={linkClasses.list()}>Edit Profile</a>
                            </Link>
                            <button className={linkClasses.list()} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationHeader;
export { NavigationHeader };

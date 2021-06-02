import { FC, useEffect } from "react";
import axios from "axios";

import { useUser } from "context";
import { getApplicationLayout } from "layouts";
import { songstagramApi } from "lib";

const AuthenticatedLayout: FC<{}> = ({ children }) => {
    const { accessToken, setAccessToken, user } = useUser();

    const source = axios.CancelToken.source();
    let hydrateAccessTokenTimer;
    const hydrateAccessToken: () => void = () => {
        if (user) {
            songstagramApi("/refresh", "GET", null, null, source)
                .then(({ accessToken }) => {
                    setAccessToken(accessToken);

                    /**
                     * Clear the timeout to prevent a build up in the event loop as this function
                     * is triggered in a `useEffect` hook which may change multiple times depending on
                     * its dependencies
                     */
                    window.clearTimeout(hydrateAccessTokenTimer);

                    hydrateAccessTokenTimer = setTimeout(() => {
                        hydrateAccessToken();
                    }, Number(process.env.NEXT_PUBLIC_ACCESS_TOKEN_REFRESH_TIME));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        hydrateAccessToken();

        return () => {
            window.clearTimeout(hydrateAccessTokenTimer);
            source.cancel();
        };
    }, []);

    return (
        user &&
        accessToken && (
            <div className="flex w-full h-screen antialiased text-gray-700">
                <main className="flex-grow max-w-4xl px-8 mx-auto">{children}</main>
            </div>
        )
    );
};

const getAuthenticatedLayout: GetLayout = (page) =>
    getApplicationLayout(<AuthenticatedLayout>{page}</AuthenticatedLayout>);

export default AuthenticatedLayout;
export { getAuthenticatedLayout, AuthenticatedLayout };

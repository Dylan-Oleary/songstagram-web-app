import { FC, useEffect, useState } from "react";
import { MenuIcon } from "@heroicons/react/outline";
import axios from "axios";

import { Navigation } from "components";
import { useUser } from "context";
import { getApplicationLayout } from "layouts";
import { songstagramApi } from "lib";

const AuthenticatedLayout: FC<{}> = ({ children }) => {
    const { accessToken, setAccessToken, user } = useUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
            <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-2">
                <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />
                <div className="flex flex-col flex-1 w-0 overflow-hidden">
                    <div className="pt-1 pl-1 md:hidden sm:pl-3 sm:pt-3">
                        <button
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={() => setIsOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                    </div>
                    <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                <h1 className="text-2xl font-semibold">Home</h1>
                            </div>
                            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        )
    );
};

const getAuthenticatedLayout: GetLayout = (page) =>
    getApplicationLayout(<AuthenticatedLayout>{page}</AuthenticatedLayout>);

export default AuthenticatedLayout;
export { getAuthenticatedLayout, AuthenticatedLayout };

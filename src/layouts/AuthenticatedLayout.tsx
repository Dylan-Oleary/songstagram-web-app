import { FC } from "react";

import { getApplicationLayout } from "layouts";

const AuthenticatedLayout: FC<{}> = ({ children }) => {
    return (
        <div className="flex w-full h-screen antialiased text-gray-700">
            <main className="flex-grow max-w-4xl px-8 mx-auto">{children}</main>
        </div>
    );
};

const getAuthenticatedLayout: GetLayout = (page) =>
    getApplicationLayout(<AuthenticatedLayout>{page}</AuthenticatedLayout>);

export default AuthenticatedLayout;
export { getAuthenticatedLayout, AuthenticatedLayout };

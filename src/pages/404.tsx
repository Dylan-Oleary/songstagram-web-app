import Link from "next/link";

import { getApplicationLayout } from "layouts";

const NotFoundPage: ExtendedNextPage = ({}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-6xl font-extrabold text-center">404 / Not Found</h1>
            <Link href="/">
                <a className="mt-2 transition duration-250 hover:text-blue-400">Go back home</a>
            </Link>
        </div>
    );
};

NotFoundPage.getLayout = getApplicationLayout;

export default NotFoundPage;

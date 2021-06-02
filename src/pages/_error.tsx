import Link from "next/link";

import { getApplicationLayout } from "layouts";

interface IErrorPageProps {
    /**
     * The error's status code
     *
     * @see [MDN - HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
     */
    statusCode?: number;
}

const ErrorPage: ExtendedNextPage<IErrorPageProps> = ({ statusCode }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-6xl font-extrabold text-center">
                {statusCode
                    ? `A ${statusCode} error occurred on the server`
                    : "An error occurred on the client"}
            </div>
            <Link href="/">
                <a className="mt-2 transition duration-250 hover:text-blue-400">Go back home</a>
            </Link>
        </div>
    );
};

ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

ErrorPage.getLayout = getApplicationLayout;

export default ErrorPage;

import App, { AppContext, AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Cookies from "cookies";

import "styles/globals.css";
import { UserProvider } from "context";
import { ApplicationLayout } from "layouts";
import { songstagramApi } from "lib";
import Error from "pages/_error";

type ServerProps = {
    accessToken?: string;
    errorStatus?: number;
    isAuthenticated: boolean;
};

type ExtendedAppProps = AppProps & { serverProps: ServerProps };

function Application({ Component, pageProps, serverProps }: ExtendedAppProps) {
    const client = new ApolloClient({
        cache: new InMemoryCache()
    });

    const getLayout: GetLayout =
        (Component as ExtendedNextComponent).getLayout ||
        ((page) => <ApplicationLayout>{page}</ApplicationLayout>);

    if (serverProps?.errorStatus) {
        return <Error statusCode={serverProps.errorStatus} />;
    }

    return (
        <ApolloProvider client={client}>
            <UserProvider initialValues={{ accessToken: serverProps?.accessToken }}>
                {getLayout(<Component {...pageProps} />)}
            </UserProvider>
        </ApolloProvider>
    );
}

Application.getInitialProps = async (context: AppContext) => {
    const appProps = await App.getInitialProps(context);
    const { ctx } = context;
    const { pathname, req = undefined, res = undefined } = ctx;
    let serverProps: ServerProps = {
        isAuthenticated: false
    };
    let error: ServerError = {
        status: null,
        message: null,
        details: []
    };

    if (req && res) {
        if (req?.cookies?.session && req?.cookies?.["session.sig"]) {
            await songstagramApi<{ accessToken: string }>("/token", "GET", null, {
                cookie: `session=${req.cookies.session}; session.sig=${req.cookies["session.sig"]};`
            })
                .then(({ accessToken }) => {
                    serverProps = {
                        ...serverProps,
                        isAuthenticated: true,
                        accessToken
                    };
                })
                .catch(({ response }) => {
                    error = {
                        status: response?.data?.status || 500,
                        message: response?.data?.message || "Server Error",
                        details: response?.data?.details || []
                    };

                    if (new RegExp(/40[13]/g).test(error.status.toString())) {
                        const cookies = new Cookies(req, res);
                        const expiredDate = new Date(1992, 1, 9);

                        cookies.set("session", null, { expires: expiredDate });
                        cookies.set("session.sig", null, { expires: expiredDate });
                    }
                });
        }

        if (error.status && new RegExp(/5\d{2}/g).test(error.status.toString())) {
            serverProps = {
                ...serverProps,
                errorStatus: error.status
            };
        } else if (!serverProps.isAuthenticated && pathname !== "/login") {
            res.writeHead(302, { Location: "/login" });
            res.end();

            return {};
        } else if (serverProps.isAuthenticated && pathname === "/login") {
            res.writeHead(302, { Location: "/" });
            res.end();

            return {};
        }
    }

    return {
        ...appProps,
        serverProps
    };
};

export default Application;

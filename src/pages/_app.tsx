import App, { AppContext, AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Cookies from "cookies";

import "styles/globals.css";
import { FlyoutProvider, UserProvider } from "context";
import { ApplicationLayout } from "layouts";
import { gqlErrorHandler, songstagramApi } from "lib";
import Error from "pages/_error";

type ServerProps = {
    accessToken?: string;
    errorStatus?: number;
    isAuthenticated: boolean;
    user?: IBaseUser;
};

type ExtendedAppProps = AppProps & { serverProps: ServerProps };

function Application({ Component, pageProps, serverProps }: ExtendedAppProps) {
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: String(process.env.NEXT_PUBLIC_SONGSTAGRAM_BACKEND_GRAPHQL_URL)
    });

    const getLayout: GetLayout =
        (Component as ExtendedNextComponent).getLayout ||
        ((page) => <ApplicationLayout>{page}</ApplicationLayout>);

    return (
        <ApolloProvider client={client}>
            <UserProvider
                initialValues={{ accessToken: serverProps?.accessToken, user: serverProps?.user }}
            >
                <FlyoutProvider>
                    {serverProps?.errorStatus ? (
                        <Error statusCode={serverProps.errorStatus} />
                    ) : (
                        getLayout(<Component {...pageProps} />)
                    )}
                </FlyoutProvider>
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

    /**
     * Server side request handling
     */
    if (req && res) {
        if (req?.cookies?.session && req?.cookies?.["session.sig"]) {
            await songstagramApi<{ accessToken: string }>("/token", "GET", null, {
                cookie: `session=${req.cookies.session}; session.sig=${req.cookies["session.sig"]};`
            })
                .then(({ accessToken }) =>
                    songstagramApi<{ data: { me: IBaseUser } }>(
                        "/graphql",
                        "POST",
                        {
                            query: `
                            query GetMe {
                                me {
                                    userNo
                                    email
                                    username
                                    profilePicture
                                    preferences {
                                        prefersDarkMode
                                    }
                                }
                            }
                        `
                        },
                        { authorization: accessToken }
                    )
                        .then(({ data }) => {
                            serverProps = {
                                ...serverProps,
                                isAuthenticated: true,
                                accessToken,
                                user: data?.me
                            };

                            return;
                        })
                        .catch((error) => gqlErrorHandler(error))
                )
                .catch(({ response }) => {
                    error = {
                        status: response?.data?.status || 500,
                        message: response?.data?.message || "Server Error",
                        details: response?.data?.details || []
                    } as ServerError;

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

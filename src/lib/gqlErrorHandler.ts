import { ApolloError } from "@apollo/client";

/**
 * Formats and returns any errors thrown by the GraphQl server
 *
 * @param error An error thrown by the GraphQl server
 * @param isClientHandler Determines whether or not the error is returned or rejected
 * @returns A standardized error object
 */
const gqlErrorHandler: (error: any, isClientHandler?: boolean) => ServerError | Promise<never> = (
    error,
    isClientHandler = false
) => {
    let formattedError: ServerError = {
        status: 500,
        message: "Server Error",
        details: []
    };

    if (isClientHandler && error instanceof ApolloError) {
        const { graphQLErrors } = error;

        if (graphQLErrors.length > 0) {
            const clientError = graphQLErrors[0];
            const code = clientError?.extensions?.code || "INTERNAL ERROR";

            switch (code) {
                case "UNAUTHENTICATED":
                    formattedError.status = 401;
                    formattedError.message = "Invalid Credentials";
                    break;
                default:
                    formattedError.status = 500;
                    break;
            }
        }

        return formattedError;
    } else {
        const graphQLError: IGraphQlError = error?.response?.data?.errors[0];

        if (graphQLError && graphQLError.extensions) {
            const extensions = graphQLError.extensions;

            formattedError = {
                status: extensions?.statusCode || 500,
                message: extensions?.message || "Server Error",
                details: extensions?.details || []
            };
        }

        return Promise.reject({
            response: {
                data: formattedError
            }
        });
    }
};

export default gqlErrorHandler;
export { gqlErrorHandler };

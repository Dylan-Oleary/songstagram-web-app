/**
 * Formats and returns any errors thrown by the GraphQl server
 *
 * @param error An error thrown by the GraphQl server
 * @returns A standardized error object
 */
const gqlErrorHandler: (error: any) => Promise<never> = (error) => {
    let formattedError = {
        status: 500,
        message: "Server Error",
        details: []
    };

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
};

export default gqlErrorHandler;
export { gqlErrorHandler };

import axios, { CancelTokenSource } from "axios";

const songstagramApiConnection = axios.create({
    baseURL: process.env.SONGSTAGRAM_BACKEND_URL,
    withCredentials: true
});

/**
 *
 * @param url The url the request is being made to
 * @param method The method used to make the request
 * @param data Parameters passed along with the request
 * @param headers Headers to be attached to the request
 * @param cancelToken A cancel token used to cancel the request, if need be
 *
 * @returns The `data` property of the API response
 */
const songstagramApi = <ExpectedReturnType, Data = {}>(
    url: string,
    method: RestMethod = "GET",
    data?: Data,
    headers?: ILooseObject,
    cancelToken?: CancelTokenSource
): Promise<ExpectedReturnType> => {
    let requestHeaders = headers ? { ...headers } : {};

    if (method !== "GET") {
        requestHeaders = {
            ...requestHeaders,
            "Content-type": "application/json"
        };
    }

    return songstagramApiConnection({
        url,
        method,
        data: method === "GET" ? null : data || null,
        params: method === "GET" ? data || null : null,
        cancelToken: cancelToken ? cancelToken.token : null,
        headers: Object.keys(requestHeaders).length > 0 ? requestHeaders : null
    }).then((response) => response.data);
};

export default songstagramApi;
export { songstagramApi };

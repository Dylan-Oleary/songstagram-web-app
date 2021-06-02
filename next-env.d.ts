/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg";
declare module "http" {
    interface IncomingMessage {
        cookies?: {
            session: string;
            "session.sig": string;
        }
    }
}
declare type GetLayout = (page: any) => JSX.Element;
declare type ExtendedNextPage<P = {}> = NextPage<P> & { getLayout: GetLayout };
declare type ExtendedNextComponent<N = NextPageContext, T = any, P = {}> = NextComponentType<N, T, P> & { getLayout: GetLayout };
declare type RestMethod = "GET" | "POST" | "PUT" | "DELETE";
declare interface ILooseObject {
    [key: string]: any;
}
declare type ServerError = {
    status: number | null;
    message: string | null;
    details: string[];
}
declare interface IBaseUser {
    userNo: number;
    email: string;
    username: string;
    profilePicture?: string;
}
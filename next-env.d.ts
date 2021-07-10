/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg";
declare module "@heroicons/*";
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
declare type Primitive = string | number | boolean | Date;
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
    preferences?: {
        prefersDarkMode?: boolean;
    }
}
declare interface IGraphQlError {
    extensions?: {
        statusCode: number;
        message: string;
        details: string[];
    };
}
declare type AlertTheme = "danger" | "info" | "success" | "warning";
declare type NavigationItem = {
    name: string;
    href: string;
    icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};
declare type AlbumType = "album" | "compilation" | "single";
declare interface IAlbum {
    id: string;
    name: string;
    artists: IArtist[];
    images: ISpotifyImage[];
    album_type: AlbumType;
}
declare interface IArtist {
    id: string;
    name: string;
    albums: IAlbum[];
    images: ISpotifyImage[];
}
declare interface ITrack {
    id: string;
    name: string;
    duration_ms: number;
    explicit: boolean;
    artists: IArtist[];
    album: IAlbum;
}
declare interface ISpotifyImage {
    height: number;
    width: number;
    url: string;
}
declare type SpotifySearchResults = {
    albums: IAlbum[];
    artists: IArtist[];
    tracks: ITrack[];
    total: number;
}
declare interface ISearchResults {
    spotifySearch: SpotifySearchResults;
}

declare interface IArtistBlockQueryResult {
    artist: {
        id: string;
        name: string;
        genres: string[];
        href: string;
        images: ISpotifyImage[];
        popularity: number;
        related_artists: IArtist[];
        top_tracks: ITrack[];
        uri: string;
        albums: {
            items: IAlbum[];
        }
        external_urls: {
            spotify: string;
        }
        followers: {
            total: number;
        }
    }
}

declare interface IFilteredMusicalReleases {
    albums: IAlbum[];
    compilations: IAlbum[];
    singles: IAlbum[];
}

declare type SelectInputOption = {
    label: string;
    value: string;
}

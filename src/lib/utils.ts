import prettyMS from "pretty-ms";

/**
 * Formats and returns a list of artists that created the album
 *
 * @param artists An array of artists
 * @returns A list of artists
 */
export const formatArtistLabel: (artists: IArtist[]) => string = (artists = []) => {
    if (artists.length === 0) return "";
    if (artists.length > 1) return "Various Artists";

    return artists[0]?.name || "";
};

/**
 * Returns a readable album length derived from each track's duration
 *
 * @param tracks The album's tracks
 * @returns A readable album length
 */
export const getAlbumLength: (tracks: ITrack[]) => any = (tracks = []) => {
    if (tracks.length === 0) return "";

    const albumLengthInMs = tracks.reduce((accumulator, currentTrack) => {
        return accumulator + currentTrack.duration_ms;
    }, 0);

    return prettyMS(albumLengthInMs, { secondsDecimalDigits: 0, verbose: true });
};

import { FC } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";

import { useUser } from "context";

interface IArtistBlockProps {
    /**
     * The id of the artist
     */
    id: string;
}

const ArtistBlock: FC<IArtistBlockProps> = ({ id }) => {
    const wrapperClasses = new ClassNames("w-full");
    const { accessToken } = useUser();
    const { data, loading, error } = useQuery<IArtistBlockQueryResult>(GET_ARTIST, {
        context: { headers: { authorization: accessToken } },
        variables: { id }
    });

    return (
        <div className={wrapperClasses.list()}>
            {loading && <div>Loading...</div>}
            {!loading && data?.artist && <div>{data.artist.name}</div>}
        </div>
    );
};

const GET_ARTIST = gql`
    query GetArtist($id: ID!) {
        artist(artistID: $id) {
            name
            popularity
            images {
                url
            }
            related_artists {
                name
            }
            followers {
                total
            }
            albums {
                items {
                    ... on Album {
                        id
                    }
                }
            }
        }
    }
`;

export default ArtistBlock;
export { ArtistBlock };

import { FC, useState } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";

import { useUser } from "context";

interface IDiscographyProps {
    /**
     * The id of the artist
     */
    id: string;
    /**
     * The initial filter used to filter the musical releases
     */
    initialFilter?: AlbumType;
}

const Discography: FC<IDiscographyProps> = ({ id, initialFilter = "album" }) => {
    const { accessToken } = useUser();
    const [releaseTypeFilter, setReleaseTypeFilter] = useState<AlbumType>(initialFilter);
    const { data, loading, error } = useQuery<IArtistBlockQueryResult>(GET_DISCOGRAPHY, {
        context: { headers: { authorization: accessToken } },
        variables: { id, releaseType: [releaseTypeFilter] }
    });

    return <div>New Component</div>;
};

const GET_DISCOGRAPHY = gql`
    query GetArtistDiscography($id: ID!, $releaseType: [String]) {
        artist(artistID: $id, include_groups: $releaseType) {
            name
            albums {
                items {
                    ... on Album {
                        id
                        name
                        images {
                            url
                        }
                    }
                }
            }
        }
    }
`;

export default Discography;
export { Discography };

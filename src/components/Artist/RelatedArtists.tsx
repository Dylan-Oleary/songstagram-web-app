import { FC } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";

import { SearchResultCard } from "components";
import { useUser } from "context";

interface IRelatedArtistsProps {
    /**
     * The id of the artist
     */
    id: string;
}

const RelatedArtists: FC<IRelatedArtistsProps> = ({ id }) => {
    const wrapperClasses = new ClassNames("w-full");
    const h3Classes = new ClassNames("text-6xl font-extrabold dark:text-white");
    const sectionListClasses = new ClassNames(
        "grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    );

    const { accessToken } = useUser();
    const { data, loading } = useQuery<IArtistBlockQueryResult>(GET_RELATED_ARTISTS, {
        context: { headers: { authorization: accessToken } },
        variables: { id }
    });

    return (
        <div className={wrapperClasses.list()}>
            <div className="space-y-4">
                <h3 className={h3Classes.list()}>Artists Like {data?.artist?.name}</h3>
                {loading && <div>Loading...</div>}
                {!loading && (data?.artist?.related_artists || []).length > 0 ? (
                    <div>
                        <div className={sectionListClasses.list()}>
                            {data?.artist?.related_artists.map((artist) => (
                                <SearchResultCard
                                    key={`related-artist-card-${artist.id}`}
                                    data={artist}
                                    type="artist"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    !loading && <div>No related artists found</div>
                )}
            </div>
        </div>
    );
};

const GET_RELATED_ARTISTS = gql`
    query GetRelatedArtists($id: ID!) {
        artist(artistID: $id) {
            name
            related_artists {
                id
                name
                images {
                    url
                }
            }
        }
    }
`;

export default RelatedArtists;
export { RelatedArtists };

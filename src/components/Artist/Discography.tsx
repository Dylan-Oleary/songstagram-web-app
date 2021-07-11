import { FC, useState } from "react";
import { ClassNames } from "@44north/classnames";
import { gql, useQuery } from "@apollo/client";

import { SearchResultCard, SelectInput } from "components";
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
    const wrapperClasses = new ClassNames("w-full");
    const h3Classes = new ClassNames("text-6xl font-extrabold dark:text-white");
    const sectionListClasses = new ClassNames(
        "grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    );

    const { accessToken } = useUser();
    const [releaseTypeFilter, setReleaseTypeFilter] = useState<SelectInputOption>(
        filterOptions.find((option) => option.value === initialFilter) || filterOptions[0]
    );
    const { data, loading } = useQuery<IArtistBlockQueryResult>(GET_DISCOGRAPHY, {
        context: { headers: { authorization: accessToken } },
        variables: { id, releaseType: [releaseTypeFilter.value] }
    });

    return (
        <div className={wrapperClasses.list()}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className={h3Classes.list()}>{data?.artist?.name}</h3>
                    <div className="w-36">
                        <SelectInput
                            name="discographyFilter"
                            onChange={(option) => setReleaseTypeFilter(option)}
                            options={filterOptions}
                            optionItemWrapperClassName="w-44"
                            value={releaseTypeFilter}
                        />
                    </div>
                </div>
                {loading && <div>Loading...</div>}
                {!loading && (data?.artist?.albums?.items || []).length > 0 ? (
                    <div>
                        <div className={sectionListClasses.list()}>
                            {data?.artist?.albums?.items.map((album) => (
                                <SearchResultCard
                                    key={`album-card-${album.id}`}
                                    artist={
                                        {
                                            id: data?.artist?.id,
                                            name: data?.artist?.name
                                        } as IArtist
                                    }
                                    data={album}
                                    type="album"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    !loading && <div>No releases found</div>
                )}
            </div>
        </div>
    );
};

const filterOptions: SelectInputOption[] = [
    {
        label: "Albums",
        value: "album"
    },
    {
        label: "Singles and EPs",
        value: "single"
    },
    {
        label: "Compilations",
        value: "compilation"
    }
];

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

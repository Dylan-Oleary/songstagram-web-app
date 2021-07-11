import { FC } from "react";

import { ArtistBlock, Button, Discography, RelatedArtists, SearchBlock } from "components";
import { useExplore } from "context";

const ExplorePortal: FC<{}> = ({}) => {
    const { activeComponent, navigateHistoryBack, navigateHistoryForward } = useExplore();
    let componentToRender: JSX.Element;

    switch (activeComponent.componentKey) {
        case "artist":
            componentToRender = <ArtistBlock id={activeComponent.value} />;
            break;
        case "discography":
            componentToRender = (
                <Discography
                    id={activeComponent?.value?.id}
                    initialFilter={activeComponent?.value?.initialFilter}
                />
            );
            break;
        case "relatedArtists":
            componentToRender = <RelatedArtists id={activeComponent.value} />;
            break;
        case "search":
            componentToRender = <SearchBlock initialSearchTerm={activeComponent.value} />;
            break;
        default:
            componentToRender = <SearchBlock />;
            break;
    }

    return (
        <div className="flex flex-col items-center h-full space-y-4">
            <div className="flex space-x-2">
                <Button onClick={navigateHistoryBack}>Back</Button>
                <Button onClick={navigateHistoryForward}>Forward</Button>
            </div>
            {componentToRender}
        </div>
    );
};

export default ExplorePortal;
export { ExplorePortal };

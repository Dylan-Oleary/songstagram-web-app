import { FC } from "react";

import { ArtistBlock, Discography, SearchBlock } from "components";
import { useExplore } from "context";

const ExplorePortal: FC<{}> = ({}) => {
    const { activeComponent } = useExplore();
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
        case "search":
            componentToRender = <SearchBlock initialSearchTerm={activeComponent.value} />;
            break;
        default:
            componentToRender = <SearchBlock />;
            break;
    }

    return <div className="flex flex-col items-center h-full space-y-4">{componentToRender}</div>;
};

export default ExplorePortal;
export { ExplorePortal };

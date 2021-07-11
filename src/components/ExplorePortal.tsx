import { FC } from "react";
import { ClassNames } from "@44north/classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

import { ArtistBlock, Button, Discography, RelatedArtists, SearchBlock } from "components";
import { useExplore } from "context";

const ExplorePortal: FC<{}> = ({}) => {
    const buttonClasses = new ClassNames(
        "transition duration-300 ease-in-out border dark:text-white text-gray-3 dark:border-white border-gray-3 hover:text-gray-4 hover:border-gray-4 disabled:border-gray-5 disabled:text-white dark:disabled:text-white dark:disabled:bg-transparent disabled:bg-gray-5 disabled:text-opacity-60 disabled:opacity-40 disabled:cursor-not-allowed"
    );
    const { activeComponent, history, navigateHistoryBack, navigateHistoryForward } = useExplore();
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
            <div className="flex w-full space-x-4">
                <Button
                    ariaLabel="Navigate Back"
                    borderRadius="circle"
                    className={buttonClasses.list()}
                    disabled={history.length === 1 || activeComponent.index === 0}
                    onClick={navigateHistoryBack}
                    outline
                    size="sm"
                    style="none"
                >
                    <ChevronLeftIcon className="w-6 h-6 mx-auto" />
                </Button>
                <Button
                    ariaLabel="Navigate Forward"
                    borderRadius="circle"
                    className={buttonClasses.list()}
                    disabled={history.length === 1 || activeComponent.index === history.length - 1}
                    onClick={navigateHistoryForward}
                    outline
                    size="sm"
                    style="none"
                >
                    <ChevronRightIcon className="w-6 h-6 mx-auto" />
                </Button>
            </div>
            {componentToRender}
        </div>
    );
};

export default ExplorePortal;
export { ExplorePortal };

import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";

type ExploreComponentControlKey =
    | "album"
    | "artist"
    | "discography"
    | "home"
    | "relatedArtists"
    | "track";

type ExploreComponentControl = {
    /**
     * The component key responsible for rendering the correct component
     */
    componentKey: ExploreComponentControlKey;
    /**
     * The value that drives the data fetching / initial render of the component
     */
    value: any;
};

type IndexedExploreComponentControl = ExploreComponentControl & {
    /**
     * The index of the item in the explore history
     */
    index: number;
};

interface IExploreContext {
    /**
     * The active component being rendered in the explore portal
     */
    activeComponent: IndexedExploreComponentControl;
    /**
     * An array of component keys and render values that help keep a view history
     */
    history: IndexedExploreComponentControl[];
    /**
     * Is the search functionality currently active?
     */
    isSearchActive?: boolean;
    /**
     * Moves back one entry in the history to render the active component
     */
    navigateHistoryBack: () => void;
    /**
     * Moves forward one entry in the history to render the active component
     */
    navigateHistoryForward: () => void;
    /**
     * Pushes a new component key/value pair to the history
     */
    pushToHistory: (entry: ExploreComponentControl) => void;
    /**
     * Sets whether or not the search is active
     */
    setIsSearchActive: Dispatch<SetStateAction<boolean>>;
}

const ExploreContext = createContext<IExploreContext>(undefined);

const ExploreProvider: FC<{}> = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState<IndexedExploreComponentControl>({
        componentKey: "home",
        value: "",
        index: 0
    });
    const [history, setHistory] = useState<IndexedExploreComponentControl[]>([
        {
            componentKey: "home",
            value: "",
            index: 0
        }
    ]);
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

    /**
     * Pushes a new component key/value pair to the history and sets the active component to the passed entry
     * @param entry The entry to push to the history
     */
    const pushToHistory: (entry: ExploreComponentControl) => void = (entry) => {
        const updatedHistory = [...history];
        const lastEntry = updatedHistory[updatedHistory.length - 1];
        const newEntry: IndexedExploreComponentControl = {
            ...entry,
            index: updatedHistory.length
        };

        if (
            typeof newEntry.value === "object" &&
            newEntry.componentKey === lastEntry.componentKey
        ) {
            let isSameEntry = true;

            for (const key of Object.keys(newEntry.value).filter((key) => key !== "index")) {
                if (newEntry.value[key] !== lastEntry.value[key]) isSameEntry = false;
            }

            if (isSameEntry) {
                setActiveComponent(lastEntry);
            } else {
                updatedHistory.push(newEntry);

                setHistory(updatedHistory);
                setActiveComponent(newEntry);
            }
        } else {
            updatedHistory.push(newEntry);

            setHistory(updatedHistory);
            setActiveComponent(newEntry);
        }
    };

    /**
     * Moves back one entry in the history to render the active component
     */
    const navigateHistoryBack: () => void = () => {
        if (isSearchActive) return setIsSearchActive(false);
        if (history.length === 1 || activeComponent.index === 0) return;

        setActiveComponent(history[activeComponent.index - 1]);
    };

    /**
     * Moves forward one entry in the history to render the active component
     */
    const navigateHistoryForward: () => void = () => {
        if (history.length === 1 || activeComponent.index === history.length - 1) return;

        setActiveComponent(history[activeComponent.index + 1]);
    };

    return (
        <ExploreContext.Provider
            value={{
                activeComponent,
                history,
                isSearchActive,
                navigateHistoryBack,
                navigateHistoryForward,
                pushToHistory,
                setIsSearchActive
            }}
        >
            {children}
        </ExploreContext.Provider>
    );
};

const useExplore = () => useContext(ExploreContext);

export default ExploreProvider;
export { ExploreContext, ExploreProvider, useExplore };

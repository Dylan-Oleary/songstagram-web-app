import { createContext, FC, useContext, useState } from "react";

type ExploreComponentControlKey = "album" | "artist" | "discography" | "search" | "track";

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
    activeComponent: ExploreComponentControl;
    /**
     * An array of component keys and render values that help keep a view history
     */
    history: ExploreComponentControl[];
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
}

const ExploreContext = createContext<IExploreContext>(undefined);

const ExploreProvider: FC<{}> = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState<IndexedExploreComponentControl>({
        componentKey: "search",
        value: "",
        index: 0
    });
    const [history, setHistory] = useState<IndexedExploreComponentControl[]>([
        {
            componentKey: "search",
            value: "",
            index: 0
        }
    ]);

    /**
     * Pushes a new component key/value pair to the history and sets the active component to the passed entry
     * @param entry The entry to push to the history
     */
    const pushToHistory: (entry: ExploreComponentControl) => void = (entry) => {
        const updatedHistory = [...history];
        const newEntry: IndexedExploreComponentControl = {
            ...entry,
            index: updatedHistory.length
        };

        updatedHistory.push(newEntry);

        setHistory(updatedHistory);
        setActiveComponent(newEntry);
    };

    /**
     * Moves back one entry in the history to render the active component
     */
    const navigateHistoryBack: () => void = () => {
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
                navigateHistoryBack,
                navigateHistoryForward,
                pushToHistory
            }}
        >
            {children}
        </ExploreContext.Provider>
    );
};

const useExplore = () => useContext(ExploreContext);

export default ExploreProvider;
export { ExploreContext, ExploreProvider, useExplore };

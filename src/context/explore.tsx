import { createContext, FC, useContext, useState } from "react";

type ExploreComponentControlKey = "album" | "artist" | "search" | "track";

type ExploreComponentControl = {
    /**
     * The component key responsible for rendering the correct component
     */
    componentKey: ExploreComponentControlKey;
    /**
     * The value that drives the data fetching of the rendered component
     */
    value: string;
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
     * Pushes a new component key/value pair to the history
     */
    pushToHistory: (entry: ExploreComponentControl) => void;
}

const ExploreContext = createContext<IExploreContext>(undefined);

const ExploreProvider: FC<{}> = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState<ExploreComponentControl>({
        componentKey: "search",
        value: ""
    });
    const [history, setHistory] = useState<ExploreComponentControl[]>([
        {
            componentKey: "search",
            value: ""
        }
    ]);

    /**
     * Pushes a new component key/value pair to the history and sets the active component to the passed entry
     * @param entry The entry to push to the history
     */
    const pushToHistory: (entry: ExploreComponentControl) => void = (entry) => {
        const updatedHistory = [...history];

        updatedHistory.push(entry);

        setHistory(updatedHistory);
        setActiveComponent(entry);
    };

    return (
        <ExploreContext.Provider value={{ activeComponent, history, pushToHistory }}>
            {children}
        </ExploreContext.Provider>
    );
};

const useExplore = () => useContext(ExploreContext);

export default ExploreProvider;
export { ExploreContext, ExploreProvider, useExplore };

import { createContext, FC, useContext, useState } from "react";

type ExploreComponentControl = {
    /**
     * The component key responsible for rendering the correct component
     */
    componentKey: "album" | "artist" | "search" | "track";
    /**
     * The value that drives the data fetching of the rendered component
     */
    value: string;
};

interface IExploreContext {
    activeComponent: ExploreComponentControl;
    history: ExploreComponentControl[];
}

const ExploreContext = createContext<IExploreContext>({
    activeComponent: {
        componentKey: "search",
        value: ""
    },
    history: []
});

const ExploreProvider: FC<{}> = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState<ExploreComponentControl>({
        componentKey: "search",
        value: ""
    });
    const [history, setHistory] = useState<ExploreComponentControl[]>([]);

    return (
        <ExploreContext.Provider value={{ activeComponent, history }}>
            {children}
        </ExploreContext.Provider>
    );
};

const useExplore = () => useContext(ExploreContext);

export default ExploreProvider;
export { ExploreContext, ExploreProvider, useExplore };

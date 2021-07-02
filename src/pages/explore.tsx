import { ExplorePortal } from "components";
import { ExploreProvider } from "context";
import { getAuthenticatedLayout } from "layouts";

const ExplorePage: ExtendedNextPage = ({}) => (
    <ExploreProvider>
        <ExplorePortal />
    </ExploreProvider>
);

ExplorePage.getLayout = getAuthenticatedLayout;

export default ExplorePage;

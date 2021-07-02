import { ExplorePortal } from "components";
import { getAuthenticatedLayout } from "layouts";

const ExplorePage: ExtendedNextPage = ({}) => <ExplorePortal />;

ExplorePage.getLayout = getAuthenticatedLayout;

export default ExplorePage;

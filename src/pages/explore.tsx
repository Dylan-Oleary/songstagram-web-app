import { getAuthenticatedLayout } from "layouts";

const ExplorePage: ExtendedNextPage = ({}) => {
    return <div className="flex flex-col items-center h-full space-y-4">Explore</div>;
};

ExplorePage.getLayout = getAuthenticatedLayout;

export default ExplorePage;

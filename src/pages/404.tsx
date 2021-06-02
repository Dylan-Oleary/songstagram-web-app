import { getApplicationLayout } from "layouts";

const NotFoundPage: ExtendedNextPage = ({}) => {
    return (
        <div className="flex items-center justify-center h-full space-y-4">
            <h1 className="text-6xl font-extrabold text-center">404 / Not Found</h1>
        </div>
    );
};

NotFoundPage.getLayout = getApplicationLayout;

export default NotFoundPage;

import { FC } from "react";

const ApplicationLayout: FC<{}> = ({ children }) => {
    return (
        <div className="flex w-full h-screen antialiased text-gray-700 bg-gradient-to-r from-yellow-200 to-yellow-300">
            <main className="flex-grow max-w-4xl px-8 mx-auto">{children}</main>
        </div>
    );
};

const getApplicationLayout: GetLayout = (page) => <ApplicationLayout>{page}</ApplicationLayout>;

export default ApplicationLayout;
export { getApplicationLayout, ApplicationLayout };

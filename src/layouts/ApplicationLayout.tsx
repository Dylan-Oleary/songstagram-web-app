import { FC, useEffect } from "react";

import { useUser } from "context";
import { updateApplicationTheme } from "lib";

const ApplicationLayout: FC<{}> = ({ children }) => {
    const { user } = useUser();

    useEffect(() => {
        updateApplicationTheme(user);
    }, [user]);

    return (
        <div className="flex w-full h-screen antialiased dark:bg-dark dark:text-white">
            <div className="flex-grow">{children}</div>
        </div>
    );
};

const getApplicationLayout: GetLayout = (page) => <ApplicationLayout>{page}</ApplicationLayout>;

export default ApplicationLayout;
export { getApplicationLayout, ApplicationLayout };

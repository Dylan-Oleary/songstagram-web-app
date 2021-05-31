import { getSiteLayout } from "layouts";

const LoginPage: ExtendedNextPage = ({}) => {
    return <div className="flex flex-col items-center h-full space-y-4">Login!</div>;
};

LoginPage.getLayout = getSiteLayout;

export default LoginPage;

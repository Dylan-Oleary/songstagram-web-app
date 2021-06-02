import { LoginForm } from "components";
import { getApplicationLayout } from "layouts";

const LoginPage: ExtendedNextPage = ({}) => {
    return (
        <div className="flex flex-col items-center h-full space-y-4">
            <LoginForm />
        </div>
    );
};

LoginPage.getLayout = getApplicationLayout;

export default LoginPage;

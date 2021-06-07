import Link from "next/link";

import { LoginForm } from "components";
import { getApplicationLayout } from "layouts";

const LoginPage: ExtendedNextPage = ({}) => {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="w-full max-w-sm mx-auto space-y-8 lg:w-96">
                    <div>
                        <img
                            className="w-auto h-12"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-6xl font-extrabold text-gray-1">
                            Sign in to your account
                        </h2>
                        <p className="mt-1 text-sm text-gray-3">
                            Don't have an account?{" "}
                            <Link href="/register">
                                <a className="font-medium transition duration-250 text-primary-3 hover:text-primary-1">
                                    Sign up today!
                                </a>
                            </Link>
                        </p>
                    </div>
                    <LoginForm className="mt-6 space-y-6" />
                </div>
            </div>
            <div className="relative flex-1 hidden w-0 lg:block">
                <img
                    className="absolute inset-0 object-cover w-full h-full"
                    src="https://images.unsplash.com/photo-1598363943803-54a01af6fec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw2MjIzNXwwfDF8c2VhcmNofDcxfHx2aW55bHxlbnwwfHx8fDE2MjMxMDE5NzU&ixlib=rb-1.2.1&q=80&w=1080"
                    alt=""
                />
            </div>
        </div>
    );
};

LoginPage.getLayout = getApplicationLayout;

export default LoginPage;

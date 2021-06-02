import Image from "next/image";
import { useRouter } from "next/router";

import { useUser } from "context";
import { getAuthenticatedLayout } from "layouts";
import { songstagramApi } from "lib";

const IndexPage: ExtendedNextPage = ({}) => {
    const router = useRouter();
    const { setAccessToken, setUser } = useUser();

    const logout = async () => {
        await songstagramApi("/logout", "POST").catch((error) => {
            //TODO: Error reporting
            console.error(error);
        });

        setAccessToken(null);
        setUser(null);

        router.replace("/login");
    };

    return (
        <div className="flex flex-col items-center h-full space-y-4">
            <Image alt="Puppers!" src="/puppers.png" layout="intrinsic" width={750} height={600} />
            <h1 className="text-2xl font-extrabold text-center">
                Next.js / TypeScript / TailwindCSS / Apollo Starter
            </h1>
            <button className="p-2 bg-blue-400" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

IndexPage.getLayout = getAuthenticatedLayout;

export default IndexPage;

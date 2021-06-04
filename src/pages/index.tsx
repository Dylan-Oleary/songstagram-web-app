import Image from "next/image";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

import { useUser } from "context";
import { getAuthenticatedLayout } from "layouts";
import { songstagramApi } from "lib";

const IndexPage: ExtendedNextPage = ({}) => {
    const router = useRouter();
    const { accessToken, setAccessToken, setUser, user } = useUser();
    const [updateUserPreferences] = useMutation(UPDATE_USER_PREFERENCES, {
        context: { headers: { authorization: accessToken } }
    });

    const logout = async () => {
        await songstagramApi("/logout", "POST").catch((error) => {
            //TODO: Error reporting
            console.error(error);
        });

        setAccessToken(null);
        setUser(null);

        router.replace("/login");
    };

    const changeTheme = () => {
        const currentPreferences = { ...user.preferences };

        setUser({
            ...user,
            preferences: {
                ...currentPreferences,
                prefersDarkMode: !currentPreferences.prefersDarkMode
            }
        });
        updateUserPreferences({
            variables: { data: { prefersDarkMode: !user.preferences.prefersDarkMode } }
        }).catch((error) => {
            setUser({
                ...user,
                preferences: {
                    ...currentPreferences
                }
            });
        });
    };

    return (
        <div className="flex flex-col items-center h-full space-y-4">
            <Image alt="Puppers!" src="/puppers.png" layout="intrinsic" width={750} height={600} />
            <h1 className="text-2xl font-extrabold text-center">
                Next.js / TypeScript / TailwindCSS / Apollo Starter
            </h1>
            <button onClick={changeTheme}>Change Theme</button>
            <button className="p-2 bg-blue-400" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

const UPDATE_USER_PREFERENCES = gql`
    mutation UpdateUserPreferences($data: UpdateUserPreferencesData) {
        updateUserPreferences(data: $data) {
            prefersDarkMode
        }
    }
`;

IndexPage.getLayout = getAuthenticatedLayout;

export default IndexPage;

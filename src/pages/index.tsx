import { gql, useMutation } from "@apollo/client";

import { useUser } from "context";
import { getAuthenticatedLayout } from "layouts";

const IndexPage: ExtendedNextPage = ({}) => {
    const { accessToken, setUser, user } = useUser();
    const [updateUserPreferences] = useMutation(UPDATE_USER_PREFERENCES, {
        context: { headers: { authorization: accessToken } }
    });

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
            <button onClick={changeTheme}>Change Theme</button>
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

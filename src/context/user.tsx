import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";

interface InitialUserContext {
    /**
     * The access token used to access resources from the API
     */
    accessToken?: string;
    /**
     * The user object
     */
    user?: IBaseUser;
}

interface IUserContext extends InitialUserContext {
    /**
     * Function that updates the current access token
     */
    setAccessToken: Dispatch<SetStateAction<string>>;
    /**
     * Function that updates the current user in context
     */
    setUser: Dispatch<SetStateAction<IBaseUser>>;
}

const UserContext = createContext<IUserContext>(undefined);

const UserProvider: FC<{ initialValues: InitialUserContext }> = ({ initialValues, children }) => {
    const [user, setUser] = useState<IBaseUser>(
        initialValues?.user ? { ...initialValues.user } : null
    );
    const [accessToken, setAccessToken] = useState<string>(initialValues?.accessToken || null);

    return (
        <UserContext.Provider value={{ accessToken, setAccessToken, setUser, user }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => useContext(UserContext);

export default UserProvider;
export { UserContext, UserProvider, useUser };

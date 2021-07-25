import { songstagramApi } from "lib";

/**
 * Makes a request to `/logout` and clears the httpsOnly cookies
 */
const logout: () => Promise<any> = () => {
    return songstagramApi("/logout", "POST").catch((error) => {
        //TODO: Error reporting
        console.error(error);
        return;
    });
};

export default logout;
export { logout };

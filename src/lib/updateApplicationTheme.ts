/**
 * Update's the application theme
 *
 * @param user A base user record
 */
const updateApplicationTheme: (user: IBaseUser) => void = (user) => {
    if (typeof window !== undefined) {
        if (user && user.preferences?.prefersDarkMode) {
            return document.documentElement.classList.add("dark");
        }

        return document.documentElement.classList.remove("dark");
    }
};

export default updateApplicationTheme;
export { updateApplicationTheme };

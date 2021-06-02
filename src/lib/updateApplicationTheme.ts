/**
 * Update's the application theme
 *
 * @param user A base user record
 */
const updateApplicationTheme: (user: IBaseUser) => void = (user) => {
    if (typeof window !== undefined) {
        if (user) {
            if (user.darkMode) {
                document.documentElement.classList.add("dark");
                if (localStorage) localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                if (localStorage) localStorage.removeItem("theme");
            }
        } else {
            if (
                localStorage?.theme === "dark" ||
                (!("theme" in localStorage) &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
                document.documentElement.classList.add("dark");
                if (localStorage) localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                if (localStorage) localStorage.removeItem("theme");
            }
        }
    }
};

export default updateApplicationTheme;
export { updateApplicationTheme };

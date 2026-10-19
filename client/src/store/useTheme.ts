import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
}

// A theme the user picked wins; until then, follow the OS setting (not saved, so it keeps following).
const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const setThemeAttribute = (theme: Theme) => {
    document.documentElement.setAttribute("data-theme", theme);
};

const initialTheme = getInitialTheme();
setThemeAttribute(initialTheme);

export const useTheme = create<ThemeStore>((set) => ({
    theme: initialTheme,
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === "light" ? "dark" : "light";
            setThemeAttribute(next);
            localStorage.setItem("theme", next);
            return { theme: next };
        }),
}));

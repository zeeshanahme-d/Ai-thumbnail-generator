import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
}

const getStoredTheme = (): Theme => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return "light";
};

const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
};

const initialTheme = getStoredTheme();
applyTheme(initialTheme);

export const useTheme = create<ThemeStore>((set) => ({
    theme: initialTheme,
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === "light" ? "dark" : "light";
            applyTheme(next);
            return { theme: next };
        }),
}));

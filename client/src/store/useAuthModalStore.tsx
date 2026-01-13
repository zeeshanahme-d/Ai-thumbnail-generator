import { create } from 'zustand';
import type { AuthMode } from '../types';

interface AuthModalStore {
    history: AuthMode[];
    mode: AuthMode;
    isModalOpen: boolean;
    showAuthModal: (mode: AuthMode) => void;
    closeModal: () => void;
    goBack: () => void;
}

export const useAuthStore = create<AuthModalStore>((set) => ({
    isModalOpen: false,
    mode: 'login',
    history: [],
    showAuthModal: (mode) => {
        set((state) => ({
            isModalOpen: true,
            mode,
            history: [...state.history, state.mode],
        }));
        const body = document.getElementById("body");
        if (body) {
            body.style.overflow = "hidden"
        }
    },
    closeModal: () => {
        set(() => ({
            isModalOpen: false,
            mode: "login",
            history: [],
        }))
        localStorage.removeItem("forgotEmail");
        localStorage.removeItem("verifiedOtp");
        const body = document.getElementById("body");
        if (body) {
            body.removeAttribute("style")
        }
    },
    goBack: () => set((state) => {
        const newHistory = [...state.history];
        const previousMode = newHistory.pop();
        return { mode: previousMode || 'login', history: newHistory };
    }),
}));
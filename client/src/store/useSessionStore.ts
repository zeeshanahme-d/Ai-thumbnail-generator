import { create } from "zustand";
import type { IUser } from "../types";

const STORAGE_KEY = "tg_session";

interface PersistedSession {
  user: IUser;
}

interface SessionState {
  user: IUser | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  setSession: (user: IUser) => void;
  clearSession: () => void;
  finishRestoring: () => void;
}

const readStoredSession = (): PersistedSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedSession) : null;
  } catch {
    return null;
  }
};

export const useSession = create<SessionState>((set) => {
  const stored = readStoredSession();

  return {
    user: stored?.user ?? null,
    isAuthenticated: !!stored?.user,
    isRestoring: true,

    setSession: (user) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user } satisfies PersistedSession),
      );
      set({ user, isAuthenticated: true });
    },

    clearSession: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, isAuthenticated: false });
    },

    finishRestoring: () => set({ isRestoring: false }),
  };
});

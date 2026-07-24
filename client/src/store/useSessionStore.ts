import { create } from "zustand";
import type { IUser } from "../pages/auth/core/_models";

const STORAGE_KEY = "tg_session";

interface PersistedSession {
  user: IUser;
  accessToken: string;
}

interface SessionState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  setSession: (user: IUser, accessToken: string) => void;
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
    accessToken: stored?.accessToken ?? null,
    isAuthenticated: !!stored?.accessToken,
    isRestoring: true,

    setSession: (user, accessToken) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, accessToken } satisfies PersistedSession),
      );
      set({ user, accessToken, isAuthenticated: true });
    },

    clearSession: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, accessToken: null, isAuthenticated: false });
    },

    finishRestoring: () => set({ isRestoring: false }),
  };
});

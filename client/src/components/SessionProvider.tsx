import { useEffect, useRef, type ReactNode } from "react";
import { useSession } from "../store/useSessionStore";
import { useVerifySession } from "../pages/auth/core/hooks";

// Restores the session on every page load by hitting /auth/verify, which
// returns the current access token (or a fresh one from the refresh cookie).
// Rendering is held back until it settles so route guards see the real state.
export default function SessionProvider({ children }: { children: ReactNode }) {
  const isRestoring = useSession((state) => state.isRestoring);
  const { mutate: verify } = useVerifySession();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // StrictMode mounts effects twice in dev
    hasRun.current = true;
    verify();
  }, [verify]);

  if (isRestoring) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background-surface">
        <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

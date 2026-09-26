import { useEffect, useRef, type ReactNode } from "react";
import { useSession } from "../store/useSessionStore";
import { useVerifySession } from "../core/auth/hooks";
import PageLoader from "./PageLoader";

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
    return <PageLoader fullScreen />;
  }

  return <>{children}</>;
}

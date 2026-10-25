import { useEffect, useRef, type ReactNode } from "react";
import { useSession } from "../store/useSessionStore";
import { useVerifySession } from "../core/auth/hooks";
import PageLoader from "./PageLoader";

// When a session is stored, checks it with /auth/verify (falling back to the refresh cookie) and
// holds rendering until it settles, so route guards see the real state. Guests skip the call.
export default function SessionProvider({ children }: { children: ReactNode }) {
  const isRestoring = useSession((state) => state.isRestoring);
  const { mutate: verify } = useVerifySession();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !isRestoring) return; // StrictMode mounts effects twice in dev
    hasRun.current = true;
    verify();
  }, [verify, isRestoring]);

  if (isRestoring) {
    return <PageLoader fullScreen />;
  }

  return <>{children}</>;
}

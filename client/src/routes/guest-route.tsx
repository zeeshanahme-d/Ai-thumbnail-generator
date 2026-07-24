import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSession } from '../store/useSessionStore';

interface GuestRouteProps {
    children: ReactNode;
}

// Auth-only screens: signed-in users are bounced back to the app.
function GuestRoute({ children }: GuestRouteProps) {
    const isAuthenticated = useSession((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/dashboard/generate" replace />;
    }

    return <>{children}</>;
}

export default GuestRoute;

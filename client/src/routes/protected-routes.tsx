import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
    const currentUser = false;

    const isAllowed = !!currentUser

    if (!isAllowed) {
        return <Navigate to={redirectTo} />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;

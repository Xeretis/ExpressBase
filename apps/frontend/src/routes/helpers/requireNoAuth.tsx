import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/auth/useAuth";

export const RequireNoAuth = ({ redirect }: { redirect?: string }) => {
    const auth = useAuth();
    const location = useLocation();

    return auth.user ? (
        <Navigate to={redirect ?? "/"} state={{ from: location }} replace />
    ) : (
        <Outlet />
    );
};

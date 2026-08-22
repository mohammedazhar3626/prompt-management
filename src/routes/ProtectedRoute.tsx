import { Navigate } from "react-router-dom"
import { useAuth } from "../store/auth.store"
import { Role } from "../constants/roles";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: readonly Role[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
    const { user, hasHydrated } = useAuth()

    if (!hasHydrated) {
        return null
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
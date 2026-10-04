import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Utilisateur non connecté
    if (!token) {
        console.log("vous n'êtes pas authentifié")
        return <Navigate to="/" replace />;
    }

    // Rôle non autorisé
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
}

export default ProtectedRoute;
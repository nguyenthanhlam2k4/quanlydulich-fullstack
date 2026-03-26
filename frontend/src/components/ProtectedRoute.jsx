// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") return <Navigate to="/" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};
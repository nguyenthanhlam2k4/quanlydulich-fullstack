import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, logout } = useAuth();

  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Kiểm tra token hết hạn
    if (payload.exp * 1000 < Date.now()) {
      logout(); // xóa token cũ
      return <Navigate to="/" replace />;
    }

    // Kiểm tra quyền admin
    if (adminOnly && payload.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  } catch {
    logout();
    return <Navigate to="/" replace />;
  }

  return children;
};
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./admin/Dashboard";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Trang login */}
        <Route path="/login" element={<AuthPage />} />

        {/* Trang admin - phải đăng nhập + admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Trang profile - phải đăng nhập */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Trang chủ */}
        <Route path="/" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
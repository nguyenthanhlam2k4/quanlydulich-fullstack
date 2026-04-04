import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./admin/Dashboard";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import TourDetail from "./pages/TourDetail";
import ProfilePage from "./pages/ProfilePage";
import BookedPage from "./pages/BookedPage";
import FavoritesPage from "./pages/FavoritesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PaymentResult from "./pages/PaymentResult";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/payment/result" element={<PaymentResult />} />

        <Route path="/admin/*" element={
          <ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/booked" element={
          <ProtectedRoute><BookedPage /></ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute><FavoritesPage /></ProtectedRoute>
        } />

        <Route path="/" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
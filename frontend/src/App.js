import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import AboutPage from "./pages/AboutPage";
import AuthCallback from "./pages/AuthCallback";
import CommunityPage from "./pages/CommunityPage";
import DashboardPage from "./pages/DashboardPage";
import EducationPage from "./pages/EducationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SellWastePage from "./pages/SellWastePage";
import UploadTestPage from "./pages/UploadTestPage";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/smart-sort" element={<UploadTestPage />} />
                <Route path="/upload-test" element={<UploadTestPage />} />
                <Route path="/sell-waste" element={<SellWastePage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <CommunityPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("=== Auth Callback Starting ===");
        console.log("URL:", window.location.href);

        // Handle the auth callback using Supabase's built-in method
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Supabase session error:", error);
          throw error;
        }

        console.log("Session data:", data);

        if (data.session && data.session.user) {
          const user = data.session.user;
          console.log("User found:", user);

          try {
            // Send user data to backend
            const response = await axios.post("/auth/oauth", {
              email: user.email,
              name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email,
              provider: "google",
              providerId: user.id,
            });

            console.log("Backend response:", response.data);

            if (response.data.success) {
              // Store token
              localStorage.setItem("token", response.data.token);

              // Update auth context
              await checkAuthStatus();

              // Show success message
              toast.success("Login berhasil!");

              // Navigate to dashboard
              navigate("/dashboard");
            } else {
              throw new Error("Backend authentication failed");
            }
          } catch (backendError) {
            console.error("Backend error:", backendError);
            toast.error("Gagal menyimpan data pengguna");
            navigate("/login");
          }
        } else {
          console.log("No session found, redirecting to login");
          toast.error("Login gagal");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Login gagal: " + error.message);
        navigate("/login");
      }
    };

    // Add small delay to ensure URL is processed
    const timer = setTimeout(handleAuthCallback, 1000);

    return () => clearTimeout(timer);
  }, [navigate, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Memproses login...</p>
        <p className="text-neutral-500 text-sm mt-2">Tunggu sebentar...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

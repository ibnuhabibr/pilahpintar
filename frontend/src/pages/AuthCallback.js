import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get session from URL hash
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          // Create or update user in your backend
          const response = await axios.post("/api/auth/oauth", {
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            provider: "google",
            providerId: session.user.id,
          });

          if (response.data.success) {
            const { token } = response.data;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Refresh auth status
            await checkAuthStatus();

            toast.success("Login berhasil!", { id: "google-auth" });
            navigate("/dashboard");
          } else {
            throw new Error("Failed to create user session");
          }
        } else {
          throw new Error("No user session found");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Gagal menyelesaikan login dengan Google", {
          id: "google-auth",
        });
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Menyelesaikan login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

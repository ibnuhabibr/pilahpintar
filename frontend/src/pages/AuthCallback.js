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
        console.log("=== Auth Callback Debug ===");
        console.log("Current URL:", window.location.href);
        console.log("Hash:", window.location.hash);

        // Handle OAuth callback - get session from URL
        const { data, error } = await supabase.auth.getSession();

        console.log("Supabase session data:", data);
        console.log("Supabase error:", error);

        if (error) {
          console.error("Supabase auth error:", error);
          throw error;
        }

        // If no session from getSession, try to get from URL hash
        if (!data.session) {
          console.log("No session found, trying to parse from URL...");

          // Parse URL hash for tokens
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken) {
            console.log("Found access token in URL, setting session...");

            // Set the session with the tokens
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              console.error("Error setting session:", sessionError);
              throw sessionError;
            }

            console.log("Session set successfully:", sessionData);
            data.session = sessionData.session;
          }
        }

        if (data.session?.user) {
          console.log("Auth callback - User data:", data.session.user);

          // Create or update user in your backend (using configured axios baseURL)
          const response = await axios.post("/auth/oauth", {
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name || data.session.user.email,
            provider: "google",
            providerId: data.session.user.id,
          });

          console.log("Backend OAuth response:", response.data);

          if (response.data.success) {
            const { token } = response.data;
            localStorage.setItem("token", token);

            // Refresh auth status
            await checkAuthStatus();

            toast.success("Login berhasil!", { id: "google-auth" });

            // Clear the URL hash and redirect
            window.history.replaceState({}, document.title, "/dashboard");
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

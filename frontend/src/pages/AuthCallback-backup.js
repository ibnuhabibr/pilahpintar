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

        // Parse the hash parameters manually for better reliability
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        console.log("Access token from hash:", accessToken ? "Present" : "Not found");
        console.log("Refresh token from hash:", refreshToken ? "Present" : "Not found");

        let session = null;

        if (accessToken) {
          // Set session using the tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error("Error setting session:", error);
            throw error;
          }

          session = data.session;
          console.log("Session set from tokens:", session);
        } else {
          // Fallback to getSession
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Supabase getSession error:", error);
            throw error;
          }

          session = data.session;
          console.log("Session from getSession:", session);
        }

        if (session?.user) {
          console.log("Auth callback - User data:", session.user);

          // Create or update user in backend
          const response = await axios.post("/auth/oauth", {
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            provider: "google",
            providerId: session.user.id,
          });

          console.log("Backend OAuth response:", response.data);

          if (response.data.success) {
            const { token } = response.data;
            localStorage.setItem("token", token);

            // Clear the URL hash to remove tokens from address bar
            window.history.replaceState(null, "", window.location.pathname);

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

        // Clear URL hash on error too
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/login");
      }
    };

    // Small delay to ensure URL is processed
    const timeoutId = setTimeout(handleAuthCallback, 1000);

    return () => clearTimeout(timeoutId);
  }, [navigate, checkAuthStatus]);
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

    // Small delay to ensure URL is processed
    const timeoutId = setTimeout(handleAuthCallback, 500);

    return () => clearTimeout(timeoutId);
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

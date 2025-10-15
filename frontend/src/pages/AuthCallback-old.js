import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { supabase } from "../config/supabase";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("=== Auth Callback Debug ===");
        console.log("Current URL:", window.location.href);
        console.log("Hash:", window.location.hash);
        console.log("Search:", window.location.search);

        // Handle auth state change from Supabase
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state change:", event, session);

          if (event === "SIGNED_IN" && session?.user) {
            try {
              console.log("Processing signed in user:", session.user);

              // Create or update user in backend
              const response = await axios.post("/auth/oauth", {
                email: session.user.email,
                name:
                  session.user.user_metadata?.full_name || session.user.email,
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
            } catch (error) {
              console.error("Backend OAuth error:", error);
              toast.error("Gagal menyimpan data pengguna", {
                id: "google-auth",
              });
              navigate("/login");
            } finally {
              setProcessing(false);
              subscription.unsubscribe();
            }
          } else if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
            console.log("Auth event:", event);
            // Continue waiting for SIGNED_IN
          }
        });

        // Also try to get current session immediately
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        if (session?.user) {
          console.log("Found existing session:", session.user);

          // Process existing session
          try {
            const response = await axios.post("/auth/oauth", {
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email,
              provider: "google",
              providerId: session.user.id,
            });

            if (response.data.success) {
              const { token } = response.data;
              localStorage.setItem("token", token);

              window.history.replaceState(null, "", window.location.pathname);
              await checkAuthStatus();

              toast.success("Login berhasil!", { id: "google-auth" });
              navigate("/dashboard");
            } else {
              throw new Error("Failed to create user session");
            }
          } catch (error) {
            console.error("Backend OAuth error:", error);
            toast.error("Gagal menyimpan data pengguna");
            navigate("/login");
          } finally {
            setProcessing(false);
            subscription.unsubscribe();
          }
        }

        // Timeout after 10 seconds
        setTimeout(() => {
          if (processing) {
            console.log("Timeout waiting for auth");
            toast.error("Timeout menunggu autentikasi");
            navigate("/login");
            setProcessing(false);
            subscription.unsubscribe();
          }
        }, 10000);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Gagal menyelesaikan login dengan Google", {
          id: "google-auth",
        });

        window.history.replaceState(null, "", window.location.pathname);
        navigate("/login");
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, checkAuthStatus, processing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Menyelesaikan login...</p>
        <p className="text-neutral-500 text-sm mt-2">
          Memproses autentikasi Google...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;

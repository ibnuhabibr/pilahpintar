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
        console.log("Search:", window.location.search);

        // For PKCE flow, check URL params first
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log("PKCE code found in URL:", code);
          
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Error exchanging code for session:", error);
            throw error;
          }
          
          const session = data.session;
          console.log("Session from PKCE exchange:", session);
          
          if (session?.user) {
            await processUser(session.user);
            return;
          }
        }

        // Fallback: Get current session (for implicit flow or existing sessions)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          throw sessionError;
        }

        const session = sessionData.session;
        console.log("Current session:", session);

        if (session?.user) {
          await processUser(session.user);
        } else {
          // Listen for auth state changes
          console.log("No session found, listening for auth state changes...");
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log("Auth state change:", event, session);
              
              if (event === 'SIGNED_IN' && session?.user) {
                await processUser(session.user);
                subscription.unsubscribe();
              }
            }
          );

          // Cleanup after 15 seconds if nothing happens
          setTimeout(() => {
            subscription.unsubscribe();
            console.log("Timeout waiting for auth state change");
            toast.error("Timeout menunggu autentikasi");
            navigate("/login");
          }, 15000);
        }

      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Gagal menyelesaikan login dengan Google");
        navigate("/login");
      }
    };

    const processUser = async (user) => {
      try {
        console.log("Processing user:", user);

        // Create or update user in backend
        const response = await axios.post("/auth/oauth", {
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          provider: "google",
          providerId: user.id,
        });

        console.log("Backend OAuth response:", response.data);

        if (response.data.success) {
          const { token } = response.data;
          localStorage.setItem("token", token);

          // Clear URL parameters
          window.history.replaceState(null, "", window.location.pathname);

          // Refresh auth status
          await checkAuthStatus();

          toast.success("Login berhasil!");
          navigate("/dashboard");
        } else {
          throw new Error("Failed to create user session in backend");
        }
      } catch (error) {
        console.error("Error processing user:", error);
        toast.error("Gagal menyimpan data pengguna");
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
        <p className="text-neutral-500 text-sm mt-2">
          Memproses autentikasi Google...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
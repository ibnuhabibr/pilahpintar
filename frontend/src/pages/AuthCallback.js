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
    console.log("=== Auth Callback Started ===");
    console.log("Current URL:", window.location.href);
    console.log("Hash:", window.location.hash);
    
    // Set up auth state listener for OAuth callback
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      console.log("Auth session:", session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log("Processing OAuth sign in...");
          
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

            // Refresh auth status
            await checkAuthStatus();

            toast.success("Login berhasil!", { id: "google-auth" });
            
            // Clean up and redirect
            authListener.subscription.unsubscribe();
            navigate("/dashboard", { replace: true });
          } else {
            throw new Error("Failed to create user session");
          }
        } catch (error) {
          console.error("OAuth processing error:", error);
          toast.error("Gagal menyelesaikan login dengan Google", {
            id: "google-auth",
          });
          authListener.subscription.unsubscribe();
          navigate("/login", { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out during OAuth");
        toast.error("Login dibatalkan", { id: "google-auth" });
        authListener.subscription.unsubscribe();
        navigate("/login", { replace: true });
      }
    });

    // Cleanup function
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
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

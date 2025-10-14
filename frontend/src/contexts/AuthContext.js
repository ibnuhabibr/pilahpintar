import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { supabase } from "../config/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if backend is available
  const isProduction = process.env.NODE_ENV === "production";
  const backendUrl = isProduction
    ? process.env.REACT_APP_API_URL_PRODUCTION || process.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL;

  // Always assume backend is available
  const hasBackend = true;

  console.log("AuthContext environment:", {
    isProduction,
    backendUrl,
    hasBackend,
    NODE_ENV: process.env.NODE_ENV,
  });

  useEffect(() => {
    if (hasBackend) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [hasBackend]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // axios headers will be set by interceptor
        const response = await axios.get("/auth/me");
        setUser(response.data.user);
      }
    } catch (error) {
      console.warn("Auth check failed (backend not available):", error.message);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("=== Login Debug ===");
      console.log("Email:", email);
      console.log("Backend URL:", backendUrl);
      console.log("API Call: POST /auth/login");

      const response = await axios.post("/auth/login", { email, password });
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      console.log("Login successful for user:", user.email);

      return { success: true };
    } catch (error) {
      console.error("Login error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        url: error.config?.url
      });

      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("=== Register Debug ===");
      console.log("User data:", userData);
      console.log("Backend URL:", backendUrl);
      console.log("API Call: POST /auth/register");

      const response = await axios.post("/auth/register", userData);
      console.log("Register response:", response.data);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      console.log("Registration successful for user:", user.email);

      return { success: true };
    } catch (error) {
      console.error("Register error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        url: error.config?.url
      });

      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Determine correct redirect URL based on environment
      const getRedirectURL = () => {
        if (isProduction) {
          // In production, use the actual deployed frontend URL
          return process.env.REACT_APP_FRONTEND_URL
            ? `${process.env.REACT_APP_FRONTEND_URL}/auth/callback`
            : `${window.location.origin}/auth/callback`;
        } else {
          // In development, use localhost
          return `${window.location.origin}/auth/callback`;
        }
      };

      const redirectURL = getRedirectURL();

      console.log("=== OAuth Debug Info ===");
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Is Production:", isProduction);
      console.log("Current Origin:", window.location.origin);
      console.log("Frontend URL:", process.env.REACT_APP_FRONTEND_URL);
      console.log("OAuth redirect URL:", redirectURL);
      console.log("========================="); // OAuth akan redirect otomatis, jadi kita return success untuk UI feedback
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectURL,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;

      // Jika sampai di sini, berarti redirect berhasil dimulai
      return { success: true, redirecting: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Google login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    supabase.auth.signOut();
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

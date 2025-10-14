import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
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
  const hasBackend = !isProduction || backendUrl;

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
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get("/api/auth/me");
        setUser(response.data.user);
      }
    } catch (error) {
      console.warn("Auth check failed (backend not available):", error.message);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // OAuth akan redirect otomatis, jadi kita return success untuk UI feedback
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
    delete axios.defaults.headers.common["Authorization"];
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

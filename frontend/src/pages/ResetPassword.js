import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        console.log("=== Reset Password Debug ===");
        console.log("Current URL:", window.location.href);
        console.log("Hash:", window.location.hash);
        console.log("Search:", location.search);

        // Check for error in hash first
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );

        const error = hashParams.get("error");
        const errorCode = hashParams.get("error_code");
        const errorDescription = hashParams.get("error_description");

        if (error) {
          console.error("Supabase error in URL:", {
            error,
            errorCode,
            errorDescription,
          });

          if (errorCode === "otp_expired") {
            toast.error(
              "Link reset password sudah kadaluarsa. Silakan request link baru."
            );
          } else {
            toast.error(
              "Link reset password tidak valid. Silakan request link baru."
            );
          }

          // Wait 2 seconds then redirect
          setTimeout(() => {
            navigate("/forgot-password");
          }, 2000);
          return;
        }

        // Check for valid tokens
        const searchParams = new URLSearchParams(location.search);

        const accessToken =
          hashParams.get("access_token") || searchParams.get("access_token");
        const refreshToken =
          hashParams.get("refresh_token") || searchParams.get("refresh_token");
        const type = hashParams.get("type") || searchParams.get("type");

        console.log("Access token:", accessToken ? "Present" : "Not found");
        console.log("Refresh token:", refreshToken ? "Present" : "Not found");
        console.log("Type:", type);

        if (accessToken && type === "recovery") {
          try {
            // Set the session with the recovery tokens
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || accessToken,
            });

            if (error) {
              console.error("Error setting recovery session:", error);
              throw error;
            }

            console.log("Recovery session set successfully:", data.session);
            setValidToken(true);

            // Clear the URL to remove sensitive tokens
            window.history.replaceState(null, "", window.location.pathname);
          } catch (sessionError) {
            console.error("Session error:", sessionError);
            throw sessionError;
          }
        } else {
          throw new Error("Invalid or missing recovery token");
        }
      } catch (error) {
        console.error("Password reset validation error:", error);
        toast.error(
          "Link reset password tidak valid atau sudah kadaluarsa. Silakan request link baru."
        );

        // Wait 2 seconds then redirect
        setTimeout(() => {
          navigate("/forgot-password");
        }, 2000);
      }
    };

    handlePasswordReset();
  }, [location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success("Password berhasil diubah!");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memvalidasi link reset password...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Reset Password
          </h1>
          <p className="text-neutral-600">Masukkan password baru Anda</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan password baru"
              required
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Konfirmasi password baru"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Mengubah Password..." : "Ubah Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

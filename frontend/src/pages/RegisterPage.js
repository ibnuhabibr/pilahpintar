import { motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Recycle,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeNewsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (!formData.agreeTerms) {
      toast.error("Anda harus menyetujui syarat dan ketentuan");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, agreeTerms, agreeNewsletter, ...userData } =
        formData;
      const result = await register(userData);

      if (result.success) {
        toast.success("Pendaftaran berhasil! Selamat datang di PilahPintar!");
        navigate("/dashboard");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      toast.loading("Mengarahkan ke Google...", { id: "google-auth" });

      const result = await loginWithGoogle();
      if (result.success) {
        if (result.redirecting) {
          toast.success("Mengarahkan ke Google untuk registrasi...", {
            id: "google-auth",
          });
          // Loading akan tetap true sampai redirect terjadi
        } else {
          toast.success("Registrasi dengan Google berhasil!", {
            id: "google-auth",
          });
          navigate("/dashboard");
          setLoading(false);
        }
      } else {
        toast.error(result.error || "Gagal registrasi dengan Google", {
          id: "google-auth",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Google register error:", error);
      toast.error("Terjadi kesalahan saat registrasi dengan Google", {
        id: "google-auth",
      });
      setLoading(false);
    }
  };

  const benefits = [
    "Dashboard personal dengan analytics",
    "Riwayat klasifikasi tersimpan",
    "Forum komunitas peduli lingkungan",
    "Direktori bank sampah terdekat",
    "Konten edukasi lengkap",
    "Profile dan preferensi personal",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-2xl">
                  <Recycle className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-neutral-800 mb-4 font-display">
                Bergabung dengan PilahPintar
              </h1>
              <p className="text-lg text-neutral-600">
                Menjadi bagian dari komunitas yang peduli lingkungan dan
                menciptakan perubahan nyata
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                Manfaat Bergabung:
              </h3>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="text-neutral-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {/* Mobile header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-3 rounded-xl">
                  <Recycle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-neutral-800 font-display">
                Daftar PilahPintar
              </h2>
              <p className="mt-2 text-neutral-600">
                Mulai perjalanan Anda menuju lingkungan yang lebih bersih
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="input-field pl-10"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input-field pl-10"
                      placeholder="Masukkan email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Phone and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      No. Telepon
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="input-field pl-10"
                        placeholder="08xxxxxxxxxx"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Lokasi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        className="input-field pl-10"
                        placeholder="Kota/Kabupaten"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="Minimal 6 karakter"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-1"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="ml-2 block text-sm text-neutral-700"
                    >
                      Saya setuju dengan{" "}
                      <a
                        href="/terms-of-service"
                        className="text-primary-600 hover:text-primary-500 font-medium"
                      >
                        Syarat & Ketentuan
                      </a>{" "}
                      dan{" "}
                      <a
                        href="/privacy-policy"
                        className="text-primary-600 hover:text-primary-500 font-medium"
                      >
                        Kebijakan Privasi
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="agreeNewsletter"
                      name="agreeNewsletter"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-1"
                      checked={formData.agreeNewsletter}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="agreeNewsletter"
                      className="ml-2 block text-sm text-neutral-700"
                    >
                      Saya ingin menerima newsletter dan update tentang
                      lingkungan
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      "Daftar Sekarang"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">Atau</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Daftar dengan Google
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-neutral-600">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

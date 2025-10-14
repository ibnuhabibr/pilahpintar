import { motion } from "framer-motion";
import { ArrowLeft, Recycle, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassificationResult from "../components/ClassificationResult";
import ImageUpload from "../components/ImageUpload";

const UploadTestPage = () => {
  const navigate = useNavigate();
  const [classificationResult, setClassificationResult] = useState(null);
  const [error, setError] = useState("");

  const handleUploadSuccess = (result) => {
    console.log("Upload successful:", result);
    setClassificationResult(result);
    setError("");
  };

  const handleUploadError = (errorMessage) => {
    console.error("Upload error:", errorMessage);
    setError(errorMessage);
    setClassificationResult(null);
  };

  const handleNewClassification = () => {
    setClassificationResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Dashboard
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                PilahPintar AI
              </h1>
            </motion.div>

            <p className="text-gray-500 mb-4">
              Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari
            </p>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-2xl">❌</span>
                <div>
                  <h3 className="font-medium">Terjadi Kesalahan</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {classificationResult ? (
            <ClassificationResult
              result={classificationResult}
              onNewClassification={handleNewClassification}
            />
          ) : (
            <div>
              <ImageUpload
                onUploadSuccess={handleUploadSuccess}
                onError={handleUploadError}
              />

              {/* How it Works - Indonesian */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12 bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
                  <Recycle className="w-6 h-6 text-green-600" />
                  Cara Kerja PilahPintar
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📸</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      1. Upload Foto
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ambil atau upload foto sampah yang ingin Anda klasifikasi
                      dengan jelas
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      2. Analisis AI
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Model CNN kami menganalisis gambar dan mengidentifikasi
                      jenis sampah dengan skor kepercayaan
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      3. Dapatkan Hasil
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Terima hasil klasifikasi lengkap dengan saran pembuangan,
                      tips daur ulang, dan lokasi TPS
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    🌟 Fitur Lengkap PilahPintar
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-2xl">♻️</span>
                      <div>
                        <h4 className="font-medium text-green-900">
                          Tips Daur Ulang
                        </h4>
                        <p className="text-green-700 text-sm">
                          Panduan lengkap cara mendaur ulang sampah
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-2xl">🗺️</span>
                      <div>
                        <h4 className="font-medium text-blue-900">
                          TPS Terdekat
                        </h4>
                        <p className="text-blue-700 text-sm">
                          Lokasi tempat pembuangan sampah di sekitar Anda
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <h4 className="font-medium text-purple-900">
                          Ide Kerajinan
                        </h4>
                        <p className="text-purple-700 text-sm">
                          Inspirasi barang yang bisa dibuat dari sampah
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <span className="text-2xl">🌍</span>
                      <div>
                        <h4 className="font-medium text-orange-900">
                          Dampak Lingkungan
                        </h4>
                        <p className="text-orange-700 text-sm">
                          Kontribusi Anda untuk planet yang lebih bersih
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supported Types */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    🗂️ Jenis Sampah yang Didukung
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      {
                        name: "Organik",
                        emoji: "🍃",
                        color: "bg-green-100 text-green-800",
                      },
                      {
                        name: "Plastik",
                        emoji: "♻️",
                        color: "bg-blue-100 text-blue-800",
                      },
                      {
                        name: "Kertas",
                        emoji: "📄",
                        color: "bg-yellow-100 text-yellow-800",
                      },
                      {
                        name: "Kaca",
                        emoji: "🍶",
                        color: "bg-purple-100 text-purple-800",
                      },
                      {
                        name: "Logam",
                        emoji: "🔧",
                        color: "bg-gray-100 text-gray-800",
                      },
                    ].map((type) => (
                      <span
                        key={type.name}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${type.color} flex items-center gap-2`}
                      >
                        <span>{type.emoji}</span>
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadTestPage;

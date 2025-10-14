import {
  Clock,
  Download,
  Gift,
  Info,
  Layers,
  Leaf,
  Lightbulb,
  MapPin,
  Recycle,
  Share2,
  Trash2,
  Wine,
  Wrench,
} from "lucide-react";

const ClassificationResult = ({ result, onNewClassification }) => {
  if (!result) return null;

  // Get waste type display with Indonesian content
  const getWasteTypeDisplay = (type) => {
    const displays = {
      organic: {
        icon: Leaf,
        color: "text-green-600",
        bgColor: "bg-green-100",
        name: "Sampah Organik",
        tips: [
          "Buat kompos untuk pupuk tanaman",
          "Bisa dijadikan pakan ternak (sisa sayuran)",
          "Olah menjadi pupuk cair organik",
          "Gunakan untuk biogas rumahan",
        ],
        recycleItems: [
          "🌱 Kompos berkualitas tinggi",
          "🐄 Pakan ternak bergizi",
          "⚡ Biogas untuk memasak",
          "💧 Pupuk cair organik",
        ],
      },
      plastic: {
        icon: Recycle,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        name: "Sampah Plastik",
        tips: [
          "Bersihkan dari sisa makanan/minuman",
          "Pisahkan berdasarkan jenis plastik",
          "Kumpulkan dalam jumlah banyak",
          "Jual ke pengepul atau bank sampah",
        ],
        recycleItems: [
          "👕 Baju dari serat daur ulang",
          "🧸 Mainan anak-anak",
          "🪑 Furnitur plastik",
          "⛽ Bahan bakar alternatif",
        ],
      },
      paper: {
        icon: Layers,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        name: "Sampah Kertas",
        tips: [
          "Pastikan kertas dalam keadaan kering",
          "Pisahkan dari plastik dan logam",
          "Hindari kertas yang terlalu kotor",
          "Lipat rapi untuk menghemat tempat",
        ],
        recycleItems: [
          "📰 Kertas daur ulang baru",
          "📦 Kardus kemasan",
          "🧻 Tissue dan tisu",
          "🎨 Kertas seni dan kerajinan",
        ],
      },
      glass: {
        icon: Wine,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        name: "Sampah Kaca",
        tips: [
          "Bersihkan dari sisa isi",
          "Hati-hati saat menangani",
          "Pisahkan berdasarkan warna",
          "Bungkus dengan aman saat membuang",
        ],
        recycleItems: [
          "🍶 Botol kaca baru",
          "🪟 Kaca jendela",
          "💎 Perhiasan kaca",
          "🎨 Kerajinan dekoratif",
        ],
      },
      metal: {
        icon: Trash2,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        name: "Sampah Logam",
        tips: [
          "Pisahkan aluminium dan besi",
          "Bersihkan dari cat atau label",
          "Kumpulkan hingga jumlah yang cukup",
          "Nilai jual tinggi di pengepul",
        ],
        recycleItems: [
          "🚗 Suku cadang kendaraan",
          "🔧 Alat-alat rumah tangga",
          "🏠 Material bangunan",
          "📱 Komponen elektronik",
        ],
      },
    };
    return displays[type] || displays.plastic;
  };

  const typeDisplay = getWasteTypeDisplay(result.classification.type);
  const IconComponent = typeDisplay.icon;

  // Get confidence level color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle download result
  const handleDownload = () => {
    const resultData = {
      classificationId: result.classificationId,
      file: result.file,
      classification: result.classification,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(resultData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `klasifikasi-${result.classificationId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle share result
  const handleShare = async () => {
    const shareData = {
      title: "PilahPintar - Hasil Klasifikasi",
      text: `Sampah saya diklasifikasikan sebagai ${typeDisplay.name} dengan tingkat kepercayaan ${result.classification.confidence}%!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${shareData.text}\n\nDiklasifikasi menggunakan PilahPintar - Platform Klasifikasi Sampah Cerdas`
      );
      alert("Hasil berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            Hasil Klasifikasi
          </h2>
          <p className="text-green-100 mt-2">
            Analisis AI berhasil diselesaikan
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Classification Result */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Detail Klasifikasi
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {formatDate(result.classification.processedAt)}
              </div>
            </div>

            {/* Waste Type */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${typeDisplay.bgColor}`}>
                <IconComponent className={`w-8 h-8 ${typeDisplay.color}`} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  {typeDisplay.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    Tingkat Kepercayaan:
                  </span>
                  <span
                    className={`font-bold ${getConfidenceColor(
                      result.classification.confidence
                    )}`}
                  >
                    {result.classification.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.classification.confidence >= 80
                      ? "bg-green-500"
                      : result.classification.confidence >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${result.classification.confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-blue-900 mb-2">
                💡 Saran Pembuangan:
              </h5>
              <p className="text-blue-800 text-sm">
                {result.classification.suggestions}
              </p>
            </div>

            {/* Recycling Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                🔄 Tips Daur Ulang:
              </h5>
              <ul className="text-green-800 text-sm space-y-1">
                {typeDisplay.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>

            {/* Recycled Products */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                ♻️ Bisa Menjadi:
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {typeDisplay.recycleItems.map((item, index) => (
                  <div key={index} className="text-purple-800 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={onNewClassification}
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Recycle className="w-5 h-5" />
              <span className="text-sm">Klasifikasi Lagi</span>
            </button>

            <button
              onClick={() => (window.location.href = "/waste-map")}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm">TPS Terdekat</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm">Unduh Hasil</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Bagikan</span>
            </button>
          </div>

          {/* Environmental Impact */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <div className="text-center">
              <h5 className="font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <Info className="w-5 h-5" />
                🌍 Dampak Lingkungan
              </h5>
              <p className="text-sm text-gray-700 mb-2">
                🎉 Selamat! Anda telah membantu lingkungan dengan memilah sampah
                dengan benar!
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>✅ Mengurangi pencemaran lingkungan</p>
                <p>♻️ Mendukung ekonomi sirkular</p>
                <p>🌱 Melestarikan sumber daya alam</p>
                <p>🌍 Berkontribusi pada planet yang lebih bersih</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResult;

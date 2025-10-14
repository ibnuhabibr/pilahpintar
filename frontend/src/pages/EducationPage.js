import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Lightbulb,
  Newspaper,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";

const EducationPage = () => {
  const [activeTab, setActiveTab] = useState("news");

  // Data berita dummy
  const newsData = [
    {
      id: 1,
      title: "Indonesia Berhasil Kurangi Sampah Plastik 30% pada 2024",
      excerpt:
        "Program nasional pengelolaan sampah plastik menunjukkan hasil positif dengan penurunan signifikan limbah plastik.",
      content:
        "Kementerian Lingkungan Hidup melaporkan pencapaian luar biasa dalam pengelolaan sampah plastik...",
      image: "https://via.placeholder.com/400x250",
      author: "Tim PilahPintar",
      publishedAt: "2 hari lalu",
      readTime: "5 menit",
      views: 1250,
      likes: 89,
      category: "Lingkungan",
    },
    {
      id: 2,
      title: "Teknologi AI untuk Pemilahan Sampah Semakin Canggih",
      excerpt:
        "Perkembangan teknologi artificial intelligence membawa revolusi dalam sistem pemilahan sampah otomatis.",
      content:
        "Teknologi AI terbaru memungkinkan identifikasi jenis sampah dengan akurasi mencapai 98%...",
      image: "https://via.placeholder.com/400x250",
      author: "Dr. Sarah Wijaya",
      publishedAt: "1 minggu lalu",
      readTime: "7 menit",
      views: 2180,
      likes: 156,
      category: "Teknologi",
    },
    {
      id: 3,
      title: "Bank Sampah Digital Berkembang Pesat di Indonesia",
      excerpt:
        "Konsep bank sampah digital memudahkan masyarakat mengelola sampah sambil mendapat keuntungan ekonomi.",
      content:
        "Platform digital untuk bank sampah telah menjangkau lebih dari 500 kota di Indonesia...",
      image: "https://via.placeholder.com/400x250",
      author: "Budi Santoso",
      publishedAt: "2 minggu lalu",
      readTime: "4 menit",
      views: 890,
      likes: 67,
      category: "Ekonomi",
    },
  ];

  // Data ide/inovasi dummy
  const innovationData = [
    {
      id: 1,
      title: "Cara Membuat Pot Tanaman dari Botol Plastik Bekas",
      excerpt:
        "Tutorial mudah mengubah botol plastik menjadi pot tanaman yang cantik dan ramah lingkungan.",
      difficulty: "Mudah",
      timeRequired: "30 menit",
      materials: [
        "Botol plastik bekas",
        "Cutter",
        "Cat akrilik",
        "Tanah",
        "Bibit tanaman",
      ],
      image: "https://via.placeholder.com/400x250",
      author: "Eko Creative",
      publishedAt: "3 hari lalu",
      likes: 234,
      saves: 89,
      category: "DIY",
    },
    {
      id: 2,
      title: "Mengolah Sampah Organik Menjadi Kompos Berkualitas",
      excerpt:
        "Panduan lengkap membuat kompos dari sampah organik rumah tangga untuk pupuk tanaman.",
      difficulty: "Sedang",
      timeRequired: "2-3 minggu",
      materials: ["Sampah organik", "Wadah kompos", "EM4", "Sekam padi", "Air"],
      image: "https://via.placeholder.com/400x250",
      author: "Green Thumb",
      publishedAt: "1 minggu lalu",
      likes: 189,
      saves: 156,
      category: "Kompos",
    },
    {
      id: 3,
      title: "Kreasi Tas Belanja dari Kardus Bekas",
      excerpt:
        "Inovasi membuat tas belanja yang kuat dan stylish menggunakan kardus bekas yang tidak terpakai.",
      difficulty: "Sedang",
      timeRequired: "1 jam",
      materials: ["Kardus tebal", "Lem", "Tali", "Kertas kado", "Gunting"],
      image: "https://via.placeholder.com/400x250",
      author: "Craft Master",
      publishedAt: "5 hari lalu",
      likes: 178,
      saves: 92,
      category: "Kerajinan",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800";
      case "Sulit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-800 mb-4 font-display">
            Pusat Edukasi
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Dapatkan informasi terkini dan inspirasi kreatif seputar pengelolaan
            sampah dan daur ulang untuk lingkungan yang lebih bersih
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex justify-center space-x-8">
              <button
                onClick={() => setActiveTab("news")}
                className={`${
                  activeTab === "news"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                } flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200`}
              >
                <Newspaper className="h-5 w-5" />
                <span>Berita & Update</span>
              </button>
              <button
                onClick={() => setActiveTab("innovation")}
                className={`${
                  activeTab === "innovation"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                } flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200`}
              >
                <Lightbulb className="h-5 w-5" />
                <span>Ide & Inovasi</span>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* News Tab Content */}
        {activeTab === "news" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {newsData.map((news, index) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                      {news.category}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                      <Clock className="h-3 w-3" />
                      <span>{news.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-neutral-400" />
                      <span className="text-xs text-neutral-600">
                        {news.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-neutral-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{news.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{news.likes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-1 text-xs text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      <span>{news.publishedAt}</span>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Innovation Tab Content */}
        {activeTab === "innovation" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {innovationData.map((innovation, index) => (
              <motion.article
                key={innovation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={innovation.image}
                  alt={innovation.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                      {innovation.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                        innovation.difficulty
                      )}`}
                    >
                      {innovation.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-3 line-clamp-2">
                    {innovation.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {innovation.excerpt}
                  </p>

                  {/* Materials Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                      Bahan yang Dibutuhkan:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {innovation.materials.slice(0, 3).map((material, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                        >
                          {material}
                        </span>
                      ))}
                      {innovation.materials.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                          +{innovation.materials.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-neutral-400" />
                      <span className="text-xs text-neutral-600">
                        {innovation.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-neutral-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{innovation.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>{innovation.saves}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-1 text-xs text-neutral-500">
                      <Clock className="h-3 w-3" />
                      <span>{innovation.timeRequired}</span>
                    </div>
                    <button className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                      Lihat Tutorial →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white text-center mt-12"
        >
          <h2 className="text-2xl font-bold mb-4">
            Punya Ide Kreatif atau Berita Menarik?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Bagikan ide daur ulang kreatif Anda atau informasi penting seputar
            lingkungan dengan komunitas PilahPintar
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Kirim Ide Kreatif
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors">
              Bagikan Berita
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationPage;

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Camera,
  CheckCircle,
  MapPin,
  Recycle,
  Smartphone,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const features = [
    {
      icon: Camera,
      title: "Alat Pilah Cerdas",
      description:
        "Klasifikasi sampah real-time menggunakan AI dan teknologi CNN",
      link: "/smart-sort",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: MapPin,
      title: "Jual Sampah",
      description:
        "Jadikan sampah punya manfaat lebih dan pastinya bikin kantong berisi",
      link: "/sell-waste",
      color: "from-secondary-500 to-secondary-600",
    },
    {
      icon: BookOpen,
      title: "Pusat Edukasi",
      description:
        "Ensiklopedia daur ulang dan panduan serta tata cara pengolahan sampah",
      link: "/education",
      color: "from-accent-500 to-accent-600",
    },
    {
      icon: Users,
      title: "Komunitas",
      description:
        "Bergabung dengan komunitas peduli lingkungan di seluruh Indonesia",
      link: "/community",
      color: "from-primary-500 to-secondary-500",
    },
  ];

  const stats = [
    { number: "1,000+", label: "Pengguna Aktif" },
    { number: "500+", label: "Sampah Terklasifikasi" },
    { number: "25+", label: "Bank Sampah Mitra" },
    { number: "95%", label: "Akurasi AI" },
  ];

  const benefits = [
    "Klasifikasi sampah akurat dengan teknologi CNN",
    "Dashboard analytics untuk tracking progress",
    "Direktori bank sampah dan pengepul terdekat",
    "Edukasi komprehensif tentang daur ulang",
    "Komunitas diskusi dan forum pengguna",
    "Teknologi terdepan untuk lingkungan berkelanjutan",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold font-display mb-6">
                Memilah Sampah dengan{" "}
                <span className="text-accent-300">Cerdas</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-primary-100">
                Demi Bumi yang Lestari
              </p>
              <p className="text-lg mb-6 text-primary-50 max-w-lg">
                Platform inovatif yang menggunakan teknologi AI dan CNN untuk
                membantu Anda mengklasifikasikan sampah dengan akurat dan
                berkontribusi pada lingkungan yang lebih bersih.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/smart-sort"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center group"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Coba Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 p-3 rounded-xl mr-4">
                    <Recycle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Teknologi CNN</h3>
                    <p className="text-primary-100">
                      Deep Learning Classification
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-accent-300 mr-3" />
                    <span>Akurasi 95%+ dalam klasifikasi</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-accent-300 mr-3" />
                    <span>Real-time image processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-accent-300 mr-3" />
                    <span>Support berbagai jenis sampah</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 font-display">
              Fitur Unggulan PilahPintar
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Ekosistem digital lengkap untuk pengelolaan sampah yang cerdas dan
              berkelanjutan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={feature.link} className="block">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 h-full">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                        <span>Pelajari lebih lanjut</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-6 font-display">
                Mengapa Memilih PilahPintar?
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Platform komprehensif yang menggabungkan teknologi AI terdepan
                dengan pendekatan komunitas untuk menciptakan dampak lingkungan
                yang nyata.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                    <span className="text-neutral-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-xl text-white">
                    <Smartphone className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-2">Mobile First</h3>
                    <p className="text-sm text-primary-100">
                      Optimized untuk penggunaan di smartphone
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-6 rounded-xl text-white">
                    <BarChart3 className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-2">Analytics</h3>
                    <p className="text-sm text-secondary-100">
                      Dashboard lengkap untuk tracking progress
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-6 rounded-xl text-white">
                    <BookOpen className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-2">Edukasi</h3>
                    <p className="text-sm text-accent-100">
                      Pusat pembelajaran daur ulang lengkap
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-6 rounded-xl text-white">
                    <Users className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-2">Komunitas</h3>
                    <p className="text-sm opacity-90">
                      Forum diskusi dengan pengguna se-Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">
              Siap Berkontribusi untuk Bumi yang Lebih Bersih?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna lainnya dalam misi menciptakan
              lingkungan yang lebih sustainable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center group"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/smart-sort"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Coba Alat Pilah Cerdas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

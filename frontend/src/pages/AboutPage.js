import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  Eye,
  Globe,
  Heart,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Ibnu Habib Ridwansyah",
      role: "Mahasiswa Teknik Informatika",
      institution: "Politeknik Elektronika Negeri Surabaya",
      initials: "IH",
    },
    {
      name: "Firas Rasendriya Athaillah",
      role: "Mahasiswa Teknik Informatika",
      institution: "Politeknik Elektronika Negeri Surabaya",
      initials: "FR",
    },
    {
      name: "Muhammad Rizqi Putra Nugroho",
      role: "Mahasiswa Teknik Informatika",
      institution: "Politeknik Elektronika Negeri Surabaya",
      initials: "MR",
    },
  ];

  const milestones = [
    {
      year: "2025",
      title: "Konsep PilahPintar",
      description:
        "Ide awal platform klasifikasi sampah untuk Lomba Esai Nasional",
      icon: Lightbulb,
    },
    {
      year: "2025",
      title: "Pengembangan AI Model",
      description: "Training model CNN dengan dataset sampah Indonesia",
      icon: Award,
    },
    {
      year: "2025",
      title: "Beta Testing",
      description: "Uji coba dengan komunitas dan sekolah di Madura",
      icon: Users,
    },
    {
      year: "2025",
      title: "Launch Platform",
      description: "Peluncuran resmi PilahPintar untuk masyarakat umum",
      icon: Globe,
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Peduli Lingkungan",
      description:
        "Komitmen untuk menciptakan bumi yang lebih bersih dan sustainable",
    },
    {
      icon: Users,
      title: "Berbasis Komunitas",
      description:
        "Memberdayakan masyarakat untuk berpartisipasi aktif dalam pengelolaan sampah",
    },
    {
      icon: Lightbulb,
      title: "Inovasi Teknologi",
      description:
        "Menggunakan teknologi AI terdepan untuk solusi lingkungan yang efektif",
    },
    {
      icon: BookOpen,
      title: "Edukasi Berkelanjutan",
      description:
        "Menyediakan pengetahuan dan awareness tentang pengelolaan sampah yang baik",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-display">
              Tentang PilahPintar
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto">
              Platform inovatif yang menggabungkan teknologi AI dengan semangat
              komunitas untuk menciptakan perubahan berkelanjutan dalam
              pengelolaan sampah
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Eye className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 font-display">
                    Visi Kami
                  </h2>
                </div>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Menjadi platform terdepan dalam edukasi dan manajemen sampah
                  berbasis komunitas yang didukung oleh teknologi AI di
                  Indonesia, menciptakan generasi yang sadar lingkungan dan
                  berkontribusi aktif untuk bumi yang lestari.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-secondary-100 p-3 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 font-display">
                    Misi Kami
                  </h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-neutral-600">
                      Menyediakan teknologi AI yang akurat dan mudah digunakan
                      untuk klasifikasi sampah
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-neutral-600">
                      Membangun komunitas peduli lingkungan yang aktif dan
                      terkoneksi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-neutral-600">
                      Memberikan edukasi komprehensif tentang pengelolaan sampah
                      yang sustainable
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-neutral-600">
                      Mengintegrasikan data untuk mendukung kebijakan lingkungan
                      yang berbasis evidensi
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-secondary-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-6 font-display">
                  Dampak yang Kami Ciptakan
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">95%</div>
                    <div className="text-sm text-primary-100">
                      Akurasi AI Model
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">1K+</div>
                    <div className="text-sm text-primary-100">
                      Pengguna Aktif
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">5K+</div>
                    <div className="text-sm text-primary-100">
                      Sampah Terklasifikasi
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">25+</div>
                    <div className="text-sm text-primary-100">
                      Mitra Bank Sampah
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 font-display">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Prinsip-prinsip yang memandu pengembangan dan operasional
              PilahPintar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 font-display">
              Perjalanan PilahPintar
            </h2>
            <p className="text-lg text-neutral-600">
              Milestone penting dalam pengembangan platform
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary-200"></div>

            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200">
                      <div className="text-primary-600 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-neutral-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4 font-display">
              Tim PilahPintar
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Individu berdedikasi yang bekerja sama menciptakan solusi
              berkelanjutan
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    {/* Professional Avatar */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {member.initials}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
                        {member.avatar}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">
                      {member.name}
                    </h3>
                    <div className="text-neutral-600 mb-3 font-medium">
                      {member.role}
                    </div>
                    <p className="text-primary-600 text-sm font-bold bg-primary-50 py-2 px-3 rounded-lg">
                      {member.institution}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">
              Bergabunglah dengan Misi Kami
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Bersama-sama kita dapat menciptakan perubahan nyata untuk
              lingkungan yang lebih bersih dan sustainable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Daftar Sekarang
              </a>
              <a
                href="/smart-sort"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Coba Platform
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

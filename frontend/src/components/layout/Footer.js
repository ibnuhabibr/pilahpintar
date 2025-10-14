import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Recycle,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display">
                PilahPintar
              </span>
            </div>
            <p className="text-neutral-300 mb-4 max-w-md">
              Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari. Platform
              inovatif yang menggunakan AI untuk membantu klasifikasi sampah dan
              edukasi lingkungan.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/smart-sort"
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Alat Pilah Cerdas
                </Link>
              </li>
              <li>
                <Link
                  to="/waste-map"
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Peta Sampah
                </Link>
              </li>
              <li>
                <Link
                  to="/education"
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Pusat Edukasi
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Komunitas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-neutral-300">
                  pilahpintar@example.com
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-neutral-300">+62 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-neutral-300">
                  Universitas Trunojoyo Madura
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © {currentYear} PilahPintar. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Syarat & Ketentuan
              </a>
            </div>
          </div>

          {/* Lomba Info */}
          <div className="mt-6 text-center">
            <p className="text-neutral-500 text-sm">
              Proyek ini dibuat untuk <strong>Lomba Esai Nasional 2025</strong>{" "}
              - Himpunan Mahasiswa Psikologi Universitas Trunojoyo Madura
            </p>
            <p className="text-neutral-500 text-xs mt-1">
              Tema: "Generasi Muda dan Kecerdasan Buatan: Kolaborasi Cerdas
              untuk Perubahan Berkelanjutan"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

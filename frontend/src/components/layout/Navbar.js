import { LogOut, Menu, Recycle, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Beranda", href: "/", current: location.pathname === "/" },
    {
      name: "Alat Pilah Cerdas",
      href: "/smart-sort",
      current: location.pathname === "/smart-sort",
    },
    {
      name: "Jual Sampah",
      href: "/sell-waste",
      current: location.pathname === "/sell-waste",
    },
    {
      name: "Pusat Edukasi",
      href: "/education",
      current: location.pathname === "/education",
    },
    {
      name: "Tentang Kami",
      href: "/about",
      current: location.pathname === "/about",
    },
  ];

  // Navigation items that require authentication
  const authNavigation = user
    ? [
        {
          name: "Komunitas",
          href: "/community",
          current: location.pathname === "/community",
        },
      ]
    : [];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient font-display">
                PilahPintar
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[...navigation, ...authNavigation].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-neutral-600 hover:text-primary-600"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
                >
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-200">
            {[...navigation, ...authNavigation].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? "text-primary-600 bg-primary-50"
                    : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
                } block px-3 py-2 text-base font-medium transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Menu */}
            <div className="border-t border-neutral-200 pt-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-neutral-600 hover:text-red-600 hover:bg-neutral-50 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Keluar</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import {
  BarChart3,
  BookOpen,
  LogOut,
  Menu,
  Recycle,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: BarChart3,
      current: location.pathname === "/",
    },
    {
      name: "Jual Sampah",
      href: "/sell-waste",
      icon: ShoppingCart,
      current: location.pathname === "/sell-waste",
    },
    {
      name: "Pusat Edukasi",
      href: "/education",
      icon: BookOpen,
      current: location.pathname === "/education",
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-lg">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient font-display">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200`}
                >
                  <IconComponent
                    className={`${
                      item.current
                        ? "text-primary-500"
                        : "text-neutral-400 group-hover:text-neutral-500"
                    } mr-3 h-5 w-5 transition-colors duration-200`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors duration-200">
            <LogOut className="mr-3 h-5 w-5 text-neutral-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900">
              Admin Panel
            </h1>
            <div></div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

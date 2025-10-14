import { motion } from "framer-motion";
import { BarChart3, BookOpen, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      name: "Total Pengepul",
      value: "45",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-primary-600",
      bgColor: "bg-primary-100",
    },
    {
      name: "Artikel Berita",
      value: "128",
      change: "+5%",
      icon: BookOpen,
      color: "text-secondary-600",
      bgColor: "bg-secondary-100",
    },
    {
      name: "Ide & Inovasi",
      value: "86",
      change: "+8%",
      icon: BarChart3,
      color: "text-accent-600",
      bgColor: "bg-accent-100",
    },
    {
      name: "Total Pengguna",
      value: "1,247",
      change: "+23%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Dashboard Admin PilahPintar
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change} dari bulan lalu
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
        >
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
              <ShoppingCart className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-neutral-900">
                Tambah Pengepul
              </h3>
              <p className="text-sm text-neutral-600">
                Daftarkan pengepul sampah baru
              </p>
            </button>
            <button className="p-4 text-left bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors duration-200">
              <BookOpen className="h-8 w-8 text-secondary-600 mb-2" />
              <h3 className="font-semibold text-neutral-900">Tulis Artikel</h3>
              <p className="text-sm text-neutral-600">
                Buat berita atau ide kreatif baru
              </p>
            </button>
            <button className="p-4 text-left bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors duration-200">
              <BarChart3 className="h-8 w-8 text-accent-600 mb-2" />
              <h3 className="font-semibold text-neutral-900">
                Lihat Analytics
              </h3>
              <p className="text-sm text-neutral-600">
                Monitor performa platform
              </p>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

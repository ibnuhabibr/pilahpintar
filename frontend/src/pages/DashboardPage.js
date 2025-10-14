import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { BarChart3, Calendar, Camera } from "lucide-react";
import { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useAuth } from "../contexts/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data untuk dashboard
  const stats = {
    totalScans: 156,
    correctClassifications: 148,
    accuracyRate: 94.9,
    thisWeekScans: 23,
    wasteTypes: {
      plastic: 45,
      paper: 38,
      organic: 42,
      metal: 31,
    },
  };

  const favorites = [
    {
      name: "TPS Hijau Lestari",
      type: "TPS",
      distance: "0.5 km",
      lastVisit: "2025-01-15",
    },
    {
      name: "Bank Sampah Bersama",
      type: "Bank Sampah",
      distance: "1.2 km",
      lastVisit: "2025-02-20",
    },
    {
      name: "Pusat Daur Ulang",
      type: "Recycling Center",
      distance: "2.1 km",
      lastVisit: "2025-03-10",
    },
  ];

  const recentActivities = [
    {
      type: "scan",
      item: "Botol Plastik PET",
      time: "2 jam lalu",
      result: "Plastik",
      confidence: 95.2,
    },
    {
      type: "scan",
      item: "Kaleng Aluminium",
      time: "2 hari lalu",
      result: "Logam",
      confidence: 88.7,
    },
    {
      type: "scan",
      item: "Kertas Bekas",
      time: "3 hari lalu",
      result: "Kertas",
      confidence: 92.1,
    },
    {
      type: "scan",
      item: "Kulit Pisang",
      time: "4 hari lalu",
      result: "Organik",
      confidence: 97.3,
    },
    {
      type: "scan",
      item: "Botol Kaca",
      time: "5 hari lalu",
      result: "Kaca",
      confidence: 91.8,
    },
  ];

  // Removed gamification elements - no longer needed

  // Chart configurations
  const weeklyProgressData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Scan Harian",
        data: [12, 19, 15, 25, 22, 18, 20],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const wasteDistributionData = {
    labels: ["Plastik", "Kertas", "Organik", "Logam"],
    datasets: [
      {
        data: [
          stats.wasteTypes.plastic,
          stats.wasteTypes.paper,
          stats.wasteTypes.organic,
          stats.wasteTypes.metal,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#64748b"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const monthlyScansData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Klasifikasi Per Bulan",
        data: [32, 45, 68, 59, 72, 89],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-display mb-2">
                  Selamat datang, {user?.name}!
                </h1>
                <p className="text-primary-100 text-lg">
                  Akurasi: {stats.accuracyRate}% • {stats.thisWeekScans} scan
                  minggu ini
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.totalScans}</div>
                <div className="text-primary-100">Total Scans</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Ringkasan", icon: BarChart3 },
                { id: "history", label: "Riwayat", icon: Calendar },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                    } flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {stats.totalScans}
                    </div>
                    <div className="text-sm text-neutral-600">Total Scans</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">
                      {stats.correctClassifications}
                    </div>
                    <div className="text-sm text-neutral-600">Akurat</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-accent-600 mb-1">
                      {stats.accuracyRate}%
                    </div>
                    <div className="text-sm text-neutral-600">Akurasi</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {stats.thisWeekScans}
                    </div>
                    <div className="text-sm text-neutral-600">Minggu Ini</div>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Progress Mingguan
                  </h3>
                  <div className="h-64">
                    <Line
                      data={weeklyProgressData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Monthly Scans */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Klasifikasi Bulanan
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={monthlyScansData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Waste Distribution */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Distribusi Jenis Sampah
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <Doughnut
                      data={wasteDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Quick Actions
                <div className="card">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Aksi Cepat
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full btn-primary flex items-center justify-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>Scan Sampah</span>
                    </button>
                    <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Cari Bank Sampah</span>
                    </button>
                    <button className="w-full btn-outline flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Lihat Leaderboard</span>
                    </button>
                  </div>
                </div> */}
n
                {/* Weekly Activity Goal */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    Target Mingguan
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {stats.thisWeekScans}/15
                    </div>
                    <div className="text-sm text-neutral-600">
                      Klasifikasi minggu ini
                    </div>
                  </div>
                  <div className="bg-neutral-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (stats.thisWeekScans / 15) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-neutral-600 text-center">
                    {15 - stats.thisWeekScans} klasifikasi lagi untuk mencapai
                    target
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Riwayat Klasifikasi
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="card flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Camera className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium">{activity.item}</div>
                        <div className="text-sm text-neutral-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary-600">
                        {activity.result}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {activity.confidence}% akurasi
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-6">
                Aktivitas Terbaru
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4 py-3 border-b border-neutral-200 last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-100">
                      <Camera className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-800">
                        {activity.item}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {activity.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary-600">
                        {activity.result}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {activity.confidence}% akurasi
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;

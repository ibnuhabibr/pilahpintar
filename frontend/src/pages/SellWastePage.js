import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Phone,
  Recycle,
  Search,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";

const SellWastePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Data pengepul sampah dummy
  const wasteCollectors = [
    {
      id: 1,
      name: "CV. Berkah Sampah Mandiri",
      category: "Plastik & Kaleng",
      rating: 4.8,
      location: "Jakarta Selatan",
      distance: "2.3 km",
      phone: "0812-3456-7890",
      operatingHours: "08:00 - 17:00",
      image: "https://via.placeholder.com/300x200",
      wasteTypes: [
        { type: "Botol Plastik", price: "Rp 3.000/kg", minWeight: "5 kg" },
        { type: "Kaleng Aluminium", price: "Rp 25.000/kg", minWeight: "2 kg" },
        { type: "Kantong Plastik", price: "Rp 2.500/kg", minWeight: "3 kg" },
      ],
      pickupService: true,
      verified: true,
    },
    {
      id: 2,
      name: "UD. Hijau Bersih",
      category: "Kertas & Kardus",
      rating: 4.6,
      location: "Jakarta Timur",
      distance: "4.1 km",
      phone: "0821-9876-5432",
      operatingHours: "07:00 - 16:00",
      image: "https://via.placeholder.com/300x200",
      wasteTypes: [
        { type: "Kertas HVS", price: "Rp 2.800/kg", minWeight: "10 kg" },
        { type: "Kardus Bekas", price: "Rp 2.200/kg", minWeight: "15 kg" },
        { type: "Koran/Majalah", price: "Rp 2.000/kg", minWeight: "8 kg" },
      ],
      pickupService: true,
      verified: true,
    },
    {
      id: 3,
      name: "Pengepul Logam Jaya",
      category: "Logam",
      rating: 4.9,
      location: "Jakarta Barat",
      distance: "5.7 km",
      phone: "0813-2468-1357",
      operatingHours: "06:00 - 18:00",
      image: "https://via.placeholder.com/300x200",
      wasteTypes: [
        { type: "Besi Tua", price: "Rp 4.500/kg", minWeight: "20 kg" },
        { type: "Tembaga", price: "Rp 65.000/kg", minWeight: "1 kg" },
        { type: "Aluminium", price: "Rp 18.000/kg", minWeight: "3 kg" },
      ],
      pickupService: false,
      verified: true,
    },
    {
      id: 4,
      name: "Bank Sampah Sejahtera",
      category: "Organik",
      rating: 4.5,
      location: "Jakarta Utara",
      distance: "6.2 km",
      phone: "0856-7890-1234",
      operatingHours: "09:00 - 15:00",
      image: "https://via.placeholder.com/300x200",
      wasteTypes: [
        { type: "Kompos Organik", price: "Rp 1.500/kg", minWeight: "25 kg" },
        { type: "Sisa Makanan", price: "Rp 1.000/kg", minWeight: "30 kg" },
        { type: "Daun Kering", price: "Rp 800/kg", minWeight: "20 kg" },
      ],
      pickupService: true,
      verified: false,
    },
    {
      id: 5,
      name: "Elektronik Recycle Center",
      category: "Elektronik",
      rating: 4.7,
      location: "Jakarta Pusat",
      distance: "3.8 km",
      phone: "0877-5432-1098",
      operatingHours: "10:00 - 19:00",
      image: "https://via.placeholder.com/300x200",
      wasteTypes: [
        {
          type: "Smartphone Bekas",
          price: "Rp 150.000/unit",
          minWeight: "1 unit",
        },
        { type: "Laptop Rusak", price: "Rp 300.000/unit", minWeight: "1 unit" },
        { type: "Kabel Elektronik", price: "Rp 12.000/kg", minWeight: "2 kg" },
      ],
      pickupService: true,
      verified: true,
    },
  ];

  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "Plastik & Kaleng", label: "Plastik & Kaleng" },
    { id: "Kertas & Kardus", label: "Kertas & Kardus" },
    { id: "Logam", label: "Logam" },
    { id: "Organik", label: "Organik" },
    { id: "Elektronik", label: "Elektronik" },
  ];

  const locations = [
    { id: "all", label: "Semua Lokasi" },
    { id: "Aceh", label: "Aceh" },
    { id: "Sumatera Utara", label: "Sumatera Utara" },
    { id: "Sumatera Barat", label: "Sumatera Barat" },
    { id: "Riau", label: "Riau" },
    { id: "Kepulauan Riau", label: "Kepulauan Riau" },
    { id: "Jambi", label: "Jambi" },
    { id: "Bengkulu", label: "Bengkulu" },
    { id: "Sumatera Selatan", label: "Sumatera Selatan" },
    { id: "Kepulauan Bangka Belitung", label: "Kepulauan Bangka Belitung" },
    { id: "Lampung", label: "Lampung" },
    { id: "Banten", label: "Banten" },
    { id: "Daerah Khusus Ibukota Jakarta", label: "DKI Jakarta" },
    { id: "Jawa Barat", label: "Jawa Barat" },
    { id: "Jawa Tengah", label: "Jawa Tengah" },
    { id: "Daerah Istimewa Yogyakarta", label: "DI Yogyakarta" },
    { id: "Jawa Timur", label: "Jawa Timur" },
    { id: "Bali", label: "Bali" },
    { id: "Nusa Tenggara Barat", label: "Nusa Tenggara Barat" },
    { id: "Nusa Tenggara Timur", label: "Nusa Tenggara Timur" },
    { id: "Kalimantan Barat", label: "Kalimantan Barat" },
    { id: "Kalimantan Tengah", label: "Kalimantan Tengah" },
    { id: "Kalimantan Selatan", label: "Kalimantan Selatan" },
    { id: "Kalimantan Timur", label: "Kalimantan Timur" },
    { id: "Kalimantan Utara", label: "Kalimantan Utara" },
    { id: "Sulawesi Utara", label: "Sulawesi Utara" },
    { id: "Gorontalo", label: "Gorontalo" },
    { id: "Sulawesi Tengah", label: "Sulawesi Tengah" },
    { id: "Sulawesi Barat", label: "Sulawesi Barat" },
    { id: "Sulawesi Selatan", label: "Sulawesi Selatan" },
    { id: "Sulawesi Tenggara", label: "Sulawesi Tenggara" },
    { id: "Maluku", label: "Maluku" },
    { id: "Maluku Utara", label: "Maluku Utara" },
    { id: "Papua Barat", label: "Papua Barat" },
    { id: "Papua", label: "Papua" },
    { id: "Papua Selatan", label: "Papua Selatan" },
    { id: "Papua Tengah", label: "Papua Tengah" },
    { id: "Papua Pegunungan", label: "Papua Pegunungan" },
    { id: "Papua Barat Daya", label: "Papua Barat Daya" },
  ];

  const filteredCollectors = wasteCollectors.filter((collector) => {
    const matchesSearch =
      collector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collector.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || collector.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || collector.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

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
            Jual Sampah Anda
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Temukan pengepul sampah terpercaya di sekitar Anda dan dapatkan
            harga terbaik untuk sampah yang dapat didaur ulang
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari pengepul atau jenis sampah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="h-6 w-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">45+</div>
            <div className="text-sm text-neutral-600">Pengepul Terdaftar</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">
              10Jt+
            </div>
            <div className="text-sm text-neutral-600">Total Transaksi</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">85%</div>
            <div className="text-sm text-neutral-600">
              Dengan Layanan Jemput
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">4.7</div>
            <div className="text-sm text-neutral-600">Rating Rata-rata</div>
          </div>
        </motion.div>

        {/* Waste Collectors List */}
        <div className="space-y-6">
          {filteredCollectors.map((collector, index) => (
            <motion.div
              key={collector.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={collector.image}
                    alt={collector.name}
                    className="w-full lg:w-48 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-neutral-800">
                          {collector.name}
                        </h3>
                        {collector.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✓ Terverifikasi
                          </span>
                        )}
                      </div>
                      <p className="text-primary-600 font-medium mb-2">
                        {collector.category}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{collector.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {collector.location} • {collector.distance}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{collector.operatingHours}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {collector.pickupService && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                          <Truck className="h-3 w-3 mr-1" />
                          Layanan Jemput
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Waste Types and Prices */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-neutral-800 mb-3">
                      Jenis Sampah & Harga:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {collector.wasteTypes.map((waste, idx) => (
                        <div
                          key={idx}
                          className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
                        >
                          <div className="font-medium text-neutral-800 mb-1">
                            {waste.type}
                          </div>
                          <div className="text-primary-600 font-bold text-sm mb-1">
                            {waste.price}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Min: {waste.minWeight}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-1 text-sm text-neutral-600 mb-3 sm:mb-0">
                      <Phone className="h-4 w-4" />
                      <span>{collector.phone}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Hubungi</span>
                      </button>
                      <button className="border border-primary-600 text-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Lihat Lokasi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCollectors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              Tidak ada pengepul ditemukan
            </h3>
            <p className="text-neutral-600">
              Coba ubah filter pencarian atau kata kunci Anda
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SellWastePage;

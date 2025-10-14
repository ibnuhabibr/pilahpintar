import { Clock, MapPin, Navigation, Phone, Star } from "lucide-react";

const TPSModal = ({ isOpen, onClose, wasteType }) => {
  if (!isOpen) return null;

  // Mock TPS data berdasarkan jenis sampah
  const getTPSByWasteType = (type) => {
    const baseTPS = [
      {
        id: 1,
        name: "TPS Hijau Lestari",
        address: "Jl. Merdeka No. 123, Menteng, Jakarta Pusat",
        distance: "0.5 km",
        phone: "021-1234567",
        hours: "06:00 - 18:00",
        rating: 4.8,
        specialties: ["organik", "plastic", "paper"],
        facilities: ["Bank Sampah", "Komposting", "Edukasi"],
      },
      {
        id: 2,
        name: "Bank Sampah Bersama",
        address: "Jl. Proklamasi No. 45, Menteng, Jakarta Pusat",
        distance: "1.2 km",
        phone: "021-2345678",
        hours: "07:00 - 17:00",
        rating: 4.6,
        specialties: ["plastic", "paper", "metal"],
        facilities: ["Pembelian Sampah", "Tabungan Sampah", "Pelatihan"],
      },
      {
        id: 3,
        name: "TPS3R Kelurahan Cikini",
        address: "Jl. Pahlawan No. 67, Cikini, Jakarta Pusat",
        distance: "2.1 km",
        phone: "021-3456789",
        hours: "05:00 - 20:00",
        rating: 4.4,
        specialties: ["organik", "plastic", "paper", "glass", "metal"],
        facilities: ["Reduce", "Reuse", "Recycle", "Composting"],
      },
      {
        id: 4,
        name: "Waste Collection Center",
        address: "Jl. Sudirman No. 89, Tanah Abang, Jakarta Pusat",
        distance: "3.5 km",
        phone: "021-4567890",
        hours: "24 Jam",
        rating: 4.2,
        specialties: ["glass", "metal", "plastic"],
        facilities: ["Drop-off Point", "Sorting", "Processing"],
      },
    ];

    // Filter berdasarkan jenis sampah
    return baseTPS
      .filter((tps) => tps.specialties.includes(type))
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  };

  const wasteTypeNames = {
    organic: "Sampah Organik",
    plastic: "Sampah Plastik",
    paper: "Sampah Kertas",
    glass: "Sampah Kaca",
    metal: "Sampah Logam",
  };

  const tpsList = getTPSByWasteType(wasteType);

  const handleNavigate = (tps) => {
    // Mock Google Maps navigation
    const encodedAddress = encodeURIComponent(tps.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, "_blank");
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                🗑️ TPS Terdekat
              </h2>
              <p className="text-green-100 mt-1">
                Tempat Pembuangan Sampah untuk {wasteTypeNames[wasteType]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {tpsList.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Belum Ada TPS Khusus
              </h3>
              <p className="text-gray-600">
                Maaf, belum ada TPS khusus untuk {wasteTypeNames[wasteType]} di
                area terdekat. Silakan coba kategori sampah lainnya.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  📍 Ditemukan {tpsList.length} TPS terdekat
                </h3>
                <div className="text-sm text-gray-500">
                  Diurutkan berdasarkan jarak
                </div>
              </div>

              {tpsList.map((tps) => (
                <div
                  key={tps.id}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {tps.name}
                        </h4>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">
                            {tps.rating}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>{tps.address}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {tps.distance}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>Buka: {tps.hours}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span>{tps.phone}</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">
                          Menerima jenis sampah:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tps.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                specialty === wasteType
                                  ? "bg-green-100 text-green-800 ring-2 ring-green-300"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {wasteTypeNames[specialty] || specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Fasilitas:</p>
                        <div className="flex flex-wrap gap-1">
                          {tps.facilities.map((facility, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleNavigate(tps)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        Navigasi
                      </button>
                      <button
                        onClick={() => handleCall(tps.phone)}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Telepon
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  ℹ️ Informasi Penting:
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Pastikan sampah sudah dipilah sesuai kategori</li>
                  <li>• Bersihkan sampah dari kontaminan sebelum dibawa</li>
                  <li>
                    • Hubungi TPS terlebih dahulu untuk memastikan operasional
                  </li>
                  <li>
                    • Beberapa TPS mungkin memiliki sistem pembelian sampah
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Data TPS diperbarui setiap hari. Konfirmasi langsung untuk
              informasi terkini.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TPSModal;

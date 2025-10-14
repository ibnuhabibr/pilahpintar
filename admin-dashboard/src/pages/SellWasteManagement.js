import {
  Clock,
  DollarSign,
  Edit,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Star,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const SellWasteManagement = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "plastic",
    price: "",
    unit: "kg",
    description: "",
    image: "",
    buyerInfo: {
      name: "",
      address: "",
      phone: "",
      hours: "",
      rating: 5,
    },
    status: "available",
  });

  // Load waste items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("sellWasteItems");
    if (savedItems) {
      setWasteItems(JSON.parse(savedItems));
    } else {
      // Initialize with sample data
      const sampleItems = [
        {
          id: 1,
          name: "Botol Plastik PET",
          category: "plastic",
          price: 3000,
          unit: "kg",
          description:
            "Botol plastik bekas minuman, kondisi bersih dan kering. Harga dapat berubah sesuai kondisi pasar.",
          image:
            "https://images.unsplash.com/photo-1572160672741-5a6f8c35d9c6?w=800",
          buyerInfo: {
            name: "CV Daur Ulang Sejahtera",
            address: "Jl. Lingkungan Hijau No. 123, Jakarta Selatan",
            phone: "021-1234-5678",
            hours: "08:00 - 17:00 WIB",
            rating: 4.5,
          },
          status: "available",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Kertas Bekas/Kardus",
          category: "paper",
          price: 2500,
          unit: "kg",
          description:
            "Kertas bekas dan kardus dalam kondisi kering, tidak sobek parah. Termasuk koran, majalah, dan kemasan kardus.",
          image:
            "https://images.unsplash.com/photo-1594736797933-d0c501ba2fe6?w=800",
          buyerInfo: {
            name: "Toko Rongsok Bahagia",
            address: "Jl. Daur Ulang No. 45, Jakarta Timur",
            phone: "021-8765-4321",
            hours: "07:00 - 18:00 WIB",
            rating: 4.2,
          },
          status: "available",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          name: "Kaleng Aluminium",
          category: "metal",
          price: 8000,
          unit: "kg",
          description:
            "Kaleng minuman bekas dari aluminium. Harga tinggi karena mudah didaur ulang dan bernilai ekonomis.",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          buyerInfo: {
            name: "Metal Recycling Center",
            address: "Kawasan Industri Pulo Gadung, Jakarta Timur",
            phone: "021-4567-8901",
            hours: "08:00 - 16:00 WIB",
            rating: 4.8,
          },
          status: "available",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setWasteItems(sampleItems);
      localStorage.setItem("sellWasteItems", JSON.stringify(sampleItems));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("sellWasteItems", JSON.stringify(wasteItems));
  }, [wasteItems]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const itemData = {
      ...formData,
      price: parseInt(formData.price),
      buyerInfo: {
        ...formData.buyerInfo,
        rating: parseFloat(formData.buyerInfo.rating),
      },
    };

    if (editingItem) {
      // Update existing item
      setWasteItems(
        wasteItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...itemData,
                id: editingItem.id,
                createdAt: editingItem.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        ...itemData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWasteItems([newItem, ...wasteItems]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "plastic",
      price: "",
      unit: "kg",
      description: "",
      image: "",
      buyerInfo: {
        name: "",
        address: "",
        phone: "",
        hours: "",
        rating: 5,
      },
      status: "available",
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      unit: item.unit,
      description: item.description,
      image: item.image,
      buyerInfo: {
        name: item.buyerInfo.name,
        address: item.buyerInfo.address,
        phone: item.buyerInfo.phone,
        hours: item.buyerInfo.hours,
        rating: item.buyerInfo.rating,
      },
      status: item.status,
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      setWasteItems(wasteItems.filter((item) => item.id !== id));
    }
  };

  const filteredItems = wasteItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.buyerInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (category) => {
    const categories = {
      plastic: "Plastik",
      paper: "Kertas",
      metal: "Logam",
      glass: "Kaca",
      organic: "Organik",
      electronic: "Elektronik",
      other: "Lainnya",
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      plastic: "bg-blue-100 text-blue-800",
      paper: "bg-green-100 text-green-800",
      metal: "bg-gray-100 text-gray-800",
      glass: "bg-cyan-100 text-cyan-800",
      organic: "bg-emerald-100 text-emerald-800",
      electronic: "bg-purple-100 text-purple-800",
      other: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Manajemen Jual Sampah
        </h1>
        <p className="text-gray-600">
          Kelola daftar harga dan pembeli sampah daur ulang
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari item atau pembeli..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingItem ? "Edit Item" : "Tambah Item Baru"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Item Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">
                      Informasi Item
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Item
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="plastic">Plastik</option>
                      <option value="paper">Kertas</option>
                      <option value="metal">Logam</option>
                      <option value="glass">Kaca</option>
                      <option value="organic">Organik</option>
                      <option value="electronic">Elektronik</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satuan
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="kg">Per Kg</option>
                      <option value="pcs">Per Pcs</option>
                      <option value="m3">Per m³</option>
                      <option value="liter">Per Liter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Tersedia</option>
                      <option value="limited">Terbatas</option>
                      <option value="unavailable">Tidak Tersedia</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Gambar
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Deskripsi item dan kondisi yang diperlukan..."
                    />
                  </div>

                  {/* Buyer Info */}
                  <div className="md:col-span-2 pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">
                      Informasi Pembeli
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pembeli/Toko
                    </label>
                    <input
                      type="text"
                      value={formData.buyerInfo.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyerInfo: {
                            ...formData.buyerInfo,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.buyerInfo.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyerInfo: {
                            ...formData.buyerInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      value={formData.buyerInfo.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyerInfo: {
                            ...formData.buyerInfo,
                            address: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jam Operasional
                    </label>
                    <input
                      type="text"
                      value={formData.buyerInfo.hours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyerInfo: {
                            ...formData.buyerInfo,
                            hours: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08:00 - 17:00 WIB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.buyerInfo.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyerInfo: {
                            ...formData.buyerInfo,
                            rating: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    {editingItem ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-xl font-bold">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    /{item.unit}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === "available"
                      ? "bg-green-100 text-green-800"
                      : item.status === "limited"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status === "available"
                    ? "Tersedia"
                    : item.status === "limited"
                    ? "Terbatas"
                    : "Tidak Tersedia"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="border-t pt-4">
                <div className="flex items-center mb-2">
                  <Store className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {item.buyerInfo.name}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 line-clamp-1">
                    {item.buyerInfo.address}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {item.buyerInfo.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {item.buyerInfo.rating}
                    </span>
                  </div>
                </div>
                {item.buyerInfo.hours && (
                  <div className="flex items-center mb-3">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {item.buyerInfo.hours}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Tidak ada item
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Tidak ada item yang sesuai dengan pencarian."
              : "Mulai dengan menambahkan item pertama."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SellWasteManagement;

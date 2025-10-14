const express = require("express");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/waste-map/heatmap
// @desc    Get waste distribution heatmap data
// @access  Public
router.get("/heatmap", optionalAuth, async (req, res) => {
  try {
    // Mock heatmap data
    // Dalam implementasi nyata, ini akan query database untuk koordinat dan kategori sampah
    const mockHeatmapData = [
      { lat: -7.1645, lng: 110.1407, intensity: 8, category: "plastic_bottle" }, // Yogyakarta
      { lat: -6.2088, lng: 106.8456, intensity: 12, category: "paper" }, // Jakarta
      { lat: -7.2504, lng: 112.7688, intensity: 6, category: "organic" }, // Surabaya
      { lat: -8.65, lng: 115.2167, intensity: 4, category: "metal" }, // Bali
      {
        lat: -6.9175,
        lng: 107.6191,
        intensity: 10,
        category: "plastic_bottle",
      }, // Bandung
      { lat: -7.7956, lng: 110.3695, intensity: 7, category: "paper" }, // Solo
      { lat: -6.9667, lng: 113.9833, intensity: 5, category: "organic" }, // Pamekasan (Madura)
      { lat: -7.0167, lng: 113.8833, intensity: 3, category: "textile" }, // Bangkalan (Madura)
    ];

    res.json({
      success: true,
      data: {
        heatmap: mockHeatmapData,
        summary: {
          totalPoints: mockHeatmapData.length,
          averageIntensity:
            mockHeatmapData.reduce((sum, point) => sum + point.intensity, 0) /
            mockHeatmapData.length,
          topCategory: "plastic_bottle",
          lastUpdated: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Get heatmap error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/waste-map/bank-sampah
// @desc    Get nearby waste banks
// @access  Public
router.get("/bank-sampah", optionalAuth, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km

    // Mock data bank sampah
    const mockBankSampah = [
      {
        id: 1,
        name: "Bank Sampah Hijau Lestari",
        address: "Jl. Kenari No. 123, Yogyakarta",
        lat: -7.1645,
        lng: 110.1407,
        phone: "0274-123456",
        operatingHours: {
          monday: "08:00-16:00",
          tuesday: "08:00-16:00",
          wednesday: "08:00-16:00",
          thursday: "08:00-16:00",
          friday: "08:00-16:00",
          saturday: "08:00-12:00",
          sunday: "Tutup",
        },
        acceptedWaste: ["plastic_bottle", "paper", "metal", "glass"],
        rating: 4.5,
        reviews: 124,
        contact: {
          whatsapp: "081234567890",
          email: "info@banksampahijau.com",
        },
        facilities: ["Parkir", "Timbangan Digital", "Penyortiran"],
      },
      {
        id: 2,
        name: "TPS3R Kelurahan Malioboro",
        address: "Jl. Malioboro, Yogyakarta",
        lat: -7.1556,
        lng: 110.1407,
        phone: "0274-789012",
        operatingHours: {
          monday: "07:00-17:00",
          tuesday: "07:00-17:00",
          wednesday: "07:00-17:00",
          thursday: "07:00-17:00",
          friday: "07:00-17:00",
          saturday: "07:00-15:00",
          sunday: "07:00-15:00",
        },
        acceptedWaste: ["organic", "plastic_bottle", "paper"],
        rating: 4.2,
        reviews: 89,
        contact: {
          whatsapp: "081987654321",
          email: "tps3r.malioboro@gmail.com",
        },
        facilities: ["Komposter", "Mesin Pencacah", "Area Edukasi"],
      },
      {
        id: 3,
        name: "Pengepul Pak Joko",
        address: "Jl. Taman Siswa, Yogyakarta",
        lat: -7.1789,
        lng: 110.1356,
        phone: "0274-345678",
        operatingHours: {
          monday: "08:00-17:00",
          tuesday: "08:00-17:00",
          wednesday: "08:00-17:00",
          thursday: "08:00-17:00",
          friday: "08:00-17:00",
          saturday: "08:00-14:00",
          sunday: "Tutup",
        },
        acceptedWaste: ["metal", "electronic", "paper"],
        rating: 4.0,
        reviews: 45,
        contact: {
          whatsapp: "082123456789",
        },
        facilities: ["Mobil Pickup", "Gudang Besar"],
      },
    ];

    // Filter berdasarkan location jika disediakan
    let filteredBankSampah = mockBankSampah;

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxRadius = parseFloat(radius);

      filteredBankSampah = mockBankSampah
        .map((bank) => {
          // Hitung jarak (simplified distance calculation)
          const distance =
            Math.sqrt(
              Math.pow(bank.lat - userLat, 2) + Math.pow(bank.lng - userLng, 2)
            ) * 111; // Rough conversion to km

          return { ...bank, distance: Math.round(distance * 100) / 100 };
        })
        .filter((bank) => bank.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance);
    }

    res.json({
      success: true,
      data: {
        bankSampah: filteredBankSampah,
        summary: {
          total: filteredBankSampah.length,
          searchRadius: radius,
          searchCenter:
            lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
        },
      },
    });
  } catch (error) {
    console.error("Get bank sampah error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/waste-map/statistics
// @desc    Get waste map statistics
// @access  Public
router.get("/statistics", optionalAuth, async (req, res) => {
  try {
    const { region, timeframe = "30" } = req.query; // timeframe in days

    // Mock statistics data
    const mockStats = {
      overview: {
        totalReports: 1247,
        totalRegions: 15,
        mostCommonWaste: "plastic_bottle",
        trendDirection: "increasing",
        changePercentage: 12.5,
      },
      byCategory: {
        plastic_bottle: { count: 425, percentage: 34.1 },
        paper: { count: 312, percentage: 25.0 },
        organic: { count: 248, percentage: 19.9 },
        metal: { count: 156, percentage: 12.5 },
        glass: { count: 89, percentage: 7.1 },
        electronic: { count: 17, percentage: 1.4 },
      },
      byRegion: [
        { region: "Yogyakarta", count: 324, percentage: 26.0 },
        { region: "Jakarta", count: 298, percentage: 23.9 },
        { region: "Surabaya", count: 245, percentage: 19.6 },
        { region: "Bandung", count: 189, percentage: 15.2 },
        { region: "Madura", count: 191, percentage: 15.3 },
      ],
      timeline: [
        { date: "2025-09-13", count: 42 },
        { date: "2025-09-14", count: 38 },
        { date: "2025-09-15", count: 45 },
        { date: "2025-09-16", count: 51 },
        { date: "2025-09-17", count: 47 },
        { date: "2025-09-18", count: 53 },
        { date: "2025-09-19", count: 49 },
        { date: "2025-10-13", count: 56 },
      ],
      predictions: {
        nextWeekEstimate: 378,
        trendAnalysis:
          "Peningkatan aktivitas klasifikasi sampah terutama di kategori plastik",
        recommendations: [
          "Fokus pada edukasi pengurangan sampah plastik",
          "Tingkatkan jumlah bank sampah di area urban",
          "Program insentif untuk pengguna aktif",
        ],
      },
    };

    res.json({
      success: true,
      data: mockStats,
      metadata: {
        generatedAt: new Date().toISOString(),
        timeframe: `${timeframe} days`,
        region: region || "all",
      },
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/waste-map/report
// @desc    Report waste location
// @access  Private (would require auth in real implementation)
router.post("/report", optionalAuth, async (req, res) => {
  try {
    const { location, wasteType, description, severity } = req.body;

    // Validation
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates are required",
      });
    }

    if (!wasteType) {
      return res.status(400).json({
        success: false,
        message: "Waste type is required",
      });
    }

    // Mock saving report
    const report = {
      id: Math.floor(Math.random() * 10000),
      location: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
        address: location.address || "Unknown",
      },
      wasteType,
      description: description || "",
      severity: severity || "medium",
      reportedBy: req.user?.id || "anonymous",
      reportedAt: new Date().toISOString(),
      status: "pending",
    };

    console.log("New waste report:", report);

    res.status(201).json({
      success: true,
      message: "Waste location reported successfully",
      data: report,
    });
  } catch (error) {
    console.error("Report waste error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

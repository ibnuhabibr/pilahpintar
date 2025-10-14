const express = require("express");
const router = express.Router();

// Simple test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Upload route working",
    timestamp: new Date().toISOString(),
  });
});

// Upload and classify route
router.post("/classify", (req, res) => {
  console.log("Files received:", req.files);
  console.log("Body received:", req.body);

  // Check if file was uploaded
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada file yang diunggah. Silakan pilih gambar.",
    });
  }

  const uploadedFile = req.files.image;

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(uploadedFile.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Jenis file tidak valid. Pilih gambar JPEG, PNG, GIF, atau WebP.",
    });
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (uploadedFile.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: "File terlalu besar. Pilih gambar yang lebih kecil dari 5MB.",
    });
  }

  // Mock response with random classification
  setTimeout(() => {
    // Random waste type for demo
    const wasteTypes = ["organic", "plastic", "paper", "glass", "metal"];
    const randomType =
      wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%

    // Indonesian suggestions for each type
    const suggestions = {
      organic:
        "Buang ke tempat sampah organik. Bisa dijadikan kompos untuk pupuk tanaman atau pakan ternak.",
      plastic:
        "Buang ke tempat sampah plastik. Pastikan bersih dari sisa makanan untuk didaur ulang.",
      paper:
        "Buang ke tempat sampah kertas. Pastikan dalam keadaan kering dan tidak terkontaminasi.",
      glass:
        "Buang ke tempat sampah kaca. Hati-hati saat menangani, bungkus dengan aman.",
      metal:
        "Buang ke tempat sampah logam. Bersihkan dari label dan cat, nilai jual tinggi di pengepul.",
    };

    const fileInfo = {
      originalName: uploadedFile.name,
      filename: uploadedFile.name,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
      url: "/uploads/" + uploadedFile.name,
      name: uploadedFile.name,
    };

    res.json({
      success: true,
      message: "Gambar berhasil diklasifikasi",
      data: {
        classificationId: "mock-" + Date.now(),
        file: fileInfo,
        classification: {
          type: randomType,
          confidence: confidence,
          suggestions: suggestions[randomType],
          processedAt: new Date(),
        },
      },
    });
  }, 2000); // Simulate processing time
});

module.exports = router;

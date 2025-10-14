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

// Mock upload route for testing frontend
router.post("/classify", (req, res) => {
  console.log("Files received:", req.files);
  console.log("Body received:", req.body);

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

    // Get file info from the uploaded file or use defaults
    const uploadedFile = req.files && req.files.image ? req.files.image : null;
    const fileInfo = uploadedFile
      ? {
          originalName: uploadedFile.name,
          filename: uploadedFile.name,
          size: uploadedFile.size,
          url: "/uploads/" + uploadedFile.name,
          name: uploadedFile.name,
        }
      : {
          originalName: "gambar-sampah.jpg",
          filename: "waste-" + Date.now() + ".jpg",
          size: Math.floor(Math.random() * 500000) + 50000, // Random size 50KB-550KB
          url: "/uploads/sample-image.jpg",
          name: "gambar-sampah.jpg",
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

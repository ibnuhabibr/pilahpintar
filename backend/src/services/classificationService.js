// Mock AI Classification Service
// Dalam implementasi nyata, ini akan menggunakan model TensorFlow.js atau API eksternal

class ClassificationService {
  constructor() {
    // Mock waste categories dengan data yang realistis
    this.wasteCategories = {
      plastic_bottle: {
        name: "Botol Plastik (PET)",
        type: "Plastik",
        recyclable: true,
        description: "Botol plastik jenis PET yang dapat didaur ulang",
        tips: [
          "Bersihkan botol dari sisa isi",
          "Lepas label dan tutup botol",
          "Kumpulkan dalam wadah terpisah",
        ],
      },
      paper: {
        name: "Kertas",
        type: "Kertas",
        recyclable: true,
        description: "Kertas yang masih dapat didaur ulang",
        tips: [
          "Pastikan kertas dalam kondisi kering",
          "Pisahkan dari kertas yang terlaminasi",
          "Lipat untuk menghemat ruang",
        ],
      },
      organic: {
        name: "Sampah Organik",
        type: "Organik",
        recyclable: true,
        description: "Sampah organik yang dapat dijadikan kompos",
        tips: [
          "Pisahkan dari sampah non-organik",
          "Dapat dijadikan kompos rumahan",
          "Potong kecil-kecil untuk mempercepat pengomposan",
        ],
      },
      metal: {
        name: "Kaleng/Logam",
        type: "Logam",
        recyclable: true,
        description: "Kaleng atau logam yang dapat didaur ulang",
        tips: [
          "Bersihkan dari sisa makanan",
          "Pipihkan untuk menghemat ruang",
          "Pisahkan berdasarkan jenis logam",
        ],
      },
      glass: {
        name: "Kaca",
        type: "Kaca",
        recyclable: true,
        description: "Botol atau wadah kaca yang dapat didaur ulang",
        tips: [
          "Bersihkan dari sisa isi",
          "Pisahkan berdasarkan warna",
          "Hati-hati saat menangani",
        ],
      },
      electronic: {
        name: "Elektronik",
        type: "Elektronik",
        recyclable: true,
        description: "Perangkat elektronik yang memerlukan penanganan khusus",
        tips: [
          "Hapus data pribadi sebelum membuang",
          "Bawa ke tempat pengumpulan e-waste",
          "Jangan buang sembarangan",
        ],
      },
      textile: {
        name: "Tekstil",
        type: "Tekstil",
        recyclable: true,
        description: "Kain atau pakaian yang masih dapat dimanfaatkan",
        tips: [
          "Donasikan jika masih layak pakai",
          "Gunakan sebagai kain lap",
          "Bawa ke tempat daur ulang tekstil",
        ],
      },
      hazardous: {
        name: "Berbahaya (B3)",
        type: "Berbahaya",
        recyclable: false,
        description: "Sampah berbahaya yang memerlukan penanganan khusus",
        tips: [
          "Jangan buang ke tempat sampah biasa",
          "Bawa ke fasilitas pengelolaan B3",
          "Gunakan APD saat menangani",
        ],
      },
    };

    // Mock model untuk simulasi loading time
    this.modelLoaded = false;
    this.loadModel();
  }

  async loadModel() {
    // Simulasi loading model AI
    console.log("Loading CNN model...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.modelLoaded = true;
    console.log("CNN model loaded successfully");
  }

  async classifyImage(imageBuffer) {
    if (!this.modelLoaded) {
      throw new Error("AI model not loaded yet");
    }

    // Simulasi processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000)
    );

    // Mock classification logic
    // Dalam implementasi nyata, ini akan menggunakan TensorFlow.js untuk inference
    const categories = Object.keys(this.wasteCategories);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const confidence = this.generateRealisticConfidence();

    const categoryData = this.wasteCategories[randomCategory];

    // Generate subcategory based on main category
    const subCategory = this.generateSubCategory(randomCategory);

    return {
      category: randomCategory,
      subCategory,
      confidence: confidence,
      recyclable: categoryData.recyclable,
      description: categoryData.description,
      name: categoryData.name,
      type: categoryData.type,
      tips: categoryData.tips,
      modelConfidence: confidence,
      processingMetadata: {
        algorithm: "CNN",
        modelVersion: "1.0.0",
        preprocessingSteps: ["resize", "normalize", "augment"],
        inferenceTime: Math.round(800 + Math.random() * 500), // milliseconds
      },
    };
  }

  generateRealisticConfidence() {
    // Generate confidence with realistic distribution
    // Most classifications should be high confidence (85-95%)
    // Some medium confidence (70-85%)
    // Few low confidence (60-70%)

    const rand = Math.random();
    if (rand < 0.7) {
      // High confidence (70% of cases)
      return Math.round(85 + Math.random() * 10); // 85-95%
    } else if (rand < 0.9) {
      // Medium confidence (20% of cases)
      return Math.round(70 + Math.random() * 15); // 70-85%
    } else {
      // Low confidence (10% of cases)
      return Math.round(60 + Math.random() * 10); // 60-70%
    }
  }

  generateSubCategory(mainCategory) {
    const subCategories = {
      plastic_bottle: [
        "PET Bottle",
        "HDPE Bottle",
        "Water Bottle",
        "Soda Bottle",
      ],
      paper: ["Newspaper", "Cardboard", "Office Paper", "Magazine"],
      organic: [
        "Food Waste",
        "Garden Waste",
        "Fruit Peels",
        "Vegetable Scraps",
      ],
      metal: ["Aluminum Can", "Steel Can", "Copper Wire", "Iron Scrap"],
      glass: ["Clear Glass", "Brown Glass", "Green Glass", "Broken Glass"],
      electronic: ["Mobile Phone", "Computer Part", "Battery", "Cable"],
      textile: ["Cotton Fabric", "Synthetic Fabric", "Used Clothing", "Shoes"],
      hazardous: [
        "Battery",
        "Chemical Container",
        "Medical Waste",
        "Paint Can",
      ],
    };

    const options = subCategories[mainCategory] || ["Unknown"];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Method untuk batch classification (future feature)
  async classifyMultipleImages(imageBuffers) {
    const results = [];
    for (const buffer of imageBuffers) {
      const result = await this.classifyImage(buffer);
      results.push(result);
    }
    return results;
  }

  // Method untuk mendapatkan similar waste items
  async getSimilarWasteItems(category, limit = 5) {
    // Mock implementation
    const allCategories = Object.keys(this.wasteCategories);
    const similarCategories = allCategories
      .filter((cat) => cat !== category)
      .slice(0, limit);

    return similarCategories.map((cat) => ({
      category: cat,
      name: this.wasteCategories[cat].name,
      similarity: Math.round(60 + Math.random() * 30), // 60-90% similarity
    }));
  }

  // Method untuk validasi gambar sebelum klasifikasi
  validateImage(imageBuffer) {
    // Basic validation
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Invalid image buffer");
    }

    // Check file size (max 5MB)
    if (imageBuffer.length > 5 * 1024 * 1024) {
      throw new Error("Image file too large. Maximum size is 5MB");
    }

    // In real implementation, you might check:
    // - Image format validation
    // - Image dimension validation
    // - Content validation (not NSFW, etc.)

    return true;
  }

  // Method untuk mengupdate model (future feature)
  async updateModel(newModelPath) {
    console.log("Updating CNN model...");
    // Implementation for model updates
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Model updated successfully");
  }

  // Get classification statistics
  getModelStats() {
    return {
      modelVersion: "1.0.0",
      supportedCategories: Object.keys(this.wasteCategories).length,
      averageAccuracy: 92.5,
      totalClassifications: 150000, // Mock data
      lastUpdated: "2025-01-01",
      modelSize: "125MB",
    };
  }
}

// Singleton instance
const classificationService = new ClassificationService();

module.exports = classificationService;

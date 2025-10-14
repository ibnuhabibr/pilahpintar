const express = require("express");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/education
// @desc    Get all education content (summary)
// @access  Public
router.get("/", optionalAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Education content retrieved successfully",
      articles: {
        count: 8,
        featured: 3,
      },
      videos: {
        count: 5,
        featured: 2,
      },
      categories: [
        "plastik",
        "organik",
        "kertas",
        "logam",
        "kaca",
        "elektronik",
      ],
      totalViews: 15420,
    });
  } catch (error) {
    console.error("Error fetching education content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch education content",
      error: error.message,
    });
  }
});

// @route   GET /api/education/articles
// @desc    Get educational articles
// @access  Public
router.get("/articles", optionalAuth, async (req, res) => {
  try {
    // Mock educational articles
    const mockArticles = [
      {
        id: 1,
        title: "Mengenal Jenis-Jenis Plastik dan Cara Daur Ulangnya",
        slug: "mengenal-jenis-plastik-daur-ulang",
        excerpt:
          "Pelajari berbagai jenis plastik berdasarkan kode recycle dan cara pengelolaannya yang tepat.",
        content: "Artikel lengkap tentang jenis-jenis plastik...",
        category: "plastik",
        tags: ["plastik", "daur ulang", "lingkungan"],
        author: "Tim PilahPintar",
        publishedAt: "2025-10-01T10:00:00Z",
        readTime: 5,
        views: 1234,
        featured: true,
        imageUrl: "https://example.com/plastic-types.jpg",
      },
      {
        id: 2,
        title: "Komposting Rumahan: Panduan Lengkap untuk Pemula",
        slug: "komposting-rumahan-panduan-pemula",
        excerpt:
          "Langkah-langkah mudah membuat kompos dari sampah organik di rumah.",
        content: "Panduan lengkap komposting...",
        category: "organik",
        tags: ["kompos", "organik", "diy"],
        author: "Dr. Maya Sari",
        publishedAt: "2025-09-28T14:30:00Z",
        readTime: 8,
        views: 987,
        featured: false,
        imageUrl: "https://example.com/composting.jpg",
      },
      {
        id: 3,
        title: "Upcycling: Mengubah Sampah Menjadi Barang Berguna",
        slug: "upcycling-sampah-barang-berguna",
        excerpt:
          "Ide kreatif mengubah sampah menjadi produk yang bernilai dan bermanfaat.",
        content: "Tutorial upcycling...",
        category: "kreatif",
        tags: ["upcycling", "kreatif", "diy"],
        author: "Andi Prasetyo",
        publishedAt: "2025-09-25T09:15:00Z",
        readTime: 6,
        views: 756,
        featured: true,
        imageUrl: "https://example.com/upcycling.jpg",
      },
    ];

    const { category, featured, limit = 10, page = 1 } = req.query;

    let filteredArticles = mockArticles;

    // Filter by category
    if (category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === category
      );
    }

    // Filter by featured
    if (featured === "true") {
      filteredArticles = filteredArticles.filter((article) => article.featured);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        articles: paginatedArticles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredArticles.length / limit),
          totalItems: filteredArticles.length,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/education/articles/:slug
// @desc    Get single article by slug
// @access  Public
router.get("/articles/:slug", optionalAuth, async (req, res) => {
  try {
    // Mock article detail
    const mockArticle = {
      id: 1,
      title: "Mengenal Jenis-Jenis Plastik dan Cara Daur Ulangnya",
      slug: "mengenal-jenis-plastik-daur-ulang",
      content: `
        <h2>Pendahuluan</h2>
        <p>Plastik adalah salah satu jenis sampah yang paling umum ditemukan dalam kehidupan sehari-hari. Namun, tidak semua plastik diciptakan sama. Setiap jenis plastik memiliki karakteristik dan cara pengelolaan yang berbeda.</p>

        <h2>Kode Recycle Plastik</h2>
        <p>Plastik diberi kode recycle berupa angka 1-7 yang biasanya terletak di bagian bawah kemasan:</p>

        <h3>1. PET/PETE (Polyethylene Terephthalate)</h3>
        <p>Digunakan untuk: Botol air mineral, botol soda, wadah makanan</p>
        <p>Cara daur ulang: Dapat didaur ulang menjadi karpet, pakaian, atau botol baru</p>

        <h3>2. HDPE (High-Density Polyethylene)</h3>
        <p>Digunakan untuk: Botol susu, deterjen, shampo</p>
        <p>Cara daur ulang: Dapat didaur ulang menjadi pipa, furnitur outdoor</p>

        <h3>3. PVC (Polyvinyl Chloride)</h3>
        <p>Digunakan untuk: Pipa, mainan, kartu kredit</p>
        <p>Cara daur ulang: Sulit didaur ulang, sebaiknya dihindari</p>

        <h2>Tips Mengelola Sampah Plastik</h2>
        <ul>
          <li>Selalu bersihkan plastik sebelum membuang</li>
          <li>Pisahkan berdasarkan jenis plastik</li>
          <li>Gunakan kembali wadah plastik yang masih baik</li>
          <li>Kurangi penggunaan plastik sekali pakai</li>
        </ul>

        <h2>Kesimpulan</h2>
        <p>Dengan memahami jenis-jenis plastik dan cara pengelolaannya, kita dapat berkontribusi dalam mengurangi dampak negatif sampah plastik terhadap lingkungan.</p>
      `,
      category: "plastik",
      tags: ["plastik", "daur ulang", "lingkungan"],
      author: {
        name: "Tim PilahPintar",
        avatar: "https://example.com/avatar.jpg",
        bio: "Tim peneliti dan developer PilahPintar yang fokus pada edukasi lingkungan",
      },
      publishedAt: "2025-10-01T10:00:00Z",
      updatedAt: "2025-10-01T10:00:00Z",
      readTime: 5,
      views: 1234,
      featured: true,
      imageUrl: "https://example.com/plastic-types.jpg",
      relatedArticles: [
        {
          id: 2,
          title: "Komposting Rumahan: Panduan Lengkap untuk Pemula",
          slug: "komposting-rumahan-panduan-pemula",
          imageUrl: "https://example.com/composting.jpg",
        },
        {
          id: 3,
          title: "Upcycling: Mengubah Sampah Menjadi Barang Berguna",
          slug: "upcycling-sampah-barang-berguna",
          imageUrl: "https://example.com/upcycling.jpg",
        },
      ],
    };

    if (req.params.slug !== mockArticle.slug) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Increment views (in real app, this would update database)
    mockArticle.views += 1;

    res.json({
      success: true,
      data: mockArticle,
    });
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/education/videos
// @desc    Get educational videos
// @access  Public
router.get("/videos", optionalAuth, async (req, res) => {
  try {
    // Mock educational videos
    const mockVideos = [
      {
        id: 1,
        title: "Cara Memilah Sampah yang Benar",
        description: "Tutorial lengkap memilah sampah berdasarkan jenisnya",
        videoUrl: "https://youtube.com/watch?v=example1",
        thumbnailUrl: "https://example.com/video1-thumb.jpg",
        duration: 300, // in seconds
        category: "tutorial",
        views: 2543,
        likes: 189,
        publishedAt: "2025-09-30T12:00:00Z",
        channel: "PilahPintar Official",
      },
      {
        id: 2,
        title: "Membuat Kompos dari Sampah Dapur",
        description: "Langkah-langkah praktis membuat kompos di rumah",
        videoUrl: "https://youtube.com/watch?v=example2",
        thumbnailUrl: "https://example.com/video2-thumb.jpg",
        duration: 450,
        category: "diy",
        views: 1876,
        likes: 145,
        publishedAt: "2025-09-28T15:30:00Z",
        channel: "EcoLiving Indonesia",
      },
      {
        id: 3,
        title: "Inovasi Daur Ulang Plastik di Indonesia",
        description:
          "Mengenal berbagai inovasi daur ulang plastik karya anak bangsa",
        videoUrl: "https://youtube.com/watch?v=example3",
        thumbnailUrl: "https://example.com/video3-thumb.jpg",
        duration: 720,
        category: "inspirasi",
        views: 3421,
        likes: 267,
        publishedAt: "2025-09-25T08:45:00Z",
        channel: "Green Innovation TV",
      },
    ];

    const { category, limit = 12, page = 1 } = req.query;

    let filteredVideos = mockVideos;

    if (category) {
      filteredVideos = filteredVideos.filter(
        (video) => video.category === category
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        videos: paginatedVideos,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredVideos.length / limit),
          totalItems: filteredVideos.length,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get videos error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/education/guides
// @desc    Get step-by-step guides
// @access  Public
router.get("/guides", optionalAuth, async (req, res) => {
  try {
    // Mock guides data
    const mockGuides = [
      {
        id: 1,
        title: "Panduan Lengkap Memilah Sampah di Rumah",
        description: "Langkah demi langkah memilah sampah dengan benar",
        difficulty: "beginner",
        estimatedTime: 15,
        steps: [
          {
            stepNumber: 1,
            title: "Siapkan Tempat Sampah Terpisah",
            description:
              "Sediakan minimal 3 tempat sampah untuk organik, non-organik, dan B3",
            imageUrl: "https://example.com/step1.jpg",
          },
          {
            stepNumber: 2,
            title: "Kenali Jenis Sampah",
            description:
              "Pelajari perbedaan antara sampah organik, plastik, kertas, dan logam",
            imageUrl: "https://example.com/step2.jpg",
          },
          {
            stepNumber: 3,
            title: "Bersihkan Sebelum Buang",
            description: "Cuci bersih kemasan makanan/minuman sebelum dibuang",
            imageUrl: "https://example.com/step3.jpg",
          },
          {
            stepNumber: 4,
            title: "Sortir dan Buang",
            description:
              "Masukkan sampah ke tempat yang sesuai dengan jenisnya",
            imageUrl: "https://example.com/step4.jpg",
          },
        ],
        category: "pemilahan",
        tags: ["pemilahan", "rumah tangga", "tutorial"],
        createdAt: "2025-09-20T10:00:00Z",
        views: 5432,
      },
      {
        id: 2,
        title: "Membuat Eco Brick dari Botol Plastik",
        description:
          "Tutorial membuat eco brick untuk membangun struktur ramah lingkungan",
        difficulty: "intermediate",
        estimatedTime: 30,
        steps: [
          {
            stepNumber: 1,
            title: "Siapkan Botol Plastik",
            description: "Gunakan botol plastik 600ml yang bersih dan kering",
            imageUrl: "https://example.com/ecobrick1.jpg",
          },
          {
            stepNumber: 2,
            title: "Kumpulkan Plastik Kemasan",
            description:
              "Kumpulkan plastik kemasan bersih seperti bungkus snack, kantong plastik",
            imageUrl: "https://example.com/ecobrick2.jpg",
          },
          {
            stepNumber: 3,
            title: "Isi Botol dengan Plastik",
            description:
              "Masukkan plastik kemasan sambil dipadatkan dengan stick kayu",
            imageUrl: "https://example.com/ecobrick3.jpg",
          },
          {
            stepNumber: 4,
            title: "Pastikan Padat dan Keras",
            description:
              "Eco brick yang baik harus padat dengan berat minimal 200 gram",
            imageUrl: "https://example.com/ecobrick4.jpg",
          },
        ],
        category: "diy",
        tags: ["eco brick", "plastik", "konstruksi"],
        createdAt: "2025-09-18T14:00:00Z",
        views: 3876,
      },
    ];

    const { category, difficulty, limit = 10, page = 1 } = req.query;

    let filteredGuides = mockGuides;

    if (category) {
      filteredGuides = filteredGuides.filter(
        (guide) => guide.category === category
      );
    }

    if (difficulty) {
      filteredGuides = filteredGuides.filter(
        (guide) => guide.difficulty === difficulty
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedGuides = filteredGuides.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        guides: paginatedGuides,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredGuides.length / limit),
          totalItems: filteredGuides.length,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get guides error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/education/categories
// @desc    Get education content categories
// @access  Public
router.get("/categories", optionalAuth, async (req, res) => {
  try {
    const categories = [
      {
        id: "plastik",
        name: "Plastik",
        description: "Edukasi tentang pengelolaan sampah plastik",
        icon: "♻️",
        color: "#3B82F6",
        articleCount: 15,
        videoCount: 8,
      },
      {
        id: "organik",
        name: "Organik",
        description: "Pengelolaan sampah organik dan komposting",
        icon: "🍃",
        color: "#10B981",
        articleCount: 12,
        videoCount: 6,
      },
      {
        id: "kreatif",
        name: "Kreatif & DIY",
        description: "Ide kreatif mengolah sampah menjadi berguna",
        icon: "🎨",
        color: "#F59E0B",
        articleCount: 20,
        videoCount: 15,
      },
      {
        id: "tutorial",
        name: "Tutorial",
        description: "Panduan langkah demi langkah",
        icon: "📚",
        color: "#8B5CF6",
        articleCount: 25,
        videoCount: 12,
      },
      {
        id: "teknologi",
        name: "Teknologi",
        description: "Inovasi teknologi dalam pengelolaan sampah",
        icon: "🔬",
        color: "#EF4444",
        articleCount: 8,
        videoCount: 5,
      },
    ];

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

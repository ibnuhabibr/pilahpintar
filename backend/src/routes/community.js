const express = require("express");
const { auth, optionalAuth } = require("../middleware/auth");
const ForumPost = require("../models/ForumPost");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// @route   GET /api/community
// @desc    Get community overview
// @access  Public
router.get("/", optionalAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Community content retrieved successfully",
      forums: {
        count: 12,
        active: 8,
        totalPosts: 245,
      },
      challenges: {
        count: 5,
        active: 3,
        participants: 89,
      },
      events: {
        count: 7,
        upcoming: 3,
        thisMonth: 2,
      },
      users: {
        total: 1250,
        activeToday: 34,
      },
    });
  } catch (error) {
    console.error("Error fetching community content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch community content",
      error: error.message,
    });
  }
});

// @route   GET /api/community/posts
// @desc    Get community posts with pagination and filtering
// @access  Public
router.get("/posts", optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const posts = await ForumPost.find(query)
      .populate("author", "name avatar email")
      .populate("replies.author", "name avatar")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
});

// @route   POST /api/community/posts
// @desc    Create new forum post
// @access  Private
router.post(
  "/posts",
  [
    auth,
    body("title")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Title must be between 5 and 200 characters"),
    body("content")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Content must be between 10 and 2000 characters"),
    body("category")
      .isIn([
        "general",
        "tips",
        "pengalaman",
        "lokasi",
        "tanya-jawab",
        "berita",
      ])
      .withMessage("Invalid category"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const { title, content, category, tags } = req.body;

      const newPost = new ForumPost({
        title,
        content,
        category,
        author: req.user._id,
        tags: tags
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      });

      await newPost.save();

      const savedPost = await ForumPost.findById(newPost._id)
        .populate("author", "name avatar email")
        .populate("replies.author", "name avatar");

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: savedPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create post",
        error: error.message,
      });
    }
  }
);

// @route   GET /api/community/posts/:id
// @desc    Get single post with replies
// @access  Public
router.get("/posts/:id", optionalAuth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("author", "name avatar email")
      .populate("replies.author", "name avatar")
      .populate("likes", "name")
      .populate("replies.likes", "name");

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
});

// @route   POST /api/community/posts/:id/replies
// @desc    Add reply to post
// @access  Private
router.post(
  "/posts/:id/replies",
  [
    auth,
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Reply content must be between 1 and 1000 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const { content } = req.body;
      const post = await ForumPost.findById(req.params.id);

      if (!post || !post.isActive) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      const newReply = {
        content,
        author: req.user._id,
        createdAt: new Date(),
      };

      post.replies.push(newReply);
      await post.save();

      const updatedPost = await ForumPost.findById(req.params.id)
        .populate("author", "name avatar email")
        .populate("replies.author", "name avatar");

      res.status(201).json({
        success: true,
        message: "Reply added successfully",
        post: updatedPost,
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add reply",
        error: error.message,
      });
    }
  }
);

// @route   POST /api/community/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? "Post unliked" : "Post liked",
      liked: likeIndex === -1,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like post",
      error: error.message,
    });
  }
});

// @route   POST /api/community/posts/:postId/replies/:replyId/like
// @desc    Like/unlike a reply
// @access  Private
router.post("/posts/:postId/replies/:replyId/like", auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);

    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const reply = post.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    const userId = req.user._id;
    const likeIndex = reply.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      reply.likes.splice(likeIndex, 1);
    } else {
      // Like
      reply.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? "Reply unliked" : "Reply liked",
      liked: likeIndex === -1,
      likeCount: reply.likes.length,
    });
  } catch (error) {
    console.error("Error liking reply:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like reply",
      error: error.message,
    });
  }
});

// @route   DELETE /api/community/posts/:id
// @desc    Delete a post (soft delete)
// @access  Private
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is the author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    post.isActive = false;
    await post.save();

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
});

// Legacy mock posts endpoint for compatibility
router.get("/posts-mock", optionalAuth, async (req, res) => {
  try {
    // Mock community posts
    const mockPosts = [
      {
        id: 1,
        title: "Berhasil Membuat Eco Brick Pertama!",
        content:
          "Hari ini saya berhasil membuat eco brick pertama dari sampah plastik di rumah. Ternyata mudah dan menyenangkan! 🌱",
        type: "achievement",
        author: {
          id: "user123",
          name: "Andi Pratama",
          avatar: "https://example.com/avatar1.jpg",
          level: "Eco Warrior",
          points: 1250,
        },
        images: [
          "https://example.com/ecobrick-post1.jpg",
          "https://example.com/ecobrick-post2.jpg",
        ],
        tags: ["eco-brick", "diy", "plastik"],
        category: "achievement",
        likes: 24,
        comments: 8,
        shares: 3,
        createdAt: "2025-10-01T08:30:00Z",
        location: {
          city: "Jakarta",
          province: "DKI Jakarta",
        },
        engagement: {
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: 2,
        title: "Tips Komposting untuk Pemula",
        content:
          "Setelah 3 bulan mencoba komposting, ini tips yang saya pelajari:\n\n1. Perbandingan hijau:coklat 1:3\n2. Aduk seminggu sekali\n3. Jaga kelembaban\n4. Sabar menunggu hasil 😊\n\nAda yang mau sharing pengalaman komposting juga?",
        type: "tips",
        author: {
          id: "user456",
          name: "Maya Sari",
          avatar: "https://example.com/avatar2.jpg",
          level: "Green Master",
          points: 2100,
        },
        images: ["https://example.com/compost-tips.jpg"],
        tags: ["kompos", "organik", "tips"],
        category: "tips",
        likes: 45,
        comments: 12,
        shares: 8,
        createdAt: "2025-09-30T15:45:00Z",
        location: {
          city: "Bandung",
          province: "Jawa Barat",
        },
        engagement: {
          isLiked: true,
          isBookmarked: false,
        },
      },
      {
        id: 3,
        title: "Challenge: Zero Waste Sehari!",
        content:
          "Siapa yang mau ikutan challenge zero waste selama sehari? Rules:\n\n• Tidak menghasilkan sampah anorganik\n• Bawa tas belanja sendiri\n• Hindari kemasan sekali pakai\n• Share foto di komentar!\n\nYuk kita lihat siapa yang bisa! 💪 #ZeroWasteChallenge",
        type: "challenge",
        author: {
          id: "user789",
          name: "Budi Santoso",
          avatar: "https://example.com/avatar3.jpg",
          level: "Eco Champion",
          points: 3450,
        },
        images: [],
        tags: ["zero-waste", "challenge", "lifestyle"],
        category: "challenge",
        likes: 67,
        comments: 23,
        shares: 15,
        createdAt: "2025-09-29T10:20:00Z",
        location: {
          city: "Surabaya",
          province: "Jawa Timur",
        },
        engagement: {
          isLiked: false,
          isBookmarked: true,
        },
      },
    ];

    const { type, category, sort = "recent", limit = 10, page = 1 } = req.query;

    let filteredPosts = mockPosts;

    // Filter by type
    if (type) {
      filteredPosts = filteredPosts.filter((post) => post.type === type);
    }

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === category
      );
    }

    // Sort posts
    if (sort === "popular") {
      filteredPosts.sort(
        (a, b) =>
          b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)
      );
    } else if (sort === "recent") {
      filteredPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredPosts.length / limit),
          totalItems: filteredPosts.length,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/community/posts
// @desc    Create new community post
// @access  Private
router.post("/posts", auth, async (req, res) => {
  try {
    const { title, content, type, category, tags, location } = req.body;

    // Validation
    if (!title || !content || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and type are required",
      });
    }

    // Mock post creation
    const newPost = {
      id: Date.now(),
      title,
      content,
      type,
      category: category || type,
      tags: tags || [],
      location: location || null,
      author: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
        level: req.user.level || "Eco Beginner",
        points: req.user.points || 0,
      },
      images: [], // Would be populated with uploaded images
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      engagement: {
        isLiked: false,
        isBookmarked: false,
      },
    };

    // Award points for posting
    const pointsAwarded = 10;

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post: newPost,
        pointsAwarded,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/community/posts/:id
// @desc    Get single post with comments
// @access  Public
router.get("/posts/:id", optionalAuth, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    // Mock post detail with comments
    const mockPost = {
      id: postId,
      title: "Berhasil Membuat Eco Brick Pertama!",
      content:
        "Hari ini saya berhasil membuat eco brick pertama dari sampah plastik di rumah. Ternyata mudah dan menyenangkan! 🌱\n\nProses pembuatannya:\n1. Kumpulkan plastik kemasan bersih\n2. Padatkan dalam botol 600ml\n3. Pastikan berat minimal 200gr\n4. Siap untuk digunakan!\n\nSemoga bisa menginspirasi teman-teman lainnya untuk mulai membuat eco brick juga.",
      type: "achievement",
      author: {
        id: "user123",
        name: "Andi Pratama",
        avatar: "https://example.com/avatar1.jpg",
        level: "Eco Warrior",
        points: 1250,
        joinedAt: "2025-08-15T10:00:00Z",
        postsCount: 15,
        followersCount: 45,
      },
      images: [
        "https://example.com/ecobrick-post1.jpg",
        "https://example.com/ecobrick-post2.jpg",
      ],
      tags: ["eco-brick", "diy", "plastik"],
      category: "achievement",
      likes: 24,
      comments: 8,
      shares: 3,
      createdAt: "2025-10-01T08:30:00Z",
      location: {
        city: "Jakarta",
        province: "DKI Jakarta",
      },
      engagement: {
        isLiked: false,
        isBookmarked: false,
      },
      commentsData: [
        {
          id: 1,
          content:
            "Keren banget! Saya juga mau coba buat eco brick. Ada tips khusus gak?",
          author: {
            id: "user456",
            name: "Maya Sari",
            avatar: "https://example.com/avatar2.jpg",
            level: "Green Master",
          },
          likes: 3,
          createdAt: "2025-10-01T09:15:00Z",
          replies: [
            {
              id: 101,
              content:
                "Yang penting plastiknya bersih dan kering dulu sebelum dimasukkan. Jangan lupa dipadatkan dengan baik!",
              author: {
                id: "user123",
                name: "Andi Pratama",
                avatar: "https://example.com/avatar1.jpg",
                level: "Eco Warrior",
              },
              likes: 2,
              createdAt: "2025-10-01T09:30:00Z",
            },
          ],
        },
        {
          id: 2,
          content: "Mantap! Eco brick ini bisa dipake buat apa aja ya?",
          author: {
            id: "user789",
            name: "Budi Santoso",
            avatar: "https://example.com/avatar3.jpg",
            level: "Eco Champion",
          },
          likes: 1,
          createdAt: "2025-10-01T10:00:00Z",
          replies: [],
        },
      ],
    };

    if (!mockPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      data: mockPost,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/community/posts/:id/like
// @desc    Toggle like on post
// @access  Private
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    // Mock like toggle
    const isLiked = Math.random() > 0.5; // Random for demo
    const newLikeCount = isLiked ? 25 : 23;

    // Award points for engagement
    const pointsAwarded = isLiked ? 1 : 0;

    res.json({
      success: true,
      data: {
        isLiked,
        likeCount: newLikeCount,
        pointsAwarded,
      },
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/community/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post("/posts/:id/comments", auth, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { content, parentId } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Mock comment creation
    const newComment = {
      id: Date.now(),
      content,
      author: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
        level: req.user.level || "Eco Beginner",
      },
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    // Award points for commenting
    const pointsAwarded = 5;

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment: newComment,
        pointsAwarded,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/community/leaderboard
// @desc    Get community leaderboard
// @access  Public
router.get("/leaderboard", optionalAuth, async (req, res) => {
  try {
    const { period = "monthly", limit = 10 } = req.query;

    // Mock leaderboard data
    const mockLeaderboard = [
      {
        rank: 1,
        user: {
          id: "user789",
          name: "Budi Santoso",
          avatar: "https://example.com/avatar3.jpg",
          level: "Eco Champion",
          city: "Surabaya",
        },
        points: 3450,
        classificationsCount: 245,
        postsCount: 18,
        badgesCount: 12,
        trend: "up",
      },
      {
        rank: 2,
        user: {
          id: "user456",
          name: "Maya Sari",
          avatar: "https://example.com/avatar2.jpg",
          level: "Green Master",
          city: "Bandung",
        },
        points: 2890,
        classificationsCount: 201,
        postsCount: 23,
        badgesCount: 9,
        trend: "up",
      },
      {
        rank: 3,
        user: {
          id: "user321",
          name: "Sari Indah",
          avatar: "https://example.com/avatar4.jpg",
          level: "Eco Warrior",
          city: "Yogyakarta",
        },
        points: 2650,
        classificationsCount: 189,
        postsCount: 15,
        badgesCount: 8,
        trend: "same",
      },
      {
        rank: 4,
        user: {
          id: "user654",
          name: "Riko Pratama",
          avatar: "https://example.com/avatar5.jpg",
          level: "Eco Warrior",
          city: "Medan",
        },
        points: 2340,
        classificationsCount: 156,
        postsCount: 12,
        badgesCount: 7,
        trend: "down",
      },
      {
        rank: 5,
        user: {
          id: "user123",
          name: "Andi Pratama",
          avatar: "https://example.com/avatar1.jpg",
          level: "Eco Warrior",
          city: "Jakarta",
        },
        points: 2100,
        classificationsCount: 145,
        postsCount: 15,
        badgesCount: 6,
        trend: "up",
      },
    ];

    // Apply limit
    const limitedLeaderboard = mockLeaderboard.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        leaderboard: limitedLeaderboard,
        period,
        totalParticipants: 1247,
        userRank: req.user ? 8 : null,
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/community/challenges
// @desc    Get active challenges
// @access  Public
router.get("/challenges", optionalAuth, async (req, res) => {
  try {
    // Mock challenges data
    const mockChallenges = [
      {
        id: 1,
        title: "Zero Waste Week Challenge",
        description:
          "Cobalah hidup tanpa menghasilkan sampah anorganik selama satu minggu penuh!",
        type: "weekly",
        difficulty: "hard",
        points: 100,
        badge: {
          name: "Zero Waste Hero",
          icon: "🌍",
          color: "#10B981",
        },
        requirements: [
          "Tidak menghasilkan sampah plastik",
          "Menggunakan tas belanja reusable",
          "Menghindari kemasan sekali pakai",
          "Upload foto progress setiap hari",
        ],
        participants: 324,
        startDate: "2025-10-01T00:00:00Z",
        endDate: "2025-10-07T23:59:59Z",
        status: "active",
        progress: req.user
          ? {
              joined: true,
              completedTasks: 3,
              totalTasks: 7,
              currentStreak: 3,
            }
          : null,
      },
      {
        id: 2,
        title: "Eco Brick Master",
        description:
          "Buat 10 eco brick dalam sebulan untuk membantu mengurangi sampah plastik",
        type: "monthly",
        difficulty: "medium",
        points: 75,
        badge: {
          name: "Eco Brick Builder",
          icon: "🧱",
          color: "#F59E0B",
        },
        requirements: [
          "Buat minimal 10 eco brick",
          "Setiap eco brick minimal 200 gram",
          "Upload foto setiap eco brick",
          "Share tips pembuatan di komunitas",
        ],
        participants: 156,
        startDate: "2025-10-01T00:00:00Z",
        endDate: "2025-10-31T23:59:59Z",
        status: "active",
        progress: req.user
          ? {
              joined: false,
              completedTasks: 0,
              totalTasks: 10,
              currentStreak: 0,
            }
          : null,
      },
      {
        id: 3,
        title: "Green Commute Challenge",
        description: "Gunakan transportasi ramah lingkungan selama 30 hari",
        type: "monthly",
        difficulty: "easy",
        points: 50,
        badge: {
          name: "Green Commuter",
          icon: "🚲",
          color: "#3B82F6",
        },
        requirements: [
          "Gunakan sepeda/jalan kaki minimal 3x seminggu",
          "Gunakan transportasi umum",
          "Hindari kendaraan pribadi",
          "Catat jejak karbon harian",
        ],
        participants: 892,
        startDate: "2025-10-01T00:00:00Z",
        endDate: "2025-10-31T23:59:59Z",
        status: "active",
        progress: req.user
          ? {
              joined: true,
              completedTasks: 8,
              totalTasks: 30,
              currentStreak: 4,
            }
          : null,
      },
    ];

    const { status = "active", type, limit = 10 } = req.query;

    let filteredChallenges = mockChallenges;

    if (status) {
      filteredChallenges = filteredChallenges.filter(
        (challenge) => challenge.status === status
      );
    }

    if (type) {
      filteredChallenges = filteredChallenges.filter(
        (challenge) => challenge.type === type
      );
    }

    filteredChallenges = filteredChallenges.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        challenges: filteredChallenges,
        totalActive: mockChallenges.filter((c) => c.status === "active").length,
      },
    });
  } catch (error) {
    console.error("Get challenges error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/community/challenges/:id/join
// @desc    Join a challenge
// @access  Private
router.post("/challenges/:id/join", auth, async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);

    // Mock join challenge
    const challenge = {
      id: challengeId,
      title: "Zero Waste Week Challenge",
      joined: true,
      joinedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: "Successfully joined challenge",
      data: challenge,
    });
  } catch (error) {
    console.error("Join challenge error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

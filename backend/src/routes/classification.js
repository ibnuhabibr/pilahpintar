const express = require("express");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const Classification = require("../models/Classification");
const User = require("../models/User");
const { auth, optionalAuth } = require("../middleware/auth");
const classificationService = require("../services/classificationService");
const imageUploadService = require("../services/imageUploadService");

const router = express.Router();

// @route   POST /api/classification
// @desc    Create new waste classification (simplified)
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { wasteType, confidence, imageUrl, location } = req.body;

    // Validate required fields
    if (!wasteType || !confidence) {
      return res.status(400).json({
        success: false,
        message: "wasteType and confidence are required",
      });
    }

    // Map wasteType to valid category
    const categoryMap = {
      plastic: "plastic_bottle",
      paper: "paper",
      organic: "organic",
      metal: "metal",
      glass: "glass",
      electronic: "electronic",
      textile: "textile",
      hazardous: "hazardous",
    };

    const category = categoryMap[wasteType] || "plastic_bottle";

    // Create classification with all required fields
    const classification = new Classification({
      user: req.user.id,
      imageUrl: imageUrl || "https://example.com/default-image.jpg",
      imagePublicId: `test_${Date.now()}`,
      result: {
        category: category,
        confidence: confidence,
        recyclable: category !== "hazardous" && category !== "organic",
        description: `Classified as ${wasteType} with ${confidence}% confidence`,
      },
      location: location || {
        type: "Point",
        coordinates: [106.8456, -6.2088], // [longitude, latitude] format untuk GeoJSON
        address: "Jakarta, Indonesia",
      },
      // feedback akan menggunakan default values dari schema
      metadata: {
        processingTime: Math.floor(Math.random() * 1000) + 500,
        modelVersion: "1.0.0",
        deviceInfo: {
          userAgent: req.headers["user-agent"] || "Unknown",
          platform: "web",
        },
      },
    });

    await classification.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        "profile.points": 10,
        "profile.totalScans": 1,
      },
    });

    res.status(201).json({
      success: true,
      message: "Classification created successfully",
      classification: {
        _id: classification._id,
        wasteType: wasteType,
        confidence: confidence,
        location: classification.location,
        createdAt: classification.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating classification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create classification",
      error: error.message,
    });
  }
}); // Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (
      process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/jpg"
    ).split(",");
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."),
        false
      );
    }
  },
});

// @route   POST /api/classification/classify
// @desc    Classify waste image
// @access  Private
router.post(
  "/classify",
  auth,
  upload.single("image"),
  [
    body("location.latitude")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    body("location.longitude")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    body("location.address")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Address cannot exceed 200 characters"),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const startTime = Date.now();

      try {
        // Upload image to cloud storage
        const uploadResult = await imageUploadService.uploadImage(req.file);

        // Classify the image using AI service
        const classificationResult = await classificationService.classifyImage(
          req.file.buffer
        );

        const processingTime = Date.now() - startTime;

        // Prepare location data
        let locationData = null;
        if (
          req.body.location &&
          req.body.location.latitude &&
          req.body.location.longitude
        ) {
          locationData = {
            type: "Point",
            coordinates: [
              parseFloat(req.body.location.longitude),
              parseFloat(req.body.location.latitude),
            ],
            address: req.body.location.address || "",
            city: req.body.location.city || "",
            province: req.body.location.province || "",
          };
        }

        // Calculate points based on confidence and category
        let pointsAwarded = 10; // Base points
        if (classificationResult.confidence >= 90) pointsAwarded += 5;
        if (classificationResult.recyclable) pointsAwarded += 3;

        // Save classification to database
        const classification = new Classification({
          user: req.user._id,
          imageUrl: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id,
          result: classificationResult,
          location: locationData,
          metadata: {
            deviceInfo: {
              userAgent: req.get("User-Agent"),
              platform: req.get("Sec-Ch-Ua-Platform") || "unknown",
              isMobile: req.get("User-Agent")?.includes("Mobile") || false,
            },
            imageInfo: {
              originalName: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype,
            },
            processingTime,
            modelVersion: "1.0.0",
          },
          pointsAwarded,
        });

        await classification.save();

        // Update user points and stats
        const user = await User.findById(req.user._id);
        user.addPoints(pointsAwarded, "classification");
        const newBadges = user.checkAndAddBadges();
        await user.save();

        // Populate the result with user data
        await classification.populate("user", "name profile.level");

        res.status(201).json({
          success: true,
          message: "Image classified successfully",
          data: {
            classification: {
              id: classification._id,
              result: classification.result,
              location: classification.location,
              pointsAwarded: classification.pointsAwarded,
              processingTime: classification.metadata.processingTime,
              createdAt: classification.createdAt,
            },
            userUpdate: {
              pointsEarned: pointsAwarded,
              totalPoints: user.profile.points,
              newLevel: user.profile.level,
              newBadges: newBadges,
            },
          },
        });
      } catch (uploadError) {
        console.error("Classification processing error:", uploadError);
        res.status(500).json({
          success: false,
          message: "Error processing image",
          error: uploadError.message,
        });
      }
    } catch (error) {
      console.error("Classification error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during classification",
      });
    }
  }
);

// @route   GET /api/classification/history
// @desc    Get user's classification history
// @access  Private
router.get("/history", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    // Add category filter if provided
    if (req.query.category) {
      filter["result.category"] = req.query.category;
    }

    // Add date range filter if provided
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const classifications = await Classification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name profile.level")
      .select("-imagePublicId -metadata.deviceInfo -flags");

    const total = await Classification.countDocuments(filter);

    res.json({
      success: true,
      data: {
        classifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/classification/:id
// @desc    Get specific classification
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const classification = await Classification.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name profile.level avatar");

    if (!classification) {
      return res.status(404).json({
        success: false,
        message: "Classification not found",
      });
    }

    res.json({
      success: true,
      data: classification,
    });
  } catch (error) {
    console.error("Get classification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/classification/:id/feedback
// @desc    Submit feedback for classification
// @access  Private
router.post(
  "/:id/feedback",
  auth,
  [
    body("isCorrect").isBoolean().withMessage("isCorrect must be a boolean"),
    body("actualCategory")
      .optional()
      .isIn([
        "plastic_bottle",
        "paper",
        "organic",
        "metal",
        "glass",
        "electronic",
        "textile",
        "hazardous",
      ])
      .withMessage("Invalid category"),
    body("comment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Comment cannot exceed 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { isCorrect, actualCategory, comment } = req.body;

      const classification = await Classification.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!classification) {
        return res.status(404).json({
          success: false,
          message: "Classification not found",
        });
      }

      // Check if feedback already submitted
      if (classification.feedback.submittedAt) {
        return res.status(400).json({
          success: false,
          message: "Feedback already submitted for this classification",
        });
      }

      // Update feedback
      await classification.updateFeedback(isCorrect, actualCategory, comment);
      await classification.save();

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        data: {
          feedback: classification.feedback,
        },
      });
    } catch (error) {
      console.error("Submit feedback error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/classification/stats/overview
// @desc    Get classification statistics
// @access  Private
router.get("/stats/overview", auth, async (req, res) => {
  try {
    // Get user's classification stats
    const userStats = await Classification.getStatistics({
      user: req.user._id,
    });

    // Get monthly breakdown for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Classification.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          points: { $sum: "$pointsAwarded" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get recent classifications
    const recentClassifications = await Classification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("result.category result.confidence pointsAwarded createdAt");

    res.json({
      success: true,
      data: {
        overview: userStats,
        monthlyBreakdown: monthlyStats,
        recentActivity: recentClassifications,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/classification/:id
// @desc    Delete classification
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const classification = await Classification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!classification) {
      return res.status(404).json({
        success: false,
        message: "Classification not found",
      });
    }

    // Delete image from cloud storage
    await imageUploadService.deleteImage(classification.imagePublicId);

    // Delete classification from database
    await Classification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Classification deleted successfully",
    });
  } catch (error) {
    console.error("Delete classification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

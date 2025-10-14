const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Classification = require("../models/Classification");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    // Get additional stats
    const totalClassifications = await Classification.countDocuments({
      user: req.user._id,
    });
    const correctClassifications = await Classification.countDocuments({
      user: req.user._id,
      "feedback.isCorrect": true,
    });

    const accuracyRate =
      totalClassifications > 0
        ? Math.round((correctClassifications / totalClassifications) * 100)
        : 0;

    res.json({
      success: true,
      data: {
        user,
        stats: {
          totalClassifications,
          correctClassifications,
          accuracyRate,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("phone")
      .optional()
      .matches(/^(\+62|62|0)8[1-9][0-9]{6,9}$/)
      .withMessage("Please enter a valid Indonesian phone number"),
    body("location")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Location cannot exceed 100 characters"),
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

      const { name, phone, location } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (location !== undefined) updateData.location = location;

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put(
  "/preferences",
  auth,
  [
    body("notifications.email")
      .optional()
      .isBoolean()
      .withMessage("Email notification must be boolean"),
    body("notifications.challenges")
      .optional()
      .isBoolean()
      .withMessage("Challenge notification must be boolean"),
    body("notifications.achievements")
      .optional()
      .isBoolean()
      .withMessage("Achievement notification must be boolean"),
    body("privacy.shareStats")
      .optional()
      .isBoolean()
      .withMessage("Share stats must be boolean"),
    body("privacy.showInLeaderboard")
      .optional()
      .isBoolean()
      .withMessage("Show in leaderboard must be boolean"),
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

      const user = await User.findById(req.user._id);

      // Update preferences
      if (req.body.notifications) {
        Object.assign(user.preferences.notifications, req.body.notifications);
      }

      if (req.body.privacy) {
        Object.assign(user.preferences.privacy, req.body.privacy);
      }

      await user.save();

      res.json({
        success: true,
        message: "Preferences updated successfully",
        data: user.preferences,
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    // Get classification stats
    const totalClassifications = await Classification.countDocuments({
      user: req.user._id,
    });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayClassifications = await Classification.countDocuments({
      user: req.user._id,
      createdAt: { $gte: todayStart },
    });

    // Get weekly progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyClassifications = await Classification.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get category breakdown
    const categoryBreakdown = await Classification.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$result.category",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$result.confidence" },
        },
      },
    ]);

    // Get recent activity
    const recentActivity = await Classification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("result.category result.confidence pointsAwarded createdAt");

    // Calculate accuracy if feedback exists
    const withFeedback = await Classification.countDocuments({
      user: req.user._id,
      "feedback.isCorrect": { $ne: null },
    });

    const correctFeedback = await Classification.countDocuments({
      user: req.user._id,
      "feedback.isCorrect": true,
    });

    const accuracyRate =
      withFeedback > 0
        ? Math.round((correctFeedback / withFeedback) * 100)
        : null;

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          location: user.location,
          profile: user.profile,
        },
        stats: {
          totalClassifications,
          todayClassifications,
          accuracyRate,
          totalPoints: user.profile.points,
          currentLevel: user.profile.level,
          currentStreak: user.profile.currentStreak,
          longestStreak: user.profile.longestStreak,
        },
        charts: {
          weeklyProgress: weeklyClassifications,
          categoryBreakdown: categoryBreakdown,
        },
        recentActivity,
        badges: user.profile.badges.slice(-5), // Last 5 badges
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/user/badges
// @desc    Get user badges and achievements
// @access  Private
router.get("/badges", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "profile.badges profile.achievements"
    );

    // Get available badges (system-defined)
    const availableBadges = [
      {
        name: "First Scan",
        description: "Complete your first waste classification",
        icon: "🎯",
        category: "milestone",
        requirement: "Complete 1 scan",
      },
      {
        name: "Plastic Warrior",
        description: "Classify 50 plastic items",
        icon: "♻️",
        category: "category",
        requirement: "Classify 50 plastic items",
      },
      {
        name: "Paper Champion",
        description: "Classify 30 paper items",
        icon: "📄",
        category: "category",
        requirement: "Classify 30 paper items",
      },
      {
        name: "Week Warrior",
        description: "Maintain a 7-day scanning streak",
        icon: "🔥",
        category: "streak",
        requirement: "Scan daily for 7 days",
      },
      {
        name: "Point Master",
        description: "Earn 1000 points",
        icon: "💎",
        category: "points",
        requirement: "Earn 1000 points",
      },
      {
        name: "Eco Master",
        description: "Reach Eco Master level",
        icon: "🌱",
        category: "level",
        requirement: "Reach Eco Master level",
      },
    ];

    // Calculate progress for unearned badges
    const earnedBadgeNames = user.profile.badges.map((b) => b.name);

    const badgesWithProgress = availableBadges.map((badge) => {
      const earned = earnedBadgeNames.includes(badge.name);
      let progress = 0;

      if (!earned) {
        // Calculate progress based on current stats
        switch (badge.name) {
          case "First Scan":
            progress = user.profile.totalScans >= 1 ? 100 : 0;
            break;
          case "Week Warrior":
            progress = Math.min((user.profile.currentStreak / 7) * 100, 100);
            break;
          case "Point Master":
            progress = Math.min((user.profile.points / 1000) * 100, 100);
            break;
          // Add more badge progress calculations as needed
          default:
            progress = 0;
        }
      }

      return {
        ...badge,
        earned,
        progress: earned ? 100 : Math.round(progress),
        earnedAt: earned
          ? user.profile.badges.find((b) => b.name === badge.name)?.earnedAt
          : null,
      };
    });

    res.json({
      success: true,
      data: {
        badges: badgesWithProgress,
        achievements: user.profile.achievements || [],
        summary: {
          totalBadges: availableBadges.length,
          earnedBadges: earnedBadgeNames.length,
          completionRate: Math.round(
            (earnedBadgeNames.length / availableBadges.length) * 100
          ),
        },
      },
    });
  } catch (error) {
    console.error("Get badges error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete(
  "/account",
  auth,
  [
    body("password")
      .notEmpty()
      .withMessage("Password is required to delete account"),
    body("confirmDelete")
      .equals("DELETE")
      .withMessage("Please type DELETE to confirm account deletion"),
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

      const { password } = req.body;

      // Verify password
      const user = await User.findById(req.user._id);
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }

      // Delete user's classifications and associated images
      const classifications = await Classification.find({ user: req.user._id });

      // In real implementation, delete images from cloud storage
      for (const classification of classifications) {
        // await imageUploadService.deleteImage(classification.imagePublicId);
      }

      // Delete classifications
      await Classification.deleteMany({ user: req.user._id });

      // Delete user account
      await User.findByIdAndDelete(req.user._id);

      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;

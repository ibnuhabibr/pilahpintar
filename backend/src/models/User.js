const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
        "Please enter a valid Indonesian phone number",
      ],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    profile: {
      level: {
        type: String,
        default: "Eco Beginner",
      },
      points: {
        type: Number,
        default: 0,
      },
      totalScans: {
        type: Number,
        default: 0,
      },
      correctClassifications: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastScanDate: {
        type: Date,
        default: null,
      },
      badges: [
        {
          name: String,
          earnedAt: Date,
          icon: String,
        },
      ],
      achievements: [
        {
          type: String,
          name: String,
          description: String,
          pointsEarned: Number,
          earnedAt: Date,
        },
      ],
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        challenges: {
          type: Boolean,
          default: true,
        },
        achievements: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        shareStats: {
          type: Boolean,
          default: true,
        },
        showInLeaderboard: {
          type: Boolean,
          default: true,
        },
      },
    },
    // OAuth fields
    oauthProvider: {
      type: String,
      enum: ["google", "facebook"],
      required: false,
    },
    oauthId: {
      type: String,
      required: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Index untuk performa
userSchema.index({ email: 1 });
userSchema.index({ "profile.points": -1 });
userSchema.index({ location: 1 });

// Hash password sebelum save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method untuk update level berdasarkan points
userSchema.methods.updateLevel = function () {
  const points = this.profile.points;

  if (points >= 5000) {
    this.profile.level = "Eco Master";
  } else if (points >= 3000) {
    this.profile.level = "Eco Champion";
  } else if (points >= 1500) {
    this.profile.level = "Eco Warrior";
  } else if (points >= 500) {
    this.profile.level = "Eco Hero";
  } else if (points >= 100) {
    this.profile.level = "Eco Explorer";
  } else {
    this.profile.level = "Eco Beginner";
  }
};

// Method untuk add points dan update streak
userSchema.methods.addPoints = function (points, scanType = "classification") {
  this.profile.points += points;
  this.profile.totalScans += 1;

  // Update streak
  const today = new Date();
  const lastScan = this.profile.lastScanDate;

  if (lastScan) {
    const daysDiff = Math.floor((today - lastScan) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      this.profile.currentStreak += 1;
    } else if (daysDiff > 1) {
      this.profile.currentStreak = 1;
    }
  } else {
    this.profile.currentStreak = 1;
  }

  if (this.profile.currentStreak > this.profile.longestStreak) {
    this.profile.longestStreak = this.profile.currentStreak;
  }

  this.profile.lastScanDate = today;
  this.updateLevel();
};

// Method untuk check dan add badges
userSchema.methods.checkAndAddBadges = function () {
  const newBadges = [];
  const existingBadges = this.profile.badges.map((b) => b.name);

  // First Scan Badge
  if (this.profile.totalScans >= 1 && !existingBadges.includes("First Scan")) {
    newBadges.push({ name: "First Scan", icon: "🎯", earnedAt: new Date() });
  }

  // Streak Badges
  if (
    this.profile.currentStreak >= 7 &&
    !existingBadges.includes("Week Warrior")
  ) {
    newBadges.push({ name: "Week Warrior", icon: "🔥", earnedAt: new Date() });
  }

  // Point Badges
  if (this.profile.points >= 1000 && !existingBadges.includes("Point Master")) {
    newBadges.push({ name: "Point Master", icon: "💎", earnedAt: new Date() });
  }

  // Add new badges
  this.profile.badges.push(...newBadges);
  return newBadges;
};

module.exports = mongoose.model("User", userSchema);

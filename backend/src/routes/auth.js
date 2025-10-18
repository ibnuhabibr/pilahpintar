const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
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
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { name, email, password, phone, location } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        phone,
        location,
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Return user data without password
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        profile: user.profile,
        role: user.role,
      };

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(400).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      // Check password
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = generateToken(user._id);

      // Return user data without password
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        profile: user.profile,
        role: user.role,
      };

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      location: req.user.location,
      profile: req.user.profile,
      preferences: req.user.preferences,
      role: req.user.role,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
    };

    res.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

router.get("/profile", auth, getCurrentUser);
router.get("/me", auth, getCurrentUser);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post(
  "/change-password",
  auth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
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

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id);

      // Check current password
      const isPasswordMatch = await user.comparePassword(currentPassword);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", auth, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// @route   POST /api/auth/oauth
// @desc    Handle OAuth login (Google, etc.)
// @access  Public
router.post(
  "/oauth",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("name")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Name is required"),
    body("provider")
      .isIn(["google", "facebook"])
      .withMessage("Invalid provider"),
    body("providerId")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Provider ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email, name, provider, providerId } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        // Update OAuth info if user exists
        user.oauthProvider = provider;
        user.oauthId = providerId;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Create new user with try-catch to handle duplicate key error
        try {
          user = await User.create({
            name,
            email,
            password: Math.random().toString(36), // Random password for OAuth users
            oauthProvider: provider,
            oauthId: providerId,
            isEmailVerified: true, // OAuth emails are already verified
            lastLogin: new Date(),
          });
        } catch (createError) {
          // If duplicate key error, try to find the user again (race condition)
          if (createError.code === 11000) {
            user = await User.findOne({ email });
            if (user) {
              // Update OAuth info
              user.oauthProvider = provider;
              user.oauthId = providerId;
              user.lastLogin = new Date();
              await user.save();
            } else {
              throw createError;
            }
          } else {
            throw createError;
          }
        }
      }

      // Generate JWT token
      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          oauthProvider: user.oauthProvider,
        },
      });
    } catch (error) {
      console.error("OAuth login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during OAuth login",
      });
    }
  }
);

// ============================================
// FORGOT PASSWORD - Send Reset Email
// ============================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists (security)
      return res.status(200).json({
        success: true,
        message: "If account exists, reset email will be sent",
      });
    }

    // Generate 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to database (expires in 1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log("Password reset requested for:", user.email);
    console.log("Reset code:", resetToken);

    // Send email via Brevo
    const brevo = require("@getbrevo/brevo");
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Reset Password - PilahPintar";
    sendSmtpEmail.to = [{ email: user.email, name: user.name }];
    sendSmtpEmail.sender = {
      name: "PilahPintar",
      email: "noreply@pilahpintar.site",
    };
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10B981; margin: 0;">🔒 Reset Password</h1>
        </div>

        <div style="background-color: #f9fafb; padding: 25px; border-radius: 10px; border-left: 4px solid #10B981;">
          <p style="font-size: 16px; color: #374151; margin-top: 0;">Halo <strong>${user.name}</strong>,</p>

          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            Anda meminta untuk reset password akun PilahPintar. Gunakan kode berikut:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <h1 style="color: #10B981; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">
              ${resetToken}
            </h1>
          </div>

          <p style="font-size: 13px; color: #9ca3af;">
            Atau klik link berikut untuk reset password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}"
               style="display: inline-block; padding: 12px 30px; background-color: #10B981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Reset Password
            </a>
          </div>
        </div>

        <div style="margin-top: 25px; padding: 15px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
          <p style="font-size: 13px; color: #991b1b; margin: 0; font-weight: 600;">
            ⏰ Kode ini akan kadaluarsa dalam 1 jam.
          </p>
          <p style="font-size: 12px; color: #991b1b; margin: 8px 0 0 0;">
            Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
        </div>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;">

        <div style="text-align: center;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Email dari PilahPintar - Memilah Sampah dengan Cerdas 🌱
          </p>
        </div>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Reset email sent successfully to:", user.email);

    res.json({
      success: true,
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reset email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ============================================
// RESET PASSWORD - Update with Token
// ============================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the token to compare with database
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    console.log("Resetting password for user:", user.email);

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password reset successful for:", user.email);

    res.json({
      success: true,
      message: "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;

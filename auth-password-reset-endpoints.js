// ============================================
// FORGOT PASSWORD & RESET PASSWORD ENDPOINTS
// ADD THIS CODE TO: backend/src/routes/auth.js
// ============================================

// Add at the top with other requires
const crypto = require("crypto");
const brevo = require("@getbrevo/brevo");

// Add these routes BEFORE the module.exports line at the bottom

/**
 * @route   POST /auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link will be sent.",
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log("Password reset requested for:", user.email);
    console.log("Reset token generated (expires in 1 hour)");

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || "https://pilahpintar.site";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Send email via Brevo
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
            Kami menerima permintaan untuk mereset password akun PilahPintar Anda.
          </p>

          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            Klik tombol di bawah ini untuk membuat password baru:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="display: inline-block; padding: 14px 32px; background-color: #10B981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 13px; color: #9ca3af; line-height: 1.5;">
            Atau copy dan paste link berikut ke browser Anda:
          </p>
          <p style="font-size: 12px; color: #10B981; word-break: break-all; background-color: white; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
          <p style="font-size: 13px; color: #991b1b; margin: 0; font-weight: 600;">
            ⏰ Link ini akan kadaluarsa dalam 1 jam.
          </p>
          <p style="font-size: 12px; color: #991b1b; margin: 10px 0 0 0;">
            Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

        <div style="text-align: center;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Email otomatis dari PilahPintar
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0 0;">
            Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari 🌱
          </p>
        </div>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Reset email sent successfully to:", user.email);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reset email. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash token to compare with database
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
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    console.log("Resetting password for user:", user.email);

    // Hash new password
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password reset successful for:", user.email);

    // Optional: Send confirmation email
    try {
      const apiInstance = new brevo.TransactionalEmailsApi();
      apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
      );

      const confirmEmail = new brevo.SendSmtpEmail();
      confirmEmail.subject = "Password Changed Successfully - PilahPintar";
      confirmEmail.to = [{ email: user.email, name: user.name }];
      confirmEmail.sender = {
        name: "PilahPintar",
        email: "noreply@pilahpintar.site",
      };
      confirmEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10B981; margin: 0;">✅ Password Berhasil Diubah</h1>
          </div>

          <div style="background-color: #f0fdf4; padding: 25px; border-radius: 10px; border-left: 4px solid #10B981;">
            <p style="font-size: 16px; color: #374151; margin-top: 0;">Halo <strong>${
              user.name
            }</strong>,</p>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              Password akun PilahPintar Anda telah berhasil diubah pada <strong>${new Date().toLocaleString(
                "id-ID"
              )}</strong>.
            </p>

            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              Anda sekarang dapat login menggunakan password baru Anda.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://pilahpintar.site/login"
                 style="display: inline-block; padding: 14px 32px; background-color: #10B981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Login Sekarang
              </a>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
            <p style="font-size: 13px; color: #991b1b; margin: 0; font-weight: 600;">
              ⚠️ Jika Anda tidak melakukan perubahan ini:
            </p>
            <p style="font-size: 12px; color: #991b1b; margin: 10px 0 0 0;">
              Segera hubungi kami atau ubah password Anda lagi untuk mengamankan akun.
            </p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

          <div style="text-align: center;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Email otomatis dari PilahPintar
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 5px 0 0 0;">
              Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari 🌱
            </p>
          </div>
        </div>
      `;

      await apiInstance.sendTransacEmail(confirmEmail);
      console.log("Confirmation email sent to:", user.email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Keep the existing module.exports at the bottom of the file

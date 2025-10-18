// ============================================
// USER MODEL UPDATE - Add Password Reset Fields
// UPDATE FILE: backend/src/models/User.js
// ============================================

// Find the userSchema definition and ADD these fields:

const userSchema = new mongoose.Schema(
  {
    // ... (existing fields like name, email, password, etc.) ...

    // ========================================
    // ADD THESE NEW FIELDS FOR PASSWORD RESET
    // ========================================
    resetPasswordToken: {
      type: String,
      required: false,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
      default: undefined,
    },
    // ========================================
  },
  {
    timestamps: true, // This should already exist
  }
);

// Rest of the file remains the same...

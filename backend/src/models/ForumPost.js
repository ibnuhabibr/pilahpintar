const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  category: {
    type: String,
    enum: ["general", "tips", "pengalaman", "lokasi", "tanya-jawab", "berita"],
    default: "general",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [replySchema],
  tags: [
    {
      type: String,
      maxlength: 30,
    },
  ],
  isPinned: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index untuk performa
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });
forumPostSchema.index({ tags: 1 });
forumPostSchema.index({ createdAt: -1 });

// Update updatedAt setiap kali dokumen dimodifikasi
forumPostSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual untuk jumlah replies
forumPostSchema.virtual("replyCount").get(function () {
  return this.replies ? this.replies.length : 0;
});

// Virtual untuk jumlah likes
forumPostSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Ensure virtual fields are serialised
forumPostSchema.set("toJSON", { virtuals: true });
forumPostSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("ForumPost", forumPostSchema);

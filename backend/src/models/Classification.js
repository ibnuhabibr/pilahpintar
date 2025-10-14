const mongoose = require("mongoose");

const classificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Image storage info
    imagePath: {
      type: String,
      required: true, // Local file path for processing
    },
    imageUrl: {
      type: String,
      required: true, // Public URL for frontend
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    // Legacy cloudinary support (optional)
    imagePublicId: {
      type: String, // Cloudinary public ID untuk delete
      required: false,
    },
    // Classification results
    wasteType: {
      type: String,
      required: true,
      enum: ["organic", "plastic", "paper", "glass", "metal"],
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    suggestions: {
      type: String,
      required: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
    // Legacy result format (optional backward compatibility)
    result: {
      category: {
        type: String,
        required: false,
        enum: [
          "plastic_bottle",
          "paper",
          "organic",
          "metal",
          "glass",
          "electronic",
          "textile",
          "hazardous",
        ],
      },
      subCategory: {
        type: String,
        trim: true,
      },
      confidence: {
        type: Number,
        required: false,
        min: 0,
        max: 100,
      },
      recyclable: {
        type: Boolean,
        required: false,
      },
      description: {
        type: String,
        trim: true,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
      address: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
      },
    },
    metadata: {
      deviceInfo: {
        userAgent: String,
        platform: String,
        isMobile: Boolean,
      },
      imageInfo: {
        originalName: String,
        size: Number,
        mimetype: String,
        dimensions: {
          width: Number,
          height: Number,
        },
      },
      processingTime: {
        type: Number, // in milliseconds
        default: 0,
      },
      modelVersion: {
        type: String,
        default: "1.0.0",
      },
    },
    feedback: {
      isCorrect: {
        type: Boolean,
        default: null,
      },
      actualCategory: {
        type: String,
        enum: [
          "plastic_bottle",
          "paper",
          "organic",
          "metal",
          "glass",
          "electronic",
          "textile",
          "hazardous",
          null,
        ],
        default: null,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      submittedAt: {
        type: Date,
        default: null,
      },
    },
    pointsAwarded: {
      type: Number,
      default: 10,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    flags: {
      inappropriate: {
        type: Boolean,
        default: false,
      },
      lowQuality: {
        type: Boolean,
        default: false,
      },
      flaggedBy: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          reason: String,
          flaggedAt: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes untuk performa
classificationSchema.index({ user: 1, createdAt: -1 });
classificationSchema.index({ "result.category": 1 });
classificationSchema.index({ "location.coordinates": "2dsphere" });
classificationSchema.index({ createdAt: -1 });
classificationSchema.index({ "result.confidence": -1 });

// Virtual untuk accuracy rate
classificationSchema.virtual("accuracyRate").get(function () {
  if (this.feedback.isCorrect === null) return null;
  return this.feedback.isCorrect ? 100 : 0;
});

// Static method untuk mendapatkan statistik klasifikasi
classificationSchema.statics.getStatistics = async function (filter = {}) {
  const pipeline = [
    { $match: filter },
    {
      $group: {
        _id: null,
        totalClassifications: { $sum: 1 },
        averageConfidence: { $avg: "$result.confidence" },
        categoryBreakdown: {
          $push: "$result.category",
        },
        recyclableCount: {
          $sum: { $cond: ["$result.recyclable", 1, 0] },
        },
      },
    },
    {
      $addFields: {
        categoryStats: {
          $reduce: {
            input: "$categoryBreakdown",
            initialValue: {},
            in: {
              $mergeObjects: [
                "$$value",
                {
                  $arrayToObject: [
                    [
                      {
                        k: "$$this",
                        v: {
                          $add: [
                            {
                              $ifNull: [
                                {
                                  $getField: {
                                    input: "$$value",
                                    field: "$$this",
                                  },
                                },
                                0,
                              ],
                            },
                            1,
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
            },
          },
        },
      },
    },
  ];

  const result = await this.aggregate(pipeline);
  return (
    result[0] || {
      totalClassifications: 0,
      averageConfidence: 0,
      categoryStats: {},
      recyclableCount: 0,
    }
  );
};

// Method untuk update feedback
classificationSchema.methods.updateFeedback = function (
  isCorrect,
  actualCategory = null,
  comment = ""
) {
  this.feedback.isCorrect = isCorrect;
  this.feedback.actualCategory = actualCategory;
  this.feedback.comment = comment;
  this.feedback.submittedAt = new Date();

  // Update user's correct classifications count
  if (isCorrect) {
    return this.model("User").findByIdAndUpdate(this.user, {
      $inc: { "profile.correctClassifications": 1 },
    });
  }
};

module.exports = mongoose.model("Classification", classificationSchema);

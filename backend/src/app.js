const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Close server gracefully
  if (global.server) {
    global.server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

const app = express();

// Trust proxy for development (needed for rate limiting)
if (process.env.NODE_ENV === "development") {
  app.set("trust proxy", 1);
}

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://pilahpintar.vercel.app",
  "https://pilahpintar-beige.vercel.app",
  "https://pilahpintar-frontend.vercel.app",
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      // In development, allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      if (
        allowedOrigins.some(
          (allowedOrigin) =>
            allowedOrigin === origin ||
            (allowedOrigin.includes("vercel.app") &&
              origin.includes("vercel.app"))
        )
      ) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving for uploaded images
app.use("/uploads", express.static("uploads"));

// Health check routes
const healthResponse = (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    success: true,
    message: "PilahPintar API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: dbStatus,
  });
};

app.get("/health", healthResponse);
app.get("/api/health", healthResponse);

// Routes
const authRoutes = require("./routes/auth");
const classificationRoutes = require("./routes/classification");
const userRoutes = require("./routes/user");
const wasteMapRoutes = require("./routes/wasteMap");
const educationRoutes = require("./routes/education");
const communityRoutes = require("./routes/community");
const uploadRoutes = require("./routes/upload");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/classification", classificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/waste-map", wasteMapRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/upload", uploadRoutes);

// Root route handler
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌱 PilahPintar Backend API",
    tagline: "Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      docs: "https://github.com/ibnuhabibr/pilahpintar",
    },
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection with retry logic
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/pilahpintar";

    // Connection options
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      heartbeatFrequencyMS: 5000, // 5 seconds
      maxPoolSize: 10,
      bufferCommands: false,
    };

    await mongoose.connect(mongoURI, options);
    console.log("📦 MongoDB connected successfully");

    // Connection event handlers
    mongoose.connection.on("connected", () => {
      console.log("📦 Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  Mongoose disconnected from MongoDB");
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // In development, we'll continue without database
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.log("⚠️  Continuing in development mode without database");
    }
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 PilahPintar API server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      }
    });

    // Store server reference globally for graceful shutdown
    global.server = server;

    // Handle server errors
    server.on("error", (error) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
        default:
          throw error;
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  try {
    await mongoose.connection.close();
    console.log("📦 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  try {
    await mongoose.connection.close();
    console.log("📦 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

// Start the server untuk development
if (process.env.NODE_ENV !== "production") {
  startServer();
}

// Export untuk Vercel serverless
module.exports = app;

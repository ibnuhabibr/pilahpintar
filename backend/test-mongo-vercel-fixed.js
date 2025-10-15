// Test MongoDB connection
require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    console.log("=== MongoDB Connection Test ===");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log(
      "MONGODB_URI (first 50 chars):",
      process.env.MONGODB_URI?.substring(0, 50)
    );

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set!");
    }

    const options = {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1,
      bufferCommands: false,
    };

    console.log("\nAttempting to connect...");
    await mongoose.connect(process.env.MONGODB_URI, options);

    console.log("✅ MongoDB connected successfully!");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.db.databaseName);

    await mongoose.connection.close();
    console.log("\n✅ Test completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Connection failed:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    process.exit(1);
  }
};

testConnection();

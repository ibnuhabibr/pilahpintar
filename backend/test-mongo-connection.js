const mongoose = require("mongoose");
require("dotenv").config();

const testConnection = async () => {
  try {
    console.log("🔌 Testing MongoDB Atlas connection...");
    console.log(
      `🌐 Connecting to: ${process.env.MONGODB_URI.replace(
        /\/\/.*@/,
        "//***:***@"
      )}`
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Atlas connection successful!");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔗 Ready State: ${mongoose.connection.readyState}`);

    // Test basic operations
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      `📁 Available collections: ${
        collections.map((c) => c.name).join(", ") || "None yet"
      }`
    );

    // Test write operation
    await mongoose.connection.db.collection("test").insertOne({
      message: "PilahPintar MongoDB Atlas connection test",
      timestamp: new Date(),
      status: "success",
    });
    console.log("✅ Test write operation successful!");

    await mongoose.connection.close();
    console.log("📴 Connection closed successfully");
    console.log("🎉 MongoDB Atlas is ready for PilahPintar!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);

    if (error.name === "MongoServerSelectionError") {
      console.error("💡 Troubleshooting tips:");
      console.error("   1. Check internet connection");
      console.error(
        "   2. Verify IP whitelist in Atlas (0.0.0.0/0 for development)"
      );
      console.error("   3. Check username/password in connection string");
      console.error("   4. Ensure cluster is not paused");
    }

    if (error.name === "MongoServerError" && error.code === 8000) {
      console.error("💡 Authentication error:");
      console.error("   1. Check database username and password");
      console.error("   2. Verify user has correct permissions");
    }
  }
};

testConnection();

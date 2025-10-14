const mongoose = require("mongoose");
require("dotenv").config();

// Import models - perlu dipastikan model files ada
const User = require("./src/models/User");
const Classification = require("./src/models/Classification");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding for PilahPintar...");

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing data (optional - untuk testing)
    // await User.deleteMany({});
    // await Classification.deleteMany({});
    // console.log('🧹 Cleared existing data');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log(
        `📊 Database already has ${existingUsers} users. Skipping seed.`
      );
      return;
    }

    // Create sample users untuk testing
    console.log("👥 Creating sample users...");

    const sampleUsers = [
      {
        name: "Andi Pratama",
        email: "andi@pilahpintar.com",
        password: "123456",
        phone: "081234567890",
        location: "Jakarta Selatan",
        role: "user",
        profile: {
          level: "Eco Warrior",
          points: 150,
          totalScans: 25,
          correctClassifications: 23,
          currentStreak: 7,
          longestStreak: 10,
          lastScanDate: new Date(),
          badges: [
            { name: "First Classification", earnedAt: new Date() },
            { name: "Eco Beginner", earnedAt: new Date() },
          ],
        },
      },
      {
        name: "Budi Santoso",
        email: "budi@pilahpintar.com",
        password: "123456",
        phone: "081987654321",
        location: "Surabaya Timur",
        role: "moderator",
        profile: {
          level: "Eco Champion",
          points: 300,
          totalScans: 50,
          correctClassifications: 47,
          currentStreak: 15,
          longestStreak: 20,
          lastScanDate: new Date(),
          badges: [
            { name: "Community Leader", earnedAt: new Date() },
            { name: "Waste Expert", earnedAt: new Date() },
          ],
        },
      },
      {
        name: "Ratna Dewi",
        email: "ratna@pilahpintar.com",
        password: "123456",
        phone: "081122334455",
        location: "Bandung Utara",
        role: "user",
        profile: {
          level: "Green Master",
          points: 200,
          totalScans: 35,
          correctClassifications: 33,
          currentStreak: 10,
          longestStreak: 12,
          lastScanDate: new Date(),
          badges: [{ name: "Educator", earnedAt: new Date() }],
        },
      },
    ];

    // Insert users
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} sample users`);

    // Create sample classifications
    console.log("📸 Creating sample classifications...");

    const sampleClassifications = [
      {
        user: users[0]._id,
        imageUrl: "/uploads/sample-bottle.jpg",
        imagePublicId: "sample-bottle-123",
        result: {
          category: "plastic_bottle",
          subCategory: "Botol PET",
          confidence: 95,
          recyclable: true,
          description: "Botol plastik bekas minuman kemasan",
        },
        location: {
          address: "Jakarta Selatan",
          coordinates: [-6.2088, 106.8456],
        },
        feedback: {
          actualCategory: "plastic_bottle",
          isCorrect: true,
          comment: "Klasifikasi benar",
        },
        pointsEarned: 10,
      },
      {
        user: users[1]._id,
        imageUrl: "/uploads/sample-paper.jpg",
        imagePublicId: "sample-paper-456",
        result: {
          category: "paper",
          subCategory: "Kardus",
          confidence: 88,
          recyclable: true,
          description: "Kardus bekas kemasan makanan",
        },
        location: {
          address: "Surabaya Timur",
          coordinates: [-7.2575, 112.7521],
        },
        feedback: {
          actualCategory: "paper",
          isCorrect: true,
          comment: "Klasifikasi benar",
        },
        pointsEarned: 10,
      },
      {
        user: users[2]._id,
        imageUrl: "/uploads/sample-can.jpg",
        imagePublicId: "sample-can-789",
        result: {
          category: "metal",
          subCategory: "Kaleng Aluminium",
          confidence: 92,
          recyclable: true,
          description: "Kaleng minuman bekas",
        },
        location: {
          address: "Bandung Utara",
          coordinates: [-6.9175, 107.6191],
        },
        feedback: {
          actualCategory: "metal",
          isCorrect: true,
          comment: "Klasifikasi benar",
        },
        pointsEarned: 15,
      },
    ];

    const classifications = await Classification.create(sampleClassifications);
    console.log(`✅ Created ${classifications.length} sample classifications`);

    // Update user stats
    for (const user of users) {
      const userClassifications = await Classification.find({
        user: user._id,
      });
      user.profile.totalScans = userClassifications.length;
      user.profile.points += userClassifications.reduce(
        (sum, c) => sum + c.pointsEarned,
        0
      );
      await user.save();
    }
    console.log("📊 Updated user statistics");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`👥 Users: ${users.length}`);
    console.log(`📸 Classifications: ${classifications.length}`);
    console.log("\n🌐 You can now test the PilahPintar application!");

    await mongoose.connection.close();
    console.log("📴 Database connection closed");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    if (error.name === "ValidationError") {
      console.error("💡 Check your model schemas");
    }
    process.exit(1);
  }
};

// Run seeding
seedDatabase();

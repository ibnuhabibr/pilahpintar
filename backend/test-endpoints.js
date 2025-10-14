const axios = require("axios");
const colors = require("colors");

const BASE_URL = "http://localhost:5000/api";
let authToken = null;

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  delay: 1000,
};

// Helper function to wait
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to make requests with retry
const makeRequest = async (config, retries = TEST_CONFIG.retries) => {
  try {
    const response = await axios({
      ...config,
      timeout: TEST_CONFIG.timeout,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...config.headers,
      },
    });
    return response;
  } catch (error) {
    if (
      retries > 0 &&
      (error.code === "ECONNREFUSED" || error.response?.status >= 500)
    ) {
      console.log(`   ⏳ Retrying... (${retries} attempts left)`.yellow);
      await wait(TEST_CONFIG.delay);
      return makeRequest(config, retries - 1);
    }
    throw error;
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log("\n🏥 Testing Health Check...".cyan.bold);
  try {
    const response = await makeRequest({
      method: "GET",
      url: "http://localhost:5000/health",
    });

    console.log("   ✅ Health check passed".green);
    console.log(`   📊 Status: ${response.status}`.gray);
    console.log(`   💾 Database: ${response.data.database}`.gray);
    return true;
  } catch (error) {
    console.log("   ❌ Health check failed".red);
    console.log(`   💥 Error: ${error.message}`.red);
    return false;
  }
};

const testUserRegistration = async () => {
  console.log("\n👤 Testing User Registration...".cyan.bold);
  try {
    const testUser = {
      name: "Test User API",
      email: `test.api.${Date.now()}@example.com`,
      password: "Test123!@#",
      location: {
        address: "Jakarta, Indonesia",
        coordinates: [-6.2088, 106.8456],
      },
    };

    const response = await makeRequest({
      method: "POST",
      url: `${BASE_URL}/auth/register`,
      data: testUser,
    });

    console.log("   ✅ User registration successful".green);
    console.log(`   📧 Email: ${testUser.email}`.gray);
    console.log(`   🎯 User ID: ${response.data.user._id}`.gray);

    // Store token for subsequent tests
    authToken = response.data.token;
    return { success: true, user: response.data.user };
  } catch (error) {
    console.log("   ❌ User registration failed".red);
    if (error.response) {
      console.log(`   💥 Error: ${error.response.data.message}`.red);
      console.log(`   📊 Status: ${error.response.status}`.red);
    } else {
      console.log(`   💥 Error: ${error.message}`.red);
    }
    return { success: false };
  }
};

const testUserLogin = async () => {
  console.log("\n🔐 Testing User Login...".cyan.bold);
  try {
    // Try to login with existing user from seeded data
    const response = await makeRequest({
      method: "POST",
      url: `${BASE_URL}/auth/login`,
      data: {
        email: "andi@pilahpintar.com",
        password: "123456",
      },
    });

    console.log("   ✅ User login successful".green);
    console.log(`   👤 User: ${response.data.user.name}`.gray);
    console.log(`   🎯 User ID: ${response.data.user._id}`.gray);

    // Update token
    authToken = response.data.token;
    return { success: true, user: response.data.user };
  } catch (error) {
    console.log("   ❌ User login failed".red);
    if (error.response) {
      console.log(`   💥 Error: ${error.response.data.message}`.red);
    } else {
      console.log(`   💥 Error: ${error.message}`.red);
    }
    return { success: false };
  }
};

const testWasteClassification = async () => {
  console.log("\n🗂️ Testing Waste Classification...".cyan.bold);
  try {
    const classificationData = {
      wasteType: "plastic",
      confidence: 95.5,
      imageUrl: "https://example.com/plastic-bottle.jpg",
      location: {
        address: "Jakarta Selatan, Indonesia",
        coordinates: [-6.2615, 106.7942],
      },
    };

    const response = await makeRequest({
      method: "POST",
      url: `${BASE_URL}/classification`,
      data: classificationData,
    });

    console.log("   ✅ Waste classification successful".green);
    console.log(`   🗂️ Type: ${response.data.classification.wasteType}`.gray);
    console.log(
      `   🎯 Confidence: ${response.data.classification.confidence}%`.gray
    );
    console.log(
      `   📍 Location: ${response.data.classification.location.address}`.gray
    );
    return { success: true, classification: response.data.classification };
  } catch (error) {
    console.log("   ❌ Waste classification failed".red);
    if (error.response) {
      console.log(`   💥 Error: ${error.response.data.message}`.red);
    } else {
      console.log(`   💥 Error: ${error.message}`.red);
    }
    return { success: false };
  }
};

const testUserProfile = async () => {
  console.log("\n👤 Testing User Profile...".cyan.bold);
  if (!authToken) {
    console.log("   ⚠️ No auth token available, skipping test".yellow);
    return { success: false };
  }

  try {
    const response = await makeRequest({
      method: "GET",
      url: `${BASE_URL}/user/profile`,
    });

    console.log("   ✅ User profile retrieved successfully".green);
    console.log(`   👤 Name: ${response.data.user.name}`.gray);
    console.log(`   📧 Email: ${response.data.user.email}`.gray);
    console.log(`   🏆 Points: ${response.data.user.points}`.gray);
    return { success: true, profile: response.data.user };
  } catch (error) {
    console.log("   ❌ User profile retrieval failed".red);
    if (error.response) {
      console.log(`   💥 Error: ${error.response.data.message}`.red);
    } else {
      console.log(`   💥 Error: ${error.message}`.red);
    }
    return { success: false };
  }
};

const testEducationContent = async () => {
  console.log("\n📚 Testing Education Content...".cyan.bold);
  try {
    const response = await makeRequest({
      method: "GET",
      url: `${BASE_URL}/education`,
    });

    console.log("   ✅ Education content retrieved successfully".green);
    console.log(
      `   📖 Articles count: ${response.data.articles?.length || 0}`.gray
    );
    console.log(
      `   🎥 Videos count: ${response.data.videos?.length || 0}`.gray
    );
    return { success: true, content: response.data };
  } catch (error) {
    console.log("   ❌ Education content retrieval failed".red);
    if (error.response) {
      console.log(`   💥 Error: ${error.response.data.message}`.red);
    } else {
      console.log(`   💥 Error: ${error.message}`.red);
    }
    return { success: false };
  }
};

// Main test runner
const runAllTests = async () => {
  console.log("🧪 PilahPintar API Testing Suite".rainbow.bold);
  console.log("=====================================".rainbow);

  const startTime = Date.now();
  const results = [];

  // Wait for server to be ready
  console.log("\n⏳ Waiting for server to be ready...".yellow);
  await wait(2000);

  // Run tests sequentially
  const tests = [
    { name: "Health Check", fn: testHealthCheck },
    { name: "User Registration", fn: testUserRegistration },
    { name: "User Login", fn: testUserLogin },
    { name: "User Profile", fn: testUserProfile },
    { name: "Waste Classification", fn: testWasteClassification },
    { name: "Education Content", fn: testEducationContent },
  ];

  for (const test of tests) {
    const result = await test.fn();
    results.push({ name: test.name, success: result.success || result });

    // Small delay between tests
    await wait(500);
  }

  // Print summary
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  console.log("\n📊 Test Results Summary".cyan.bold);
  console.log("========================".cyan);

  results.forEach((result) => {
    const status = result.success ? "✅ PASS".green : "❌ FAIL".red;
    console.log(`${status} ${result.name}`);
  });

  console.log(`\n🎯 Results: ${passed}/${total} tests passed`.bold);
  console.log(`⏱️ Duration: ${duration.toFixed(2)}s`.gray);

  if (passed === total) {
    console.log("\n🎉 All tests passed! API is working correctly.".green.bold);
  } else {
    console.log(
      `\n⚠️ ${total - passed} test(s) failed. Please check the errors above.`
        .yellow.bold
    );
  }

  process.exit(passed === total ? 0 : 1);
};

// Handle script termination
process.on("SIGINT", () => {
  console.log("\n\n🛑 Test execution interrupted".yellow);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("\n💥 Uncaught Exception:", error.message.red);
  process.exit(1);
});

// Run tests
runAllTests().catch((error) => {
  console.error("\n💥 Test suite failed:", error.message.red);
  process.exit(1);
});

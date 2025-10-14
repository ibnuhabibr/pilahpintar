const axios = require("axios");

// Test configuration
const API_BASE = "http://localhost:5000";
const API_ENDPOINTS = `${API_BASE}/api`;

// Helper function to create delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Test results tracking
let testResults = [];
let authToken = null;

// Helper function to log test results
const logTest = (testName, success, message = "", data = null) => {
  const result = {
    test: testName,
    success,
    message,
    timestamp: new Date().toISOString(),
    data: data ? JSON.stringify(data, null, 2) : null,
  };

  testResults.push(result);

  const status = success ? "✅ PASS" : "❌ FAIL";
  const color = success ? "\x1b[32m" : "\x1b[31m";
  const reset = "\x1b[0m";

  console.log(`${color}${status}${reset} ${testName}`);
  if (message) console.log(`   ${message}`);
  if (data && Object.keys(data).length > 0) {
    console.log(`   Data: ${JSON.stringify(data, null, 2)}`);
  }
  console.log("");

  return result;
};

// Test functions
const testHealthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE}/health`, { timeout: 10000 });

    logTest("Health Check", true, `Status: ${response.status}`, {
      message: response.data.message,
      database: response.data.database,
      environment: response.data.environment,
    });

    return true;
  } catch (error) {
    logTest("Health Check", false, `Error: ${error.message}`);
    return false;
  }
};

const testUserRegistration = async () => {
  try {
    const userData = {
      name: "Integration Test User",
      email: `integration.test.${Date.now()}@pilahpintar.com`,
      password: "TestPassword123!",
      phone: "081234567890",
      location: {
        address: "Jakarta, Indonesia",
        coordinates: [-6.2088, 106.8456],
      },
    };

    const response = await axios.post(
      `${API_ENDPOINTS}/auth/register`,
      userData,
      { timeout: 10000 }
    );

    logTest("User Registration", true, `Status: ${response.status}`, {
      email: response.data.user?.email,
      userId: response.data.user?._id,
      hasToken: !!response.data.token,
    });

    // Store token for subsequent tests
    authToken = response.data.token;
    return true;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    logTest("User Registration", false, `Error: ${message}`);
    return false;
  }
};

const testUserLogin = async () => {
  try {
    const loginData = {
      email: "andi@pilahpintar.com",
      password: "123456",
    };

    const response = await axios.post(
      `${API_ENDPOINTS}/auth/login`,
      loginData,
      { timeout: 10000 }
    );

    logTest("User Login", true, `Status: ${response.status}`, {
      userName: response.data.user?.name,
      userId: response.data.user?._id,
      hasToken: !!response.data.token,
    });

    // Update token
    authToken = response.data.token;
    return true;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    logTest("User Login", false, `Error: ${message}`);
    return false;
  }
};

const testUserProfile = async () => {
  if (!authToken) {
    logTest("User Profile", false, "No auth token available");
    return false;
  }

  try {
    const response = await axios.get(`${API_ENDPOINTS}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
      timeout: 10000,
    });

    logTest("User Profile", true, `Status: ${response.status}`, {
      name: response.data.user?.name,
      email: response.data.user?.email,
      points: response.data.user?.profile?.points,
      level: response.data.user?.profile?.level,
    });

    return true;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    logTest("User Profile", false, `Error: ${message}`);
    return false;
  }
};

const testWasteClassification = async () => {
  if (!authToken) {
    logTest("Waste Classification", false, "No auth token available");
    return false;
  }

  try {
    const classificationData = {
      wasteType: "plastic",
      confidence: 95.5,
      imageUrl: "https://example.com/test-plastic-bottle.jpg",
      location: {
        type: "Point",
        address: "Jakarta Selatan, Indonesia",
        coordinates: [106.7942, -6.2615], // [longitude, latitude] format
      },
    };

    const response = await axios.post(
      `${API_ENDPOINTS}/classification`,
      classificationData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 10000,
      }
    );

    logTest("Waste Classification", true, `Status: ${response.status}`, {
      wasteType: response.data.classification?.wasteType,
      confidence: response.data.classification?.confidence,
      location: response.data.classification?.location?.address,
    });

    return true;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    logTest("Waste Classification", false, `Error: ${message}`);
    return false;
  }
};

const testEducationContent = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS}/education`, {
      timeout: 10000,
    });

    logTest("Education Content", true, `Status: ${response.status}`, {
      hasArticles: !!response.data.articles,
      hasVideos: !!response.data.videos,
      articleCount: response.data.articles?.length || 0,
      videoCount: response.data.videos?.length || 0,
    });

    return true;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    logTest("Education Content", false, `Error: ${message}`);
    return false;
  }
};

const testCommunityFeatures = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS}/community`, {
      timeout: 10000,
    });

    logTest("Community Features", true, `Status: ${response.status}`, {
      hasForums: !!response.data.forums,
      hasChallenges: !!response.data.challenges,
      hasEvents: !!response.data.events,
    });

    return true;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    logTest("Community Features", false, `Error: ${message}`);
    return false;
  }
};

// Main test runner
const runIntegrationTests = async () => {
  console.log("\n🧪 PilahPintar API Integration Tests");
  console.log("=====================================\n");

  const startTime = Date.now();

  // Wait for server to be ready
  await delay(2000);

  // Run tests sequentially
  const tests = [
    { name: "Health Check", fn: testHealthCheck },
    { name: "User Registration", fn: testUserRegistration },
    { name: "User Login", fn: testUserLogin },
    { name: "User Profile", fn: testUserProfile },
    { name: "Waste Classification", fn: testWasteClassification },
    { name: "Education Content", fn: testEducationContent },
    { name: "Community Features", fn: testCommunityFeatures },
  ];

  for (const test of tests) {
    console.log(`🔍 Running: ${test.name}...`);
    await test.fn();
    await delay(500); // Small delay between tests
  }

  // Generate summary
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  const passed = testResults.filter((r) => r.success).length;
  const total = testResults.length;

  console.log("\n📊 Test Summary");
  console.log("===============");
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log("\n🎉 All tests passed! Backend API is fully functional.");
  } else {
    console.log(
      `\n⚠️  ${total - passed} test(s) failed. Review the errors above.`
    );
  }

  // Generate detailed report
  console.log("\n📋 Detailed Test Report");
  console.log("=======================");
  testResults.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.test}: ${result.success ? "PASS" : "FAIL"}`
    );
    if (result.message) console.log(`   Message: ${result.message}`);
    if (result.data) console.log(`   Data: ${result.data}`);
    console.log("");
  });

  return { passed, total, testResults };
};

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n\n🛑 Test execution interrupted");
  process.exit(0);
});

// Run tests
if (require.main === module) {
  runIntegrationTests()
    .then((results) => {
      process.exit(results.passed === results.total ? 0 : 1);
    })
    .catch((error) => {
      console.error("\n💥 Test suite failed:", error.message);
      process.exit(1);
    });
}

module.exports = { runIntegrationTests };

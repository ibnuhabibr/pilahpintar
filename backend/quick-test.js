// Simple API test using Node.js that won't interfere with server
const axios = require("axios");

const testEndpoints = async () => {
  console.log("🔍 Testing PilahPintar API endpoints...\n");

  try {
    // Test health endpoint
    console.log("1. Testing Health Check...");
    const healthResponse = await axios.get("http://localhost:5000/health");
    console.log(`   ✅ Status: ${healthResponse.status}`);
    console.log(`   📊 Data:`, JSON.stringify(healthResponse.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Health check failed: ${error.message}`);
  }

  try {
    // Test user registration
    console.log("\n2. Testing User Registration...");
    const registerData = {
      name: "Node Test User",
      email: `nodetest.${Date.now()}@example.com`,
      password: "Test123!@#",
      location: {
        address: "Jakarta, Indonesia",
        coordinates: [-6.2088, 106.8456],
      },
    };

    const registerResponse = await axios.post(
      "http://localhost:5000/api/auth/register",
      registerData
    );
    console.log(`   ✅ Status: ${registerResponse.status}`);
    console.log(`   📧 Email: ${registerResponse.data.user?.email}`);
    console.log(`   🎯 User ID: ${registerResponse.data.user?._id}`);
    console.log(`   🔑 Token received: ${!!registerResponse.data.token}`);
  } catch (error) {
    console.log(
      `   ❌ Registration failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }

  try {
    // Test user login
    console.log("\n3. Testing User Login...");
    const loginData = {
      email: "andi@pilahpintar.com",
      password: "123456",
    };

    const loginResponse = await axios.post(
      "http://localhost:5000/api/auth/login",
      loginData
    );
    console.log(`   ✅ Status: ${loginResponse.status}`);
    console.log(`   👤 User: ${loginResponse.data.user?.name}`);
    console.log(`   🎯 User ID: ${loginResponse.data.user?._id}`);
    console.log(`   🔑 Token received: ${!!loginResponse.data.token}`);

    const authToken = loginResponse.data.token;

    // Test user profile with auth token
    if (authToken) {
      console.log("\n4. Testing User Profile...");
      const profileResponse = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(`   ✅ Status: ${profileResponse.status}`);
      console.log(`   👤 Name: ${profileResponse.data.user?.name}`);
      console.log(`   📧 Email: ${profileResponse.data.user?.email}`);
      console.log(
        `   🏆 Points: ${profileResponse.data.user?.profile?.points}`
      );
    }

    // Test waste classification with auth token
    if (authToken) {
      console.log("\n5. Testing Waste Classification...");
      const classificationData = {
        wasteType: "plastic",
        confidence: 95.5,
        imageUrl: "https://example.com/plastic-bottle.jpg",
        location: {
          address: "Jakarta Selatan, Indonesia",
          coordinates: [-6.2615, 106.7942],
        },
      };

      const classificationResponse = await axios.post(
        "http://localhost:5000/api/classification",
        classificationData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(`   ✅ Status: ${classificationResponse.status}`);
      console.log(
        `   🗂️ Type: ${classificationResponse.data.classification?.wasteType}`
      );
      console.log(
        `   🎯 Confidence: ${classificationResponse.data.classification?.confidence}%`
      );
    }
  } catch (error) {
    console.log(
      `   ❌ Login failed: ${error.response?.data?.message || error.message}`
    );
  }

  try {
    // Test education content (no auth required)
    console.log("\n6. Testing Education Content...");
    const educationResponse = await axios.get(
      "http://localhost:5000/api/education"
    );
    console.log(`   ✅ Status: ${educationResponse.status}`);
    console.log(
      `   📚 Response structure:`,
      Object.keys(educationResponse.data)
    );
  } catch (error) {
    console.log(
      `   ❌ Education content failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }

  console.log("\n🎯 API testing completed!");
};

testEndpoints();

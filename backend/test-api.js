const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

const testAPI = async () => {
  try {
    console.log("🧪 Testing PilahPintar API with MongoDB Atlas...\n");

    // Test 1: Health Check
    console.log("1️⃣ Testing Health Check...");
    const healthResponse = await axios.get("http://localhost:5000/health");
    console.log("✅ Health Check:", healthResponse.data.message);

    // Test 2: User Registration
    console.log("\n2️⃣ Testing User Registration...");
    const registerData = {
      username: "testuser",
      email: "test@pilahpintar.com",
      password: "123456",
      fullName: "Test User",
    };

    try {
      const registerResponse = await axios.post(
        `${API_BASE_URL}/auth/register`,
        registerData
      );
      console.log("✅ Registration successful:", registerResponse.data.message);

      // Test 3: User Login
      console.log("\n3️⃣ Testing User Login...");
      const loginData = {
        email: "test@pilahpintar.com",
        password: "123456",
      };

      const loginResponse = await axios.post(
        `${API_BASE_URL}/auth/login`,
        loginData
      );
      console.log("✅ Login successful:", loginResponse.data.message);

      const token = loginResponse.data.token;

      // Test 4: Get User Profile
      console.log("\n4️⃣ Testing Get User Profile...");
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Profile retrieved:", profileResponse.data.data.fullName);

      // Test 5: Get User Dashboard Data
      console.log("\n5️⃣ Testing User Dashboard...");
      const dashboardResponse = await axios.get(
        `${API_BASE_URL}/user/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        "✅ Dashboard data retrieved:",
        dashboardResponse.data.data.stats
      );
    } catch (authError) {
      if (
        authError.response?.status === 400 &&
        authError.response?.data?.message === "User already exists"
      ) {
        console.log("⚠️ User already exists, trying login...");

        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: "test@pilahpintar.com",
          password: "123456",
        });
        console.log("✅ Login successful with existing user");
      } else {
        throw authError;
      }
    }

    // Test 6: Education Endpoints
    console.log("\n6️⃣ Testing Education Endpoints...");
    const articlesResponse = await axios.get(
      `${API_BASE_URL}/education/articles`
    );
    console.log(
      "✅ Articles retrieved:",
      articlesResponse.data.data.articles.length,
      "articles"
    );

    // Test 7: Community Endpoints
    console.log("\n7️⃣ Testing Community Endpoints...");
    const postsResponse = await axios.get(`${API_BASE_URL}/community/posts`);
    console.log(
      "✅ Community posts retrieved:",
      postsResponse.data.data.posts.length,
      "posts"
    );

    // Test 8: Waste Map Endpoints
    console.log("\n8️⃣ Testing Waste Map Endpoints...");
    const bankSampahResponse = await axios.get(
      `${API_BASE_URL}/waste-map/bank-sampah`
    );
    console.log(
      "✅ Bank Sampah data retrieved:",
      bankSampahResponse.data.data.length,
      "locations"
    );

    console.log(
      "\n🎉 All API tests passed! MongoDB Atlas integration is working correctly."
    );
  } catch (error) {
    console.error(
      "\n❌ API Test failed:",
      error.response?.data || error.message
    );

    if (error.code === "ECONNREFUSED") {
      console.error(
        "💡 Make sure the backend server is running on http://localhost:5000"
      );
    }
  }
};

// Run tests
testAPI();

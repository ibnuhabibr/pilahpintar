const axios = require("axios");

async function testRegistration() {
  try {
    console.log("🧪 Testing registration endpoint...");

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: "Test User",
        email: "testuser" + Date.now() + "@example.com",
        password: "password123",
      }
    );

    console.log("✅ Registration successful!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Registration failed!");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

testRegistration();

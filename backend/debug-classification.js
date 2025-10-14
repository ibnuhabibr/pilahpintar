const axios = require("axios");

const testClassification = async () => {
  try {
    console.log("Testing classification endpoint...");

    // First login
    const loginResponse = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: "andi@pilahpintar.com",
        password: "123456",
      }
    );

    const token = loginResponse.data.token;
    console.log("✅ Login successful, token received");

    // Test classification
    const classificationData = {
      wasteType: "plastic",
      confidence: 95.5,
      imageUrl: "https://example.com/test.jpg",
      location: {
        type: "Point",
        address: "Jakarta",
        coordinates: [106.8456, -6.2088], // [longitude, latitude] format
      },
    };

    const classificationResponse = await axios.post(
      "http://localhost:5000/api/classification",
      classificationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Classification successful:", classificationResponse.data);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("Stack:", error.stack);
  }
};

testClassification();

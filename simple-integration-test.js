/**
 * Simple Frontend-Backend Integration Test
 * Manual testing without browser automation
 */

const axios = require("axios");

class SimpleIntegrationTester {
  constructor() {
    this.testResults = [];
  }

  logTest(testName, success, message = "", data = null) {
    const result = {
      testName,
      success,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.testResults.push(result);

    const status = success ? "✅ PASS" : "❌ FAIL";
    const color = success ? "\x1b[32m" : "\x1b[31m";
    const reset = "\x1b[0m";

    console.log(`${color}${status}${reset} ${testName}`);
    if (message) console.log(`   ${message}`);
    if (data && typeof data === "object")
      console.log(`   Data:`, JSON.stringify(data, null, 2));
    console.log("");

    return result;
  }

  // Test 1: Frontend Server Accessibility
  async testFrontendServer() {
    try {
      console.log("🔍 Testing Frontend Server...");

      const response = await axios.get("http://localhost:3000", {
        timeout: 15000,
        validateStatus: () => true, // Accept any status
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "Integration-Test/1.0",
        },
      });

      const isAccessible = response.status === 200;

      this.logTest(
        "Frontend Server",
        isAccessible,
        `Status: ${response.status}`,
        {
          contentType: response.headers["content-type"],
          contentLength: response.data?.length || 0,
          hasReactApp:
            typeof response.data === "string" &&
            response.data.includes("react"),
          serverRunning: isAccessible,
        }
      );

      return isAccessible;
    } catch (error) {
      const errorDetails = {
        code: error.code,
        message: error.message,
        status: error.response?.status,
        syscall: error.syscall,
        address: error.address,
        port: error.port,
      };

      this.logTest(
        "Frontend Server",
        false,
        `Connection failed: ${error.code || error.message}`,
        errorDetails
      );
      return false;
    }
  }

  // Test 2: Backend Server Accessibility
  async testBackendServer() {
    try {
      console.log("🔍 Testing Backend Server...");

      const response = await axios.get("http://localhost:5000/health", {
        timeout: 10000,
      });

      this.logTest("Backend Server", true, `Status: ${response.status}`, {
        message: response.data.message,
        database: response.data.database,
        environment: response.data.environment,
      });

      return true;
    } catch (error) {
      this.logTest("Backend Server", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 3: Proxy Configuration (Frontend to Backend)
  async testProxyConfiguration() {
    try {
      console.log("🔍 Testing Proxy Configuration...");

      // Test multiple proxy endpoints to ensure reliability
      const testEndpoints = ["/health", "/api/../health"];

      let proxyWorking = false;
      let lastResponse = null;

      for (const endpoint of testEndpoints) {
        try {
          const response = await axios.get(`http://localhost:3000${endpoint}`, {
            timeout: 15000,
            headers: {
              Accept: "application/json",
              "User-Agent": "Frontend-Integration-Test",
            },
            validateStatus: (status) => status < 500, // Accept 200-499
          });

          if (response.status === 200 && response.data.message) {
            proxyWorking = true;
            lastResponse = response.data;
            break;
          }
        } catch (endpointError) {
          // Try next endpoint
          continue;
        }
      }

      this.logTest(
        "Proxy Configuration",
        proxyWorking,
        proxyWorking ? `Proxy working correctly` : `Proxy not accessible`,
        {
          proxiedFrom: "http://localhost:3000",
          actualBackend: "http://localhost:5000",
          response: lastResponse,
          testedEndpoints: testEndpoints,
        }
      );

      return proxyWorking;
    } catch (error) {
      const errorDetails = {
        code: error.code,
        message: error.message,
        status: error.response?.status,
      };

      this.logTest(
        "Proxy Configuration",
        false,
        `Proxy connection failed: ${error.code || error.message}`,
        errorDetails
      );
      return false;
    }
  }

  // Test 4: CORS Headers
  async testCORSHeaders() {
    try {
      console.log("🔍 Testing CORS Headers...");

      const response = await axios.options(
        "http://localhost:5000/api/auth/login",
        {
          headers: {
            Origin: "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type,Authorization",
          },
          timeout: 10000,
        }
      );

      const corsHeaders = {
        "access-control-allow-origin":
          response.headers["access-control-allow-origin"],
        "access-control-allow-methods":
          response.headers["access-control-allow-methods"],
        "access-control-allow-headers":
          response.headers["access-control-allow-headers"],
        "access-control-allow-credentials":
          response.headers["access-control-allow-credentials"],
      };

      const hasValidCORS =
        corsHeaders["access-control-allow-origin"] !== undefined;

      this.logTest(
        "CORS Headers",
        hasValidCORS,
        `CORS configured: ${hasValidCORS}`,
        corsHeaders
      );

      return hasValidCORS;
    } catch (error) {
      this.logTest("CORS Headers", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 5: API Authentication Flow
  async testAPIAuthentication() {
    try {
      console.log("🔍 Testing API Authentication Flow...");

      // Test login endpoint
      const loginResponse = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: "andi@pilahpintar.com",
          password: "123456",
        },
        {
          headers: {
            Origin: "http://localhost:3000",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const token = loginResponse.data.token;
      const user = loginResponse.data.user;

      // Test authenticated endpoint
      const profileResponse = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Origin: "http://localhost:3000",
          },
          timeout: 10000,
        }
      );

      this.logTest("API Authentication", true, "Authentication flow working", {
        loginStatus: loginResponse.status,
        hasToken: !!token,
        userName: user?.name,
        profileStatus: profileResponse.status,
        profileData: !!profileResponse.data.user,
      });

      return true;
    } catch (error) {
      this.logTest("API Authentication", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 6: API Data Operations
  async testAPIDataOperations() {
    try {
      console.log("🔍 Testing API Data Operations...");

      // Login first
      const loginResponse = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: "andi@pilahpintar.com",
          password: "123456",
        }
      );

      const token = loginResponse.data.token;

      // Test classification endpoint (main feature)
      const classificationResponse = await axios.post(
        "http://localhost:5000/api/classification",
        {
          wasteType: "plastic",
          confidence: 95.5,
          imageUrl: "https://example.com/test-integration.jpg",
          location: {
            type: "Point",
            address: "Integration Test Location",
            coordinates: [106.8456, -6.2088],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Origin: "http://localhost:3000",
          },
          timeout: 10000,
        }
      );

      // Test education endpoint
      const educationResponse = await axios.get(
        "http://localhost:5000/api/education",
        {
          headers: {
            Origin: "http://localhost:3000",
          },
          timeout: 10000,
        }
      );

      this.logTest("API Data Operations", true, "Data operations working", {
        classificationStatus: classificationResponse.status,
        classificationCreated: !!classificationResponse.data.classification,
        educationStatus: educationResponse.status,
        educationData: !!educationResponse.data.articles,
      });

      return true;
    } catch (error) {
      this.logTest("API Data Operations", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    console.log("🧪 Simple Frontend-Backend Integration Tests");
    console.log("=============================================\n");

    const startTime = Date.now();

    // Run tests sequentially
    const tests = [
      { name: "Frontend Server", fn: this.testFrontendServer },
      { name: "Backend Server", fn: this.testBackendServer },
      { name: "Proxy Configuration", fn: this.testProxyConfiguration },
      { name: "CORS Headers", fn: this.testCORSHeaders },
      { name: "API Authentication", fn: this.testAPIAuthentication },
      { name: "API Data Operations", fn: this.testAPIDataOperations },
    ];

    for (const test of tests) {
      await test.fn.call(this);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay between tests
    }

    // Generate summary
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const passed = this.testResults.filter((r) => r.success).length;
    const total = this.testResults.length;

    console.log("\n📊 Integration Test Summary");
    console.log("============================");
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Duration: ${duration.toFixed(2)}s`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (passed === total) {
      console.log(
        "\n🎉 All integration tests passed! Frontend-Backend integration is working correctly."
      );
      console.log("✅ Ready for production deployment or advanced features!");
    } else {
      console.log(
        `\n⚠️  ${total - passed} test(s) failed. Review the errors above.`
      );
    }

    return { passed, total, results: this.testResults };
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SimpleIntegrationTester();
  tester
    .runAllTests()
    .then((results) => {
      process.exit(results.passed === results.total ? 0 : 1);
    })
    .catch((error) => {
      console.error("\n💥 Integration test suite failed:", error.message);
      process.exit(1);
    });
}

module.exports = SimpleIntegrationTester;

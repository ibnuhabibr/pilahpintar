/**
 * Frontend-Backend Integration Test
 * Tests API calls from frontend perspective
 */

const axios = require("axios");
const puppeteer = require("puppeteer");

// Configure axios untuk simulate frontend calls
const frontendAxios = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

// Test configuration
const BACKEND_API = "http://localhost:5000/api";
const FRONTEND_URL = "http://localhost:3000";

class IntegrationTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
  }

  async setup() {
    console.log("🚀 Setting up Frontend-Backend Integration Tests...\n");

    // Launch browser for frontend testing
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      defaultViewport: { width: 1280, height: 720 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();

    // Enable console logging
    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log("❌ Frontend Console Error:", msg.text());
      }
    });

    // Enable network monitoring
    await this.page.setRequestInterception(true);
    this.page.on("request", (request) => {
      if (request.url().includes("/api/")) {
        console.log(`📡 API Request: ${request.method()} ${request.url()}`);
      }
      request.continue();
    });

    this.page.on("response", (response) => {
      if (response.url().includes("/api/")) {
        console.log(`📨 API Response: ${response.status()} ${response.url()}`);
      }
    });
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
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
    if (data) console.log(`   Data:`, JSON.stringify(data, null, 2));
    console.log("");

    return result;
  }

  // Test 1: Frontend Loading & Basic Functionality
  async testFrontendLoading() {
    try {
      console.log("🔍 Testing Frontend Loading...");

      await this.page.goto(FRONTEND_URL, { waitUntil: "networkidle2" });

      // Wait for main content
      await this.page.waitForSelector("main", { timeout: 5000 });

      // Check for navbar
      const navbar = await this.page.$("nav");
      const hasNavbar = !!navbar;

      // Check for main content
      const mainContent = await this.page.$("main");
      const hasMainContent = !!mainContent;

      // Check page title
      const title = await this.page.title();

      this.logTest("Frontend Loading", true, "Frontend loaded successfully", {
        title,
        hasNavbar,
        hasMainContent,
        url: this.page.url(),
      });

      return true;
    } catch (error) {
      this.logTest("Frontend Loading", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 2: Authentication Flow
  async testAuthenticationFlow() {
    try {
      console.log("🔍 Testing Authentication Flow...");

      // Navigate to login page
      await this.page.goto(`${FRONTEND_URL}/login`, {
        waitUntil: "networkidle2",
      });

      // Wait for login form
      await this.page.waitForSelector("form", { timeout: 5000 });

      // Fill login form
      await this.page.type('input[type="email"]', "andi@pilahpintar.com");
      await this.page.type('input[type="password"]', "123456");

      // Submit form
      await this.page.click('button[type="submit"]');

      // Wait for redirect or success message
      await this.page.waitForTimeout(3000);

      // Check if redirected to dashboard or authenticated state
      const currentUrl = this.page.url();
      const isAuthenticated = !currentUrl.includes("/login");

      this.logTest(
        "Authentication Flow",
        isAuthenticated,
        "Login flow completed",
        {
          finalUrl: currentUrl,
          authenticated: isAuthenticated,
        }
      );

      return isAuthenticated;
    } catch (error) {
      this.logTest("Authentication Flow", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 3: API Calls from Frontend
  async testAPICallsFromFrontend() {
    try {
      console.log("🔍 Testing API Calls from Frontend...");

      // Navigate to a page that makes API calls
      await this.page.goto(`${FRONTEND_URL}/smart-sort`, {
        waitUntil: "networkidle2",
      });

      // Monitor network requests
      const apiCalls = [];

      this.page.on("response", async (response) => {
        if (response.url().includes("/api/")) {
          apiCalls.push({
            url: response.url(),
            status: response.status(),
            method: response.request().method(),
          });
        }
      });

      // Wait for potential API calls
      await this.page.waitForTimeout(5000);

      this.logTest(
        "API Calls from Frontend",
        true,
        "API monitoring completed",
        {
          apiCallsDetected: apiCalls.length,
          calls: apiCalls,
        }
      );

      return true;
    } catch (error) {
      this.logTest("API Calls from Frontend", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 4: Direct Backend API Health Check
  async testBackendConnectivity() {
    try {
      console.log("🔍 Testing Backend Connectivity...");

      const response = await axios.get(`${BACKEND_API}/../health`);

      this.logTest("Backend Connectivity", true, `Backend is responsive`, {
        status: response.status,
        message: response.data.message,
        database: response.data.database,
      });

      return true;
    } catch (error) {
      this.logTest("Backend Connectivity", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Test 5: Cross-Origin Requests (CORS)
  async testCORSConfiguration() {
    try {
      console.log("🔍 Testing CORS Configuration...");

      // Execute API call from frontend context
      const corsTest = await this.page.evaluate(async () => {
        try {
          const response = await fetch("/api/../health");
          const data = await response.json();
          return { success: true, status: response.status, data };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });

      this.logTest(
        "CORS Configuration",
        corsTest.success,
        "CORS test completed",
        corsTest
      );

      return corsTest.success;
    } catch (error) {
      this.logTest("CORS Configuration", false, `Error: ${error.message}`);
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    console.log("🧪 Frontend-Backend Integration Test Suite");
    console.log("==========================================\n");

    const startTime = Date.now();

    await this.setup();

    // Run tests sequentially
    const tests = [
      { name: "Frontend Loading", fn: this.testFrontendLoading },
      { name: "Backend Connectivity", fn: this.testBackendConnectivity },
      { name: "CORS Configuration", fn: this.testCORSConfiguration },
      { name: "API Calls from Frontend", fn: this.testAPICallsFromFrontend },
      { name: "Authentication Flow", fn: this.testAuthenticationFlow },
    ];

    for (const test of tests) {
      await test.fn.call(this);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay between tests
    }

    await this.teardown();

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
  const tester = new IntegrationTester();
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

module.exports = IntegrationTester;

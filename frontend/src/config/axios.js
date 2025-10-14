import axios from "axios";

// Determine API URL based on environment
const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction
  ? process.env.REACT_APP_API_URL_PRODUCTION || process.env.REACT_APP_API_URL
  : process.env.REACT_APP_API_URL;

console.log("=== Axios Configuration ===");
console.log("Environment:", process.env.NODE_ENV);
console.log("Is Production:", isProduction);
console.log("API URL:", apiUrl);
console.log("Production API URL:", process.env.REACT_APP_API_URL_PRODUCTION);
console.log("Development API URL:", process.env.REACT_APP_API_URL);
console.log("==============================");

// Set default base URL
if (apiUrl) {
  axios.defaults.baseURL = apiUrl;
} else {
  console.warn("⚠️ No API URL configured!");
}

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.config?.url,
      error.message
    );
    return Promise.reject(error);
  }
);

export default axios;

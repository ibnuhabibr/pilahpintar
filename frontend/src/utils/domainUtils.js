// Domain redirect utility
export const handleDomainRedirect = () => {
  // Disabled because DNS-level redirect is already configured
  // This serves as backup if DNS redirect fails
  return false;
};

// Get the correct domain for API calls and redirects
export const getDomainConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      frontend: "http://localhost:3000",
      api: process.env.REACT_APP_API_URL,
    };
  }

  return {
    frontend:
      process.env.REACT_APP_FRONTEND_URL || "https://www.pilahpintar.site",
    api: process.env.REACT_APP_API_URL_PRODUCTION,
    primaryDomain:
      process.env.REACT_APP_DOMAIN_PRIMARY || "https://www.pilahpintar.site",
    apexDomain: process.env.REACT_APP_DOMAIN_APEX || "https://pilahpintar.site",
  };
};

// Domain redirect utility
export const handleDomainRedirect = () => {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') return;
  
  const currentDomain = window.location.hostname;
  const preferredDomain = 'www.pilahpintar.site';
  
  // Redirect apex domain to www subdomain
  if (currentDomain === 'pilahpintar.site') {
    const newUrl = `https://${preferredDomain}${window.location.pathname}${window.location.search}${window.location.hash}`;
    console.log('Redirecting from apex domain to www:', newUrl);
    window.location.replace(newUrl);
    return true;
  }
  
  return false;
};

// Get the correct domain for API calls and redirects
export const getDomainConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    return {
      frontend: 'http://localhost:3000',
      api: process.env.REACT_APP_API_URL,
    };
  }
  
  return {
    frontend: process.env.REACT_APP_FRONTEND_URL || 'https://www.pilahpintar.site',
    api: process.env.REACT_APP_API_URL_PRODUCTION,
    primaryDomain: process.env.REACT_APP_DOMAIN_PRIMARY || 'https://www.pilahpintar.site',
    apexDomain: process.env.REACT_APP_DOMAIN_APEX || 'https://pilahpintar.site',
  };
};
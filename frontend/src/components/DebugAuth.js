const DebugAuth = () => {
  const isProduction = process.env.NODE_ENV === "production";

  const getRedirectURL = () => {
    if (isProduction) {
      return process.env.REACT_APP_FRONTEND_URL
        ? `${process.env.REACT_APP_FRONTEND_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`;
    } else {
      return `${window.location.origin}/auth/callback`;
    }
  };

  const debugInfo = {
    environment: process.env.NODE_ENV,
    isProduction,
    currentOrigin: window.location.origin,
    frontendUrl: process.env.REACT_APP_FRONTEND_URL,
    apiUrl: process.env.REACT_APP_API_URL,
    apiUrlProduction: process.env.REACT_APP_API_URL_PRODUCTION,
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
    redirectUrl: getRedirectURL(),
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug Auth Configuration</h3>
      <pre className="text-sm bg-white p-3 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          This debug info helps troubleshoot authentication issues. Remove this
          component in production.
        </p>
      </div>
    </div>
  );
};

export default DebugAuth;

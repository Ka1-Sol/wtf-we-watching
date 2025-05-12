import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Validate the API key by making a simple request
    const validateApiKey = async () => {
      try {
        const response = await api.get('/configuration');
        if (response.status === 200) {
          console.log('TMDB API key is valid');
          setApiKeyValid(true);
        } else {
          setApiKeyValid(false);
          setApiError('Invalid API response');
        }
      } catch (error: any) {
        console.error('API key validation error:', error);
        setApiKeyValid(false);
        setApiError(error.response?.data?.status_message || 'Failed to validate API key');
      }
    };

    validateApiKey();
  }, []);

  // Show API error message if validation fails
  if (apiKeyValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">API Error</h1>
          <p className="text-gray-700 mb-4">
            There was a problem connecting to the TMDB API. Please check your API key and try again.
          </p>
          {apiError && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
              <p className="font-medium">Error details:</p>
              <p className="text-sm">{apiError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null; // App component is not used directly anymore
}

export default App;

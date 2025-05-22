import { useState, useCallback } from 'react';

/**
 * A custom hook to handle API requests (GET, POST, PUT, DELETE).
 * @returns {Object} The hook's return object includes loading, data, error, and the API call function.
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');
  const [error, setError] = useState(null);

  /**
   * The function that calls an API with the specified URL, method, and parameters.
   * @param {string} url - The API endpoint to be called.
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
   * @param {Object|null} body - The request body (for POST, PUT methods).
   * @param {Object} config - Additional configurations like headers (optional).
   */
  const callApi = useCallback(
    async (url, method = 'GET', body = null, config = {}) => {
      setLoading(true);
      setError(null);
      const headers = config.headers || {};
      if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      const options = {
        method,
        headers,
        body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          let errorMessage = await response.json()
          console.log(errorMessage)
          if(errorMessage && errorMessage.message){
            setError( errorMessage.message || 'Something went wrong');
            console.log(error)
          }
        }else{
          const contentType = response.headers.get('Content-Type');
          let responseData;
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text(); // Fallback for non-JSON responses
          }
  
          setData(responseData);
          return responseData;
        }
      
      } catch (err) {
        setError(err.message || 'Something went wrong');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    data,
    error,
    callApi, // Expose callApi so the component can call it when needed
  };
};

export default useApi;

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
      console.log(`API call initiated: URL=${url}, Method=${method}, Body=`, body);
      setLoading(true);
      setError(null);
  
      const accessToken = sessionStorage.getItem('accessToken');
      console.log(`Access Token: ${accessToken}`);
  
      const headers = { ...config.headers };
  
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
  
      if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
  
      const options = {
        method,
        headers,
        body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      };
  
      console.log(`Request options:`, options);
  
      try {
        const response = await fetch(url, options);
        console.log(`Response status: ${response.status}`);
  
        if (!response.ok) {
          const errorMessage = await response.json();
          console.log(`Error response:`, errorMessage);
          setError(errorMessage.message || 'Something went wrong');
          return null;
        }
  
        const contentType = response.headers.get('Content-Type');
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
  
        console.log(`Response data:`, responseData);
        setData(responseData);
        return responseData;
      } catch (err) {
        console.error(`Error during API call:`, err);
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
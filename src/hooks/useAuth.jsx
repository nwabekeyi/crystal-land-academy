import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError } from '../reduxStore/slices/uiSlice';
import { setUser, resetUser } from '../reduxStore/slices/usersSlice';
import { endpoints } from '../utils/constants';
import { useEffect } from 'react';
import { deleteAllStores } from '../utils/indexedDBService';


const useAuth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { loading, error } = useSelector((state) => state.ui);

  // Function to login the user
  const login = async (email, password) => {
    dispatch(setLoading(true)); // Start loading
    dispatch(setError(null)); // Clear any previous errors
    try {
      // Make the login API call to your backend
      const res = await fetch(endpoints.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Ensure cookies are sent
      });

      if (!res.ok) {
        throw new Error('Login failed: ' + res.statusText);
      }

      const data = await res.json();

      // Handle the response based on the user role
      dispatch(setUser(data.user)); // Set logged-in user data
      console.log(data);

    } catch (err) {
      dispatch(setError(err.message)); // Handle any errors
    } finally {
      dispatch(setLoading(false)); // End loading
    }
  };

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });

      if (!res.ok) {
        throw new Error('Failed to refresh access token');
      }

      // Optionally, you can also fetch fresh user data after refreshing the token if needed
      // For example, you can call the login function again or a separate fetch to update user details.

    } catch (err) {
      dispatch(setError(err.message));
      console.log(err); // Handle any errors
    }
  };

  // Set up token refresh logic on component mount
  useEffect(() => {
    // Refresh token every 14 minutes
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000); // Refresh token every 14 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to logout
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });
      dispatch(resetUser()); // Reset user data after logout
      
      // Delete the "Messages" store when logout is successful
     await deleteAllStores('Messages');
     console.log('Messages store deleted after logout.');
    } catch (err) {
      dispatch(setError(err.message)); // Handle any errors
    }
  };

  return {
    user,
    login,
    logout,
    loading,
    error,
  };
};

export default useAuth;

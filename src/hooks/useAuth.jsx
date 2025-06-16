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
  const login = async (email, password, role) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      if (!role) {
        throw new Error('User role is required for login');
      }

      let loginEndpoint;

      switch (role.toLowerCase()) {
        case 'admin':
          loginEndpoint = endpoints.LOGIN.ADMIN;
          break;
        case 'teacher':
          loginEndpoint = endpoints.LOGIN.TEACHER;
          break;
        case 'student':
          loginEndpoint = endpoints.LOGIN.STUDENT;
          break;
        default:
          throw new Error('Invalid user role');
      }

      const res = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const errorText = contentType?.includes("application/json")
          ? (await res.json()).message || 'Login failed'
          : await res.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response format");
      }

      const data = await res.json();

      // Store accessToken in sessionStorage
      if (data.data.token) {
        sessionStorage.setItem('accessToken', data.data.token);
        console.log('Access token stored in sessionStorage');
      } else {
        console.warn('No access token found in response');
      }

      // Set user data based on role
      if (role.toLowerCase() === 'student') {
        dispatch(setUser(data.data.student));
        console.log('Logged in:', data.data.student);
      } else if (role.toLowerCase() === 'teacher') {
        dispatch(setUser(data.data.teacher));
        console.log('Logged in:', data.data.teacher);
      } else {
        dispatch(setUser(data.data.user));
        console.log('Logged in:', data.data.user);
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Refresh token logic
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(endpoints.REFRESH_TOKEN, {
        method: 'POST',
        credentials: 'include',
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const errorText = contentType?.includes("application/json")
          ? (await res.json()).message || 'Failed to refresh token'
          : await res.text();
        throw new Error(`Failed to refresh access token: ${errorText}`);
      }

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid refresh token response format");
      }

      const data = await res.json();

      if (data.token) {
        sessionStorage.setItem('accessToken', data.token);
        console.log('Access token refreshed and stored in sessionStorage');
      } else {
        console.warn('No access token found in refresh response');
      }
    } catch (err) {
      dispatch(setError(err.message));
      console.error(err);
    }
  };

  // Auto-refresh token every 14 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await fetch(endpoints.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });

      dispatch(resetUser());
      sessionStorage.removeItem('accessToken');
      console.log('Access token removed from sessionStorage');
      await deleteAllStores('Messages');
      console.log('Messages store deleted after logout.');
    } catch (err) {
      dispatch(setError(err.message));
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

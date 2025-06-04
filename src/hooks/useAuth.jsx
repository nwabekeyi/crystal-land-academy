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

      if (!res.ok) {
        throw new Error('Login failed: ' + res.statusText);
      }

      const data = await res.json();
      if(role.toLowerCase() === 'student'){
        dispatch(setUser(data.data.student));
      console.log('Logged in:', data.data.student);
      }else if(role.toLowerCase() === 'teacher'){
        dispatch(setUser(data.data.teacher));
      console.log('Logged in:', data.data.teacher)
    }else{
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

      if (!res.ok) {
        throw new Error('Failed to refresh access token');
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

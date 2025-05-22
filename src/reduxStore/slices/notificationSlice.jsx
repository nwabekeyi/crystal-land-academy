import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setUser } from './usersSlice'; // Import setUser action from user slice

// Async thunk to update notification read status and update user data in the state
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async ({ notificationId, userId, userRole }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/notification/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          readStatus: true,
          userId: userId, // Send userId to the backend
          role: userRole // Send userRole to the backend
        }), // Update read status to true
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update notification');
      }

      const updatedNotification = await response.json();

      // Check if the user data has changed before dispatching setUser
      if (updatedNotification.user && updatedNotification.user.id !== userId) {
        dispatch(setUser(updatedNotification.user)); // Dispatch setUser only if the user data has changed
      }

      return updatedNotification.notification; // Return the updated notification from the API response
    } catch (error) {
      return rejectWithValue(error.message); // Return the error message in case of failure
    }
  }
);

// Redux slice with notification handling
const initialState = {
  notifications: [],
  unreadCount: 0,
  error: null,
  loading: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = state.notifications.filter(notif => !notif.readStatus).length;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      if (!action.payload.readStatus) {
        state.unreadCount += 1;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
      state.unreadCount = state.notifications.filter(notif => !notif.readStatus).length;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notif) => {
        notif.readStatus = true;
      });
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload;
        const notification = state.notifications.find((notif) => notif.id === updatedNotification.id);
        if (notification) {
          notification.readStatus = true;
          state.unreadCount -= 1;
        }
        state.loading = false;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error updating notification';
      });
  },
});

export const { setNotifications, addNotification, removeNotification, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fetchedUsers: false,    // Flag to track if users were fetched
  fetchedCourses: false,  // Flag to track if courses were fetched
};

const apiSlice = createSlice({
  name: 'apiCallCheck',
  initialState,
  reducers: {
    // Action to set when users have been fetched
    setFetchedUsers: (state) => {
      state.fetchedUsers = true;  // Set the correct flag for users
    },
    // Action to set when courses have been fetched
    setFetchedCourses: (state) => {
      state.fetchedCourses = true;  // Set the correct flag for courses
    },
  },
});

export const { setFetchedUsers, setFetchedCourses } = apiSlice.actions; // Correct action export
export default apiSlice.reducer;


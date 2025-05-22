import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  isDashboardCollapse: true, // Initial value set to true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    toggleDashboardCollapse: (state, action) => {
      state.isDashboardCollapse = action.payload;
    },
  },
});

export const { setLoading, setError, toggleDashboardCollapse } = uiSlice.actions;
export default uiSlice.reducer;

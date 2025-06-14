import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../utils/constants';

// Async thunk to fetch enquiries
export const fetchEnquiries = createAsyncThunk('enquiries/fetchEnquiries', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(endpoints.ENQUIRIES);
    if (!response.ok) {
      throw new Error('Failed to fetch enquiries');
    }
    const data = await response.json();
    return data.data || []; // Use `data.data` based on the server response
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


const enquiriesSlice = createSlice({
  name: 'enquiries',
  initialState: {
    enquiries: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Add reducers for other actions like adding or removing enquiries
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload; // Set the enquiries data
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default enquiriesSlice.reducer;
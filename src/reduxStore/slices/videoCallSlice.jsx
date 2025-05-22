import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  streamStatus: null,
};

const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
  },
});

export const { setStreamStatus } = streamSlice.actions;
export default streamSlice.reducer;

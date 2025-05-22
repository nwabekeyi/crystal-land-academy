import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    resetUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, resetUser } = usersSlice.actions;
export default usersSlice.reducer;

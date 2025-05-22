import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersData: {
  },
  error: null,
  connected: false,
  allCourses: []
};

const adminDataSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connected = action.payload;
    },
    setAllCourses: (state, action) => {
      state.courses = action.payload;
    },

    // Add deleteUser function
    deleteUser: (state, action) => {
      const { userId, role } = action.payload;

      if (state.usersData[role]) {
        const updatedArray = state.usersData[role].filter(user => user.id !== userId);
        state.usersData[role] = updatedArray;
      } else {
        state.error = `Role ${role} not found.`;
      }
    },

    // Add updateUser function
    updateUser: (state, action) => {
      const { userId, updatedData, role } = action.payload;

      if (state.usersData[role]) {
        const userIndex = state.usersData[role].findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
          state.usersData[role][userIndex] = {
            ...state.usersData[role][userIndex],
            ...updatedData
          };
        } else {
          state.error = `User with ID ${userId} not found in ${role}.`;
        }
      } else {
        state.error = `Role ${role} not found.`;
      }
    },

   // Add addUser function
addUser: (state, action) => {
  const newUser = action.payload;

  switch (newUser.role) {
    case 'student':
      state.usersData.students.push(newUser);
      break;
    case 'instructor':
      state.usersData.instructors.push(newUser);
      break;
    case 'admin':
      state.usersData.admins.push(newUser);
      break;
    case 'superadmin':
      state.usersData.superAdmins.push(newUser);
      break;
    default:
      state.error = `Role ${newUser.role} not found.`;
      break;
  }
}

  },
});

export const { setUsersData, setAllCourses, setError, setConnectionStatus, deleteUser, updateUser, addUser } = adminDataSlice.actions;

export const selectadminDataState = (state) => state.adminData;

export default adminDataSlice.reducer;

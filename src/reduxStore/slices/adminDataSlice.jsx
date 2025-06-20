import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersData: {},
  error: null,
  connected: false,
  academicYears: [],
  currentAcademicYear: null,
  classLevels: [], // New field for class levels
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
    setAcademicYears: (state, action) => {
      state.academicYears = action.payload;
    },
    setCurrentAcademicYear: (state, action) => {
      state.currentAcademicYear = action.payload;
    },
    setClassLevels: (state, action) => {
      state.classLevels = action.payload;
    },
    updateAcademicYear: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.academicYears.findIndex(year => year._id === id);
      if (index !== -1) {
        state.academicYears[index] = {
          ...state.academicYears[index],
          ...updatedData,
        };
        // Update currentAcademicYear if the updated year is current
        if (updatedData.isCurrent) {
          state.currentAcademicYear = state.academicYears[index];
          // Optionally unset isCurrent for other years in state
          state.academicYears = state.academicYears.map(year =>
            year._id !== id ? { ...year, isCurrent: false } : year
          );
        }
      } else {
        state.error = `Academic year with ID ${id} not found.`;
      }
    },
    deleteUser: (state, action) => {
      const { userId, role } = action.payload;
      if (state.usersData[role]) {
        const updatedArray = state.usersData[role].filter(user => user.id !== userId);
        state.usersData[role] = updatedArray;
      } else {
        state.error = `Role ${role} not found.`;
      }
    },
    updateUser: (state, action) => {
      const { userId, updatedData, role } = action.payload;
      if (state.usersData[role]) {
        const userIndex = state.usersData[role].findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.usersData[role][userIndex] = {
            ...state.usersData[role][userIndex],
            ...updatedData,
          };
        } else {
          state.error = `User with ID ${userId} not found in ${role}.`;
        }
      } else {
        state.error = `Role ${role} not found.`;
      }
    },
    addUser: (state, action) => {
      const newUser = action.payload;
      switch (newUser.role) {
        case 'student':
          state.usersData.students = state.usersData.students || [];
          state.usersData.students.push(newUser);
          break;
        case 'instructor':
          state.usersData.instructors = state.usersData.instructors || [];
          state.usersData.instructors.push(newUser);
          break;
        case 'admin':
          state.usersData.admins = state.usersData.admins || [];
          state.usersData.admins.push(newUser);
          break;
        case 'superadmin':
          state.usersData.superAdmins = state.usersData.superAdmins || [];
          state.usersData.superAdmins.push(newUser);
          break;
        default:
          state.error = `Role ${newUser.role} not found.`;
          break;
      }
    },
  },
});

export const {
  setUsersData,
  setError,
  setConnectionStatus,
  setAcademicYears,
  setCurrentAcademicYear,
  setClassLevels,
  updateAcademicYear,
  deleteUser,
  updateUser,
  addUser,
} = adminDataSlice.actions;

// Thunk to find and set the current academic year
export const setCurrentAcademicYearFromList = () => (dispatch, getState) => {
  const { academicYears } = getState().adminData;
  const currentYear = academicYears.find(year => year.isCurrent === true);
  if (currentYear) {
    dispatch(setCurrentAcademicYear(currentYear));
  } else {
    dispatch(setError('No current academic year found.'));
  }
};

export const selectAdminDataState = (state) => state.adminData;

export default adminDataSlice.reducer;
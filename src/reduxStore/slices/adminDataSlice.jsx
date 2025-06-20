import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersData: { students: [], teachers: [], admins: [], superAdmins: [] }, // Initialize with empty arrays
  error: null,
  connected: false,
  academicYears: [],
  currentAcademicYear: null,
  classLevels: [],
  subjects: [],
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
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    updateAcademicYear: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.academicYears.findIndex(year => year._id === id);
      if (index !== -1) {
        state.academicYears[index] = {
          ...state.academicYears[index],
          ...updatedData,
        };
        if (updatedData.isCurrent) {
          state.currentAcademicYear = state.academicYears[index];
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
        state.usersData[role] = state.usersData[role].filter(user => user._id !== userId); // Use _id
      } else {
        state.error = `Role ${role} not found.`;
      }
    },
    updateUser: (state, action) => {
      const { id, user, role } = action.payload; // Adjusted to match useSignUp dispatch
      if (state.usersData[role]) {
        const userIndex = state.usersData[role].findIndex(u => u._id === id);
        if (userIndex !== -1) {
          state.usersData[role][userIndex] = {
            ...state.usersData[role][userIndex],
            ...user,
          };
        } else {
          state.error = `User with ID ${id} not found in ${role}.`;
        }
      } else {
        state.error = `Role ${role} not found.`;
      }
    },
    addUser: (state, action) => {
      const { user, role } = action.payload; // Destructure user and role
      switch (role) {
        case 'student':
          state.usersData.students = state.usersData.students || [];
          state.usersData.students.push(user); // Push user object, not payload
          break;
        case 'teacher':
          state.usersData.teachers = state.usersData.teachers || [];
          state.usersData.teachers.push(user);
          break;
        case 'admin':
          state.usersData.admins = state.usersData.admins || [];
          state.usersData.admins.push(user);
          break;
        case 'superadmin':
          state.usersData.superAdmins = state.usersData.superAdmins || [];
          state.usersData.superAdmins.push(user);
          break;
        default:
          state.error = `Role ${role} not found.`;
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
  setSubjects,
  updateAcademicYear,
  deleteUser,
  updateUser,
  addUser,
} = adminDataSlice.actions;

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
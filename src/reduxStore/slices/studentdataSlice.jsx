// src/redux/slices/studentSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studentId: null,  // Placeholder for studentId (can be set dynamically)
  assignments: [],  // Array for assignment data
  timetable: [],     // Array for timetable data
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    // Action to set studentId (can be dynamic based on the logged-in student)
    setStudentId(state, action) {
      state.studentId = action.payload;
    },
    
    // Action to set assignments
    setAssignments(state, action) {
      state.assignments = action.payload;
    },
    
    // Action to set timetable
    setTimetable(state, action) {
      state.timetable = action.payload;
    },
    
    // Action to add an individual assignment
    addAssignment(state, action) {
      state.assignments.push(action.payload);
    },
    
    // Action to add an individual timetable entry
    addTimetable(state, action) {
      state.timetable.push(action.payload);
    },

    // Action to clear assignments (if needed)
    clearAssignments(state) {
      state.assignments = [];
    },

    // Action to clear timetable (if needed)
    clearTimetable(state) {
      state.timetable = [];
    },
  },
});

export const {
  setStudentId,
  setAssignments,
  setTimetable,
  addAssignment,
  addTimetable,
  clearAssignments,
  clearTimetable,
} = studentSlice.actions;

export default studentSlice.reducer;

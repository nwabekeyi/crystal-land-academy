import { useMemo, useReducer, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endpoints } from '../../../../../utils/constants';
import useApi from "../../../../../hooks/useApi";
import { setAssignments, setTimetable } from '../../../../../reduxStore/slices/studentdataSlice'; // Import dispatch actions

// Define action types for the reducer
const actionTypes = {
  SET_COURSES: 'SET_COURSES',
  SET_PAST_TIMETABLES: 'SET_PAST_TIMETABLES',
  SET_NEXT_CLASS: 'SET_NEXT_CLASS',
  SET_MISSED_CLASSES: 'SET_MISSED_CLASSES',
  SET_ALL_RESOURCES: 'SET_ALL_RESOURCES', // New action type for resources
};

// Define the initial state
const initialState = {
  courses: [],
  timePastTimetables: [],
  nextClass: null,
  missedClasses: [],
  allResources: [], // New state for all resources
};

// Reducer function to handle state changes
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_COURSES:
      return { ...state, courses: action.payload };
    case actionTypes.SET_PAST_TIMETABLES:
      return { ...state, timePastTimetables: action.payload };
    case actionTypes.SET_NEXT_CLASS:
      return { ...state, nextClass: action.payload };
    case actionTypes.SET_MISSED_CLASSES:
      return { ...state, missedClasses: action.payload };
    case actionTypes.SET_ALL_RESOURCES:
      return { ...state, allResources: action.payload }; // Handle resources
    default:
      return state;
  }
};

const useStudentData = () => {
  const [state, localDispatch] = useReducer(reducer, initialState); // Initialize useReducer
  const { courses, timePastTimetables, nextClass, missedClasses, allResources } = state; // Include resources in destructuring
  const timeTable = useSelector((state) => state.student.timetable);
  const studentData = useSelector((state) => state.users.user);
  const dispatch = useDispatch(); // Initialize redux dispatch
  const { data: timeTableData, callApi: timeTableFetch, loading: timeTableLoading } = useApi();
  const { data: courseData, callApi: courseFetch, loading: courseLoading } = useApi();
  const { data: assignmentData, callApi: assignementFetch, loading: assignmentLoading } = useApi();

  // Fetch timeTable data when student data is available and cohort is present
  useEffect(() => {
    if (studentData && studentData.cohort) {
      timeTableFetch(`${endpoints.TIMETABLE}/${studentData.cohort}`, 'GET');
    }
  }, [studentData, timeTableFetch]);

  useEffect(() => {
    if (studentData && studentData.cohort) {
      assignementFetch(`${endpoints.ASSIGNMENT}/${studentData.cohort}`, 'GET');
    }
  }, [studentData, assignementFetch]);

  // Dispatch timetable data to Redux
  useEffect(() => {
    if (timeTableData && timeTableData.length > 0) {
      dispatch(setTimetable(timeTableData)); // Dispatch timetable data to Redux store
    }
  }, [timeTableData, dispatch]);

  // Dispatch assignment data to Redux store
  useEffect(() => {
    if (assignmentData) {
      dispatch(setAssignments(assignmentData)); // Dispatch assignments data to Redux store
    }
  }, [assignmentData, dispatch]);

  // Fetch courses data
  useEffect(() => {
    courseFetch(`${endpoints.COURSES}`, 'GET');
  }, [courseFetch]);

  // Set courses data when received from the API
  useEffect(() => {
    if (courseData) {
      localDispatch({ type: actionTypes.SET_COURSES, payload: courseData.courses });
    }
  }, [courseData]);

  // Update timePastTimetables when timeTableData is updated
  useEffect(() => {
    if (timeTableData && timeTableData.length > 0) {
      const currentDateTime = new Date();
      const pastTimetables = timeTableData.filter(timetable => {
        const timetableDateTime = new Date(`${timetable.date}T${timetable.time}`);
        return timetableDateTime < currentDateTime;
      });
      localDispatch({ type: actionTypes.SET_PAST_TIMETABLES, payload: pastTimetables });
    }
  }, [timeTableData]);

  // Helper function to format the date
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Find the next class from the timetable data
  useEffect(() => {
    if (timeTableData && timeTableData.length > 0) {
      const currentDateTime = new Date();
      let closestClass = null;

      timeTableData.forEach(timetable => {
        const timetableDateTime = new Date(`${timetable.date.split('T')[0]}T${timetable.time}`);
        if (timetableDateTime > currentDateTime) {
          if (!closestClass || timetableDateTime < new Date(`${closestClass.date.split('T')[0]}T${closestClass.time}`)) {
            closestClass = timetable;
          }
        }
      });

      if (closestClass) {
        const formattedClass = {
          ...closestClass,
          formattedDate: formatDateToDDMMYYYY(closestClass.date),
        };
        localDispatch({ type: actionTypes.SET_NEXT_CLASS, payload: formattedClass });
      }
    }
  }, [timeTableData]);

  // Process courses, curriculum, and missed classes
  const {
    completedCourses,
    remainingCourses,
    progressPercentage,
    attendanceRate,
    outstandings,
  } = useMemo(() => {
    const completedCourses = [];
    const remainingCourses = [];
    const missedClassesList = [];
    let allResources = [];

    timeTable.forEach(topic => {
      if (topic.done && topic.attendance.includes(studentData.userId)) {
        completedCourses.push(topic);
      } else if (!topic.done) {
        remainingCourses.push(topic);
      } else {
        missedClassesList.push(topic);
      }
    });

    // Set missed classes in the reducer
    localDispatch({ type: actionTypes.SET_MISSED_CLASSES, payload: missedClassesList });

    // Collect resources from each course's curriculum
    courses.forEach(course => {
      if (course.curriculum && course.curriculum.length > 0) {
        course.curriculum.forEach(item => {
          allResources = [...allResources, ...item.resources];
        });
      }
    });

    // Dispatch all resources to the reducer
    localDispatch({ type: actionTypes.SET_ALL_RESOURCES, payload: allResources });

    const totalTopics = completedCourses.length + remainingCourses.length;
    const progressPercentage = totalTopics > 0 ? (completedCourses.length / totalTopics) * 100 : 0;
    const attendedClasses = timeTableData && timeTableData.filter(timetable =>
      timetable.attendance.includes(studentData.userId)
    ).length;

    const totalDoneTimetables = timeTableData && timeTableData.length;
    const attendanceRate = totalDoneTimetables > 0 ? (attendedClasses / totalDoneTimetables) * 100 : 0;

    const amountPaid = studentData.amountPaid || 0;
    const totalCost = courses.reduce((acc, course) => {
      const cost = parseInt(course.cost, 10) || 0;
      return acc + cost;
    }, 0);

    const totalOutstanding = totalCost - amountPaid;
    const percentageDifference = totalCost > 0 ? (totalOutstanding / totalCost) * 100 : 0;

    return {
      completedCourses,
      remainingCourses,
      progressPercentage,
      attendanceRate,
      outstandings: { totalOutstanding, percentageDifference, amountPaid },
    };
  }, [courses, timePastTimetables, studentData]);

  return {
    completedCourses,
    remainingCourses,
    progressPercentage,
    timePastTimetables,
    nextClass,
    attendanceRate,
    outstandings,
    studentData,
    missedClasses,
    allResources, // Return resources as part of the data
    loading: timeTableLoading || courseLoading,
    formatDateToDDMMYYYY,
  };
};

export default useStudentData;

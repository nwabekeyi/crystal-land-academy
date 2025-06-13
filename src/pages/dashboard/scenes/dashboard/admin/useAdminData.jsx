import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import {
  setUsersData,
  setAcademicYears,
  setCurrentAcademicYear,
  setError,
} from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect, useState, useCallback } from 'react';
import { endpoints } from '../../../../../utils/constants';

const useAdminData = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const dispatch = useDispatch();

  // Access academic years and current academic year from Redux
  const academicYears = useSelector((state) => state.adminData.academicYears) || [];
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);

  // API hooks
  const {
    loading: studentsLoading,
    data: studentsData,
    error: studentsError,
    callApi: getStudents,
  } = useApi();
  const {
    loading: teachersLoading,
    data: teachersData,
    error: teachersError,
    callApi: getTeachers,
  } = useApi();
  const {
    loading: academicYearsLoading,
    data: academicYearsData,
    error: academicYearsError,
    callApi: getAcademicYears,
  } = useApi();
  const {
    loading: currentYearLoading,
    data: currentYearData,
    error: currentYearError,
    callApi: getCurrentYear,
  } = useApi();

  // Memoized API calls
  const memoizedGetStudents = useCallback(
    () => getStudents(endpoints.STUDENTS, 'GET'),
    [getStudents]
  );
  const memoizedGetTeachers = useCallback(
    () => getTeachers(endpoints.TEACHERS, 'GET'),
    [getTeachers]
  );
  const memoizedGetAcademicYears = useCallback(
    () => getAcademicYears(endpoints.ACADEMIC_YEARS, 'GET'),
    [getAcademicYears]
  );
  const memoizedGetCurrentYear = useCallback(
    () => getCurrentYear(endpoints.CURRENT_ACADEMIC_YEAR, 'GET'),
    [getCurrentYear]
  );

  // Fetch data on mount
  useEffect(() => {
    memoizedGetStudents();
    memoizedGetTeachers();
    memoizedGetAcademicYears();
    memoizedGetCurrentYear();
  }, [
    memoizedGetStudents,
    memoizedGetTeachers,
    memoizedGetAcademicYears,
    memoizedGetCurrentYear,
  ]);

  // Handle students and teachers data
  useEffect(() => {
    if (studentsData || teachersData) {
      const newStudents = studentsData?.data || [];
      const newInstructors = teachersData?.data || [];

      // Update local state
      setStudents((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newStudents) ? newStudents : prev
      );
      setInstructors((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newInstructors)
          ? newInstructors
          : prev
      );

      // Dispatch to Redux
      dispatch(setUsersData({ students: newStudents, instructors: newInstructors }));
    }
  }, [studentsData, teachersData, dispatch]);

  // Handle academic years data
  useEffect(() => {
    if (academicYearsData) {
      const newAcademicYears = academicYearsData?.data || []; // Access data array directly
      dispatch(setAcademicYears(newAcademicYears));
    }
    if (academicYearsError) {
      dispatch(setError(academicYearsError.message || 'Failed to fetch academic years.'));
    }
  }, [academicYearsData, academicYearsError, dispatch]);

  // Handle current academic year data
  useEffect(() => {
    if (currentYearData) {
      const newCurrentYear = currentYearData?.data || null; // Access data object directly
      dispatch(setCurrentAcademicYear(newCurrentYear));
    }
    if (currentYearError) {
      dispatch(setError(currentYearError.message || 'Failed to fetch current academic year.'));
    }
  }, [currentYearData, currentYearError, dispatch]);

  return {
    usersData: {
      students: studentsData?.data || [],
      instructors: teachersData?.data || [],
    },
    academicYears,
    currentAcademicYear,
    loading:
      studentsLoading ||
      teachersLoading ||
      academicYearsLoading ||
      currentYearLoading,
    error: studentsError || teachersError || academicYearsError || currentYearError,
    refetchAcademicYears: memoizedGetAcademicYears, // Added for refetching
    refetchCurrentYear: memoizedGetCurrentYear, // Added for refetching
  };
};

export default useAdminData;
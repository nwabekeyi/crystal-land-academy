import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import {
  setUsersData,
  setAcademicYears,
  setCurrentAcademicYear,
  setClassLevels,
  setError,
} from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect, useState, useCallback } from 'react';
import { endpoints } from '../../../../../utils/constants';

const useAdminData = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);
  const dispatch = useDispatch();

  // Access data from Redux
  const academicYears = useSelector((state) => state.adminData.academicYears) || [];
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const classLevels = useSelector((state) => state.adminData.classLevels) || [];

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

  // Fetch unread enquiries
  const fetchUnreadEnquiries = useCallback(async () => {
    try {
      const response = await fetch(`${endpoints.ENQUIRIES}?status=unread`);
      if (!response.ok) throw new Error('Failed to fetch unread enquiries');
      const data = await response.json();
      const enquiries = data.data || [];
      setUnreadEnquiriesCount(enquiries.length);
    } catch (error) {
      console.error('Error fetching unread enquiries:', error);
    }
  }, []);
  const {
    loading: classLevelsLoading,
    data: classLevelsData,
    error: classLevelsError,
    callApi: getClassLevels,
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
  const memoizedGetClassLevels = useCallback(
    () => getClassLevels(endpoints.CLASS_LEVEL, 'GET'),
    [getClassLevels]
  );

  useEffect(() => {
    memoizedGetStudents();
    memoizedGetTeachers();
    memoizedGetAcademicYears();
    memoizedGetCurrentYear();
    fetchUnreadEnquiries();
    memoizedGetClassLevels();
  }, [
    memoizedGetStudents,
    memoizedGetTeachers,
    memoizedGetAcademicYears,
    memoizedGetCurrentYear,
    fetchUnreadEnquiries,
    memoizedGetClassLevels,
  ]);

  useEffect(() => {
    if (studentsData || teachersData) {
      const newStudents = studentsData?.data || [];
      const newInstructors = teachersData?.data || [];
      setStudents((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newStudents) ? newStudents : prev
      );
      setInstructors((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newInstructors)
          ? newInstructors
          : prev
      );
      dispatch(setUsersData({ students: newStudents, instructors: newInstructors }));
    }
  }, [studentsData, teachersData, dispatch]);

  useEffect(() => {
    if (academicYearsData) {
      const newAcademicYears = academicYearsData?.data || [];
      dispatch(setAcademicYears(newAcademicYears));
    }
    if (academicYearsError) {
      dispatch(setError(academicYearsError.message || 'Failed to fetch academic years.'));
    }
  }, [academicYearsData, academicYearsError, dispatch]);

  useEffect(() => {
    if (currentYearData) {
      const newCurrentYear = currentYearData?.data || null;
      dispatch(setCurrentAcademicYear(newCurrentYear));
    }
    if (currentYearError) {
      dispatch(setError(currentYearError.message || 'Failed to fetch current academic year.'));
    }
  }, [currentYearData, currentYearError, dispatch]);

  // Handle class levels data
  useEffect(() => {
    if (classLevelsData) {
      const newClassLevels = classLevelsData?.data || [];
      dispatch(setClassLevels(newClassLevels));
    }
    if (classLevelsError) {
      dispatch(setError(classLevelsError.message || 'Failed to fetch class levels.'));
    }
  }, [classLevelsData, classLevelsError, dispatch]);

  return {
    usersData: {
      students: studentsData?.data || [],
      instructors: teachersData?.data || [],
    },
    academicYears,
    currentAcademicYear,
    unreadEnquiriesCount,
    classLevels,
    loading:
      studentsLoading ||
      teachersLoading ||
      academicYearsLoading ||
      currentYearLoading ||
      classLevelsLoading,
    error: studentsError || teachersError || academicYearsError || currentYearError || classLevelsError,
    refetchAcademicYears: memoizedGetAcademicYears,
    refetchCurrentYear: memoizedGetCurrentYear,
    refetchClassLevels: memoizedGetClassLevels,
  };
};

export default useAdminData;

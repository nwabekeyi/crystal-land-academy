import { useDispatch, useSelector } from 'react-redux';
import  useApi  from '../../../../../hooks/useApi';
import {
  setUsersData,
  setAcademicYears,
  setCurrentAcademicYear,
  setClassLevels,
  setSubjects,
  setError,
} from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect, useState, useCallback } from 'react';
import { endpoints } from '../../../../../utils/constants';

const useAdminData = () => {
  // Local state for students and teachers
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const dispatch = useDispatch();

  // Access data from Redux
  const academicYears = useSelector((state) => state.adminData.academicYears) || [];
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const classLevels = useSelector((state) => state.adminData.classLevels) || [];
  const subjects = useSelector((state) => state.adminData.subjects) || [];

  // Log Redux classLevels to verify state updates
  console.log('Redux classLevels:', classLevels);

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
  const {
    loading: classLevelsLoading,
    data: classLevelsData,
    error: classLevelsError,
    callApi: getClassLevels,
  } = useApi();
  const {
    loading: subjectsLoading,
    data: subjectsData,
    error: subjectsError,
    callApi: getSubjects,
  } = useApi();

  // Memoized API calls
  const memoizedGetStudents = useCallback(
    () => {
      console.log('Fetching students from:', endpoints.STUDENTS);
      return getStudents(endpoints.STUDENTS, 'GET');
    },
    [getStudents]
  );
  const memoizedGetTeachers = useCallback(
    () => {
      console.log('Fetching teachers from:', endpoints.TEACHERS);
      return getTeachers(endpoints.TEACHERS, 'GET');
    },
    [getTeachers]
  );
  const memoizedGetAcademicYears = useCallback(
    () => {
      console.log('Fetching academic years from:', endpoints.ACADEMIC_YEARS);
      return getAcademicYears(endpoints.ACADEMIC_YEARS, 'GET');
    },
    [getAcademicYears]
  );
  const memoizedGetCurrentYear = useCallback(
    () => {
      console.log('Fetching current academic year from:', endpoints.CURRENT_ACADEMIC_YEAR);
      return getCurrentYear(endpoints.CURRENT_ACADEMIC_YEAR, 'GET');
    },
    [getCurrentYear]
  );
  const memoizedGetClassLevels = useCallback(
    () => {
      console.log('Fetching class levels from:', endpoints.CLASS_LEVEL);
      return getClassLevels(endpoints.CLASS_LEVEL, 'GET');
    },
    [getClassLevels]
  );
  const memoizedGetSubjects = useCallback(
    () => {
      console.log('Fetching subjects from:', endpoints.SUBJECT);
      return getSubjects(endpoints.SUBJECT, 'GET');
    },
    [getSubjects]
  );

  // Fetch data on mount
  useEffect(() => {
    memoizedGetStudents();
    memoizedGetTeachers();
    memoizedGetAcademicYears();
    memoizedGetCurrentYear();
    memoizedGetClassLevels();
    memoizedGetSubjects();
  }, [
    memoizedGetStudents,
    memoizedGetTeachers,
    memoizedGetAcademicYears,
    memoizedGetCurrentYear,
    memoizedGetClassLevels,
    memoizedGetSubjects,
  ]);

  // Handle students and teachers data
  useEffect(() => {
    if (studentsData || teachersData) {
      console.log('Students Data:', studentsData);
      console.log('Teachers Data:', teachersData);
      const newStudents = studentsData?.data || [];
      const newTeachers = teachersData?.data || [];

      // Update local state
      setStudents((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newStudents) ? newStudents : prev
      );
      setTeachers((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newTeachers) ? newTeachers : prev
      );

      // Dispatch to Redux
      dispatch(setUsersData({ students: newStudents, teachers: newTeachers }));
    }
    if (studentsError) {
      console.error('Students Error:', studentsError);
      dispatch(setError(studentsError.message || 'Failed to fetch students.'));
    }
    if (teachersError) {
      console.error('Teachers Error:', teachersError);
      dispatch(setError(teachersError.message || 'Failed to fetch teachers.'));
    }
  }, [studentsData, teachersData, studentsError, teachersError, dispatch]);

  // Handle academic years data
  useEffect(() => {
    if (academicYearsData) {
      console.log('Academic Years Data:', academicYearsData);
      const newAcademicYears = academicYearsData?.data || [];
      dispatch(setAcademicYears(newAcademicYears));
    }
    if (academicYearsError) {
      console.error('Academic Years Error:', academicYearsError);
      dispatch(setError(academicYearsError.message || 'Failed to fetch academic years.'));
    }
  }, [academicYearsData, academicYearsError, dispatch]);

  // Handle current academic year data
  useEffect(() => {
    if (currentYearData) {
      console.log('Current Academic Year Data:', currentYearData);
      const newCurrentYear = currentYearData?.data || null;
      dispatch(setCurrentAcademicYear(newCurrentYear));
    }
    if (currentYearError) {
      console.error('Current Academic Year Error:', currentYearError);
      dispatch(setError(currentYearError.message || 'Failed to fetch current academic year.'));
    }
  }, [currentYearData, currentYearError, dispatch]);

  // Handle class levels data
  useEffect(() => {
    console.log('Class Levels Data:', classLevelsData);
    if (classLevelsData) {
      // Handle different API response structures
      const newClassLevels = Array.isArray(classLevelsData)
        ? classLevelsData
        : classLevelsData?.data || classLevelsData?.classLevels || [];
      console.log('New Class Levels to Dispatch:', newClassLevels);
      if (newClassLevels.length === 0) {
        console.warn('Class levels data is empty. Is this expected?');
      }
      dispatch(setClassLevels(newClassLevels));
    }
    if (classLevelsError) {
      console.error('Class Levels Error:', classLevelsError);
      dispatch(setError(classLevelsError.message || 'Failed to fetch class levels.'));
    }
  }, [classLevelsData, classLevelsError, dispatch]);

  // Handle subjects data
  useEffect(() => {
    if (subjectsData) {
      console.log('Subjects Data:', subjectsData);
      const newSubjects = subjectsData?.data || [];
      dispatch(setSubjects(newSubjects));
    }
    if (subjectsError) {
      console.error('Subjects Error:', subjectsError);
      dispatch(setError(subjectsError.message || 'Failed to fetch subjects.'));
    }
  }, [subjectsData, subjectsError, dispatch]);

  // Consolidated error object
  const error = [
    studentsError,
    teachersError,
    academicYearsError,
    currentYearError,
    classLevelsError,
    subjectsError,
  ].find((err) => err) || null;

  return {
    usersData: {
      students: studentsData?.data || [],
      teachers: teachersData?.data || [],
    },
    academicYears,
    currentAcademicYear,
    classLevels,
    subjects,
    loading:
      studentsLoading ||
      teachersLoading ||
      academicYearsLoading ||
      currentYearLoading ||
      classLevelsLoading ||
      subjectsLoading,
    error,
    refetchAcademicYears: memoizedGetAcademicYears,
    refetchCurrentYear: memoizedGetCurrentYear,
    refetchClassLevels: memoizedGetClassLevels,
    refetchSubjects: memoizedGetSubjects,
  };
};

export default useAdminData;
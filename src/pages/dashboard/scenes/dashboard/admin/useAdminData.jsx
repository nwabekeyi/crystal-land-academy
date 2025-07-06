// hooks/useAdminData.jsx
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import {
  setUsersData,
  setAcademicYears,
  setCurrentAcademicYear,
  setClassLevels,
  setSubjects,
  setError,
} from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { endpoints } from '../../../../../utils/constants';

const useAdminData = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);
  const dispatch = useDispatch();

  const academicYears = useSelector((state) => state.adminData.academicYears) || [];
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const classLevels = useSelector((state) => state.adminData.classLevels) || [];
  const subjects = useSelector((state) => state.adminData.subjects) || [];

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
  const {
    loading: financialDataLoading,
    data: financialData,
    error: financialDataError,
    callApi: getFinancialData,
  } = useApi();
  const {
    loading: outstandingFeesLoading,
    data: outstandingFeesData,
    error: outstandingFeesError,
    callApi: getOutstandingFees,
  } = useApi();

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

  const memoizedGetStudents = useCallback(() => {
    console.log('Fetching students from:', endpoints.STUDENTS);
    return getStudents(endpoints.STUDENTS, 'GET');
  }, [getStudents]);

  const memoizedGetTeachers = useCallback(() => {
    console.log('Fetching teachers from:', endpoints.TEACHERS);
    return getTeachers(endpoints.TEACHERS, 'GET');
  }, [getTeachers]);

  const memoizedGetAcademicYears = useCallback(() => {
    console.log('Fetching academic years from:', endpoints.ACADEMIC_YEARS);
    return getAcademicYears(endpoints.ACADEMIC_YEARS, 'GET');
  }, [getAcademicYears]);

  const memoizedGetCurrentYear = useCallback(() => {
    console.log('Fetching current academic year from:', endpoints.CURRENT_ACADEMIC_YEAR);
    return getCurrentYear(endpoints.CURRENT_ACADEMIC_YEAR, 'GET');
  }, [getCurrentYear]);

  const memoizedGetClassLevels = useCallback(() => {
    console.log('Fetching class levels from:', endpoints.CLASS_LEVEL);
    return getClassLevels(endpoints.CLASS_LEVEL, 'GET');
  }, [getClassLevels]);

  const memoizedGetSubjects = useCallback(() => {
    console.log('Fetching subjects from:', endpoints.SUBJECT);
    return getSubjects(endpoints.SUBJECT, 'GET');
  }, [getSubjects]);

  const memoizedGetFinancialData = useCallback(() => {
    console.log('Fetching financial data from:', endpoints.SCHOOL_FEES_DATA);
    return getFinancialData(endpoints.SCHOOL_FEES_DATA, 'GET');
  }, [getFinancialData]);

  const memoizedGetOutstandingFees = useCallback(() => {
    console.log('Fetching outstanding fees from:', endpoints.OUTSTANDING_FEES_DATA);
    return getOutstandingFees(endpoints.OUTSTANDING_FEES_DATA, 'GET');
  }, [getOutstandingFees]);

  useEffect(() => {
    memoizedGetStudents();
    memoizedGetTeachers();
    memoizedGetAcademicYears();
    memoizedGetCurrentYear();
    fetchUnreadEnquiries();
    memoizedGetClassLevels();
    memoizedGetSubjects();
    memoizedGetFinancialData();
    memoizedGetOutstandingFees();
  }, [
    memoizedGetStudents,
    memoizedGetTeachers,
    memoizedGetAcademicYears,
    memoizedGetCurrentYear,
    fetchUnreadEnquiries,
    memoizedGetClassLevels,
    memoizedGetSubjects,
    memoizedGetFinancialData,
    memoizedGetOutstandingFees,
  ]);

  useEffect(() => {
    if (studentsData || teachersData) {
      const newStudents = studentsData?.data || [];
      const newTeachers = teachersData?.data || [];
      console.log('Students Data:', newStudents);
      setStudents((prev) => (JSON.stringify(prev) !== JSON.stringify(newStudents) ? newStudents : prev));
      setTeachers((prev) => (JSON.stringify(prev) !== JSON.stringify(newTeachers) ? newTeachers : prev));
      dispatch(setUsersData({ students: newStudents, teachers: newTeachers }));
    }
    if (studentsError) {
      console.error('Students Error:', studentsError);
      dispatch(setError(studentsError.message || 'Failed to fetch students.'));
    }
    if (teachersError) {
      dispatch(setError(teachersError.message || 'Failed to fetch teachers.'));
    }
  }, [studentsData, teachersData, studentsError, teachersError, dispatch]);

  useEffect(() => {
    if (academicYearsData) {
      const newAcademicYears = academicYearsData?.data || [];
      console.log('Academic Years Data:', newAcademicYears);
      dispatch(setAcademicYears(newAcademicYears));
    }
    if (academicYearsError) {
      console.error('Academic Years Error:', academicYearsError);
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

  useEffect(() => {
    if (classLevelsData) {
      const newClassLevels = Array.isArray(classLevelsData)
        ? classLevelsData
        : classLevelsData?.data || classLevelsData?.classLevels || [];
      dispatch(setClassLevels(newClassLevels));
    }
    if (classLevelsError) {
      dispatch(setError(classLevelsError.message || 'Failed to fetch class levels.'));
    }
  }, [classLevelsData, classLevelsError, dispatch]);

  useEffect(() => {
    if (subjectsData) {
      const newSubjects = subjectsData?.data || [];
      dispatch(setSubjects(newSubjects));
    }
    if (subjectsError) {
      dispatch(setError(subjectsError.message || 'Failed to fetch subjects.'));
    }
  }, [subjectsData, subjectsError, dispatch]);

  useEffect(() => {
    if (financialData) {
      console.log('Raw Financial Data:', financialData);
      console.log('Processed Financial Data:', financialData?.data?.data || financialData?.data || {});
    }
    if (financialDataError) {
      console.error('Financial Data Error:', financialDataError);
      dispatch(setError(financialDataError.message || 'Failed to fetch financial data.'));
    }
  }, [financialData, financialDataError, dispatch]);

  useEffect(() => {
    if (outstandingFeesData) {
      console.log('Raw Outstanding Fees Data:', outstandingFeesData);
      console.log('Processed Outstanding Fees Data:', outstandingFeesData?.data || []);
    }
    if (outstandingFeesError) {
      console.error('Outstanding Fees Error:', outstandingFeesError);
      dispatch(setError(outstandingFeesError.message || 'Failed to fetch outstanding fees data.'));
    }
  }, [outstandingFeesData, outstandingFeesError, dispatch]);

  // Compute enrollment data
  const enrollmentData = useMemo(() => {
    if (!academicYearsData?.data) {
      console.log('Missing academicYearsData:', academicYearsData);
      return { total: [] };
    }

    const academicYears = academicYearsData.data;
    console.log('Academic Years Data:', academicYears);
    console.log('Students Data:', studentsData?.data);

    // Total enrollment per academic year
    const totalData = academicYears.map((year) => {
      const yearStudents = (studentsData?.data || []).filter((student) =>
        year.students.includes(String(student._id))
      );
      return {
        id: `Total-${year.name}`,
        academicYear: year.name,
        value: year.students.length, // Use year.students.length directly
      };
    });

    return {
      total: totalData.filter((item) => item.value > 0),
    };
  }, [academicYearsData, studentsData]);

  useEffect(() => {
    console.log('Enrollment Data:', enrollmentData);
  }, [enrollmentData]);

  const error = [
    studentsError,
    teachersError,
    academicYearsError,
    currentYearError,
    classLevelsError,
    subjectsError,
    financialDataError,
    outstandingFeesError,
  ].find((err) => err) || null;

  return {
    usersData: {
      students: studentsData?.data || [],
      teachers: teachersData?.data || [],
    },
    academicYears,
    currentAcademicYear,
    unreadEnquiriesCount,
    classLevels,
    subjects,
    financialData: financialData?.data?.data || financialData?.data || { primary: [], secondary: [] },
    outstandingFeesData: Array.isArray(outstandingFeesData?.data) ? outstandingFeesData.data : [],
    enrollmentData,
    financialDataLoading,
    financialDataError,
    outstandingFeesLoading,
    outstandingFeesError,
    enrollmentDataLoading: studentsLoading || academicYearsLoading,
    enrollmentDataError: studentsError || academicYearsError,
    loading:
      studentsLoading ||
      teachersLoading ||
      academicYearsLoading ||
      currentYearLoading ||
      classLevelsLoading ||
      subjectsLoading ||
      financialDataLoading ||
      outstandingFeesLoading,
    error,
    refetchAcademicYears: memoizedGetAcademicYears,
    refetchCurrentYear: memoizedGetCurrentYear,
    refetchClassLevels: memoizedGetClassLevels,
    refetchSubjects: memoizedGetSubjects,
    refetchFinancialData: memoizedGetFinancialData,
    refetchOutstandingFees: memoizedGetOutstandingFees,
  };
};

export default useAdminData;
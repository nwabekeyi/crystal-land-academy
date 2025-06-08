import { useDispatch } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import { setUsersData } from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect, useState, useCallback } from 'react';
import { endpoints } from '../../../../../utils/constants';

const useAdminData = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const dispatch = useDispatch();

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

  const memoizedGetStudents = useCallback(
    () => getStudents(endpoints.STUDENTS, 'GET'),
    [getStudents]
  );
  const memoizedGetTeachers = useCallback(
    () => getTeachers(endpoints.TEACHERS, 'GET'),
    [getTeachers]
  );

  useEffect(() => {
    memoizedGetStudents();
    memoizedGetTeachers();
  }, [memoizedGetStudents, memoizedGetTeachers]);

  useEffect(() => {
    if (studentsData || teachersData) {
      // Extract students and teachers directly from response.data
      const newStudents = studentsData?.data || [];
      const newInstructors = teachersData?.data || [];

      // Update local state only if data has changed
      setStudents((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newStudents) ? newStudents : prev
      );
      setInstructors((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newInstructors)
          ? newInstructors
          : prev
      );

      // Dispatch to Redux store
      dispatch(setUsersData({ students: newStudents, instructors: newInstructors }));
    }
  }, [studentsData, teachersData, dispatch]);

  return {
    usersData: {
      students: studentsData?.data || [],
      instructors: teachersData?.data || [],
    },
    loading: studentsLoading || teachersLoading,
    error: studentsError || teachersError,
  };
};

export default useAdminData;
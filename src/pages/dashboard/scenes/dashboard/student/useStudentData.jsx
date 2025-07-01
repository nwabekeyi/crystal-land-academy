import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import { endpoints } from '../../../../../utils/constants';
import { setCurrentAcademicYear } from '../../../../../reduxStore/slices/adminDataSlice';

export default function useStudentData() {
  const [dashboardData, setDashboardData] = useState({
    sessionProgress: 0,
    termAttendance: 0,
    feeStatus: { percentagePaid: 0, totalOutstanding: 0 },
    nextClass: null,
    missedClasses: [],
    subjectPerformance: null,
    allResources: [],
    loading: false,
    error: null,
  });

  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.users.user?._id);
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);

  const { callApi, loading, error } = useApi();

  const fetchStudentData = useCallback(async () => {
    if (!studentId) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: 'Student ID not found. Please log in.',
      }));
      return;
    }

    setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch current academic year
      const response = await callApi(endpoints.CURRENT_ACADEMIC_YEAR, 'GET');
      if (response && response.status === 'success') {
        const { data } = response;
        dispatch(setCurrentAcademicYear(data || null));

        // Placeholder for other student data (to be replaced with actual API calls)
        setDashboardData({
          sessionProgress: 66, // Replace with API call when available
          termAttendance: 95, // Replace with API call
          feeStatus: { percentagePaid: 80, totalOutstanding: 200 }, // Replace with API call
          nextClass: null, // Replace with API call (e.g., student timetable)
          missedClasses: [], // Replace with API call
          subjectPerformance: null, // Replace with API call
          allResources: [], // Replace with API call
          loading: false,
          error: null,
        });
      } else {
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: response?.message || 'Failed to fetch student dashboard data',
        }));
      }
    } catch (err) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch student dashboard data',
      }));
    }
  }, [studentId, callApi, dispatch]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const formatDateToDDMMYYYY = (date) => new Date(date).toLocaleDateString('en-GB');

  return {
    ...dashboardData,
    currentAcademicYear,
    formatDateToDDMMYYYY,
  };
}
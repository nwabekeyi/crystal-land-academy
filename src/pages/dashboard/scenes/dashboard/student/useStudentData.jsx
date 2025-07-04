// src/hooks/useStudentData.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import { BASE_URL } from '../../../../../utils/constants';
import { setCurrentAcademicYear } from '../../../../../reduxStore/slices/adminDataSlice';

export default function useStudentData() {
  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.users.user?._id);
  const userId = useSelector((state) => state.users.user?.userId); // For PerformanceLineChart
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const { callApi, loading, error } = useApi();
  const [dashboardData, setDashboardData] = useState({
    sessionProgress: 0,
    termAttendance: 0,
    feeStatus: { percentagePaid: 0, totalOutstanding: 0 },
    nextClass: null,
    missedClasses: [],
    subjectPerformance: null,
    allResources: [],
    assignments: [],
    timetable: [],
    loading: false,
    error: null,
  });

  const fetchStudentData = useCallback(async () => {
    if (!studentId) {
      setDashboardData({
        sessionProgress: 0,
        termAttendance: 0,
        feeStatus: { percentagePaid: 0, totalOutstanding: 0 },
        nextClass: null,
        missedClasses: [],
        subjectPerformance: null,
        allResources: [],
        assignments: [],
        timetable: [],
        loading: false,
        error: 'Student ID not found. Please log in.',
      });
      return;
    }

    setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await callApi(`${BASE_URL}/student-dashboard/${studentId}`, 'GET');
      if (response && response.status === 'success') {
        const { data } = response;
        dispatch(setCurrentAcademicYear(data.currentAcademicYear || null));
        setDashboardData({
          sessionProgress: data.sessionProgress || 0,
          termAttendance: data.termAttendance || 0,
          feeStatus: data.feeStatus || { percentagePaid: 0, totalOutstanding: 0 },
          nextClass: data.nextClass || null,
          missedClasses: data.missedClasses || [],
          subjectPerformance: data.subjectPerformance || null,
          allResources: data.allResources || [],
          assignments: data.assignments || [],
          timetable: data.timetable || [],
          loading: false,
          error: null,
        });
      } else {
        setDashboardData({
          sessionProgress: 0,
          termAttendance: 0,
          feeStatus: { percentagePaid: 0, totalOutstanding: 0 },
          nextClass: null,
          missedClasses: [],
          subjectPerformance: null,
          allResources: [],
          assignments: [],
          timetable: [],
          loading: false,
          error: response?.message || 'Failed to fetch student dashboard data',
        });
      }
    } catch (err) {
      setDashboardData({
        sessionProgress: 0,
        termAttendance: 0,
        feeStatus: { percentagePaid: 0, totalOutstanding: 0 },
        nextClass: null,
        missedClasses: [],
        subjectPerformance: null,
        allResources: [],
        assignments: [],
        timetable: [],
        loading: false,
        error: err.message || 'Failed to fetch student dashboard data',
      });
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
    userId, // For PerformanceLineChart
  };
}
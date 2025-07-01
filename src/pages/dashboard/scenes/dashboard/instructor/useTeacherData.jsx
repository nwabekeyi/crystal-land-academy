import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useApi from '../../../../../hooks/useApi';
import { BASE_URL } from '../../../../../utils/constants';

export default function useTeacherData() {
  const [dashboardData, setDashboardData] = useState({
    termProgress: 0,
    studentAttendance: 0,
    assignmentSubmissionRate: { totalAssignmentRate: 0 },
    nextClass: null,
    topStudents: [],
    leastActiveStudents: [],
    loading: false,
    error: null,
  });

  const { callApi, loading, error } = useApi();
  const teacherId = useSelector((state) => state.users.user?._id);

  const fetchTeacherData = useCallback(async () => {
    if (!teacherId) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: 'Teacher ID not found. Please log in.',
      }));
      return;
    }

    setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await callApi(`${BASE_URL}/teacher-dashboard/${teacherId}`, 'GET');
      if (response && response.status === 'success') {
        const { data } = response; // Extract the 'data' field
        setDashboardData({
          termProgress: data.termProgress || 0,
          studentAttendance: data.studentAttendance || 0,
          assignmentSubmissionRate: data.assignmentSubmissionRate || { totalAssignmentRate: 0 },
          nextClass: data.nextClass || null,
          topStudents: data.topStudents || [],
          leastActiveStudents: data.leastActiveStudents || [],
          loading: false,
          error: null,
        });
      } else {
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: response?.message || 'Failed to fetch teacher dashboard data',
        }));
      }
    } catch (err) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch teacher dashboard data',
      }));
    }
  }, [teacherId, callApi]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  return dashboardData;
}
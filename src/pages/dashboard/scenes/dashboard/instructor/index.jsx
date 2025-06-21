// src/pages/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import Loader from '../../../../../utils/loader';
import {
  DashboardDataBox,
  RowGrid,
  RowContainer,
  ResponsiveContainer,
} from '../../../components/dashbaordDataBox';
import TermProgress from './termProgress';
import StudentAttendance from './studentAttendance';
import AssignmentSubmissions from './assignmentSubmissions';
import NextClass from './nextClass';
import EventCalendar from './eventCalendar';
import Announcements from './announcements';
import TopStudents from './topStudents';
import LeastActiveStudents from './leastActiveStudents';
import useTeacherData from './useTeacherData';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: dataLoading, error: hookError } = useTeacherData(); // Assumed to return loading and error

  useEffect(() => {
    if (!dataLoading) {
      setLoading(false);
    }
    if (hookError) {
      setError(hookError.message || 'An error occurred while fetching data.');
    }
  }, [dataLoading, hookError]);

  if (loading || dataLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box m="20px">
        <Typography variant="h4" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Typography variant="h3" fontWeight="600" mb="20px">
        Teacher Dashboard
      </Typography>
      <RowGrid>
        {/* Row 1: Term Progress, Student Attendance, Assignment Submissions, Next Class */}
        <RowContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <TermProgress />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <StudentAttendance />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <AssignmentSubmissions />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <NextClass />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Row 2: Event Calendar, Announcements */}
        <RowContainer>
          <ResponsiveContainer md={8}>
            <DashboardDataBox noFlex moreStyles={{ height: '500px', overflowY: 'auto' }}>
              <EventCalendar />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '500px', overflowY: 'auto' }}>
              <Announcements />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Row 3: Top Students, Least Active Students */}
        <RowContainer>
          <ResponsiveContainer md={6}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <TopStudents />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={6}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <LeastActiveStudents />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>
      </RowGrid>
    </Box>
  );
};

export default Instructor;
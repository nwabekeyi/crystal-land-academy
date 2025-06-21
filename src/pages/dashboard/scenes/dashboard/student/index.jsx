// src/pages/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import Loader from '../../../../../utils/loader';
import {
  DashboardDataBox,
  RowGrid,
  RowContainer,
  ResponsiveContainer,
} from '../../../components/dashbaordDataBox';
import SessionProgress from './sessionProgress';
import TermAttendance from './termAttendance';
import FeePaymentStatus from './feePaymentStatus';
import NextClass from './nextClass';
import SubjectPerformance from './subjectPerformance';
import MissedClasses from './missedClasses';
import Announcements from './announcements';
import UsefulResources from './usefulResources';
import StudentActivities from './studentActivities';
import useStudentData from './useStudentData';

const StudentDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: dataLoading, error: hookError } = useStudentData(); // Assumed to return loading and error

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
        Student Dashboard
      </Typography>
      <RowGrid>
        {/* First Row: Session Progress, Term Attendance, Fee Payment, Next Class */}
        <RowContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <SessionProgress />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <TermAttendance />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <FeePaymentStatus />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox noFlex>
              <NextClass />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Second Row: Subject Performance, Missed Classes */}
        <RowContainer>
          <ResponsiveContainer md={8}>
            <DashboardDataBox height="350px" noFlex>
              <Typography variant="h5" fontWeight="600" textAlign="center" mb="10px">
                Subject Performance
              </Typography>
              <SubjectPerformance />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex>
              <MissedClasses />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Third Row: Announcements, Useful Resources */}
        <RowContainer>
          <ResponsiveContainer md={6}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Announcements />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={6}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <UsefulResources />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Fourth Row: School Activities */}
        <RowContainer>
          <ResponsiveContainer md={12}>
            <DashboardDataBox noFlex>
              <Typography variant="h5" fontWeight="600" textAlign="center" mb="10px">
                School Activities
              </Typography>
              <StudentActivities />
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>
      </RowGrid>
    </Box>
  );
};

export default StudentDashboard;
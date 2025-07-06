// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import GroupsIcon from '@mui/icons-material/Groups';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Loader from '../../../../../utils/loader';
import {
  DashboardDataBox,
  RowGrid,
  RowContainer,
  ResponsiveContainer,
} from '../../../components/dashbaordDataBox';
import PopulationChart from './populationChart';
import RevenueChart from './revenueChart';
import SchoolActivities from '../../calendar/schoolActivities';
import OutstandingPayments from './outstandingPayments';
import TopTeachers from './topTeachers';
import useAdminData from './useAdminData';
import EnrollmentStats from './enrollmenttStats';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [newStudents, setNewStudents] = useState(0);
  const [error, setError] = useState(null);

  const { usersData, currentAcademicYear, unreadEnquiriesCount, loading: dataLoading, error: hookError } = useAdminData();

  useEffect(() => {
    if (usersData && (currentAcademicYear || currentAcademicYear === null)) {
      setLoading(false);
      setStudents(usersData.students?.length || 0);
      setInstructors(usersData.teachers?.length || 0);
      setNewStudents(currentAcademicYear?.students?.length || 0);
    }
    if (hookError) {
      setError(hookError.message || 'An error occurred while fetching data.');
    }
  }, [usersData, currentAcademicYear, hookError]);

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

  const statStyle = { mt: '15px', fontWeight: 'bold' };

  // Calculate total revenue from RevenueChart dummy data
  const totalRevenue =
    50000 + 52000 + 48000 + 45000 + 51000 + 53000 + 55000 + 54000 + 52000 + 50000 + // Primary
    70000 + 72000 + 68000 + 65000 + 71000 + 73000 + 75000 + 74000 + 72000 + 70000; // Secondary

  return (
    <Box m="20px">
      <Typography variant="h3" fontWeight="600" mb="20px">School Administration Dashboard</Typography>
      <RowGrid>
        {/* Row 1: Summary Stats */}
        <RowContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">Students</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <GroupsIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>{`${students} students`}</Typography>
                <Typography>Total students</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">Teachers</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <SchoolIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>{`${instructors} teachers`}</Typography>
                <Typography>Total teachers</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">New Students</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <PersonAddIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>{`${newStudents} students`}</Typography>
                <Typography>New students this academic year</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">Unread Enquiries</Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <MailOutlineIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>{unreadEnquiriesCount}</Typography>
                <Typography>Total unread enquiries</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Row 2: Revenue and Outstanding Payments */}
        <RowContainer>
          <ResponsiveContainer md={8}>
            <DashboardDataBox noFlex>
              <Typography variant="h5" fontWeight="600" textAlign="center">School fees data</Typography>
              <Box mt="10px">
                <RevenueChart />
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex>
              <Typography variant="h5" fontWeight="600" textAlign="center">Outstanding Payments</Typography>
              <Box mt="10px">
                <OutstandingPayments />
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Row 3: Enrollmwent Stats, Top Teachers, Classes */}
        <RowContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>Enrollment Stats</Typography>
              <Box mt="10px">
                <EnrollmentStats />
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>Top Teachers</Typography>
              <Box mt="10px">
                <TopTeachers />
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>Class Distribution</Typography>
              <Box mt="10px">
                <PopulationChart />
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Row 4: School Activities */}
        <RowContainer>
          <ResponsiveContainer md={12}>
            <DashboardDataBox noFlex>
              <Typography variant="h5" fontWeight="600" textAlign="center">School Activities</Typography>
              <Box mt="10px">
                <SchoolActivities />
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>
      </RowGrid>
    </Box>
  );
};

export default Admin;
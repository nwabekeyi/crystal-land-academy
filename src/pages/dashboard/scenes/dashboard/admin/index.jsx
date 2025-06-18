import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  tokens
} from '../../../theme';
import GroupsIcon from '@mui/icons-material/Groups';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useAdminData from './useAdminData';
import { useState, useEffect } from 'react';
import Loader from '../../../../../utils/loader';
import {
  DashboardDataBox,
  RowGrid,
  RowContainer,
  ResponsiveContainer
} from '../../../components/dashbaordDataBox';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [newStudents, setNewStudents] = useState(0);

  const {
    usersData,
    currentAcademicYear,
    unreadEnquiriesCount,
    loading: dataLoading,
  } = useAdminData();

  useEffect(() => {
    if (usersData && (currentAcademicYear || currentAcademicYear === null)) {
      setLoading(false);
      setInstructors(usersData.instructors?.length || 0);
      setStudents(usersData.students?.length || 0);
      setNewStudents(currentAcademicYear?.students?.length || 0);
    }
  }, [usersData, currentAcademicYear]);

  if (loading || dataLoading) {
    return <Loader />;
  }

  const statStyle = {
    mt: '15px',
    fontWeight: 'bold'
  };

  return (
    <Box>
      <RowGrid>
        <RowContainer>
          {/* Students */}
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">
                Students
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <GroupsIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                  {`${students} students`}
                </Typography>
                <Typography>Total students</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>

          {/* Teachers */}
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">
                Teachers
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <SchoolIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                  {`${instructors} teachers`}
                </Typography>
                <Typography>Total teachers</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>

          {/* New Students */}
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">
                New Students
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <PersonAddIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                  {`${newStudents} students`}
                </Typography>
                <Typography>New students this academic year</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>

          {/* Unread Enquiries */}
          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">
                Unread Enquiries
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <MailOutlineIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                  {unreadEnquiriesCount}
                </Typography>
                <Typography>Total unread enquiries</Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>
        <RowContainer>
          <ResponsiveContainer md={8}>
            <DashboardDataBox noFlex>
              <Typography variant="h5" fontWeight="600" textAlign="center">
                Revenue Generated
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <Typography variant="body1"> </Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>

          <ResponsiveContainer md={4}>
            <DashboardDataBox>
              <Typography variant="h5" fontWeight="600" textAlign="center">
                Outstanding Payments
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <Typography variant="body1"> </Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* Row 3 - Blank */}
        <RowContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>
                Subject Stats
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <Typography variant="body1"> </Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>

          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>
                Top Teachers
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <Typography variant="body1"> </Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>

          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>
                Classes
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <Typography variant="body1"> </Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>
      </RowGrid>
    </Box>
  );
};

export default Admin;

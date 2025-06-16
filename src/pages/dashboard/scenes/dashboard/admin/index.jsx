import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import GroupsIcon from '@mui/icons-material/Groups';
import MailOutlineIcon from '@mui/icons-material/MailOutline'; // Icon for enquiries
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Added for New Students
import useAdminData from './useAdminData';
import { useState, useEffect } from 'react';
import Loader from '../../../../../utils/loader';
import { endpoints } from '../../../../../utils/constants'; // Import endpoints
import { DashboardDataBox, RowGrid, RowContainer, ResponsiveContainer, } from '../../../components/dashbaordDataBox';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0); // State for unread enquiries count
  const [newStudents, setNewStudents] = useState(0); // Added for New Students
  const {
    usersData, 
    loading: dataLoading,
    currentAcademicYear
  } = useAdminData();
  console.log(currentAcademicYear)

  // Fetch unread enquiries count
  useEffect(() => {
    const fetchUnreadEnquiries = async () => {
      try {
        const response = await fetch(`${endpoints.ENQUIRIES}?status=unread`); // Use the ENQUIRIES endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch unread enquiries');
        }

        const responseData = await response.json();
        console.log('API Response:', responseData); // Log the response to inspect its structure

        // Access the enquiries array from the response
        const enquiries = responseData.data || []; // Default to an empty array if data is undefined
        setUnreadEnquiriesCount(enquiries.length); // Set the count of unread enquiries
      } catch (error) {
        console.error('Error fetching unread enquiries:', error);
      }
    };

    fetchUnreadEnquiries();
  }, []);

  useEffect(() => {
    if (usersData && (currentAcademicYear || currentAcademicYear === null)) {
      setLoading(false);
      setInstructors(usersData.instructors?.length || 0);
      setStudents(usersData.students?.length || 0);
      setNewStudents(currentAcademicYear?.students?.length || 0); // Set New Students count
    }
  }, [usersData, currentAcademicYear]);


  if (loading || dataLoading) {
    return <Loader />;
  }

    // Styles
    const statStyle = { mt: '15px', fontWeight: 'bold' };

    return (
      <Box>
        <RowGrid>
          {/* First Row */}
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

          {/* Instructors */}
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

        {/* Row 2 - Blank */}
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
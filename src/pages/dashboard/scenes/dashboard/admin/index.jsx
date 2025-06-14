import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MailOutlineIcon from '@mui/icons-material/MailOutline'; // Icon for enquiries
import SchoolIcon from '@mui/icons-material/School';
import LineChart from '../../../components/LineChart';
import useAdminData from './useAdminData';
import { useState, useEffect } from 'react';
import Loader from '../../../../../utils/loader';
import ProgressCircle from '../../../components/ProgressCircle';
import { endpoints } from '../../../../../utils/constants'; // Import endpoints
import {
  DashboardDataBox,
  RowGrid,
  RowContainer,
  ResponsiveContainer,
} from '../../../components/dashbaordDataBox';

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0); // State for unread enquiries count
  const { usersData, totalRevenue, programStats, topInstructors, outstandingPayments } = useAdminData();

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
    if (usersData) {
      setLoading(false);
      setInstructors(usersData.instructors?.length || 0);
      setStudents(usersData.students?.length || 0);
    }
  }, [usersData]);

  const conBg = `${theme.palette.mode === 'light' ? colors.grey[800] : colors.greenAccent[700]} !important`;

  if (!usersData) {
    return <Loader />;
  } else {
    // Sort courses by student count in descending order
    const sortedProgramStats = Object.keys(programStats)
      .map((program) => ({
        program,
        ...programStats[program],
      }))
      .sort((a, b) => b.studentCount - a.studentCount); // Sorting by student count

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

            {/* Teachers */}
            <ResponsiveContainer sm={6} md={3}>
              <DashboardDataBox>
                <Typography variant="h5" fontWeight="600" textAlign="center">
                  Teachers
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                  <SchoolIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                  <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                    {`${instructors} instructors`}
                  </Typography>
                  <Typography>Total instructors</Typography>
                </Box>
              </DashboardDataBox>
            </ResponsiveContainer>

            {/* New Students */}
            <ResponsiveContainer sm={6} md={3}>
              <DashboardDataBox>
                <Typography variant="h5" fontWeight="600" textAlign="center">
                  New students
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                  <PersonAddIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
                  <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                    {`${usersData.studentsIn24Hrs || 0} students`}
                  </Typography>
                  <Typography>Students registered within 24hrs</Typography>
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

          {/* ROW 2 */}
          <RowContainer>
            <ResponsiveContainer md={8}>
              <DashboardDataBox noFlex>
                <Box
                  mt="25px"
                  p="0 30px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ borderRadius: '10px' }}
                >
                  <Box p="10px 0">
                    <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                      Revenue Generated
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {`₦${totalRevenue}`}
                    </Typography>
                  </Box>
                </Box>
                <Box height="250px" m="-20px 0 0 0">
                  <LineChart isDashboard={true} />
                </Box>
              </DashboardDataBox>
            </ResponsiveContainer>

            <ResponsiveContainer md={4}>
              <DashboardDataBox>
                <Typography variant="h5" fontWeight="600" pb="30px">
                  Outstanding Payments
                </Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mt="25px"
                  mb="25px"
                >
                  <ProgressCircle
                    size="125"
                    progress={
                      outstandingPayments.totalOutstanding > 0
                        ? ((outstandingPayments.totalOutstanding / totalRevenue) * 100).toFixed(2)
                        : 0
                    }
                  />
                  <Typography
                    variant="h4"
                    color={colors.blueAccent[200]}
                    sx={statStyle}
                  >
                    ₦{outstandingPayments.totalOutstanding} outstanding payment
                  </Typography>
                  <Typography>
                    {outstandingPayments.totalOutstanding > 0
                      ? ((outstandingPayments.totalOutstanding / totalRevenue) * 100).toFixed(2)
                      : 0}
                    % of total expected payments
                  </Typography>
                </Box>
              </DashboardDataBox>
            </ResponsiveContainer>
          </RowContainer>
        </RowGrid>
      </Box>
    );
  }
};

export default Admin;
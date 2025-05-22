import { Box, Typography, useTheme, Avatar, useMediaQuery, Grid } from '@mui/material';
import { tokens } from '../../../theme';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import LineChart from '../../../components/LineChart';
import useAdminData from './useAdminData';
import { useState, useEffect } from 'react';
import Loader from '../../../../../utils/loader';
import ProgressCircle from '../../../components/ProgressCircle';
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
  const { usersData, totalRevenue, programStats, topInstructors, outstandingPayments, mockCohorts, unreadEnquiries } = useAdminData();

  useEffect(() => {
    if (usersData) {
      setLoading(false);
      setInstructors(usersData.instructors?.length || 0);
      setStudents(usersData.students?.length || 0);
    }
  }, [usersData]);

  const conBg = `${theme.palette.mode === "light" ? colors.grey[800] : colors.greenAccent[700]} !important`;

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

      //styles
      const statStyle =  { mt: "15px", fontWeight: 'bold'}
    return (
      <Box>

      <RowGrid>
        {/* first row */}

      <RowContainer>
      <ResponsiveContainer sm={6} md={3}>
          <DashboardDataBox>
            <Typography variant="h5" fontWeight="600" textAlign='center'>
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
            <Typography variant="h5" fontWeight="600" textAlign='center'>
              Instructors
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
            <Typography variant="h5" fontWeight="600" textAlign='center'>
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
            <Typography variant="h5" fontWeight="600" textAlign='center'>
              Unread Enquiries
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
              <PersonAddIcon sx={{ fontSize: '70px', color: colors.blueAccent[200] }} />
              <Typography variant="h4" color={colors.blueAccent[200]} sx={statStyle}>
                {unreadEnquiries}
              </Typography>
              <Typography>Read enquiries</Typography>
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
                sx={{ borderRadius: '10px'}}
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
                  progress={outstandingPayments.totalOutstanding > 0 ? ((outstandingPayments.totalOutstanding / totalRevenue) * 100).toFixed(2) : 0}
                />
                <Typography
                  variant="h4"
                  color={colors.blueAccent[200]}
                  sx={statStyle}
                >
                  ₦{outstandingPayments.totalOutstanding} outstanding payment
                </Typography>
                <Typography>
                  {outstandingPayments.totalOutstanding > 0 ? ((outstandingPayments.totalOutstanding / totalRevenue) * 100).toFixed(2) : 0}% of total expected payments
                </Typography>
              </Box>
            </DashboardDataBox>
          </ResponsiveContainer>


        </RowContainer>


        {/* ROW 3 - Cohorts, Course Stats, Top Instructors */}
        <RowContainer>
        <ResponsiveContainer md={4}>
            <DashboardDataBox 
            noFlex 
            moreStyles={{
            height: '400px',
            overflowY: 'auto'
          }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Courses Stats
              </Typography>

              {sortedProgramStats.map(({ program, studentCount, totalAmount }) => (
                <Box key={program}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    p="15px"
                    mb="10px"
                    sx={{ backgroundColor: conBg, borderRadius: '10px' }}
                  >
                    {/* Avatar for Program */}
                    <Avatar>{program.charAt(0)}</Avatar>

                    {/* Program Details */}
                    <Box display="flex" flexDirection="column" ml="15px">
                      <Typography variant="h6" fontWeight="600" textAlign='right'>
                        {program}
                      </Typography>
                      <Typography variant="body1" textAlign='right'>Students: {studentCount}</Typography>
                      <Typography variant="body1" textAlign='right'>Total Revenue: ₦{totalAmount}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </DashboardDataBox>
          </ResponsiveContainer>

          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex
                moreStyles={{
                  height: '400px',
                  overflowY: 'auto'
                }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Top Instructors
              </Typography>

              {topInstructors.map((instructor) => (
                <Box key={instructor.firstName + instructor.lastName}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    p="15px"
                    mb="10px"
                    sx={{ backgroundColor: conBg, borderRadius: '10px' }}
                  >
                    {/* Avatar for Instructor */}
                    <Avatar src={instructor.profilePictureUrl}>{instructor.firstName.charAt(0)}</Avatar>

                    {/* Instructor Details */}
                    <Box display="flex" flexDirection="column" ml="15px" >
                      <Typography variant="h6" fontWeight="600" textAlign='right'>
                        {instructor.firstName} {instructor.lastName}
                      </Typography>
                      <Typography variant="body1" textAlign='right'>Rating: {instructor.rating}</Typography>
                      <Typography variant="body1" textAlign='right'>Program: {instructor.program}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </DashboardDataBox>
          </ResponsiveContainer>

          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex
                moreStyles={{
                  height: '400px',
                  overflowY: 'auto'
                }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Cohorts
              </Typography>

              {mockCohorts.map((cohort, index) => (
                <Box key={index}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    p="15px"
                    mb="10px"
                    sx={{ backgroundColor: conBg, borderRadius: '10px' }}

                  >
                    <Typography variant="h6" fontWeight="600">
                      {cohort.name}
                    </Typography>
                    <Typography variant="body1">Course: {cohort.courseName}</Typography>
                    <Typography variant="body1">Number of Students: {cohort.numStudents}</Typography>
                    <Typography variant="body1">Progress: {cohort.progress}%</Typography>
                  </Box>
                </Box>
              ))}
            </DashboardDataBox>
          </ResponsiveContainer>

      </RowContainer>

  </RowGrid>
 </Box>

    );
  }
};

export default Admin;

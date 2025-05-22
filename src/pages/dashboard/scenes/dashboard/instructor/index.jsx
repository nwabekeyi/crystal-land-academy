import { Box, Typography, useTheme, Card, CardContent, Avatar, useMediaQuery } from '@mui/material';
import { tokens } from '../../../theme';
import Calendar from './calendar';
import {
  DashboardDataBox,
  RowGrid,
  RowContainer,
  ResponsiveContainer
} from '../../../components/dashbaordDataBox';
import SchoolIcon from '@mui/icons-material/School';
import ProgressCircle from '../../../components/ProgressCircle';
import useInstructorData from './useInstructorData';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));


  // Mock Announcements Data
  const mockAnnouncements = [
    {
      id: 1,
      title: "New Semester Starts",
      message: "The new semester starts on January 15th. Please make sure to review your schedule.",
      date: "2024-12-22",
    },
    {
      id: 2,
      title: "Maintenance Window",
      message: "Scheduled maintenance will occur on December 24th from 2:00 AM to 4:00 AM. Please plan accordingly.",
      date: "2024-12-22",
    },
    {
      id: 3,
      title: "Holiday Break",
      message: "The holiday break starts on December 23rd. All classes will resume on January 10th.",
      date: "2024-12-22",
    }
  ];

  const {
    courseProgress,
    attendanceRate,
    nextClass,
    assignmentSubmissionRate,
    topStudents,
    leastStudents,
    announcements
  } = useInstructorData();


  const conBg = `${theme.palette.mode === "light" ? colors.blueAccent[800] : colors.greenAccent[600]} !important`

  return (
    <Box>
      <RowGrid>
       {/* ROW 1 */}
      <RowContainer>

        {/* Course Progress */}
        <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
                <Typography variant="h5" fontWeight="600" textAlign='center'>
                Course Progress
              </Typography>
                <Box display="flex" flexDirection="column" alignItems="center" mt="25px" 
              >
                <ProgressCircle size="125" progress={courseProgress / 100} />
                <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
                  {`${courseProgress}% completed`}
                </Typography>
                <Typography>Completion rate</Typography>
              </Box>
          </DashboardDataBox>
        </ResponsiveContainer>


        {/* Attendance */}
        <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
                <Typography variant="h5" fontWeight="600" textAlign='center'>
                Attendance
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <ProgressCircle size="125" progress= {attendanceRate / 100} />
                <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
                  {`${attendanceRate}% attendance rate`}
                </Typography>
                <Typography>Total attendance rate of students</Typography>
              </Box>
          </DashboardDataBox>
        </ResponsiveContainer>

        {/* Assignment submissions */}

      <ResponsiveContainer sm={6} md={3}>
          <DashboardDataBox>
                <Typography variant="h5" fontWeight="600" textAlign='center'>
                Assignment submissions
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
                <ProgressCircle size="125" progress={assignmentSubmissionRate.totalAssignmentRate/100} />
                <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: "15px" }}>
                  {`${assignmentSubmissionRate.totalAssignmentRate}% submission rate`}
                </Typography>
                <Typography>Total assignment submission rate</Typography>
              </Box>
          </DashboardDataBox>
      </ResponsiveContainer>

        {/* Next Lecture */}

      <ResponsiveContainer sm={6} md={3}>
      <DashboardDataBox>
            <Typography variant="h5" fontWeight="600" mb="15px" textAlign='center'>
            Next Lecture
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            {nextClass ? (
              <Box textAlign="center">
                <SchoolIcon sx={{ fontSize: '50px', color: colors.blueAccent[500] }} />
                <Typography variant="h6">{nextClass.topic}</Typography>
                <Typography>{nextClass.date}</Typography>
                <Typography>{nextClass.time}</Typography>
              </Box>
            ) : (
              <Typography>No upcoming lectures.</Typography>
            )}
          </Box>
      </DashboardDataBox>
      </ResponsiveContainer>
      
      </RowContainer>

      {/* ROW 2 */}
      <RowContainer>
        {/* Calendar */}
        <ResponsiveContainer md={8}> 
            <DashboardDataBox noFlex  moreStyles={{
            height: '500px',
            overflowY: 'auto'
            
          }}> 
              <Typography variant="h5" fontWeight="600" mb="15px">
                Event calendar
              </Typography>
              <Calendar />
          </DashboardDataBox>
        </ResponsiveContainer>
        {/* Announcement Box */}
        <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex  moreStyles={{
            height: '500px',
            overflowY: 'auto'
            
          }}>                
          <Typography variant="h5" fontWeight="600" mb="15px">
                        Announcements
                      </Typography>
                      {announcements && announcements.length > 0 ? (
                        announcements.map((announcement) => (
                          <Card key={announcement.id} sx={{ mb: 2 }}>
                            <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
                              <Typography variant="h6">{announcement.title}</Typography>
                              <Typography variant="body2">{announcement.message}</Typography>
                              <Typography variant="caption" color="gray">
                                {announcement.date}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Typography>No announcements available</Typography>
                      )}          
              </DashboardDataBox>
        </ResponsiveContainer>
       

      </RowContainer>

      {/* ROW 3 */}
      <RowContainer>
        {/* Top 5 Students by Activity */}
      <ResponsiveContainer md={6}>
            <DashboardDataBox noFlex  
            moreStyles={{
            height: '400px',
            overflowY: 'auto'
            
          }}>
              <Typography variant="h5" fontWeight="600" mb="15px">
                  Top Students by Activity
                </Typography>
                {topStudents?.map((student, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    mb={2}
                    backgroundColor={theme.palette.mode === "light" ? colors.greenAccent[300] : colors.primary[500]}
                    p="15px"
                    borderRadius="8px"
                    sx={{
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Avatar
                      src={student?.profilePicture}
                      alt={`${student?.firstName} ${student?.lastName}`}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" color="white">
                        {`${student?.firstName} ${student?.lastName}`}
                      </Typography>
                      <Typography variant="body2" color="white">
                        {`Activity Rate: ${student?.activityRate}%`}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </DashboardDataBox>

      {/* last row */}
      </ResponsiveContainer>
        {/* Least Active Students */}
      <ResponsiveContainer md={6}>
          <DashboardDataBox noFlex 
          moreStyles={{
            height: '400px',
            overflowY: 'auto'
            
          }}
        >
             <Typography variant="h5" fontWeight="600" mb="15px">
            Least Active Students
          </Typography>
          {leastStudents?.map((student, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              mb={2}
              backgroundColor={theme.palette.mode === "light" ? colors.greenAccent[300] : colors.primary[500]}
              p="15px"
              borderRadius="8px"
              sx={{
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar
                src={student?.profilePicture}
                alt={`${student?.firstName} ${student?.lastName}`}
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" color="white">
                  {`${student?.firstName} ${student?.lastName}`}
                </Typography>
                <Typography variant="body2" color="white">
                  {`Activity Rate: ${student?.activityRate}%`}
                </Typography>
              </Box>
            </Box>
          ))}
      </DashboardDataBox>
      </ResponsiveContainer>

      </RowContainer>
    </RowGrid>
    </Box>
    
  );
};

export default Instructor;
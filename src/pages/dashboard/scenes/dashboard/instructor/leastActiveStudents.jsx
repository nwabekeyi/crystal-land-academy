// src/components/teacherDashboard/LeastActiveStudents.jsx
import { Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useTeacherData  from './useTeacherData';

const LeastActiveStudents = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { leastActiveStudents } = useTeacherData(); // Assumed to return [{ firstName, lastName, profilePicture, activityRate }]

  // Dummy data
  const dummyLeastActiveStudents = [
    { firstName: 'Mike', lastName: 'Wilson', profilePicture: '', activityRate: 60 },
    { firstName: 'Sarah', lastName: 'Davis', profilePicture: '', activityRate: 65 },
    { firstName: 'Tom', lastName: 'Clark', profilePicture: '', activityRate: 70 },
  ];

  const students = leastActiveStudents || dummyLeastActiveStudents;
  const bgColor = theme.palette.mode === 'light' ? colors.greenAccent[300] : colors.primary[500];

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb="15px">
        Least Active Students
      </Typography>
      {students.map((student, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          mb={2}
          backgroundColor={bgColor}
          p="15px"
          borderRadius="8px"
          sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <Avatar
            src={student.profilePicture}
            alt={`${student.firstName} ${student.lastName}`}
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" color="white">
              {`${student.firstName} ${student.lastName}`}
            </Typography>
            <Typography variant="body2" color="white">
              {`Activity Rate: ${student.activityRate}%`}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LeastActiveStudents;
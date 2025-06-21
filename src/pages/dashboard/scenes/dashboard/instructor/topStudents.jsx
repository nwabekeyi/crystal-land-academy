// src/components/teacherDashboard/TopStudents.jsx
import { Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useTeacherData  from './useTeacherData';

const TopStudents = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { topStudents } = useTeacherData(); // Assumed to return [{ firstName, lastName, profilePicture, performanceScore }]

  // Dummy data
  const dummyTopStudents = [
    { firstName: 'John', lastName: 'Doe', profilePicture: '', performanceScore: 95 },
    { firstName: 'Jane', lastName: 'Smith', profilePicture: '', performanceScore: 92 },
    { firstName: 'Alice', lastName: 'Brown', profilePicture: '', performanceScore: 90 },
  ];

  const students = topStudents || dummyTopStudents;
  const bgColor = theme.palette.mode === 'light' ? colors.greenAccent[300] : colors.primary[500];

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb="15px">
        Top Students by Performance
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
              {`Performance Score: ${student.performanceScore}%`}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TopStudents;
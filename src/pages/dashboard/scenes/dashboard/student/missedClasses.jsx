// src/components/studentDashboard/MissedClasses.jsx
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useStudentData  from './useStudentData';

const MissedClasses = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { missedClasses, formatDateToDDMMYYYY } = useStudentData(); // Assumed to return [{ id, subject, date, time, location }]

  // Dummy data
  const dummyMissedClasses = [
    { id: '1', subject: 'English', date: '2025-06-10', time: '09:00 AM', location: 'Room 5' },
    { id: '2', subject: 'Science', date: '2025-06-12', time: '11:00 AM', location: 'Lab 2' },
  ];

  const classes = missedClasses || dummyMissedClasses;
  const conBg = theme.palette.mode === 'light' ? colors.blueAccent[800] : colors.greenAccent[600];

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb="15px">
        Missed Classes
      </Typography>
      {classes.length > 0 ? (
        classes.map((schedule) => (
          <Card key={schedule.id} sx={{ mb: 2 }}>
            <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
              <Typography variant="h6">{schedule.subject}</Typography>
              <Typography>{formatDateToDDMMYYYY ? formatDateToDDMMYYYY(schedule.date) : schedule.date}</Typography>
              <Typography>{schedule.time}</Typography>
              <Typography>Location: {schedule.location}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>You attended all classes</Typography>
      )}
    </Box>
  );
};

export default MissedClasses;
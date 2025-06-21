// src/components/studentDashboard/Announcements.jsx
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useApi from '../../../../../hooks/useApi';
import { endpoints } from '../../../../../utils/constants';

const Announcements = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { callApi } = useApi();
  const [announcements, setAnnouncements] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await callApi(endpoints.ANNOUNCEMENT, 'GET');
        if (response && response.data) {
          setAnnouncements(response.data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [callApi]);

  const conBg = theme.palette.mode === 'light' ? colors.blueAccent[800] : colors.greenAccent[600];

  // Dummy data
  const dummyAnnouncements = [
    { id: '1', title: 'End of Term Exams', message: 'Exams start on July 1, 2025.', date: '2025-06-20' },
    { id: '2', title: 'Sports Day', message: 'Join us on July 15, 2025.', date: '2025-06-18' },
  ];

  const data = announcements || dummyAnnouncements;

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb="15px">
        Announcements
      </Typography>
      {data.length > 0 ? (
        data.map((announcement) => (
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
    </Box>
  );
};

export default Announcements;
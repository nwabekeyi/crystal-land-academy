// src/components/studentDashboard/UsefulResources.jsx
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useStudentData  from './useStudentData';

const UsefulResources = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { allResources } = useStudentData(); // Assumed to return [{ title, url }]

  // Dummy data
  const dummyResources = [
    { title: 'Math Textbook', url: 'https://example.com/math-textbook.pdf' },
    { title: 'Science Notes', url: 'https://example.com/science-notes.pdf' },
  ];

  const resources = allResources || dummyResources;
  const conBg = theme.palette.mode === 'light' ? colors.blueAccent[800] : colors.greenAccent[600];

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb="15px">
        Useful Resources
      </Typography>
      {resources.length > 0 ? (
        resources.map((res, i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
              <Typography variant="h6">{res.title}</Typography>
              <a href={res.url} target="_blank" rel="noopener noreferrer">
                {res.url}
              </a>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No Resources Available</Typography>
      )}
    </Box>
  );
};

export default UsefulResources;
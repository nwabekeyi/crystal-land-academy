import React, { useState } from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import Header from '../../components/Header';

// Dummy data for classes (consistent with TeacherStudentManagement)
const dummyClasses = [
  { classId: 'class_1', name: 'Primary 1A', session: '2024-2025', term: 'First Term' },
  { classId: 'class_2', name: 'Secondary 1B', session: '2024-2025', term: 'First Term' },
];

// Dummy data for reviews (no student names)
const dummyReviews = [
  {
    id: 'rev_1',
    studentId: 'stu_1',
    classId: 'class_1',
    rating: 4,
    reviewText: 'Explains algebra clearly but could include more examples.',
    date: '2024-09-15',
  },
  {
    id: 'rev_2',
    studentId: 'stu_2',
    classId: 'class_1',
    rating: 5,
    reviewText: 'Very engaging and supportive in class!',
    date: '2024-09-16',
  },
  {
    id: 'rev_3',
    studentId: 'stu_3',
    classId: 'class_2',
    rating: 3,
    reviewText: 'Lessons are informative, but pacing is a bit fast.',
    date: '2024-09-17',
  },
  {
    id: 'rev_4',
    studentId: 'stu_4',
    classId: 'class_2',
    rating: 4,
    reviewText: 'Helpful feedback on assignments, but more group activities would be great.',
    date: '2024-09-18',
  },
];

// Current term (set by admin, hardcoded for dummy data)
const currentTerm = 'First Term';
const currentSession = '2024-2025';

const InstructorReviews = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reviews] = useState(dummyReviews);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Filter reviews by current term and session
  const filteredReviews = reviews.filter((review) =>
    dummyClasses.some(
      (cls) =>
        cls.classId === review.classId &&
        cls.session === currentSession &&
        cls.term === currentTerm
    )
  );

  return (
    <Box>
      <Grid item xs={12}>
        <Header title="INSTRUCTOR REVIEWS" subtitle="Student Reviews for Your Classes" />
      </Grid>

      {filteredReviews.length > 0 ? (
        // Conditionally render Grid or simple layout based on screen size
        isSmallScreen ? (
          // Simple layout without Grid on small screens
          <Box>
            {filteredReviews.map((review) => (
              <Box
                key={review.id}
                p={2}
                mb={2}
                borderRadius="8px"
                boxShadow={2}
                bgcolor={colors.primary[400]}
              >
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Class: {dummyClasses.find((cls) => cls.classId === review.classId)?.name || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Rating: {review.rating} / 5
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.reviewText || 'No review text provided.'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Date: {new Date(review.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          // Grid layout for larger screens
          <Grid container spacing={2}>
            {filteredReviews.map((review) => (
              <Grid item xs={12} sm={6} key={review.id}>
                <Box
                  p={2}
                  borderRadius="8px"
                  boxShadow={2}
                  bgcolor={colors.primary[400]}
                >
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Class: {dummyClasses.find((cls) => cls.classId === review.classId)?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Rating: {review.rating} / 5
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.reviewText || 'No review text provided.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Date: {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <Typography>No reviews available for this instructor.</Typography>
      )}
    </Box>
  );
};

export default withDashboardWrapper(InstructorReviews);
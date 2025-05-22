import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import Header from '../../components/Header';

const InstructorReviews = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, data, error, callApi } = useApi();
  
  // Accessing the instructorId from the Redux store
  const instructorId = useSelector((state) => state.users.user._id); // Make sure this is correctly set in the Redux store
  
  const [reviews, setReviews] = useState([]);
  
  // Check if the screen size is small
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (instructorId) {
      callApi(`${endpoints.REVIEW}/${instructorId}`, 'GET');
    }
  }, [instructorId]);

  useEffect(() => {
    if (data) {
      setReviews(data); // Assuming the API response is the array of reviews
    }
  }, [data]);

  if (loading) {
    return <Typography>Loading reviews...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        Error fetching reviews: {error.message || 'Something went wrong'}
      </Typography>
    );
  }

  return (
    <Box>
      <Grid item xs={12}>
        <Header title="Instructor's reviews" subtitle="Student reviews" />
      </Grid>

      {reviews.length > 0 ? (
        // Conditionally render Grid or simple layout based on screen size
        isSmallScreen ? (
          // Simple layout without Grid on small screens
          <Box>
            {reviews.map((review, index) => (
              <Box
                key={index}
                p={2}
                mb={2}
                borderRadius="8px"
                boxShadow={2}
                bgcolor={colors.primary[400]}
              >
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Rating: {review.rating} / 5
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.reviewText || 'No review text provided.'}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          // Grid layout for larger screens
          <Grid container spacing={2}>
            {reviews.map((review, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  p={2}
                  borderRadius="8px"
                  boxShadow={2}
                  bgcolor={colors.primary[400]}
                >
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Rating: {review.rating} / 5
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.reviewText || 'No review text provided.'}
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

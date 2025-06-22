import React, { useState } from 'react';
import { Box, Typography, Avatar, TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Modal from '../../components/modal';
import CustomAccordion from '../../components/accordion';
import Header from '../../components/Header';
import ConfirmationModal from '../../components/confirmationModal';

// Dummy teacher data
const dummyTeachers = [
  {
    _id: 'tch_1',
    firstName: 'Yusuf',
    lastName: 'Ahmed',
    role: 'Mathematics Teacher',
    program: 'Secondary Education',
    profilePictureUrl: 'https://example.com/profiles/john_doe.jpg',
  },
  {
    _id: 'tch_2',
    firstName: 'Halima',
    lastName: 'Rasheed',
    role: 'English Teacher',
    program: 'Secondary Education',
    profilePictureUrl: 'https://example.com/profiles/jane_smith.jpg',
  },
  {
    _id: 'tch_3',
    firstName: 'Fawaz',
    lastName: 'Razak',
    role: 'Science Teacher',
    program: 'Secondary Education',
    profilePictureUrl: 'https://example.com/profiles/alice_brown.jpg',
  },
];

function StudentTeachers() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teachers] = useState(dummyTeachers); // Use dummy data directly
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ reviewText: '', rating: '' });
  const [confirmReviewOpen, setConfirmReviewOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState({ error: null, message: null });

  const handleReviewClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCloseConfirmReview = () => {
    setConfirmReviewOpen(false);
    setReviewStatus({ error: null, message: null });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReviewData({ reviewText: '', rating: '' });
    setSelectedTeacher(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (!reviewData.reviewText || !reviewData.rating) {
      setReviewStatus({ error: 'Please provide both review text and rating', message: null });
      setConfirmReviewOpen(true);
      return;
    }

    // Simulate review submission
    console.log('Submitting review:', {
      userId: 'mock_user_id',
      teacherId: selectedTeacher?._id,
      reviewText: reviewData.reviewText,
      rating: Number(reviewData.rating),
    });

    setReviewStatus({ error: null, message: 'Teacher review submitted successfully!' });
    setConfirmReviewOpen(true);
    handleCloseModal();
  };

  return (
    <Box m="30px">
      <Header title="YOUR TEACHERS" subtitle="" />
      {teachers.length < 1 && (
        <Typography>You have not been assigned a teacher yet</Typography>
      )}

      {teachers.map((teacher, index) => (
        <CustomAccordion
          key={index}
          title={`${teacher.firstName} ${teacher.lastName}`}
          details={
            <Box display="flex" alignItems="center" justifyContent="center" gap="10px">
              <Avatar
                src={teacher.profilePictureUrl}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Box>
                <Typography variant="body2" color={colors.grey[100]}>
                  {teacher.role}
                </Typography>
                <Typography variant="body2" color={colors.grey[100]} mt="5px">
                  {teacher.program}
                </Typography>
              </Box>
            </Box>
          }
          actions={[
            {
              label: 'Review',
              onClick: () => handleReviewClick(teacher),
            },
          ]}
        />
      ))}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={`Review ${selectedTeacher?.firstName} ${selectedTeacher?.lastName}`}
        onConfirm={handleConfirm}
      >
        <Box display="flex" flexDirection="column" gap="16px">
          <TextField
            name="reviewText"
            label="Review"
            variant="outlined"
            multiline
            rows={4}
            value={reviewData.reviewText}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="rating"
            label="Rating"
            variant="outlined"
            select
            value={reviewData.rating}
            onChange={handleInputChange}
            required
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Modal>

      <ConfirmationModal
        open={confirmReviewOpen}
        onClose={handleCloseConfirmReview}
        isLoading={false}
        title="Teacher Review Confirmation"
        message={reviewStatus.message || reviewStatus.error}
      />
    </Box>
  );
}

export default StudentTeachers;
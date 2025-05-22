import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { useSelector } from 'react-redux';
import Modal from '../../components/modal';
import CustomAccordion from '../../components/accordion';
import Header from "../../components/Header";
import ConfirmationModal from '../../components/confirmationModal';
import Loader from '../../../../utils/loader';

function StudentInstructors() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector((state) => state.users.user);
    const { loading, data, error, callApi } = useApi();
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState({ reviewText: '', rating: '' });
    const [confirmReviewOpen, setConfirmReviewOpen] = useState(false);


    useEffect(() => {
        console.log('called')
        callApi(`${endpoints.COHORT}/instructors/${user.cohort}`, 'GET');
    }, []);

    useEffect(() => {
        if (data && Array.isArray(data.data)) { 
            setInstructors(data.data);
        }
    }, [data]);

    const handleReviewClick = (instructor) => {
        setSelectedInstructor(instructor);
        setIsModalOpen(true);
    };

    const handleCloseConfirmReview = (i) => {
        setConfirmReviewOpen(false)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setReviewData({ reviewText: '', rating: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirm = async () => {
        const reviewPayload = {
            userId: user._id,
            reviewText: reviewData.reviewText,
            rating: Number(reviewData.rating),
        };

        try {
            await callApi(`${endpoints.REVIEW}/${selectedInstructor._id}`, 'POST', reviewPayload);
            console.log('Review submitted successfully');
            setConfirmReviewOpen(true);
        } catch (err) {
            console.error('Error submitting review:', err);
        } finally {
            handleCloseModal();
        }
    };

    if (loading) {
        return <Loader />;
    }


    return (
        <Box m="30px">
        <Header title="YOUR INSTRUCTORS" subtitle="" />
            {
                error && <Typography>Error fetching instructors: This might be due to network issues</Typography>
            }

{
                instructors.length < 1 && <Typography>You have not been assigned an instrcutor yet</Typography>
            }

            {instructors.map((instructor, index) => (
                <CustomAccordion
                    key={index}
                    title={`${instructor.firstName} ${instructor.lastName}`}
                    details={
                        <Box display="flex" alignItems="center" justifyContent='center' gap="10px">
                            <Avatar
                                src={instructor.profilePictureUrl}
                                alt={`${instructor.firstName} ${instructor.lastName}`}
                                sx={{ width: 120, height: 120, mb: 2 }}
                            />
                            <Box>
                                <Typography variant="body2" color={colors.grey[100]}>
                                {instructor.role}
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]} mt="5px">
                                {instructor.program}
                            </Typography>

                            </Box>
                        </Box>
                    }
                    actions={[
                        {
                            label: 'Review',
                            onClick: () => handleReviewClick(instructor),
                        },
                        {
                            label: 'Send Message',
                            onClick: () => console.log('Send Message clicked'),
                        },
                    ]}
                />
            ))}

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={`Review ${selectedInstructor?.firstName} ${selectedInstructor?.lastName}`}
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

            {/* review response modal */}

            <ConfirmationModal
        open={confirmReviewOpen}
        onClose={handleCloseConfirmReview}
        isLoading={loading}
        title= 'Instructor review confirmation'
        message= {error ? "Error submitting instructor review!" : "Instructor review submitted successfully!"}
        />
        </Box>
    );
}

export default StudentInstructors;

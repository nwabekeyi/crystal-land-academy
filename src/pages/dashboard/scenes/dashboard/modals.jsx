import React, { useState } from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Modal from '../../components/modal';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import ConfirmationModal from '../../components/confirmationModal';

const MakeAnnouncement = ({ openAnnoucementModal, setModalOpen }) => {
  const [formFields, setFormFields] = useState({
    title: '',
    message: '',
    dueDate: '' // Add the due date field
  });

  const { data, loading, callApi } = useApi();
  const [confirmModal, setConfirmModal] = useState(false);

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { title, message, dueDate } = formFields;
    const body = { title, message, date: dueDate }; // Send form data including due date

    const response = await callApi(endpoints.ANNOUNCEMENT, "POST", body);
    if (response && response?.announcement) {
      setModalOpen(false);
      setConfirmModal(true);
      // Reset form fields
      setFormFields({ title: '', message: '', dueDate: '' });
    }
  };

  return (
    <>
      <Modal
        open={openAnnoucementModal}
        onClose={() => setModalOpen(false)}
        title="Make Announcement"
        onConfirm={handleSubmit}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formFields.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Message"
            name="message"
            value={formFields.message}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            required
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formFields.dueDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{
              shrink: true, // Ensures the label doesn't overlap the date value
            }}
            required
          />
        </Box>
      </Modal>

      {/* Confirmation modal for success or error */}
      <ConfirmationModal
        open={confirmModal}
        isLoading={loading}
        onClose={() => setConfirmModal(false)}
        title="Confirm Announcement Submission"
        message={data ? 'Announcement submitted successfully!' : 'Could not submit announcement.'}
      />
    </>
  );
};


const SubmitFeedback = ({ openFeedbackModal, setModalOpen }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');

  const {
    data,
    loading: submitLoading,
    error: submitError,
    callApi: submitFeedback,
  } = useApi();

  const [confirmModal, setConfirmModal] = useState(false);

// Handle form submission to save feedback to the server
const handleSubmit = async () => {
  const newFeedback = { name, role, date, comments };

  await submitFeedback(endpoints.FEEDBACKS, 'POST', newFeedback);

  if (!submitError) {
    setConfirmModal(true);
    // Update feedback list with the newly added feedback
    setName('');
    setRole('');
    setDate('');
    setComments('');
  }
};


  return (
    <>
      <Modal
        open={openFeedbackModal}
        onClose={() => setModalOpen(false)}
        title="Send Feedbacks"
        onConfirm={handleSubmit}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
            <MenuItem value="worker">Worker</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        </Box>
      </Modal>

      {/* Confirmation modal for success or error */}
      <ConfirmationModal
        open={confirmModal}
        isLoading={submitLoading}
        onClose={() => setConfirmModal(false)}
        title="Feedback confirmantion"
        message={ data ? 'Feeback submitted successfully!' : 'Could not submit announcement.'}
      />
    </>
  );
};
export { MakeAnnouncement, SubmitFeedback };

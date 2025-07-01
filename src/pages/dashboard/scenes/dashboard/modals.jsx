// components/modals/index.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import Modal from '../../components/modal';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import ConfirmationModal from '../../components/confirmationModal';
import { useSelector } from 'react-redux';

const MakeAnnouncement = ({ openAnnouncementModal, setModalOpen }) => {
  const user = useSelector((state) => state.users.user);
  const [formFields, setFormFields] = useState({
    title: '',
    message: '',
    dueDate: '',
    classLevel: '',
    subclass: '',
  });
  const [classes, setClasses] = useState([]);
  const { data, loading, error, callApi } = useApi();
  const [confirmModal, setConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch teacher's assigned classes
  useEffect(() => {
    if (!user || !user._id) {
      setErrorMessage('User not authenticated. Please log in again.');
      setConfirmModal(true);
      return;
    }
    if (user.role === 'teacher' && openAnnouncementModal) {
      const fetchAssignedClasses = async () => {
        try {
          const response = await callApi(`${endpoints.ACADEMIC_CLASSES}/assigned`, 'GET');
          if (response && response.data) {
            setClasses(response.data); // Expected: [{ _id, section, name, subclasses: [{ letter }] }]
          } else {
            setErrorMessage('No assigned classes found.');
            setConfirmModal(true);
          }
        } catch (error) {
          setErrorMessage('Failed to load assigned classes: ' + error.message);
          setConfirmModal(true);
        }
      };
      fetchAssignedClasses();
    }
  }, [openAnnouncementModal, user, callApi]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
      // Reset subclass when classLevel changes
      ...(name === 'classLevel' ? { subclass: '' } : {}),
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user || !user._id) {
      setErrorMessage('User not authenticated. Please log in again.');
      setConfirmModal(true);
      return;
    }

    const { title, message, dueDate, classLevel, subclass } = formFields;

    // Validation
    if (!title || !message || !dueDate) {
      setErrorMessage('Please fill all required fields (title, message, due date).');
      setConfirmModal(true);
      return;
    }
    if (user.role === 'teacher' && (!classLevel || !subclass)) {
      setErrorMessage('Please select a class level and subclass.');
      setConfirmModal(true);
      return;
    }

    const body = user.role === 'teacher'
      ? { title, message, date: dueDate, createdBy: user._id, targets: [{ classLevel, subclass }] }
      : { title, message, date: dueDate, createdBy: user._id };

    const endpoint = user.role === 'teacher'
      ? `${endpoints.ANNOUNCEMENT}/class`
      : `${endpoints.ANNOUNCEMENT}/general`;

    try {
      const response = await callApi(endpoint, 'POST', body);
      if (response && response.status === 'success' && response.data && response.data.announcement) {
        setFormFields({ title: '', message: '', dueDate: '', classLevel: '', subclass: '' });
        setErrorMessage(''); // Clear any existing error message
        setModalOpen(false);
        setConfirmModal(true);
      } else {
        setErrorMessage('Failed to submit announcement. Please try again.');
        setConfirmModal(true);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to submit announcement.');
      setConfirmModal(true);
    }
  };

  // Show loading state if user is not loaded
  if (!user || !user._id) {
    return (
      <Modal
        open={openAnnouncementModal}
        onClose={() => setModalOpen(false)}
        title="Make Announcement"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <CircularProgress />
        </Box>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        open={openAnnouncementModal}
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
            InputLabelProps={{ shrink: true }}
            required
          />
          {user.role === 'teacher' && (
            <>
              <FormControl fullWidth>
                <InputLabel>Class Level</InputLabel>
                <Select
                  name="classLevel"
                  value={formFields.classLevel}
                  onChange={handleInputChange}
                  required
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.section} {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Subclass</InputLabel>
                <Select
                  name="subclass"
                  value={formFields.subclass}
                  onChange={handleInputChange}
                  required
                  disabled={!formFields.classLevel}
                >
                  {formFields.classLevel &&
                    classes
                      .find((cls) => cls._id === formFields.classLevel)
                      ?.subclasses.map((sub) => (
                        <MenuItem key={sub.letter} value={sub.letter}>
                          {sub.letter}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </Modal>

      <ConfirmationModal
        open={confirmModal}
        isLoading={loading}
        onClose={() => setConfirmModal(false)}
        title="Announcement Submission"
        message={data && data.status === 'success' ? 'Announcement submitted successfully!' : errorMessage || 'Could not submit announcement. Please try again.'}
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
  }else{
    console.error('Error submitting feedback:', submitError);
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
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Instructor">Instructor</MenuItem>
            <MenuItem value="Worker">Worker</MenuItem>
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

      <ConfirmationModal
        open={confirmModal}
        isLoading={submitLoading}
        onClose={() => setConfirmModal(false)}
        title="Feedback confirmation"
        message={data ? 'Feedback submitted successfully!' : 'Could not submit announcement.'}
      />
    </>
  );
};

export { MakeAnnouncement, SubmitFeedback };
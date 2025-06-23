import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import Modal from '../../dashboard/components/modal'; // Adjust path
import FloatingMessageIcon from './floatingMessageIcon'; // Adjust path

const Enquiry = () => {
  const [open, setOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const ENQUIRY_ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT;

  const handleEnquiryClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSuccessModalClose = () => {
    setSuccessModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, phone, email, message } = formData;
    if (!name || !phone || !email || !message) {
      return 'All fields are required.';
    }
    if (!/^\d{10,15}$/.test(phone)) {
      return 'Please enter a valid phone number.';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${ENQUIRY_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit enquiry');
      }

      const data = await response.json();
      console.log('Enquiry submitted successfully:', data);

      setFormData({ name: '', phone: '', email: '', message: '' });
      setOpen(false);
      setSuccessModal(true);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Enquiry Icon */}
      <FloatingMessageIcon onClick={handleEnquiryClick} showLabel={true} />

      {/* Modal with Form */}
      <Modal
        open={open}
        onClose={handleClose}
        title="Submit Enquiry"
        onConfirm={handleSubmit}
        confirmMessage={loading ? 'Submitting...' : 'Submit'}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Enquiry Message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
          />
          {error && (
            <Box sx={{ color: 'red', mt: 1 }}>
              {error}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModal}
        onClose={handleSuccessModalClose}
        title="Success"
        noConfirm
        sx={{ px: 4 }}
      >
        <Box sx={{ mt: 2 }}>
          <h2>Enquiry Submitted Successfully!</h2>
          <p>Thank you for reaching out. We will get back to you shortly.</p>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <button
              onClick={handleSuccessModalClose}
              style={{
                backgroundColor: '#0E0C30',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Enquiry;
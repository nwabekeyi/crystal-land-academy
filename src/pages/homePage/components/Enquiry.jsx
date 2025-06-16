import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Box, TextField } from '@mui/material';
import Modal from '../../dashboard/components/modal'; // Adjust the import path as needed

const Enquiry = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Get the base URL and enquiry endpoint from the environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const ENQUIRY_ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT;

  const handleEnquiryClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null); // Clear any errors when closing the modal
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

      // Reset form and close modal
      setFormData({ name: '', phone: '', email: '', message: '' });
      setOpen(false);
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
      <Box
        onClick={handleEnquiryClick}
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 50,
          backgroundColor: '#0E0C30',
          color: 'white',
          borderRadius: '5px',
          width: 70,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          zIndex: '1000',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: '#0E0C20',
          },
        }}
      >
        <FaEnvelope size={24} />
      </Box>

      {/* Modal with Form */}
      <Modal
        open={open}
        onClose={handleClose}
        title="Enquiry Form"
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
    </>
  );
};

export default Enquiry;
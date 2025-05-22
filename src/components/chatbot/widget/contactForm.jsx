import React, { useState } from 'react';
import styled from 'styled-components';
import ChatbotBtn from '../chatbotBtn';
import BtnWrapperStyle from '../btnWrapperstyle';
import useApi from '../../../hooks/useApi';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', message: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const { callApi, loading } = useApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Reset error when user is typing
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0')) {
      if (phoneNumber.length !== 11) {
        return 'Phone number starting with 0 must be 11 digits long.';
      }
    } else if (phoneNumber.startsWith('234')) {
      if (phoneNumber.length !== 13) {
        return 'Phone number starting with 234 must be 13 digits long.';
      }
    } else {
      return 'Phone number must start with 0 or 234.';
    }
    return ''; // No error
  };

  const handleSubmit = async (e) => {
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ENQUIRY_ENDPOINT}`;

    e.preventDefault();
    const phoneError = validatePhoneNumber(formData.phoneNumber);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    try {
      const result = await callApi(baseUrl, 'POST', formData);
      console.log('Enquiry submitted successfully:', result);
      setFormData({ name: '', message: '', phoneNumber: '' });
    } catch (err) {
      console.error('Error submitting enquiry:', err.message);
      setError('Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <StyledEnquiryForm>
      <StyledInput
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>} {/* Display error message */}
      <StyledTextArea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
      />
      <BtnWrapperStyle>
        <ChatbotBtn onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Enquiry'}
        </ChatbotBtn>
      </BtnWrapperStyle>
    </StyledEnquiryForm>
  );
};

const StyledEnquiryForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  height: 3em;
  border: 2px solid #0d6efd;
  border-radius: 10px;
  margin: 10px auto;
  width: 70%;
  padding: 0 10px;
`;

const StyledTextArea = styled.textarea`
  border: 2px solid #0d6efd;
  border-radius: 10px;
  margin: 10px auto;
  width: 70%;
  padding: 10px;
  resize: none;
  height: 5em;
`;

const ErrorMessage = styled.p`
  color: red;
  margin: 5px 0;
`;

export default ContactForm;

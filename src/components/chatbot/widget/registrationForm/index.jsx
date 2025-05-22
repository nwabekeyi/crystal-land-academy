import React, { useState } from 'react';
import styled from 'styled-components';
import BtnWrapperStyle from '../../btnWrapperstyle';
import ChatbotBtn from '../../chatbotBtn';

const RegistrationFormWidget = (props) => {
const submitForm= props.actionProvider.confirmRegistration;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Call the onSubmit function with the form data
  //   onSubmit(formData);
  // };




  return (
    <StyledFormWrapper>
      <h2 style={{textAlign:'center', marginBottom:'20px'}}>Registration Form</h2>
      <form 
      // onSubmit={handleSubmit}
      >
        <StyledLabel>
          <StyledParagraph>Name</StyledParagraph>
          <StyledInput type="text" name="name" value={formData.name} onChange={handleChange}  required/>
        </StyledLabel>

        <StyledLabel>
        <StyledParagraph>Email</StyledParagraph>
          <StyledInput type="email" name="email" value={formData.email} onChange={handleChange} required/>
        </StyledLabel>
  
        <StyledLabel>
        <StyledParagraph>Select a course</StyledParagraph>
          <StyledSelect name="course" value={formData.course} onChange={handleChange} required>
            <option value="">Select Course</option>
            <option value="Frontend Web Development">Frontend Web Development</option>
            <option value="Backend Web Development">Backend Web Development</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Data Science">Data Science</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Internet of Things">Internet of Things</option>
          </StyledSelect>
        </StyledLabel>
        <br />
        <BtnWrapperStyle >
          <ChatbotBtn onClick={submitForm}>Submit</ChatbotBtn>
          </BtnWrapperStyle>
      </form>
    </StyledFormWrapper>
  );
};

const StyledFormWrapper = styled.div`
  /* Add styles for the form wrapper here */
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledLabel = styled.label`
  /* Add styles for the labels here */
  margin-bottom: 10px;
  display: block;
`;

const StyledInput = styled.input`
  /* Add styles for the input fields here */
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 5px;
  width: 100%;
  display: block;
`;

const StyledSelect = styled.select`
  /* Add styles for the select field here */
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 5px;
  width: 100%;
`;

const StyledParagraph = styled.p`
  font-weight: bold;
`;

export default RegistrationFormWidget;
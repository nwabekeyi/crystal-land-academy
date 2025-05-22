import React from 'react';
import styled from 'styled-components';
import ChatbotBtn from '../../chatbotBtn'; // Make sure the file path is correct
import BtnWrapperStyle from '../../btnWrapperstyle';

const CourseSelection = (props) => {
  const showForm = props.actionProvider.handleForm;
  const courses = ['Frontend Web Development', 'Backend Web Development', 'Data Analytics', 'Data Science', 'Software Engineering', 'Internet of Things'];

  return (
    <StyledCourseSelection>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>
      <p style={{marginTop: '10px', color: 'blue'}}>Each course is priced at $500</p>
      <BtnWrapperStyle>
        <ChatbotBtn onClick={showForm} style={{ marginTop: '10px' }}>Proceed with Registration?</ChatbotBtn>
      </BtnWrapperStyle>
    </StyledCourseSelection>
  );
};

const StyledCourseSelection = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export default CourseSelection;

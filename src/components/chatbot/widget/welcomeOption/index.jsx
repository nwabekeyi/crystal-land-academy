import React from 'react';
import ChatbotBtn from '../../chatbotBtn';
import BtnWrapperStyle from '../../btnWrapperstyle';


const WelcomeOptions = (props ) => {
    const hanleRegistration = props.actionProvider.handleCourseRegistration;
    const handleInfo = props.actionProvider.handleEnquiry;
    const handlePayment = props.actionProvider.handlePaymentProcess;


  return (
    <BtnWrapperStyle>
      <ChatbotBtn onClick={hanleRegistration}>Register for a course</ChatbotBtn>
      <ChatbotBtn onClick={handleInfo}>Get more information</ChatbotBtn>
      <ChatbotBtn onClick={handlePayment}>Contact Our team</ChatbotBtn>

    </BtnWrapperStyle>
  );
};

export default WelcomeOptions;

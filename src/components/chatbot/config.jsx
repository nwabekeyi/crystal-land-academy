import { createChatBotMessage } from 'react-chatbot-kit';
import CourseSelection from './widget/courseSelection';
import RegistrationFormWidget from './widget/registrationForm';
import WelcomeOptions from './widget/welcomeOption';
import  Logo from '../../images/logo.svg';
import ContactForm from './widget/contactForm';

const config = {
  botName: 'Beks Support Bot',
  initialMessages: [
    createChatBotMessage('`Hello, My name is Babs. How can I assist you today?`', {
      widget: 'welcomeOptions', // Render the WelcomeOptions widget as the initial message
    }),  ],
  customComponents: {
    botAvatar: (props) => <img src={Logo} style={{height: '40px', width: '40px'}} {...props} />, 

  },
   widgets: [
    {
      widgetName: 'contactForm',
      widgetFunc: (props) => (
        <ContactForm  {...props}/>
      ),
    },

    {
      widgetName: 'welcomeOptions',
      widgetFunc: (props) => (
        <WelcomeOptions  {...props}/>
      ),
    },

    {
      widgetName: 'courseSelection',
      widgetFunc: (props) => <CourseSelection {...props} />,
      props: {
      },
    },
    {
      widgetName: 'registrationForm',
      widgetFunc: (props) => <RegistrationFormWidget {...props} />,
      props: {
        onSubmit: (formData) => {
          // Logic to handle form submission (e.g., send data to server)
          console.log('Form data:', formData);
          // You can trigger the next step in the chatbot flow here if needed
          // props.triggerNextStep();
        },
      },
    },
  ],
};

export default config;



class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleHello = () => {
    const messages = this.createChatBotMessage(
      'Hello. Nice to meet you. How may i be of help today?',
        );

    this.addMessageToBotState(messages);
  };

  handleForm = () => {
    const messages = [
      this.createChatBotMessage(
              `Kindly fill the form below`,
              {
                widget: 'registrationForm',
              }
            )
    ];

    this.addMessageToBotState(messages);
  };

  handleCourseRegistration = () => {
    const messages = [
      this.createChatBotMessage(
        "To register for a program, please visit view the list of available course and then proceed with registration",
          {
            widget: 'courseSelection',
          }
            )
    ];

    this.addMessageToBotState(messages);
  };
  confirmRegistration = (e) => {
    e.preventDefault();
    const messages = [
      this.createChatBotMessage( "Thanks for registering for a course with us. Kindly Go ahead and make payment, then upload your proof of payment. How else can I help you?",
      {
        widget: 'welcomeOptions',
      }
            )
    ];

    this.addMessageToBotState(messages);
  };

  handleProgramInformation = () => {
    const messages = [
      this.createChatBotMessage(
        "Our programs cover a variety of topics including web development, data science, software engineering, and more. Each program includes hands-on projects led by industry experts. The cost of each program is $500, and the duration is approximately 4 months. You can find detailed information about each program on our website.",
      )
    ];

    this.addMessageToBotState(messages);
  };


  handleProgramDuration = () => {
    const messages = [
      this.createChatBotMessage(
        "The duration of each program varies depending on the timetable agreed upon with the instructor and other classmates. However, typically, programs are completed within 4 to 6 months. Additionally, each program includes a one-year mentorship period upon completion."        )
    ];

    this.addMessageToBotState(messages);
  };
  handleEnquiry = () => {
    const messages = [
      this.createChatBotMessage(
        "Kindly drop your enquiry about our program in the message box",
        )
    ];

    this.addMessageToBotState(messages);
  };

  handlePaymentProcess = () => {
    const messages = [
      this.createChatBotMessage(
        "Feel free to reach out to our support team, Drop your message in the form below",
        {
          widget: 'contactForm',
        }
        )
    ];

    this.addMessageToBotState(messages);
  };

  handlePaymentConfirmation = () => {
    const messages = [
      this.createChatBotMessage(
        "Thanks for uploading your proof of payment, you will receive a confirmation e-mail from us shortly. How else can I help you today",
        {
          widget: 'welcomeOptions',
        }
        )
    ];

    this.addMessageToBotState(messages);
  };

  handleClassFormat = () => {
    const messages = [
      this.createChatBotMessage(
        "Our classes are conducted online, providing a virtual learning environment. Upon enrollment, you will be assigned to a dedicated instructor, and you will have the opportunity to coordinate your schedule with both your teacher and fellow classmates. Is there anything else you would like to inquire about?"        )
    ];

    this.addMessageToBotState(messages);
  };

  handleCoursePrice = () => {
    const messages = [
      this.createChatBotMessage("The tuition fee for each course is $500. Do you have any other question?")
 ];

    this.addMessageToBotState(messages);
  };

  handleCompanyInformation = () => {
    const messages = [
      this.createChatBotMessage(
        "Our company is dedicated to providing high-quality education and training in various fields. You can learn more about our mission, values, and history on our website.",
        )
    ];

    this.addMessageToBotState(messages);
  };

  handleClassStartDate = () => {
    const messages = [
      this.createChatBotMessage(

        "Commencement dates for classes vary based on the program and schedule. Upon enrollment, you will be assigned a dedicated instructor with whom you can coordinate your timetable."        )
    ];

    this.addMessageToBotState(messages);
  };


  // Add more methods for handling other types of queries as needed...

  // Method to handle unknown queries or fallback responses
  handleUnknownQuery = () => {
    const messages = [
      this.createChatBotMessage(
        "I'm sorry, but I'm not sure how to answer that question. Please contact our support team for assistance or select an option below",
        {
          widget: 'welcomeOptions',
        }
        )
    ];

    this.addMessageToBotState(messages);
  };

  handleWebDevelopmentFrontendInfo = () => {
    const message = this.createChatBotMessage(
      "Our frontend web development course covers HTML, CSS, JavaScript, and react. You'll learn the fundamentals of building user interfaces and interactive experiences for the web. Upon completion, you'll have the skills to create responsive websites and engaging web applications."
    );

    this.addMessageToBotState(message);
  };

  handleWebDevelopmentBackendInfo = () => {
    const message = this.createChatBotMessage(
      "Our backend web development course focuses on server-side programming, databases, and API development. You'll learn to build robust backend systems that power dynamic web applications. Topics include server-side scripting, database management, and API integration. Upon completion, you'll have the skills to develop scalable and secure web applications."
    );

    this.addMessageToBotState(message);
  };

  handleDataScienceInfo = () => {
    const message = this.createChatBotMessage(
      "In our data science course, you'll learn Python programming, data analysis, machine learning, and more. This course is ideal for those interested in extracting insights from data and making data-driven decisions. Topics include data manipulation, statistical analysis, machine learning algorithms, and data visualization. Upon completion, you'll have the skills to analyze and interpret data effectively."
    );

    this.addMessageToBotState(message);
  };

  handleSoftwareEngineeringInfo = () => {
    const message = this.createChatBotMessage(
      "Our software engineering course focuses on software development principles, algorithms, and best practices. You'll learn to design, develop, and deploy software applications using industry-standard tools and techniques. Topics include software architecture, version control, testing, and deployment strategies. Upon completion, you'll have the skills to build scalable and maintainable software solutions."
    );

    this.addMessageToBotState(message);
  };

  handleDataAnalyticsInfo = () => {
    const message = this.createChatBotMessage(
      "Our data analytics course covers data processing, statistical analysis, and data visualization techniques. You'll learn to extract meaningful insights from large datasets and communicate findings effectively. Topics include data cleaning, exploratory data analysis, and advanced visualization tools. Upon completion, you'll have the skills to analyze data and provide actionable insights to stakeholders."
    );

    this.addMessageToBotState(message);
  };

  handleInternetOfThingsInfo = () => {
    const message = this.createChatBotMessage(
      "In our Internet of Things (IoT) course, you'll explore the intersection of hardware and software technologies. You'll learn to design, build, and deploy IoT solutions for various applications. Topics include sensor integration, data communication protocols, and IoT platform development. Upon completion, you'll have the skills to develop IoT systems and leverage connected devices to create innovative solutions."
    );

    this.addMessageToBotState(message);
  };

  handleDataScienceVsDataAnalytics = () => {
    const message = this.createChatBotMessage(
      "Data Science and Data Analytics are related fields but with some key differences. Data Science focuses on analyzing and interpreting complex data to make predictions and decisions. It involves programming, statistics, machine learning, and data visualization. On the other hand, Data Analytics mainly deals with analyzing data to uncover actionable insights and trends. It typically involves data cleaning, statistical analysis, and data visualization techniques. While Data Science is more focused on predictive modeling and algorithm development, Data Analytics is more focused on descriptive analysis and business intelligence."
    );
    this.addMessageToBotState(message);
  };

  handleDataScienceVsSoftwareEngineering = () => {
    const message = this.createChatBotMessage(
      "Data Science and Software Engineering are distinct fields with different focuses and methodologies. Data Science deals with analyzing and interpreting large datasets to extract insights and make data-driven decisions. It involves techniques such as statistical analysis, machine learning, and data visualization. On the other hand, Software Engineering focuses on designing, developing, and maintaining software systems and applications. It involves principles such as software architecture, design patterns, and coding practices. While Data Science emphasizes data analysis and modeling, Software Engineering emphasizes software development and engineering principles."
    );
    this.addMessageToBotState(message);
  };

  handleDataAnalyticsVsSoftwareEngineering = () => {
    const message = this.createChatBotMessage(
      "Data Analytics and Software Engineering are distinct fields with different objectives and methodologies. Data Analytics involves analyzing and interpreting data to uncover patterns, trends, and insights. It typically involves data cleaning, statistical analysis, and data visualization techniques. On the other hand, Software Engineering focuses on designing, developing, and maintaining software systems and applications. It involves principles such as software architecture, design patterns, and coding practices. While Data Analytics is more focused on data analysis and interpretation, Software Engineering is more focused on software development and engineering processes."
    );
    this.addMessageToBotState(message);
  };

  handleWebDevVsDataScience = () => {
    const message = this.createChatBotMessage(
      "Web Development and Data Science are different fields with distinct focuses and applications. Web Development involves designing and building websites and web applications using technologies such as HTML, CSS, JavaScript, and various web frameworks. It focuses on creating user interfaces and interactive experiences for web users. On the other hand, Data Science involves analyzing and interpreting large datasets to extract insights and make data-driven decisions. It involves techniques such as statistical analysis, machine learning, and data visualization. While Web Development is more focused on web application development, Data Science is more focused on data analysis and modeling."
    );
    this.addMessageToBotState(message);
  };

  handleWebDevVsSoftwareEngineering = () => {
    const message = this.createChatBotMessage(
      "Web Development and Software Engineering are related fields but with different focuses and methodologies. Web Development involves designing and building websites and web applications using technologies such as HTML, CSS, JavaScript, and various web frameworks. It focuses on creating user interfaces and interactive experiences for web users. On the other hand, Software Engineering focuses on designing, developing, and maintaining software systems and applications. It involves principles such as software architecture, design patterns, and coding practices. While Web Development is more focused on web application development, Software Engineering is more focused on software development and engineering processes."
    );
    this.addMessageToBotState(message);
  };

  handleWebDevVsDataAnalytics = () => {
    const message = this.createChatBotMessage(
      "Web Development and Data Analytics are different fields with distinct focuses and applications. Web Development involves designing and building websites and web applications using technologies such as HTML, CSS, JavaScript, and various web frameworks. It focuses on creating user interfaces and interactive experiences for web users. On the other hand, Data Analytics involves analyzing and interpreting data to uncover patterns, trends, and insights. It typically involves data cleaning, statistical analysis, and data visualization techniques. While Web Development is more focused on web application development, Data Analytics is more focused on data analysis and interpretation."
    );
    this.addMessageToBotState(message);
  };

  handlePrerequisites = () => {
    const message = this.createChatBotMessage(
      "The prerequisites for our courses vary depending on the specific program. Some courses may require prior knowledge or experience in certain subjects, while others may be suitable for beginners. You can find detailed information about the prerequisites for each course on our website or contact our support team for assistance."
    );
    this.addMessageToBotState(message);
  };

  handleNoExperienceNeeded = () => {
    const message = this.createChatBotMessage(
      "Many of our courses are designed for individuals with no prior experience in the field. Our beginner-friendly programs provide comprehensive learning materials and support to help you build foundational skills and succeed in your learning journey."
    );
    this.addMessageToBotState(message);
  };

  handleInstructors = () => {
    const message = this.createChatBotMessage(
      "Our courses are taught by experienced instructors who are experts in their respective fields. They bring real-world industry knowledge and practical insights to the classroom, ensuring a dynamic and engaging learning experience for students."
    );
    this.addMessageToBotState(message);
  };

  handleSupport = () => {
    const message = this.createChatBotMessage(
      "We offer comprehensive support to our students throughout their learning journey. Our support services include access to course materials, online forums, and dedicated support staff who are available to answer questions and provide assistance when needed."
    );
    this.addMessageToBotState(message);
  };

  handleContactInstructor = () => {
    const message = this.createChatBotMessage(
      "If you have questions or need assistance, you can contact your instructor directly through our course platform. Instructors are available to provide guidance, clarification, and support to help you succeed in your studies."
    );
    this.addMessageToBotState(message);
  };

  handleAccreditation = () => {
    const message = this.createChatBotMessage(
      "Our courses are carefully designed to meet industry standards, but accreditation may vary depending on the institution or organization offering the certification. We recommend checking with your local accreditation authority for specific details."
    );
    this.addMessageToBotState(message);
  };

  handleCertificate = () => {
    const message = this.createChatBotMessage(
      "Yes, upon successful completion of the course, you will receive a certificate to recognize your achievement. Our certificates are issued based on your performance and demonstrate your mastery of the course material."
    );
    this.addMessageToBotState(message);
  };

  handleCertificateRecognition = () => {
    const message = this.createChatBotMessage(
      "Our certificates are widely recognized within the industry and by employers worldwide. They demonstrate your skills and commitment to professional development, helping you stand out in the job market and advance your career."
    );
    this.addMessageToBotState(message);
  };

  handleCareerOpportunities = () => {
    const message = this.createChatBotMessage(
      "Our courses prepare students for a wide range of career opportunities in their respective fields. Graduates may pursue roles such as web developer, data analyst, software engineer, and more. The skills and knowledge gained from our courses equip students with the expertise needed to succeed in today's competitive job market."
    );
    this.addMessageToBotState(message);
  };

  handleJobRoles = () => {
    const message = this.createChatBotMessage(
      "Examples of job roles for graduates of our courses include:\n\n- Web Developer\n- Data Analyst\n- Software Engineer\n- Data Scientist\n- IT Consultant\n- Systems Analyst\n- Network Administrator\n- UX/UI Designer\n\nThese are just a few examples, and the career options may vary depending on the specific course and individual interests."
    );
    this.addMessageToBotState(message);
  };

  handleCareerAdvancement = () => {
    const message = this.createChatBotMessage(
      "Completing our courses can significantly enhance your career prospects and contribute to your career advancement. The practical skills, industry knowledge, and certifications gained from our programs demonstrate your expertise and dedication to professional development, making you a valuable asset to employers and opening up new opportunities for growth and advancement."
    );
    this.addMessageToBotState(message);
  };

  handleRefundPolicy = () => {
    const messages = this.createChatBotMessage(
      "All deposits made by any individual can not be refunded back.",
        );

    this.addMessageToBotState(messages);
  };

  // handleStudentPace = () => {
  //   const messages = this.createChatBotMessage(
  //     "In any of our courses, you will be assigned to an instructor hence making the courses instuctor-led.",
  //       );

  //   this.addMessageToBotState(messages);
  // };

  

  addMessageToBotState = (messages, newState) => {
    if (Array.isArray(messages)) {
      this.setState((state) => ({
        ...state,
        ...newState,
        messages: [...state.messages, ...messages],
        gist: "",
        infoBox: "",
      }));
    } else {
      this.setState((state) => ({
        ...state,
        ...newState,
        messages: [...state.messages, messages],
        gist: "",
        infoBox: "",
      }));
    }
  };
}

// Exporting handleForm as named export along with the default export of ActionProvider
export default ActionProvider;

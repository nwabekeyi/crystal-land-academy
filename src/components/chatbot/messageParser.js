class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
     }

  parse = (message) => {
    const lowerCase = message.toLowerCase();
    // const courseInfo = ActionProvider.handleCourseInfo

    if (lowerCase.includes('hello') || lowerCase.includes('hi')) {
      this.actionProvider.handleHello();
    }
    else if (lowerCase.includes('register') &&
    (lowerCase.includes('course') || lowerCase.includes('programme') || lowerCase.includes('program') ) )
    {
      this.actionProvider.handleCourseRegistration();
    }

    else if (lowerCase.includes('register') &&
    (lowerCase.includes('how') || lowerCase.includes('for')) )
    {
      this.actionProvider.handleCourseRegistration();
    }
    else if (
      lowerCase.includes("about") &&
      (lowerCase.includes("program") || lowerCase.includes("programme") || lowerCase.includes("courses") || lowerCase.includes("course"))) {
      this.actionProvider.handleProgramInformation();
    }

    else if (
      (lowerCase.includes("know") || lowerCase.includes("details")) &&
      (lowerCase.includes("program") || lowerCase.includes("programme") || lowerCase.includes("courses") || lowerCase.includes("course"))) {
      this.actionProvider.handleProgramInformation();
    }

    else if (
      lowerCase.includes("how") &&
      (lowerCase.includes("started") || lowerCase.includes("start"))) {
      this.actionProvider.handleProgramInformation();
    }

    else if (
      lowerCase.includes("get") &&
      lowerCase.includes("more") &&
      lowerCase.includes("information") &&
      (lowerCase.includes("program") || lowerCase.includes("programme") || lowerCase.includes("course"))) {
      this.actionProvider.handleProgramInformation();
    }

    else if (
      (lowerCase.includes("long") || lowerCase.includes("duration") || lowerCase.includes("period")) &&
      (lowerCase.includes("program") || lowerCase.includes("programme") || lowerCase.includes("courses") || lowerCase.includes("course"))) {
      this.actionProvider.handleProgramDuration();
    }

    else if (
      (lowerCase.includes("class") || lowerCase.includes("classes")) &&
      (lowerCase.includes("online") || lowerCase.includes("virtual")
      || lowerCase.includes("physical") || lowerCase.includes("conducted")
      || lowerCase.includes("schedules") || lowerCase.includes("schedule") ||  lowerCase.includes("conduct"))) {
      this.actionProvider.handleClassFormat();
    }

    else if (
      (lowerCase.includes("class") || lowerCase.includes("classes") || lowerCase.includes("program") || lowerCase.includes("programme")) &&
      (lowerCase.includes("start") || lowerCase.includes("starting"))
    ) {
      this.actionProvider.handleClassStartDate();
    }

    else if (
      (lowerCase.includes("cost") || lowerCase.includes("much") || lowerCase.includes("what") || lowerCase.includes("how ")) &&
      (lowerCase.includes("course")
      || lowerCase.includes("program")
      ||lowerCase.includes("programme")
      ||lowerCase.includes("courses"))
    ) {
      this.actionProvider.handleCoursePrice();
    }

    else if (
      (lowerCase.includes("front-end") ||
      lowerCase.includes("frontend")) &&
      (lowerCase.includes("know") ||
      lowerCase.includes("more") ||
      lowerCase.includes("curriculum") ||
      lowerCase.includes("about"))

    )     {
      this.actionProvider.handleWebDevelopmentFrontendInfo();
    }

    else if (
      (lowerCase.includes("backend-end") ||
      lowerCase.includes("backend")) &&
      (lowerCase.includes("know") ||
      lowerCase.includes("more") ||
      lowerCase.includes("curriculum") ||
      lowerCase.includes("about"))    ) {
      this.actionProvider.handleWebDevelopmentBackendInfo();
    }

    else if (
      lowerCase.includes("data science") &&
      (lowerCase.includes("know") ||
      lowerCase.includes("more") ||
      lowerCase.includes("curriculum") ||
      lowerCase.includes("about"))    ) 
      {
      this.actionProvider.handleDataScienceInfo();
    }

    else if (
      lowerCase.includes("software engineering") &&
      (lowerCase.includes("know") ||
      lowerCase.includes("more") ||
      lowerCase.includes("curriculum") ||
      lowerCase.includes("about"))    )
       {
      this.actionProvider.handleSoftwareEngineeringInfo();
    }

    else if (
      lowerCase.includes("data analytics") &&
      (lowerCase.includes("know") ||
      lowerCase.includes("more") ||
      lowerCase.includes("curriculum") ||
      lowerCase.includes("about"))    )
      {
      this.actionProvider.handleDataAnalyticsInfo();
    }

    else if (
      (lowerCase.includes("internet of things") ||
      lowerCase.includes("Iot")) &&
      (lowerCase.includes("know") ||
      lowerCase.includes("more") ||
      lowerCase.includes("curriculum") ||
      lowerCase.includes("about"))    ) {
      this.actionProvider.handleInternetOfThingsInfo();
    }

    else if (
      lowerCase.includes('difference') &&
      (lowerCase.includes('data science') ||
        lowerCase.includes('data analytics'))
    ) {
      this.actionProvider.handleDataScienceVsDataAnalytics();
    }

    else if (
      lowerCase.includes('difference') &&
      (lowerCase.includes('data science') ||
        lowerCase.includes('software engineering'))
    ) {
      this.actionProvider.handleDataScienceVsSoftwareEngineering();
    }

    else if (
      lowerCase.includes('difference') &&
      (lowerCase.includes('data analytics') ||
        lowerCase.includes('software engineering'))
    ) {
      this.actionProvider.handleDataAnalyticsVsSoftwareEngineering();
    }

    else if (
      lowerCase.includes('difference') &&
      (lowerCase.includes('web development') ||
        lowerCase.includes('data science'))
    ) {
      this.actionProvider.handleWebDevVsDataScience();
    }

    else if (
      lowerCase.includes('difference') &&
      (lowerCase.includes('web development') ||
        lowerCase.includes('software engineering'))
    ) {
      this.actionProvider.handleWebDevVsSoftwareEngineering();
    }

    else if (
      lowerCase.includes('difference') &&
      (lowerCase.includes('web development') ||
        lowerCase.includes('data analytics'))
    ) {
      this.actionProvider.handleWebDevVsDataAnalytics();
    }

    else if (
      lowerCase.includes('prerequisites') ||
      lowerCase.includes('requirements')
    ) {
      this.actionProvider.handlePrerequisites();
    }

    else if (
      (lowerCase.includes('experience') || lowerCase.includes('prior')) && 
      (lowerCase.includes("program") || lowerCase.includes("programme") || lowerCase.includes("courses") || lowerCase.includes("course")))  {
      this.actionProvider.handleNoExperienceNeeded();
    }

    else if (
      (lowerCase.includes('instructors') || lowerCase.includes('teachers') || lowerCase.includes('instructor') || lowerCase.includes('teacher')) &&
      (lowerCase.includes('for') || lowerCase.includes('how'))
    ) {
      this.actionProvider.handleInstructors();
    } else if (
      (lowerCase.includes('kind') ||lowerCase.includes('type') ) &&
      (lowerCase.includes('support') ||lowerCase.includes('assistance') ) 
    )
       {
      this.actionProvider.handleSupport();
    } else if (
      (lowerCase.includes('contact') ||lowerCase.includes('reach') ) &&
      (lowerCase.includes('instructors') || lowerCase.includes('teachers') || lowerCase.includes('instructor') || lowerCase.includes('teacher'))
    ) {
      this.actionProvider.handleContactInstructor();
    }

    else if (
      lowerCase.includes('accreditation') ||
      lowerCase.includes('accredited') ||
      lowerCase.includes('certified')
    ) {
      this.actionProvider.handleAccreditation();
    }

    else if (
      lowerCase.includes('certificate')
    ) {
      this.actionProvider.handleCertificate();
    }

    else if (
      (lowerCase.includes('recognition') || lowerCase.includes('known') || lowerCase.includes('know')  ) &&
      lowerCase.includes('certificate')
    ) {
      this.actionProvider.handleCertificateRecognition();
    }

    else if (
      (lowerCase.includes('career') || lowerCase.includes('job')) &&
      lowerCase.includes('opportunities')
    ) {
      this.actionProvider.handleCareerOpportunities();
    }

    else if (
      lowerCase.includes('job') &&
      lowerCase.includes('roles')
    ) {
      this.actionProvider.handleJobRoles();
    }

    else if (
      lowerCase.includes('career') &&
      lowerCase.includes('advancement')
    ) {
      this.actionProvider.handleCareerAdvancement();
    }

    else if(
      lowerCase.includes('refund') &&
      lowerCase.includes('policy') || lowerCase.include('policies')
    ){
      this.actionProvider.handleRefundPolicy();
    }

    // else if(
    //   lowerCase.includes('courses') &&
    //   lowerCase.includes('self-paced') || lowerCase.include('instructor-led')
    // ){
    //   this.actionProvider.handleStudentPace();
    // }

    else {
      this.actionProvider.handleUnknownQuery();
    }
  };
}

export default MessageParser;
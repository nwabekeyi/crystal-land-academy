import {
    benefitIcon1,
    benefitIcon2,
    benefitIcon3,
    benefitIcon4,
    benefitImage2,
    chromecast,
    disc02,
    discordBlack,
    facebook,
    instagram,
    notification2,
    notification3,
    notification4,
    recording01,
    recording03,
    sliders04,
    telegram,
    twitter,
  } from "../assets";
  
  import {
    GiPrayerBeads,
    GiStarFormation
  } from 'react-icons/gi';
  
  import { MdMosque } from "react-icons/md";

  import {
    FaQuran,
    FaPray,
    FaBook,
    FaHandHoldingHeart,
    FaUserAlt
  } from 'react-icons/fa';

  import sciencelab from '../assets/lab_facility.png'
  import learningAid from '../assets/learning_aid.webp'
  import creche from '../assets/creche.jpg'
  import computerlab from '../assets/computer_lab.jpg'



  
  export const navigation = [
    {
        id: "1",
        title: "About Us",
        url: "#About",
    },
    {
        id: "2",
        title: "Services",
        url: "#services",
    },
    {
        id: "3",
        title: "Learning Approach",
        url: "#roadmap",
    },
    {
        id: "4",
        title: "Sign Up",
        url: "/code-authenticator",
        onlyMobile: true,
    },
    {
        id: "5",
        title: "Sign in",
        url: "/signin",
        onlyMobile: true,
    },
];
  
  
  export const notificationImages = [notification4, notification3, notification2];

  export const services = [
    "Qualified teachers",
    "Conducive learning environment",
    "Islamic-rooted learning"
  ];
  
  export const servicesIcons = [
    recording03,
    recording01,
    disc02,
    chromecast,
    sliders04,
  ];
  
  export const roadmap = [
    {
      id: "0",
      title: "Creche",
      text: "A warm and nurturing environment designed to support early childhood development through play, care, and foundational learning.",
      imageUrl: creche,
      colorful: true,
    },
    {
      id: "1",
      title: "Science laboratory",
      text: "A hands-on learning space where students explore scientific concepts through experiments and practical activities.",
      imageUrl: sciencelab,
    },
    {
      id: "2",
      title: "Visual and vocal learning aids",
      text: "Innovative tools and resources that enhance understanding through visual cues and auditory guidance, catering to diverse learning styles.",
      date: "May 2023",
      imageUrl: learningAid,
    },
    {
      id: "3",
      title: "Computer facilities",
      text: "Modern computer labs equipped to build digital literacy, support coding skills, and encourage tech-based learning.",
      imageUrl: computerlab,
    },
  ];
  
  export const collabText =
"Proving a structured approach to creating a high-quality Islamic school that combines modern education with islamic values "
  
  export const collabContent = [
    {
      id: "0",
      title: "Qualified teachers",
      text: collabText,
    },
    {
      id: "1",
      title: "Islamic studies",
    },
    {
      id: "2",
      title: "Conducive learning environment",
    },
  ];
  
  export const collabApps = [
    {
      id: "0",
      title: "Qur'an",
      icon: FaQuran,
      width: 34,
      height: 34,
    },
    {
      id: "1",
      title: "Mosque",
      icon: MdMosque,
      width: 36,
      height: 36,
    },
    {
      id: "2",
      title: "Prayer",
      icon: FaPray,
      width: 32,
      height: 32,
    },
    {
      id: "3",
      title: "Islamic Book",
      icon: FaBook,
      width: 34,
      height: 34,
    },
    {
      id: "4",
      title: "Charity",
      icon: FaHandHoldingHeart,
      width: 34,
      height: 34,
    },
    {
      id: "5",
      title: "Modesty",
      icon: FaUserAlt,
      width: 32,
      height: 32,
    },
    {
      id: "6",
      title: "Tasbeeh",
      icon: GiPrayerBeads,
      width: 30,
      height: 30,
    },
    {
      id: "7",
      title: "Ummah",
      icon: GiStarFormation, // symbolic
      width: 34,
      height: 34,
    },
  ];
  
  
  export const about = [
    {
      id: "0",
      title: "Excellence",
      description: "Provide quality education integrated with islamic principles",
      pictureUrl: "https://dl.dropboxusercontent.com/scl/fi/nc5lyu0qrs8wuss68iu5b/istockphoto-838386124-612x612.jpg?rlkey=8lotlyti5j9v7r781e867rozb&st=l70imi5l&dl=0",  // Replace with the actual path to the image
    },
    {
      id: "1",
      title: "Faith",
      description: "Foster a nurturing, faith-based learning environment",
      pictureUrl: "https://dl.dropboxusercontent.com/scl/fi/9nc6j2x5gm6kwex1dqxzy/energy-innovation-concept-light-bulb-black-background-with-light-fair-power-energy-ecology-solution-saving-global-warming-creative-innovation-idea_44868-1375.avif?rlkey=2m300llz5gt20butx8d9qp5e0&st=el7wrxmi&dl=0",  // Replace with the actual path to the image
    },
    {
      id: "2",
      title: "Discipline",
      description: "Build a foundation for lifelong learning and responsible citizenship",
      pictureUrl: "https://dl.dropboxusercontent.com/scl/fi/53nmmrlj09hg9u23ff1pq/QuestionMarks-FAQs.png?rlkey=z0d5dtx8nsul7pxodseaz4qf4&st=1l1k2na3&dl=0",  // Replace with the actual path to the image
    },
  ];
  
  
  export const courses = [
    {
      id: "0",
      title: "Frontend Development",
      text: "Learn how to build interactive websites and applications using HTML, CSS, JavaScript, and popular frameworks like React and Vue.js.",
      backgroundUrl: "./src/assets/benefits/card-1.svg",
      iconUrl: benefitIcon1,
      imageUrl: benefitImage2,
    },
    {
      id: "1",
      title: "Fullstack Development",
      text: "Become a full-stack developer by mastering both frontend and backend technologies, including Node.js, Express, and databases like MongoDB.",
      backgroundUrl: "./src/assets/benefits/card-2.svg",
      iconUrl: benefitIcon2,
      imageUrl: benefitImage2,
      light: true,
    },
    {
      id: "2",
      title: "Software Engineering",
      text: "Master software engineering principles, including design patterns, algorithms, and system architecture to develop scalable applications.",
      backgroundUrl: "./src/assets/benefits/card-3.svg",
      iconUrl: benefitIcon3,
      imageUrl: benefitImage2,
    },
    {
      id: "3",
      title: "Cybersecurity",
      text: "Learn how to protect systems from cyber threats with ethical hacking, penetration testing, encryption, and security protocols.",
      backgroundUrl: "./src/assets/benefits/card-4.svg",
      iconUrl: benefitIcon4,
      imageUrl: benefitImage2,
      light: true,
    },
    {
      id: "4",
      title: "Data Analysis",
      text: "Develop skills to analyze, interpret, and visualize data using tools like Python, R, and SQL to derive insights and make data-driven decisions.",
      backgroundUrl: "./src/assets/benefits/card-5.svg",
      iconUrl: benefitIcon1,
      imageUrl: benefitImage2,
    },
    {
      id: "5",
      title: "UI/UX Design",
      text: "Learn how to design user-friendly interfaces and create exceptional user experiences with tools like Figma, Adobe XD, and prototyping.",
      backgroundUrl: "./src/assets/benefits/card-6.svg",
      iconUrl: benefitIcon2,
      imageUrl: benefitImage2,
    },
  ];
  
  export const socials = [
    {
      id: "0",
      title: "Discord",
      iconUrl: discordBlack,
      url: "#",
    },
    {
      id: "1",
      title: "Twitter",
      iconUrl: twitter,
      url: "#",
    },
    {
      id: "2",
      title: "Instagram",
      iconUrl: instagram,
      url: "#",
    },
    {
      id: "3",
      title: "Telegram",
      iconUrl: telegram,
      url: "#",
    },
    {
      id: "4",
      title: "Facebook",
      iconUrl: facebook,
      url: "#",
    },
  ];
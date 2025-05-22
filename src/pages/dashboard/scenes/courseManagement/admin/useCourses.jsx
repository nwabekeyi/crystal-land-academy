import { useState, useEffect } from 'react';
import useApi from '../../../../../hooks/useApi';
import { useDispatch, useSelector } from 'react-redux';
import {setAllCourses} from '../../../../../reduxStore/slices/adminDataSlice'
import { endpoints } from '../../../../../utils/constants';


const useCourses = () => {

  // Use the centralized useWebSocket hook, passing both URL and actionToSend

  const [formValues, setFormValues] = useState({
    courseName: '',
    description: '',
    duration: '',
    startDate: '',
    cost: '',
    curriculum: []
  });
  
  const[openCourseDetails, setOpenCourseDetails] = useState(false);
  const [courses, setCourses] = useState([]);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [cohortAddModalOpen, setCohortAddModalOpen] = useState(false);  // Separate state for Cohort Add Modal
  const [updateCurriculumModalOpen, setUpdateCurriculumModalOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [addMessageModal, setAddMessageModal] = useState(null);
  const [message, setMessage] = useState('');
  const [openCurriculumList, setOpenCurriculumList] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [addCurriculumOpen, setAddCurriculumOpen] = useState(false);  
  const { loading, data, error, callApi } = useApi();
  const allCourses = useSelector((state) => state.adminData.allCourses);
  const dispatch = useDispatch();
  const [deleteCourseModal, setDeleteCourseModal] = useState(false)

  useEffect(() => {
    if (allCourses) {
      setCourses(allCourses);
    }
  }, [allCourses]);  // Only runs when `allCourses` changes
  
  useEffect(() => {
    callApi(endpoints.COURSES, 'GET');
  }, []);

  useEffect(() => {
    if (!loading && data) {
      console.log('Data received:', data);
      dispatch(setAllCourses(data));
      setCourses(data.courses);
    }
  }, [loading, data]); 

  // Handle course form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle curriculum field changes
  const handleCurriculumChange = (index, field, value) => {
    const newCurriculum = [...formValues.curriculum];
    newCurriculum[index] = { ...newCurriculum[index], [field]: value };
    setFormValues(prev => ({
      ...prev,
      curriculum: newCurriculum
    }));
  };

  // Add new course
  const handleAddCourse = async () => {
  const { courseName, description, duration, startDate, cost } = formValues;
    console.log(formValues)
  // Validation: Ensure all required fields are filled
  if (
    courseName.trim() === '' ||
    description.trim() === '' ||
    duration.trim() === '' ||
    startDate.trim() === ''
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  if (/[/\\]/.test(courseName)) {
    alert("Course name cannot contain slashes");
  }
  
  // Prepare the course data to be sent in the API request
  const courseData = {
    courseName,
    description,
    duration,
    startDate,
    cost: parseFloat(cost), // Convert cost to a number
  };

  // Call the API to add the course
  const courseId = await callApi(endpoints.COURSES, "POST", courseData);

  if (courseId) {
    // Update courses list if the course was successfully added
    const updatedCourses = [...courses, { id: courseId, ...courseData }];
    setCourses(updatedCourses);

    // Store the updated courses in sessionStorage
    sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));

    // Reset the form fields
    setFormValues({
      courseName: '',
      description: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  } else {
    console.log('Failed to add course.');
  }
};

  // Update course curriculum
  const handleUpdateCurriculum = async () => {
    try {

      const updatedCourses = courses.map(course =>
        course.id === currentCourseId ? { ...course, curriculum: formValues.curriculum } : course
      );
      setCourses(updatedCourses);

      setFormValues({
        courseName: '',
        description: '',
        duration: '',
        startDate: '',
        cost: '',
        curriculum: []
      });
      setUpdateCurriculumModalOpen(false);
    } catch (error) {
      console.error('Error updating curriculum:', error);
    }
  };

  // Delete a course
  const handleDeleteCourse = (courseId) => {
    callApi(`${endpoints.COURSES}/${courseId}`, 'DELETE');
    setDeleteCourseModal(false);

  };

  // Open curriculum update modal
  const handleAddCurriculum = (id) => {
    const course = courses.find(c => c.id === id);
    if (course && course.curriculum && course.curriculum.length > 0) {
      setFormValues({ ...formValues, curriculum: course.curriculum });
    } else {
      setFormValues({ ...formValues, curriculum: [] });
    }
    setUpdateCurriculumModalOpen(true);
  };

  // Add a new curriculum field
  const addCurriculumField = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      curriculum: [...prevValues.curriculum, { topic: '', overview: '', week: '', isCompleted: false }]
    }));
  };

  // Remove a curriculum field
  const removeCurriculumField = (index) => {
    setFormValues(prevValues => ({
      ...prevValues,
      curriculum: prevValues.curriculum.filter((_, i) => i !== index)
    }));
  };

  // Open add course modal
  const openAddCourseModal = (status) => {

    const modalType = status
    sessionStorage.setItem('modalType', JSON.stringify(modalType));

    if(status === 'add'){
      setFormValues({
        courseName: '',
        description: '',
        duration: '',
        startDate: '',
        cost: '',
        curriculum: []
      });
      setAddCourseModalOpen(true);
    }else{
      setAddCourseModalOpen(true);

    }
  };

  // Open add course modal
  const openDeleteCourseModal = (course) => {
    console.log(course)
    sessionStorage.setItem('selectedCourseId', JSON.stringify(course.id));
    setDeleteCourseModal(true);
  };
  const closeDeleteCourseModal = () => {
    setDeleteCourseModal(false);
  };

  // Close add course modal
  const closeAddCourseModal = () => {
    setAddCourseModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  };

  // Open cohort add modal
  const openCohortAddModal = () => {
    console.log('hello')
    setCohortAddModalOpen(true);  // Set cohort modal to true
  };

  // Close cohort add modal
  const closeCohortAddModal = () => {
    setCohortAddModalOpen(false);  // Set cohort modal to false
  };

   // Open curricum list
   const openCurriculum = (course) => {
    console.log('hello')
    setSelectedCourse(course);
    setOpenCurriculumList(true);  // Set cohort modal to true
  };

  // Close cohort add modal
  const closeCurriculum = () => {
    setOpenCurriculumList(false);  // Set cohort modal to false
  };

  // Close curriculum update modal
  const closeUpdateCurriculumModal = () => {
    setUpdateCurriculumModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  };

  // Open course details modal
  const openCourseDetailsModal = (course) => {
    if (course) {
      setSelectedCourse(course);
      setOpenCourseDetails(true);
    } else {
      console.log("No valid course passed");
    }
  };
  

  const openAddCurriculumModal = () => {
    console.log('Opening curriculum modal'); // Add a console log to check if it's called
    setAddCurriculumOpen(true);
  };
  
  const closeAddCurriculumModal = () => {
    setAddCurriculumOpen(false);
  };

  // Close course details modal
  const closeCourseDetailsModal = () => {
    setOpenCourseDetails(false);
    setSelectedCourse(null);
  };


  // Close message modal
  const closeAddMessageModal = () => {
    setAddMessageModal(false);
  };

  // Update course details
const handleUpdateCourse = async (courseId) => {
  const { courseName, description, duration, startDate, cost, curriculum } = formValues;

  // Ensure required fields are filled
  if (
    courseName.trim() === '' ||
    description.trim() === '' ||
    duration.trim() === '' ||
    startDate.trim() === '' ||
    cost === ''
  )
    return;

  const updatedCourseData = {
    courseName,
    description: description,
    duration,
    startDate,
    cost: parseFloat(cost),
    curriculum
  };

  try {
    // Update the course in the database
    await callApi(`${endpoints.COURSES}/${courseId}`, 'PUT', updatedCourseData);

    // Update the course in the state
    const updatedCourses = courses.map(course =>
      course.id === selectedCourse.id ? { ...course, ...updatedCourseData } : course
    );
    setCourses(updatedCourses);

    // Save the updated courses to sessionStorage

    // Reset form values and close the modal
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
    setAddCourseModalOpen(false);
  } catch (error) {
    console.error('Error updating course:', error);
  }
};


  return {
    handleUpdateCourse,
    openCourseDetails,
    courses,
    formValues,
    addCourseModalOpen,
    cohortAddModalOpen,  // Pass this to the UI
    updateCurriculumModalOpen,
    selectedCourse,
    addMessageModal,
    message,
    handleChange,
    handleCurriculumChange,
    handleAddCourse,
    handleUpdateCurriculum,
    handleDeleteCourse,
    handleAddCurriculum,
    addCurriculumField,
    removeCurriculumField,
    openAddCourseModal,
    closeAddCourseModal,
    openCohortAddModal,  // Provide open/close methods
    closeCohortAddModal,
    closeUpdateCurriculumModal,
    openCourseDetailsModal,
    closeCourseDetailsModal,
    closeAddMessageModal,
    openAddCurriculumModal,
    closeAddCurriculumModal,
    addCurriculumOpen,
    openCurriculumList,
    openCurriculum,
    closeCurriculum,
    setSelectedCourse,
    deleteCourseModal,
    closeDeleteCourseModal,
    openDeleteCourseModal
   };
};

export default useCourses;

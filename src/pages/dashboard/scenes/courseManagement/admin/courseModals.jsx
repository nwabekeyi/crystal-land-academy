import React from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Stack, 
  Paper,
  IconButton
} from '@mui/material';
import useCourses from './useCourses';
import useApi from '../../../../../hooks/useApi';
import { useState, useEffect } from 'react';
import { endpoints } from '../../../../../utils/constants';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from "../../../components/modal";
import ActionButton from '../../../components/actionButton';
import CustomIconButton from '../../../components/customIconButton';



const AddCurriculumModal = ({ courseId }) => {

  const { handleCurriculumChange } = useCourses();
  const [resources, setResources] = useState(''); // State for resources input
  const { loading, data, error, callApi } = useApi();


  // Handle resources input change
  const handleResourcesChange = (event) => {
    setResources(event.target.value);
  };

  // Submit function to handle adding curriculum
  const handleSubmit = () => {
    const resourcesArray = resources.split(',').map(resource => resource.trim()); // Convert the string to an array
    const curriculumData = {
      topic: 'Sample Topic', // Use state values or inputs as necessary
      description: 'Sample Description', 
      duration: '1 Week',
      courseId: courseId,
      resources: resourcesArray, // Send resources as an array
    };

    callApi(endpoints.CURRICULUM, "POST", curriculumData, {});
    console.log(curriculumData); // Here you would typically call an API to send data to the backend
  };

  return (
    <Box>
      
      <TextField
        label="Topic"
        name="topic"
        onChange={handleCurriculumChange} // Assuming this function updates the state for topic
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Description"
        name="description"
        onChange={handleCurriculumChange} // Assuming this function updates the state for description
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Duration"
        name="duration"
        onChange={handleCurriculumChange} // Assuming this function updates the state for duration
        fullWidth
        margin="normal"
      />
      
      {/* New Resources field */}
      <TextField
        label="Resources (comma separated links)"
        name="resources"
        value={resources}
        onChange={handleResourcesChange} // Update resources state on change
        fullWidth
        margin="normal"
      />

      <ActionButton 
        onClick={handleSubmit} // On submit, send the data with resources array
        content="Add Curriculum"
      />
    </Box>
  );
};


const AddCourseModal = ({ course, handleSubmit }) => {
  const { formValues, handleChange, handleAddCourse, handleUpdateCourse } = useCourses();
  const [isUpdating, setIsUpdating] = useState('');
  const [courseId, setCourseId] = useState('');

  // Prefill the form if updating a course
  useEffect(() => {
    const modalType = JSON.parse(sessionStorage.getItem('modalType'));
    const courseid = JSON.parse(sessionStorage.getItem('selectedCourseId'));
    setCourseId(courseid);
    setIsUpdating(modalType);
  }, [isUpdating]);

  useEffect(() => {
    if (isUpdating === 'update' && course) {
      // Set form values to the existing course data when updating
      handleChange({
        target: { name: 'courseName', value: course.courseName },
      });
      handleChange({
        target: { name: 'description', value: course.description },
      });
      handleChange({
        target: { name: 'duration', value: course.duration },
      });
      handleChange({
        target: { name: 'startDate', value: course.startDate },
      });
      handleChange({
        target: { name: 'cost', value: course.cost },
      });
    }
  }, [course, isUpdating]);

  const handleFormSubmit = () => {
    if (isUpdating === 'update') {
      handleUpdateCourse(courseId);
    } else {
      handleAddCourse();
    }
  };

  return (
    <Box>
      <Box mb={2}>
        <TextField
          label="Course Name"
          name="courseName"
          value={formValues.courseName}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Course Description"
          name="description"
          value={formValues.courseDescription}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Duration"
          name="duration"
          value={formValues.duration}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Start Date"
          name="startDate"
          type="date" // Set the input type to date
          value={formValues.startDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true, // Ensure the label is always above the input field for date
          }}
  />
      </Box>
      <Box mb={2}>
        <TextField
          label="Cost"
          name="cost"
          value={formValues.cost}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <ActionButton 
        onClick={handleFormSubmit}  // On submit, send the data with resources array
        content= {isUpdating === 'update' ? 'Update Course' : 'Add Course'}
      />
    </Box>
  );
};



const AddCohortModal = ({ courseId }) => {
  const urlId = courseId;
  console.log(typeof courseId);
  const [cohortName, setCohortName] = useState('');
  const { callApi } = useApi();

  // Handle input change for the cohort name
  const handleChange = (event) => {
    setCohortName(event.target.value);
  };

  // API call to create a new cohort
  const handleSubmit = async (courseId) => {
    const body = {
      name: cohortName

    }
    await callApi(`${endpoints.COHORT}/${urlId}`, "POST", body, {});  };

  return (
    <Box>
      <TextField
        label="Cohort Name"
        name="cohortName"
        value={cohortName}
        onChange={handleChange}
      />
      <ActionButton 
        onClick={handleSubmit}   // On submit, send the data with resources array
        content= "Add cohort"
      />
    </Box>
  );
};



const COurseDetailsModal = ({selectedCourse, userRole, openAddCurriculumModal, openCohortAddModal,}) => {
  console.log(selectedCourse)
  return (
    <Box>
    <Typography variant="h6">Course Name</Typography>
    <Typography>{selectedCourse.courseName}</Typography>

    <Typography variant="h6">Description</Typography>
    <Typography>{selectedCourse.description}</Typography>

    <Typography variant="h6">Duration</Typography>
    <Typography>{selectedCourse.duration}</Typography>

    <Typography variant="h6">Start Date</Typography>
    <Typography>{new Date(selectedCourse.startDate).toLocaleDateString()}</Typography>

    <Typography variant="h6">Cost</Typography>
    <Typography>{selectedCourse.cost}</Typography>

    {/* <Typography variant="h6">Cohorts</Typography>
    {selectedCourse.cohorts.length > 0 ? (
      selectedCourse.cohorts.map((cohort, index) => (
        <Typography key={index}>Cohort {index + 1}</Typography>
      ))
    ) : (
      <Typography>No Cohorts available</Typography>
    )} */}

    {/* <Typography variant="h6">Curriculum</Typography>
    {selectedCourse.curriculum.length > 0 ? (
      selectedCourse.curriculum.map((curriculumItem, index) => (
        <Box key={index} mb={2}>
          <Typography variant="body1">Week {curriculumItem.week}: {curriculumItem.topic}</Typography>
          <Typography variant="body2">{curriculumItem.overview}</Typography>
        </Box>
      ))
    ) : (
      <Typography>No Curriculum available</Typography>
    )} */}

    {userRole === "admin" || userRole === "superadmin" && (
      <Box sx={{display: 'flex', gap:'5px'}}>
        <ActionButton 
        onClick={openCohortAddModal}   // On submit, send the data with resources array
        content= "Add cohort"
      />

      <ActionButton
          onClick={openAddCurriculumModal}   // On submit, send the data with resources array
          content= "Add curriculum"
        />
      </Box>
    )}

    <CurriculumList id={selectedCourse.id} />
  </Box>
  )
}

const CurriculumList = ({ id }) => {
  const courses = useSelector((state) => state.adminData.courses.courses);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ topic: '', description: '', duration: '', resources: [] });
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const { loading, data, error, callApi } = useApi();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const[confirmMessage, setConfirmMessage]=useState(false)



  // Find the course that matches the passed id
  const course = courses.find((course) => course.courseId === id);

  // Ensure curriculum exists before mapping
  const curriculum = course ? course.curriculum : [];

  console.log(curriculum);

  // Handler for selecting a curriculum (e.g., for editing)
  const handleSelectCurriculum = (curriculumItem) => {
    setSelectedCurriculum(curriculumItem);
    console.log('Selected curriculum:', curriculumItem);
    setEditFormData({
      topic: curriculumItem.topic,
      description: curriculumItem.description,
      duration: curriculumItem.duration,
      resources: curriculumItem.resources.join(', '), // Convert array back to comma-separated string
    });
  };

  const handleOpenEditOpen = () => {
    setOpenEditModal(true);
  };

  const closeOpenEditOpen = () => {
    setOpenEditModal(false);
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handler for editing a curriculum
  const handleEditSubmit = async () => {
    const updatedData = {
      curriculumId:selectedCurriculum._id,
      courseId: id, // Use the passed course ID
      ...editFormData,
      resources: editFormData.resources.split(',').map((r) => r.trim()), // Convert resources back to array
    };

    try {
      await callApi(endpoints.CURRICULUM, "PUT", updatedData, {});
      console.log('Curriculum updated:', updatedData);
    } catch (error) {
      console.error('Error updating curriculum:', error);
    }
  };

  // Handler for deleting a curriculum
  const handleDelete = async () => {

    const data = {
      curriculumId:selectedCurriculum._id,
      courseId: id
    };

    const response = await callApi(endpoints.CURRICULUM, "DELETE", data, {});
    if(response.ok){
      setConfirmMessage(true);

    }

  };

  const handleOpenConfimModal = () => {
    setConfirmationModal(true);
  };
  const handleCloseConfirmModal = () => {
    setConfirmMessage(false);
    setConfirmationModal(false);

  };


  return (
    <Stack spacing={2} mt={4}>
      {curriculum.length > 0 ? (
        curriculum.map((curriculumItem) => (
          <Paper key={curriculumItem._id} elevation={3} style={{ padding: '16px' }} onClick={() => handleSelectCurriculum(curriculumItem)}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" gutterBottom>{curriculumItem.topic}</Typography>
              <Box>

            {/* Edit Button */}
            <CustomIconButton 
              color="primary" 
              onClick={handleOpenEditOpen} 
              icon={<EditIcon />} 
              sx={{ /* Add any additional styles if needed */ }} 
            />

            {/* Delete Button */}
            <CustomIconButton 
              color="secondary" 
              onClick={handleOpenConfimModal} 
              icon={<DeleteIcon />} 
              sx={{ /* Add any additional styles if needed */ }} 
            />
              </Box>
            </Box>

            <Typography variant="body1" gutterBottom><strong>Description:</strong> {curriculumItem.description}</Typography>
            <Typography variant="body1" gutterBottom><strong>Duration:</strong> {curriculumItem.duration}</Typography>
            <Typography variant="body1" gutterBottom><strong>Resources:</strong> {curriculumItem.resources.join(', ')}</Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="h6">No curriculum available for this course.</Typography>
      )}

      {/* Edit Curriculum Modal */}
      <Modal open={openEditModal} onClose={closeOpenEditOpen} title="Edit Curriculum" noConfirm>
        <form>
          <TextField
            label="Topic"
            name="topic"
            value={editFormData.topic}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editFormData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Duration"
            name="duration"
            value={editFormData.duration}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Resources (comma-separated)"
            name="resources"
            value={editFormData.resources}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Box>
        </form>
      </Modal>

      <Modal open={confirmationModal} onClose={handleCloseConfirmModal} onConfirm={handleDelete}>
        { confirmationModal ?
            <p>Do you really want to delete curriculum?</p>
            : confirmationModal && confirmMessage ?
            <p>Curriculum successfull deleted</p>
            :
            <p></p>
        }
        </Modal>
    </Stack>
  );
};


export {AddCurriculumModal,
        AddCourseModal,
        AddCohortModal,
        COurseDetailsModal,
};
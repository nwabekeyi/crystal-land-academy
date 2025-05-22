import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton,  Avatar } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table'; // Adjust the import path as needed
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // For view submissions button
import { useSelector } from 'react-redux';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import ConfirmationModal from '../../components/confirmationModal';
import ActionButton from '../../components/actionButton';
import CustomIconButton from '../../components/customIconButton';

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '' });
  const [sortBy, setSortBy] = useState('sn');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewSubmissionsModal, setViewSubmissionsModal] = useState(false); // Modal for viewing submissions
  const [submissions, setSubmissions] = useState([]); // Store submissions for the selected assignment
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Modal for confirmation before delete
  const [assignmentToDelete, setAssignmentToDelete] = useState(null); // Store assignment to delete
  const [deleteConfirm, setDeleteConfrim] = useState(false);
  const [updateConfirm, setUpdateConfrim] = useState(false)
  const [postConfirm, setPostConfrim] = useState(false)

    //handle confirm modal close
    const handleConfirmModalClose = () => {
      if(deleteConfirm === true){
        setDeleteConfrim(false);
      };
  
      if(updateConfirm === true){
        setUpdateConfrim(false);
      };
      if(postConfirm === true){
        setPostConfrim(false);
      }
    };

  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const postUrl = `${endpoints.ASSIGNMENT}/${cohortName}`;

  const { loading: postLoading, data: postData, error: postError, callApi: postCallApi } = useApi();
  const { loading: getLoading, data: getCallData, error: getError, callApi: getCallApi } = useApi();
  const { loading: putLoading, data: putData, error: putError, callApi: putCallApi } = useApi();
  const { loading: deleteLoading, data: deleteData, error: deleteError, callApi: deleteCallApi } = useApi();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (postUrl) {
        console.log(postUrl)
        const data = await getCallApi(postUrl, 'GET');
        setAssignments(data);
      }
    };

    fetchSchedules();
  }, []);

  const sortAssignments = (assignments) => {
    return assignments.sort((a, b) => (b?.id || 0) - (a?.id || 0));
  };

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setNewAssignment({
        title: assignment.title,
        dueDate: assignment.dueDate,
        description: assignment.description,
      });
    } else {
      setSelectedAssignment(null);
      setNewAssignment({ title: '', dueDate: '', description: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (selectedAssignment) {
        // Update assignment via the API using PUT request
        const response = await putCallApi(
          `${postUrl}/${selectedAssignment._id}`,
          'PUT',
          newAssignment
        );

        // If the update is successful, update assignments in local state
        if (response) {
          const updatedAssignments = assignments.map(a =>
            a.id === selectedAssignment.id ? { ...a, ...newAssignment } : a
          );
          setAssignments(sortAssignments(updatedAssignments)); // Sort after update
          setUpdateConfrim(true);
        }else{
          setUpdateConfrim(true);
        }
      } else {
        // Add new assignment via the API using POST request
        const response = await postCallApi(postUrl, 'POST', newAssignment);

        // If post is successful, add the new assignment to the state
        if (response) {
          const newAssignmentWithId = { ...newAssignment, id: assignments.length + 1 };
          const updatedAssignments = [...assignments, newAssignmentWithId];
          setAssignments(sortAssignments(updatedAssignments)); // Sort after adding
          setPostConfrim(true);
        }else{
          setPostConfrim(true);
        }
      }

      handleCloseModal(); // Close the modal after submitting
    } catch (error) {
      console.error('Error submitting assignment: ', error);
    }
  };

  const handleDeleteAssignment = (assignment) => {
    setAssignmentToDelete(assignment);
    setOpenDeleteModal(true); // Show confirmation modal
  };

  const confirmDeleteAssignment = async () => {
    try {
      // Delete assignment using DELETE request
      const response = await deleteCallApi(
        `${postUrl}/${assignmentToDelete._id}`,
        'DELETE'
      );
      // If delete is successful, update assignments in local state
      if (response) {
        const updatedAssignments = assignments.filter(a => a.id !== assignmentToDelete.id);
        setAssignments(sortAssignments(updatedAssignments)); // Sort after deletion
        setDeleteConfrim(true);
        setDeleteConfrim(true);

      }else{
        setDeleteConfrim(true);

      }
      setOpenDeleteModal(false); // Close confirmation modal after delete
    } catch (error) {
      console.error('Error deleting assignment: ', error);
      setOpenDeleteModal(false); // Close confirmation modal on error
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false); // Close confirmation modal without deleting
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissions(assignment.submissions || []); // Populate submissions from the assignment
    console.log(submissions)
    setViewSubmissionsModal(true);
  };

  const handleCloseSubmissionsModal = () => {
    setViewSubmissionsModal(false);
  };

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAssignment(prevState => ({ ...prevState, [name]: value }));
  };

  // Columns definition with actions
  const columns = [
    { id: 'sn', label: 'S/N', minWidth: 50 },
    { id: 'title', label: 'Title', minWidth: 100 },
    { id: 'dueDate', label: 'Due Date', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 150 },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      renderCell: (row) => (
        <Box display="flex" justifyContent="start">
           < CustomIconButton
                title="Edit assignment"
                onClick={() => handleOpenModal(row)}
                icon= {<EditIcon />}
              />
             < CustomIconButton
                onClick={() => handleDeleteAssignment(row)}
                title="Delete assignment"
                icon= {<DeleteIcon />}
              />

              < CustomIconButton
                onClick={() => handleViewSubmissions(row)}
                title="View submissions"
                icon= {<VisibilityIcon />}
              />
    </Box>
      ),
    },
  ];

  return (
    <Box>
      <Header
        title="ASSIGNMENTS"
        subtitle="Overview of Assignments"
      />
         <ActionButton
        onClick={() => handleOpenModal()}
        content= 'Add Assignment'
      />

      <TableComponent
        columns={columns}
        tableHeader="Overview of Assignments"
        data={assignments.map((assignment, index) => ({
          ...assignment,
          sn: index + 1, // This will reflect the current index
        }))} 
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        hiddenColumnsSmallScreen={['dueDate', 'description']}
      />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={selectedAssignment ? "Update Assignment" : "Add Assignment"}
        onConfirm={handleSubmit}
      >
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            type="text"
            name="title"
            label="Title"
            value={newAssignment.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            type="date"
            name="dueDate"
            label="Due Date"
            value={newAssignment.dueDate}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="text"
            name="description"
            label="Description"
            value={newAssignment.description}
            onChange={handleInputChange}
            required
            multiline
            rows={4}
          />
        </Box>
      </Modal>

      {/* Confirmation Modal for Deleting Assignment */}
      <Modal
        open={openDeleteModal}
        onClose={handleCancelDelete}
        title="Confirm Deletion"
        onConfirm={confirmDeleteAssignment}
      >
        <Box>
          <p>Are you sure you want to delete this assignment?</p>
        </Box>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        open={viewSubmissionsModal}
        onClose={handleCloseSubmissionsModal}
        title="View Submissions"
        noConfirm
      >
       <Box>
  {submissions.length === 0 ? (
    <p>No submissions yet.</p>
  ) : (
    <Box>
      {submissions.map((submission, index) => (
       <Box
       key={index}
       sx={{
         display: 'flex',
         alignItems: 'center',
         marginBottom: '1rem',
         padding: '1rem',
         border: '1px solid #ddd',
         borderRadius: '8px',
         boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', // Adding a box shadow
       }}
     >
          {/* Display Profile Picture using MUI Avatar */}
          <Avatar 
            alt={`${submission.firstName} ${submission.lastName}`} 
            src={submission.profilePictureUrl} 
            sx={{ width: 50, height: 50, marginRight: '1rem' }} 
          />

          <Box>
            {/* Display Name */}
            <p>
              <strong>{submission.firstName} {submission.lastName}</strong>
            </p>

            {/* Student ID */}
            <p>Student ID: {submission.studentId}</p>

            {/* Submission Time */}
            <p>Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>

            {/* Submission URL as a Downloadable Link */}
            <p>
              <a 
                href={submission.submission} 
                download
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'blue' }}
              >
                Download Submission
              </a>
            </p>
          </Box>
        </Box>
      ))}
    </Box>
  )}
</Box>
      </Modal>

       {/* delete and update confrim modal */}
      <ConfirmationModal
        open={deleteConfirm || updateConfirm || postConfirm}
        onClose={handleConfirmModalClose}
        title= {deleteConfirm ? "Delete Confirmation" : postConfirm ? "Assignment created" : 'Update confirmation'}
        isLoading= {deleteConfirm ? deleteLoading : postConfirm ? postLoading : putLoading}
        message= {deleteConfirm ?
          "Assignment successfully deleted" :
          updateConfirm ? 'Assignment successfully updated' :
          deleteConfirm && deleteError ? "Could not update assignemnt, something went wrong" :
          updateConfirm && putError ? "Could not update assignemnt, something went wrong" :
          postConfirm ? 'Assignment successfully posted' :
           "something went wrong"
          }
      />
    </Box>
  );
};

export default Assignment;

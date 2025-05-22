import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, TextField, Tooltip, IconButton, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import Loader from "../../../../utils/loader";
import ConfirmationModal from '../../components/confirmationModal';
import ActionButton from '../../components/actionButton';

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [submissionMessageModal, SetSubmissionMessageModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [file, setFile] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { loading, data, callApi } = useApi();
  const { loading: postAssignmentLoad, error: postAssignmentError, callApi: postAssignment } = useApi();

  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const studentId = userDetails.studentId;
  const postUrl = `${endpoints.ASSIGNMENT}/${cohortName}`;

  useEffect(() => {
    if (postUrl) {
      callApi(postUrl, 'GET');
    }
  }, [postUrl, callApi]);

  useEffect(() => {
    if (data) {
      setAssignments(data);
    }
  }, [data]);

  const refinedAssignments = assignments.map((assignment, index) => {
    const hasSubmitted = assignment.submissions.some(
      (submission) => submission.studentId === studentId
    );

    return {
      id: index + 1,
      title: assignment.title,
      dueDate: assignment.dueDate,
      description: assignment.description,
      assignmentId: assignment.id,
      hasSubmitted // Add flag indicating if the student has submitted
    };
  });

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
    } else {
      setSelectedAssignment(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenSubmitModal = (assignment = null) => {
    setSelectedAssignment(assignment);
    setOpenSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setOpenSubmitModal(false);
  };

  const handleSubmissionMessageModal = () => {
    SetSubmissionMessageModal(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (assignmentId) => {
    if (file) {
      const formData = new FormData();
      formData.append('submission', file);
      formData.append('studentId', studentId);
      const response = postAssignment(`${endpoints.ASSIGNMENT}/submissions/${userDetails.cohort}/${assignmentId}`, 'PATCH', formData);
      if (response && response.message) {
         // Update the assignment state after successful submission
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === assignmentId
            ? {
                ...assignment,
                submissions: [...assignment.submissions, { studentId }], // Add the submission for the student
              }
            : assignment
        )
      );
        SetSubmissionMessageModal(true);
      }

      if (postAssignmentError) {
        SetSubmissionMessageModal(true);
      }
    }
    handleCloseSubmitModal();
  };

  //handle resubmission
  const handleFileResubmit = (assignmentId) => {
    if (file) {
      const formData = new FormData();
      formData.append('submission', file);
      formData.append('studentId', studentId);
      postAssignment(`${endpoints.ASSIGNMENT}/resubmissions/${userDetails.cohort}/${assignmentId}`, 'PATCH', formData);
      if (postAssignment || postAssignmentError) {
        SetSubmissionMessageModal(true);
      }
     

    }
    handleCloseSubmitModal();
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'description', label: 'Description' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <>
          <Tooltip title="View assignment">
            <IconButton onClick={() => handleOpenModal(row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.hasSubmitted ? "Resubmit assignment" : "Submit assignment"}>
            <Button
              onClick={() => handleOpenSubmitModal(row)}
              variant="contained"
              color="primary"
            >
              {row.hasSubmitted ? "Resubmit" : "Submit"}
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

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

  return (
    <Box>
      <Header title="ASSIGNMENTS" subtitle="Overview of Assignments" />
      {loading ? (
        <Loader />
      ) : (
        <Box height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="Overview of Assignments"
            data={refinedAssignments}
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
        </Box>
      )}

      {/* Modal to view assignment details */}
      <Modal open={openModal} onClose={handleCloseModal} title="View Assignment Details" onConfirm={handleCloseModal}>
        {selectedAssignment && (
          <Box>
            <Typography variant="h6">Title: {selectedAssignment.title}</Typography>
            <Typography variant="body1">Due Date: {selectedAssignment.dueDate}</Typography>
            <Typography variant="body2">Description: {selectedAssignment.description}</Typography>
          </Box>
        )}
      </Modal>

      {/* Modal to submit assignment as a file */}
      <Modal open={openSubmitModal} onClose={handleCloseSubmitModal} title={`Submit assignment for ${selectedAssignment?.title}`} noConfirm>
        <Box display='flex'>
          <TextField type="file" onChange={handleFileChange} fullWidth />

          <ActionButton 
            onClick={() => {selectedAssignment?.hasSubmitted ? handleFileResubmit(selectedAssignment?.assignmentId) : handleFileSubmit(selectedAssignment?.assignmentId)}}
            content= {selectedAssignment?.hasSubmitted ? "Resubmit" : "Submit"}
            sx={{margin: '10px', }}
          />

        </Box>
      </Modal>

      {/* Modal for submission message */}

      <ConfirmationModal
        open={submissionMessageModal}
        onClose={handleSubmissionMessageModal}
        isLoading={postAssignmentLoad}
        title= 'Assigment submission confirmation'
        message= {postAssignmentError ? "Error submitting the assignment!" : "Assignment submitted successfully!"}
        />
    </Box>
  );
};

export default Assignment;

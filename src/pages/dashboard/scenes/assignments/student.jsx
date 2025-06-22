import React, { useState } from 'react';
import { Box, Button, TextField, Tooltip, IconButton, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmationModal from '../../components/confirmationModal';
import ActionButton from '../../components/actionButton';

// Dummy assignment data
const dummyAssignments = [
  {
    id: 'asst_1',
    title: 'Algebra Worksheet',
    dueDate: '2025-06-10',
    description: 'Solve 20 algebra problems covering linear equations.',
    submissions: [{ studentId: 'stu_1' }],
  },
  {
    id: 'asst_2',
    title: 'English Essay',
    dueDate: '2025-06-12',
    description: 'Write a 500-word essay on Shakespeare’s Macbeth.',
    submissions: [],
  },
  {
    id: 'asst_3',
    title: 'Science Lab Report',
    dueDate: '2025-06-15',
    description: 'Submit a report on the recent chemistry experiment.',
    submissions: [{ studentId: 'stu_2' }],
  },
  {
    id: 'asst_4',
    title: 'History Timeline',
    dueDate: '2025-06-17',
    description: 'Create a timeline of World War II events.',
    submissions: [],
  },
  {
    id: 'asst_5',
    title: 'PE Fitness Plan',
    dueDate: '2025-06-20',
    description: 'Design a personal fitness plan for the semester.',
    submissions: [{ studentId: 'stu_1' }],
  },
];

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [assignments] = useState(dummyAssignments); // Use dummy data directly
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [submissionMessageModal, setSubmissionMessageModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [file, setFile] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [submissionStatus, setSubmissionStatus] = useState({ error: null, message: null });

  // Mock student ID for hasSubmitted logic
  const mockStudentId = 'stu_1';

  // Map assignments to table format
  const refinedAssignments = assignments.map((assignment, index) => ({
    id: index + 1,
    title: assignment.title,
    dueDate: assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A',
    description: String(assignment.description || 'N/A'),
    assignmentId: assignment.id,
    hasSubmitted: assignment.submissions.some((submission) => submission.studentId === mockStudentId),
  }));

  const handleOpenModal = (assignment = null) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAssignment(null);
  };

  const handleOpenSubmitModal = (assignment = null) => {
    setSelectedAssignment(assignment);
    setOpenSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setOpenSubmitModal(false);
    setFile(null);
    setSelectedAssignment(null);
  };

  const handleSubmissionMessageModal = () => {
    setSubmissionMessageModal(false);
    setSubmissionStatus({ error: null, message: null });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (assignmentId) => {
    if (file) {
      // Simulate successful submission
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === assignmentId
            ? {
                ...assignment,
                submissions: [...assignment.submissions, { studentId: mockStudentId }],
              }
            : assignment
        )
      );
      setSubmissionStatus({ error: null, message: 'Assignment submitted successfully!' });
      setSubmissionMessageModal(true);
    } else {
      // Simulate error if no file is selected
      setSubmissionStatus({ error: 'No file selected', message: null });
      setSubmissionMessageModal(true);
    }
    handleCloseSubmitModal();
  };

  const handleFileResubmit = (assignmentId) => {
    if (file) {
      // Simulate successful resubmission
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === assignmentId
            ? {
                ...assignment,
                submissions: [...assignment.submissions.filter((s) => s.studentId !== mockStudentId), { studentId: mockStudentId }],
              }
            : assignment
        )
      );
      setSubmissionStatus({ error: null, message: 'Assignment resubmitted successfully!' });
      setSubmissionMessageModal(true);
    } else {
      // Simulate error if no file is selected
      setSubmissionStatus({ error: 'No file selected', message: null });
      setSubmissionMessageModal(true);
    }
    handleCloseSubmitModal();
  };

  const columns = [
    { id: 'id', label: 'ID', flex: 0.5 },
    {
      id: 'title',
      label: 'Title',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.title || 'N/A')}</Typography>,
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      flex: 1,
      renderCell: (row) => <Typography>{row.dueDate || 'N/A'}</Typography>,
    },
    {
      id: 'description',
      label: 'Description',
      flex: 2,
      renderCell: (row) => <Typography>{String(row.description || 'N/A')}</Typography>,
    },
    {
      id: 'actions',
      label: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <>
          <Tooltip title="View assignment">
            <IconButton onClick={() => handleOpenModal(row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.hasSubmitted ? 'Resubmit assignment' : 'Submit assignment'}>
            <Button
              onClick={() => handleOpenSubmitModal(row)}
              variant="contained"
              color="primary"
            >
              {row.hasSubmitted ? 'Resubmit' : 'Submit'}
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
    setPage(0);
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const tableProps = {
    columns,
    tableHeader: 'Overview of Assignments',
    data: refinedAssignments,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
    hiddenColumnsSmallScreen: ['dueDate', 'description'],
  };

  return (
    <Box>
      <Header title="ASSIGNMENTS" subtitle="Overview of Assignments" />
      <Box height="75vh">
        <TableComponent {...tableProps} />
      </Box>

      {/* Modal to view assignment details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title="View Assignment Details"
        onConfirm={handleCloseModal}
      >
        {selectedAssignment && (
          <Box>
            <Typography variant="h6">Title: {selectedAssignment.title}</Typography>
            <Typography variant="body1">Due Date: {selectedAssignment.dueDate}</Typography>
            <Typography variant="body2">Description: {selectedAssignment.description}</Typography>
          </Box>
        )}
      </Modal>

      {/* Modal to submit assignment as a file */}
      <Modal
        open={openSubmitModal}
        onClose={handleCloseSubmitModal}
        title={`Submit assignment for ${selectedAssignment?.title}`}
        noConfirm
      >
        <Box display="flex">
          <TextField type="file" onChange={handleFileChange} fullWidth />
          <ActionButton
            onClick={() =>
              selectedAssignment?.hasSubmitted
                ? handleFileResubmit(selectedAssignment?.assignmentId)
                : handleFileSubmit(selectedAssignment?.assignmentId)
            }
            content={selectedAssignment?.hasSubmitted ? 'Resubmit' : 'Submit'}
            sx={{ margin: '10px' }}
          />
        </Box>
      </Modal>

      {/* Modal for submission message */}
      <ConfirmationModal
        open={submissionMessageModal}
        onClose={handleSubmissionMessageModal}
        isLoading={false}
        title="Assignment Submission Confirmation"
        message={submissionStatus.message || submissionStatus.error}
      />
    </Box>
  );
};

export default Assignment;
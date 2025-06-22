import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmationModal from '../../components/confirmationModal';

// Dummy assignment data with class, session, and term
const dummyAssignments = [
  {
    id: 'asst_1',
    session: '2024-2025',
    term: 'First Term',
    classId: 'class_1',
    title: 'Algebra Worksheet',
    dueDate: '2024-09-10',
    description: 'Solve 20 algebra problems covering linear equations.',
    submissions: [{ studentId: 'stu_1', name: 'John Doe' }],
  },
  {
    id: 'asst_2',
    session: '2024-2025',
    term: 'First Term',
    classId: 'class_2',
    title: 'English Essay',
    dueDate: '2024-09-12',
    description: 'Write a 500-word essay on Shakespeare’s Macbeth.',
    submissions: [],
  },
  {
    id: 'asst_3',
    session: '2024-2025',
    term: 'Second Term',
    classId: 'class_1',
    title: 'Science Lab Report',
    dueDate: '2025-01-15',
    description: 'Submit a report on the recent chemistry experiment.',
    submissions: [{ studentId: 'stu_2', name: 'Jane Smith' }],
  },
  {
    id: 'asst_4',
    session: '2024-2025',
    term: 'Second Term',
    classId: 'class_2',
    title: 'History Timeline',
    dueDate: '2025-01-17',
    description: 'Create a timeline of World War II events.',
    submissions: [],
  },
];

// Dummy classes the teacher is assigned to
const dummyClasses = [
  { classId: 'class_1', name: 'Primary 1A', session: '2024-2025' },
  { classId: 'class_2', name: 'Secondary 1B', session: '2024-2025' },
];

// Academic session and term options
const academicSessions = ['2024-2025', '2025-2026'];
const terms = ['First Term', 'Second Term', 'Third Term'];

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [assignments, setAssignments] = useState(dummyAssignments);
  const [selectedSession, setSelectedSession] = useState(academicSessions[0]);
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    dueDate: '',
    description: '',
    classId: '',
  });
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter assignments by session, term, and class
  const filteredAssignments = assignments
    .filter(
      (assignment) =>
        assignment.session === selectedSession &&
        assignment.term === selectedTerm &&
        (!selectedClass || assignment.classId === selectedClass)
    )
    .map((assignment, index) => ({
      id: index + 1,
      title: assignment.title,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A',
      description: String(assignment.description || 'N/A'),
      className: dummyClasses.find((cls) => cls.classId === assignment.classId)?.name || 'N/A',
      assignmentId: assignment.id,
      submissions: assignment.submissions,
    }));

  // Handle adding a new assignment
  const handleAddAssignment = () => {
    const newId = `asst_${assignments.length + 1}`;
    const newAssignmentEntry = {
      id: newId,
      session: selectedSession,
      term: selectedTerm,
      classId: newAssignment.classId,
      title: newAssignment.title,
      dueDate: newAssignment.dueDate,
      description: newAssignment.description,
      submissions: [],
    };
    setAssignments([...assignments, newAssignmentEntry]);
    setMessage('Assignment added successfully!');
    setMessageModalOpen(true);
    setNewAssignment({ title: '', dueDate: '', description: '', classId: '' });
    setAddModalOpen(false);
  };

  // Table columns
  const columns = [
    { id: 'id', label: 'ID', flex: 0.5 },
    {
      id: 'title',
      label: 'Title',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.title || 'N/A')}</Typography>,
    },
    {
      id: 'className',
      label: 'Class',
      flex: 1,
      renderCell: (row) => <Typography>{row.className}</Typography>,
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
      id: 'submissions',
      label: 'Submissions',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {row.submissions.length > 0
            ? `${row.submissions.length} student(s) submitted`
            : 'No submissions'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setSelectedAssignment(row);
            setViewModalOpen(true);
          }}
          startIcon={<VisibilityIcon />}
        >
          View
        </Button>
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
    tableHeader: `Assignments for ${selectedSession}, ${selectedTerm}${
      selectedClass ? `, ${dummyClasses.find((cls) => cls.classId === selectedClass)?.name}` : ''
    }`,
    data: filteredAssignments,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
    hiddenColumnsSmallScreen: ['description', 'submissions'],
  };

  return (
    <Box py="20px">
      <Header title="TEACHER ASSIGNMENTS" subtitle="Manage Assignments for Classes" />
      <Box mb="20px" display="flex" gap="20px" alignItems="center">
        {/* Session Selector */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="session-select-label">Session</InputLabel>
          <Select
            labelId="session-select-label"
            value={selectedSession}
            label="Session"
            onChange={(e) => {
              setSelectedSession(e.target.value);
              setSelectedTerm(terms[0]);
              setSelectedClass('');
              setPage(0);
            }}
          >
            {academicSessions.map((session) => (
              <MenuItem key={session} value={session}>
                {session}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Term Selector */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="term-select-label">Term</InputLabel>
          <Select
            labelId="term-select-label"
            value={selectedTerm}
            label="Term"
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              setSelectedClass('');
              setPage(0);
            }}
          >
            {terms.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Class Selector */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="class-select-label">Class</InputLabel>
          <Select
            labelId="class-select-label"
            value={selectedClass}
            label="Class"
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All Classes</MenuItem>
            {dummyClasses
              .filter((cls) => cls.session === selectedSession)
              .map((cls) => (
                <MenuItem key={cls.classId} value={cls.classId}>
                  {cls.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Add Assignment Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setAddModalOpen(true)}
          sx={{ ml: 'auto' }}
        >
          Add Assignment
        </Button>
      </Box>
      <Box>
        {filteredAssignments.length > 0 ? (
          <TableComponent {...tableProps} />
        ) : (
          <Typography>No assignments available for the selected filters.</Typography>
        )}
      </Box>

      {/* Add Assignment Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setNewAssignment({ title: '', dueDate: '', description: '', classId: '' });
        }}
      >
        <DialogTitle>Add New Assignment</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="16px" mt="10px">
            <FormControl fullWidth>
              <InputLabel id="add-class-select-label">Class</InputLabel>
              <Select
                labelId="add-class-select-label"
                value={newAssignment.classId}
                label="Class"
                onChange={(e) => setNewAssignment({ ...newAssignment, classId: e.target.value })}
              >
                {dummyClasses
                  .filter((cls) => cls.session === selectedSession)
                  .map((cls) => (
                    <MenuItem key={cls.classId} value={cls.classId}>
                      {cls.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Title"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Due Date (YYYY-MM-DD)"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddModalOpen(false);
              setNewAssignment({ title: '', dueDate: '', description: '', classId: '' });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAssignment}
            color="primary"
            disabled={
              !newAssignment.title ||
              !newAssignment.dueDate ||
              !newAssignment.description ||
              !newAssignment.classId
            }
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Assignment Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedAssignment(null);
        }}
      >
        <DialogTitle>Assignment Details</DialogTitle>
        <DialogContent>
          {selectedAssignment && (
            <Box display="flex" flexDirection="column" gap="16px">
              <Typography variant="h6">Title: {selectedAssignment.title}</Typography>
              <Typography variant="body1">Class: {selectedAssignment.className}</Typography>
              <Typography variant="body1">Due Date: {selectedAssignment.dueDate}</Typography>
              <Typography variant="body2">Description: {selectedAssignment.description}</Typography>
              <Typography variant="body2">
                Submissions:
                {selectedAssignment.submissions.length > 0 ? (
                  <ul>
                    {selectedAssignment.submissions.map((submission) => (
                      <li key={submission.studentId}>{submission.name}</li>
                    ))}
                  </ul>
                ) : (
                  ' No submissions'
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setViewModalOpen(false);
              setSelectedAssignment(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        isLoading={false}
        title="Assignment Action"
        message={message}
      />
    </Box>
  );
};

export default Assignment;
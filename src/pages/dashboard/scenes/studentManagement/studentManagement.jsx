import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import Header from '../../components/Header';
import CustomAccordion from '../../components/accordion'; // Adjust path as needed
import { tokens } from '../../theme';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

// Dummy data for classes and students
const dummyClasses = [
  { classId: 'class_1', name: 'Primary 1A', session: '2024-2025', term: 'First Term' },
  { classId: 'class_2', name: 'Secondary 1B', session: '2024-2025', term: 'First Term' },
];

const dummyStudents = [
  {
    studentId: 'stu_1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    profilePicture: 'https://via.placeholder.com/150',
    activityRate: '80%',
    classId: 'class_1',
    comment: '',
  },
  {
    studentId: 'stu_2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+0987654321',
    profilePicture: 'https://via.placeholder.com/150',
    activityRate: '90%',
    classId: 'class_1',
    comment: '',
  },
  {
    studentId: 'stu_3',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phoneNumber: '+1122334455',
    profilePicture: 'https://via.placeholder.com/150',
    activityRate: '75%',
    classId: 'class_2',
    comment: '',
  },
  {
    studentId: 'stu_4',
    firstName: 'Bob',
    lastName: 'Brown',
    email: 'bob.brown@example.com',
    phoneNumber: '+5566778899',
    profilePicture: 'https://via.placeholder.com/150',
    activityRate: '85%',
    classId: 'class_2',
    comment: '',
  },
];

// Current term (set by admin, hardcoded for dummy data)
const currentTerm = 'First Term';
const currentSession = '2024-2025';

const StudentManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [students, setStudents] = useState(dummyStudents);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'details', 'comment'
  const [comment, setComment] = useState('');

  // Filter students by selected class
  const filteredStudents = students.filter(
    (student) => !selectedClass || student.classId === selectedClass
  );

  const handleOpenDialog = (student, mode) => {
    setSelectedStudent(student);
    setDialogMode(mode);
    setComment(student.comment || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setDialogMode('');
    setComment('');
  };

  const handleSaveComment = () => {
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === selectedStudent.studentId
          ? { ...student, comment }
          : student
      )
    );
    console.log(`Comment for ${selectedStudent.firstName} ${selectedStudent.lastName}: ${comment}`);
    handleCloseDialog();
  };

  return (
    <Box>
      <Grid item xs={12}>
        <Header title="TEACHER STUDENT MANAGEMENT" subtitle="Manage Students in Your Classes" />
      </Grid>

      <Box mb="20px" display="flex" gap="20px" alignItems="center">
        {/* Class Selector */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="class-select-label">Class</InputLabel>
          <Select
            labelId="class-select-label"
            value={selectedClass}
            label="Class"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value="">All Classes</MenuItem>
            {dummyClasses
              .filter((cls) => cls.session === currentSession && cls.term === currentTerm)
              .map((cls) => (
                <MenuItem key={cls.classId} value={cls.classId}>
                  {cls.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredStudents.length ? (
          filteredStudents.map((student) => (
            <Grid item xs={12} md={6} key={student.studentId}>
              <CustomAccordion
                title={`${student.firstName} ${student.lastName}`}
                details={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                      <img
                        src={student.profilePicture}
                        alt="Profile"
                        style={{
                          maxWidth: '100%',
                          height: '100%',
                          borderRadius: '10px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 2, textAlign: 'left' }}>
                      <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                        {`${student.firstName} ${student.lastName}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', mt: 1 }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Student ID: </span>
                        {student.studentId}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', mt: 1 }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Email: </span>
                        {student.email}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', mt: 1 }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Phone Number: </span>
                        {student.phoneNumber}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', mt: 1 }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Activity Rate: </span>
                        {student.activityRate}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', mt: 1 }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Comment: </span>
                        {student.comment || 'No comment'}
                      </Typography>
                    </Box>
                  </Box>
                }
                actions={[
                  {
                    label: 'View Details',
                    onClick: () => handleOpenDialog(student, 'details'),
                  },
                  {
                    label: 'Add Comment',
                    onClick: () => handleOpenDialog(student, 'comment'),
                  },
                ]}
                defaultExpanded={false}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No students found for the selected class.</Typography>
          </Grid>
        )}
      </Grid>

      {/* Dialog for Details or Comment */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === 'details' ? 'Student Details' : 'Add Comment'}</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box display="flex" flexDirection="column" gap="16px" mt="10px">
              {dialogMode === 'details' && (
                <>
                  <Typography variant="h6">
                    {`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  </Typography>
                  <Typography>Student ID: {selectedStudent.studentId}</Typography>
                  <Typography>Email: {selectedStudent.email}</Typography>
                  <Typography>Phone Number: {selectedStudent.phoneNumber}</Typography>
                  <Typography>Activity Rate: {selectedStudent.activityRate}</Typography>
                  <Typography>Comment: {selectedStudent.comment || 'No comment'}</Typography>
                </>
              )}
              {dialogMode === 'comment' && (
                <TextField
                  label="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogMode === 'comment' && (
            <Button onClick={handleSaveComment} color="primary" disabled={!comment}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withDashboardWrapper(StudentManagement);
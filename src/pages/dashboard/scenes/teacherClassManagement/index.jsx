import React, { useState } from 'react';
import {
  Box,
  useTheme,
  Tabs,
  Tab,
  Typography,
  LinearProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import Modal from '../../components/modal';
import CustomAccordion from '../../components/accordion';

// Custom TabPanel for accessibility
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Dummy data
const dummyData = {
  academicYears: [
    { _id: 'year_1', name: '2023–2024' },
    { _id: 'year_2', name: '2024–2025' },
  ],
  classes: [
    {
      _id: 'class_1',
      academicYearId: 'year_2',
      section: 'Primary',
      displayName: 'Primary 1A',
      students: ['stu_1', 'stu_2'],
      subjectsTaught: ['Mathematics', 'English'],
    },
    {
      _id: 'class_2',
      academicYearId: 'year_2',
      section: 'Secondary',
      displayName: 'Secondary 1B',
      students: ['stu_3'],
      subjectsTaught: ['Science'],
    },
  ],
  students: [
    {
      _id: 'stu_1',
      firstName: 'John',
      lastName: 'Doe',
      subjects: [
        {
          name: 'Mathematics',
          topics: [
            { topic: 'Linear Equations', progress: 80 },
            { topic: 'Quadratic Functions', progress: 60 },
          ],
          overallProgress: 70,
        },
        {
          name: 'English',
          topics: [
            { topic: 'Grammar Basics', progress: 90 },
            { topic: 'Literature Analysis', progress: 50 },
          ],
          overallProgress: 70,
        },
      ],
    },
    {
      _id: 'stu_2',
      firstName: 'Jane',
      lastName: 'Smith',
      subjects: [
        {
          name: 'Mathematics',
          topics: [
            { topic: 'Linear Equations', progress: 70 },
            { topic: 'Quadratic Functions', progress: 40 },
          ],
          overallProgress: 55,
        },
      ],
    },
    {
      _id: 'stu_3',
      firstName: 'Alice',
      lastName: 'Brown',
      subjects: [
        {
          name: 'Science',
          topics: [
            { topic: 'Chemical Reactions', progress: 85 },
          ],
          overallProgress: 85,
        },
      ],
    },
  ],
  testQuestions: [
    {
      id: 'q_1',
      classId: 'class_1',
      subject: 'Mathematics',
      question: 'What is the solution to 2x + 3 = 7?',
      options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
      correctAnswer: 'x = 2',
    },
    {
      id: 'q_2',
      classId: 'class_1',
      subject: 'English',
      question: 'What is a synonym for "happy"?',
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      correctAnswer: 'Joyful',
    },
    {
      id: 'q_3',
      classId: 'class_2',
      subject: 'Science',
      question: 'What gas do plants absorb during photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correctAnswer: 'Carbon Dioxide',
    },
  ],
  tests: [
    {
      id: 'test_1',
      classId: 'class_1',
      subject: 'Mathematics',
      questionIds: ['q_1'],
    },
    {
      id: 'test_2',
      classId: 'class_1',
      subject: 'English',
      questionIds: ['q_2'],
    },
    {
      id: 'test_3',
      classId: 'class_2',
      subject: 'Science',
      questionIds: ['q_3'],
    },
  ],
  testScores: [
    {
      id: 'score_1',
      testId: 'test_1',
      studentId: 'stu_1',
      score: 80,
      date: '2024-09-20',
    },
    {
      id: 'score_2',
      testId: 'test_1',
      studentId: 'stu_2',
      score: 70,
      date: '2024-09-20',
    },
    {
      id: 'score_3',
      testId: 'test_2',
      studentId: 'stu_1',
      score: 90,
      date: '2024-09-21',
    },
    {
      id: 'score_4',
      testId: 'test_3',
      studentId: 'stu_3',
      score: 85,
      date: '2024-09-22',
    },
  ],
  announcements: [
    {
      id: 'ann_1',
      classId: 'class_1',
      title: 'Math Homework Reminder',
      message: 'Please complete the algebra worksheet by Friday.',
      date: '2024-09-18',
    },
    {
      id: 'ann_2',
      classId: 'class_2',
      title: 'Science Project Update',
      message: 'Project proposals are due next Monday.',
      date: '2024-09-19',
    },
  ],
};

const TeacherClassManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mainTabValue, setMainTabValue] = useState(0);
  const [academicYearTabValue, setAcademicYearTabValue] = useState(0);
  const academicYears = Array.isArray(dummyData.academicYears) ? dummyData.academicYears : [];
  const [tabState, setTabState] = useState(
    academicYears.reduce(
      (acc, year) => ({
        ...acc,
        [year._id]: {
          page: 0,
          rowsPerPage: 5,
          sortBy: 'name',
          sortDirection: 'asc',
        },
      }),
      {}
    )
  );
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [announcementsModalOpen, setAnnouncementsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [testQuestions, setTestQuestions] = useState(dummyData.testQuestions);
  const [announcements, setAnnouncements] = useState(dummyData.announcements);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
  });

  // Get unique subject-class combinations
  const subjectClassPairs = [];
  dummyData.classes.forEach((cls) => {
    cls.subjectsTaught.forEach((subject) => {
      subjectClassPairs.push({
        classId: cls._id,
        className: cls.displayName,
        subject,
      });
    });
  });

  // Handle main tab change
  const handleMainTabChange = (event, newValue) => {
    setMainTabValue(newValue);
  };

  // Handle academic year tab change
  const handleAcademicYearTabChange = (event, newValue) => {
    setAcademicYearTabValue(newValue);
  };

  // Handle pagination and sorting
  const handlePageChange = (yearId, newPage) => {
    setTabState((prev) => ({
      ...prev,
      [yearId]: { ...prev[yearId], page: newPage },
    }));
  };

  const handleRowsPerPageChange = (yearId, event) => {
    setTabState((prev) => ({
      ...prev,
      [yearId]: { ...prev[yearId], page: 0, rowsPerPage: parseInt(event.target.value, 10) },
    }));
  };

  const handleSortChange = (yearId, columnId) => {
    setTabState((prev) => {
      const current = prev[yearId];
      const newSortDirection =
        current.sortBy === columnId && current.sortDirection === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        [yearId]: {
          ...current,
          sortBy: columnId,
          sortDirection: newSortDirection,
        },
      };
    });
  };

  // Open modals
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setStudentModalOpen(true);
  };

  const openProgressModal = (student) => {
    setSelectedStudent(student);
    setProgressModalOpen(true);
  };

  const openQuestionsModal = (test) => {
    setSelectedTest(test);
    setQuestionsModalOpen(true);
  };

  const openAnnouncementsModal = (cls) => {
    setSelectedClass(cls);
    setAnnouncementsModalOpen(true);
  };

  // Handle test question input
  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  // Add new test question
  const handleAddQuestion = () => {
    if (
      !newQuestion.question ||
      !newQuestion.options.every((opt) => opt) ||
      !newQuestion.correctAnswer
    ) {
      alert('Please fill all fields');
      return;
    }
    const newId = `q_${testQuestions.length + 1}`;
    const question = {
      id: newId,
      classId: selectedTest.classId,
      subject: selectedTest.subject,
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
    };
    setTestQuestions([...testQuestions, question]);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
  };

  // Handle announcement input
  const handleAnnouncementInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  // Add new announcement
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      alert('Please fill all fields');
      return;
    }
    const newId = `ann_${announcements.length + 1}`;
    const announcement = {
      id: newId,
      classId: selectedClass._id,
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      date: new Date().toISOString().split('T')[0], // Current date
    };
    setAnnouncements([...announcements, announcement]);
    setNewAnnouncement({
      title: '',
      message: '',
    });
  };

  // Get table data for a year
  const getTableDataForYear = (yearId) => {
    const { page, rowsPerPage, sortBy, sortDirection } = tabState[yearId] || {
      page: 0,
      rowsPerPage: 5,
      sortBy: 'name',
      sortDirection: 'asc',
    };
    const classes = dummyData.classes.filter((c) => c.academicYearId === yearId);

    let combinedStudents = [];
    classes.forEach((cls) => {
      const classStudents = dummyData.students
        .filter((s) => cls.students.includes(s._id))
        .map((s) => ({
          ...s,
          className: cls.displayName,
          section: cls.section,
          subjectsDisplay: (s.subjects || []).map((sub) => sub.name).join(', '),
        }));
      combinedStudents.push(...classStudents);
    });

    combinedStudents.sort((a, b) => {
      let aValue = a[sortBy] ?? '';
      let bValue = b[sortBy] ?? '';
      if (sortBy === 'name') {
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortBy === 'subjects') {
        aValue = (a.subjects || []).length;
        bValue = (b.subjects || []).length;
      } else if (sortBy === 'subjectsDisplay') {
        aValue = a.subjectsDisplay.toLowerCase();
        bValue = b.subjectsDisplay.toLowerCase();
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const startIndex = page * rowsPerPage;
    const paginatedData = combinedStudents.slice(startIndex, startIndex + rowsPerPage);

    return paginatedData.map((student, index) => ({
      ...student,
      sn: startIndex + index + 1,
      name: `${student.firstName} ${student.lastName}`,
    }));
  };

  // Get test scores table data
  const getTestScoresData = (test) => {
    const testObj = dummyData.tests.find(
      (t) => t.classId === test.classId && t.subject === test.subject
    );
    if (!testObj) return [];

    const scores = dummyData.testScores
      .filter((score) => score.testId === testObj.id)
      .map((score, index) => {
        const student = dummyData.students.find((s) => s._id === score.studentId);
        return {
          sn: index + 1,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          score: score.score,
          date: new Date(score.date).toLocaleDateString(),
        };
      });

    return scores;
  };

  // Test scores table columns
  const testScoresColumns = [
    { id: 'sn', label: 'S/N', flex: 0.5 },
    { id: 'studentName', label: 'Student Name', flex: 2 },
    { id: 'score', label: 'Score (%)', flex: 1 },
    { id: 'date', label: 'Date', flex: 1 },
  ];

  // Student table columns
  const studentColumns = [
    { id: 'sn', label: 'S/N', flex: 0.5 },
    {
      id: 'name',
      label: 'Student Name',
      flex: 2,
      renderCell: (row) => <Typography>{row.name}</Typography>,
    },
    {
      id: 'className',
      label: 'Class',
      flex: 1,
      renderCell: (row) => <Typography>{row.className}</Typography>,
    },
    {
      id: 'subjectsDisplay',
      label: 'Subjects',
      flex: 2,
      renderCell: (row) => <Typography>{row.subjectsDisplay || 'None'}</Typography>,
    },
    {
      id: 'actions',
      label: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <Box display="flex" gap="10px">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => openStudentModal(row)}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => openProgressModal(row)}
          >
            Progress
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Header
        title="TEACHER CLASS MANAGEMENT"
        subtitle="Manage Students, Tests, and Announcements"
      />

      <Box sx={{ mt: 3, mb: 3 }}>
        <Tabs
          value={mainTabValue}
          onChange={handleMainTabChange}
          aria-label="main tabs"
          sx={{
            backgroundColor: colors.primary[400],
            '& .MuiTabs-indicator': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <Tab
            label="Students"
            sx={{
              color: 'white !important',
              textTransform: 'none',
              fontWeight: 'bold',
              '&.Mui-selected': {
                color: 'white !important',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                backgroundColor: colors.blueAccent[700],
              },
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: colors.primary[400],
            }}
          />
          <Tab
            label="Tests"
            sx={{
              color: 'white !important',
              textTransform: 'none',
              fontWeight: 'bold',
              '&.Mui-selected': {
                color: 'white !important',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                backgroundColor: colors.blueAccent[700],
              },
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: colors.primary[400],
            }}
          />
          <Tab
            label="Announcements"
            sx={{
              color: 'white !important',
              textTransform: 'none',
              fontWeight: 'bold',
              '&.Mui-selected': {
                color: 'white !important',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                backgroundColor: colors.blueAccent[700],
              },
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: colors.primary[400],
            }}
          />
        </Tabs>

        {/* Students Tab */}
        <TabPanel value={mainTabValue} index={0}>
          {academicYears.length > 0 ? (
            <>
              <Tabs
                value={academicYearTabValue}
                onChange={handleAcademicYearTabChange}
                aria-label="academic year tabs"
                sx={{
                  backgroundColor: colors.primary[400],
                  '& .MuiTabs-indicator': {
                    backgroundColor: colors.blueAccent[700],
                  },
                }}
              >
                {academicYears.map((year, index) => (
                  <Tab
                    key={year._id}
                    label={year.name}
                    sx={{
                      color: 'white !important',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&.Mui-selected': {
                        color: 'white !important',
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: colors.blueAccent[700],
                      },
                      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                      backgroundColor: colors.primary[400],
                    }}
                  />
                ))}
              </Tabs>
              {academicYears.map((year, index) => (
                <TabPanel key={year._id} value={academicYearTabValue} index={index}>
                  <TableComponent
                    columns={studentColumns}
                    tableHeader={`Students for ${year.name}`}
                    data={getTableDataForYear(year._id)}
                    page={tabState[year._id]?.page || 0}
                    rowsPerPage={tabState[year._id]?.rowsPerPage || 5}
                    sortBy={tabState[year._id]?.sortBy || 'name'}
                    sortDirection={tabState[year._id]?.sortDirection || 'asc'}
                    onSortChange={(columnId) => handleSortChange(year._id, columnId)}
                    onPageChange={(event, newPage) => handlePageChange(year._id, newPage)}
                    onRowsPerPageChange={(event) => handleRowsPerPageChange(year._id, event)}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    hiddenColumnsSmallScreen={['subjectsDisplay']}
                  />
                </TabPanel>
              ))}
            </>
          ) : (
            <Typography>No academic years assigned</Typography>
          )}
        </TabPanel>

        {/* Tests Tab */}
        <TabPanel value={mainTabValue} index={1}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Manage Test Questions
          </Typography>
          {subjectClassPairs.length > 0 ? (
            <Grid container spacing={2}>
              {subjectClassPairs.map((pair, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    p={2}
                    borderRadius="8px"
                    boxShadow={2}
                    bgcolor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="10px"
                  >
                    <Typography variant="h6">{pair.subject}</Typography>
                    <Typography variant="body1">{pair.className}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openQuestionsModal(pair)}
                    >
                      Manage Questions
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No subjects or classes assigned</Typography>
          )}
        </TabPanel>

        {/* Announcements Tab */}
        <TabPanel value={mainTabValue} index={2}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Manage Class Announcements
          </Typography>
          {dummyData.classes.length > 0 ? (
            <Grid container spacing={2}>
              {dummyData.classes.map((cls, index) => (
                <Grid item xs={12} sm={6} md={4} key={cls._id}>
                  <Box
                    p={2}
                    borderRadius="8px"
                    boxShadow={2}
                    bgcolor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="10px"
                  >
                    <Typography variant="h6">{cls.displayName}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openAnnouncementsModal(cls)}
                    >
                      Manage Announcements
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No classes assigned</Typography>
          )}
        </TabPanel>
      </Box>

      {/* Student Details Modal */}
      <Modal
        open={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          setSelectedStudent(null);
        }}
        title={`${selectedStudent?.name || 'Student'} Details`}
        noConfirm
      >
        {selectedStudent && (
          <Box>
            <Typography variant="h6">Class: {selectedStudent.className || 'N/A'}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Subjects and Progress
            </Typography>
            {(selectedStudent.subjects || []).length > 0 ? (
              selectedStudent.subjects.map((subject, index) => {
                const studentAvgProgress =
                  (selectedStudent.subjects || []).reduce(
                    (sum, s) => sum + s.overallProgress,
                    0
                  ) / (selectedStudent.subjects?.length || 1);
                return (
                  <CustomAccordion
                    key={index}
                    title={`${subject.name} (${subject.overallProgress.toFixed(2)}%)`}
                    details={
                      <Box>
                        {subject.topics.map((topic, tIndex) => (
                          <Box key={tIndex} sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {topic.topic}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={topic.progress}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: colors.grey[300],
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: colors.greenAccent[500],
                                },
                              }}
                            />
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color={colors.grey[100]}>
                                <strong style={{ color: colors.blueAccent[200] }}>
                                  Topic Progress:
                                </strong>{' '}
                                {topic.progress.toFixed(2)}%
                              </Typography>
                              <Typography variant="body2" color={colors.grey[100]}>
                                <strong style={{ color: colors.blueAccent[200] }}>
                                  Subject Overall Progress:
                                </strong>{' '}
                                {subject.overallProgress.toFixed(2)}%
                              </Typography>
                              <Typography variant="body2" color={colors.grey[100]}>
                                <strong style={{ color: colors.blueAccent[200] }}>
                                  Student Average Progress:
                                </strong>{' '}
                                {studentAvgProgress.toFixed(2)}%
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    }
                    defaultExpanded={false}
                  />
                );
              })
            ) : (
              <Typography variant="body1">No subjects assigned</Typography>
            )}
          </Box>
        )}
      </Modal>

      {/* Progress Modal */}
      <Modal
        open={progressModalOpen}
        onClose={() => {
          setProgressModalOpen(false);
          setSelectedStudent(null);
        }}
        title={`Progress for ${selectedStudent?.name || 'Student'}`}
        noConfirm
      >
        {selectedStudent && (
          <Box display="flex" flexDirection="column" gap="16px">
            {(selectedStudent.subjects || []).length > 0 ? (
              selectedStudent.subjects.map((subject, index) => (
                <Box key={index}>
                  <Typography variant="h6" mb="15px">
                    {subject.name} ({subject.overallProgress.toFixed(2)}%)
                  </Typography>
                  {subject.topics.map((topic, tIndex) => (
                    <Box key={tIndex} sx={{ mb: 2 }}>
                      <Typography variant="body1" mb="10px">
                        {topic.topic}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={topic.progress}
                        sx={{
                          height: '10px',
                          borderRadius: '5px',
                          backgroundColor: colors.primary[300],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: colors.greenAccent[500],
                          },
                        }}
                      />
                      <Typography variant="body2" mt="10px">
                        Progress: {topic.progress.toFixed(2)}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))
            ) : (
              <Typography variant="body1">No subjects available to display</Typography>
            )}
          </Box>
        )}
      </Modal>

      {/* Test Questions Modal */}
      <Modal
        open={questionsModalOpen}
        onClose={() => {
          setQuestionsModalOpen(false);
          setSelectedTest(null);
          setNewQuestion({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
          });
        }}
        title={`Manage Test Questions for ${selectedTest?.subject} (${selectedTest?.className || 'Class'})`}
        noConfirm
      >
        {selectedTest && (
          <Box display="flex" flexDirection="column" gap="16px">
            {/* Add New Question */}
            <Box>
              <Typography variant="h6" mb="10px">
                Add New Question
              </Typography>
              <TextField
                label="Question"
                name="question"
                value={newQuestion.question}
                onChange={handleQuestionInputChange}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              {newQuestion.options.map((option, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ))}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="correct-answer-select-label">Correct Answer</InputLabel>
                <Select
                  labelId="correct-answer-select-label"
                  name="correctAnswer"
                  value={newQuestion.correctAnswer}
                  onChange={handleQuestionInputChange}
                  label="Correct Answer"
                >
                  {newQuestion.options.map((option, index) => (
                    <MenuItem key={index} value={option} disabled={!option}>
                      {option || `Option ${index + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
                sx={{ mb: 2 }}
              >
                Add Question
              </Button>
            </Box>

            {/* Display Existing Questions */}
            <Typography variant="h6">Existing Questions</Typography>
            {testQuestions
              .filter((q) => q.classId === selectedTest.classId && q.subject === selectedTest.subject)
              .length > 0 ? (
              testQuestions
                .filter((q) => q.classId === selectedTest.classId && q.subject === selectedTest.subject)
                .map((question, index) => (
                  <CustomAccordion
                    key={question.id}
                    title={`Question ${index + 1}: ${question.question}`}
                    details={
                      <Box>
                        <Typography variant="body1">Subject: {question.subject}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Options:
                        </Typography>
                        <ul>
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex}>
                              <Typography
                                variant="body2"
                                color={
                                  option === question.correctAnswer
                                    ? colors.greenAccent[500]
                                    : 'inherit'
                                }
                              >
                                {option}
                                {option === question.correctAnswer && ' (Correct)'}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    }
                    defaultExpanded={false}
                  />
                ))
            ) : (
              <Typography>No questions set for this subject and class.</Typography>
            )}

            {/* Display Test Scores */}
            <Typography variant="h6" sx={{ mt: 3 }}>
              Student Test Scores
            </Typography>
            {getTestScoresData(selectedTest).length > 0 ? (
              <TableComponent
                columns={testScoresColumns}
                tableHeader={`Scores for ${selectedTest.subject} (${selectedTest.className})`}
                data={getTestScoresData(selectedTest)}
                page={0}
                rowsPerPage={5}
                sortBy="studentName"
                sortDirection="asc"
                hiddenColumnsSmallScreen={['date']}
              />
            ) : (
              <Typography>No test scores available for this subject and class.</Typography>
            )}
          </Box>
        )}
      </Modal>

      {/* Announcements Modal */}
      <Modal
        open={announcementsModalOpen}
        onClose={() => {
          setAnnouncementsModalOpen(false);
          setSelectedClass(null);
          setNewAnnouncement({ title: '', message: '' });
        }}
        title={`Manage Announcements for ${selectedClass?.displayName || 'Class'}`}
        noConfirm
      >
        {selectedClass && (
          <Box display="flex" flexDirection="column" gap="16px">
            {/* Add New Announcement */}
            <Box>
              <Typography variant="h6" mb="10px">
                Add New Announcement
              </Typography>
              <TextField
                label="Title"
                name="title"
                value={newAnnouncement.title}
                onChange={handleAnnouncementInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Message"
                name="message"
                value={newAnnouncement.message}
                onChange={handleAnnouncementInputChange}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAnnouncement}
                sx={{ mb: 2 }}
              >
                Add Announcement
              </Button>
            </Box>

            {/* Display Existing Announcements */}
            <Typography variant="h6">Existing Announcements</Typography>
            {announcements
              .filter((ann) => ann.classId === selectedClass._id)
              .length > 0 ? (
              announcements
                .filter((ann) => ann.classId === selectedClass._id)
                .map((ann, index) => (
                  <CustomAccordion
                    key={ann.id}
                    title={`${ann.title} (${new Date(ann.date).toLocaleDateString()})`}
                    details={
                      <Box>
                        <Typography variant="body1">{ann.message}</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: colors.grey[500] }}>
                          Posted on: {new Date(ann.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    defaultExpanded={false}
                  />
                ))
            ) : (
              <Typography>No announcements for this class.</Typography>
            )}
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default withDashboardWrapper(TeacherClassManagement);
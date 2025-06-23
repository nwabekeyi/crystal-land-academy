import React, { useState } from 'react';
import {
  Box,
  Button,
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
import CustomAccordion from '../../components/accordion';
import ConfirmationModal from '../../components/confirmationModal';

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
      classId: 'class_1',
      subjects: ['Mathematics', 'English'],
    },
    {
      _id: 'stu_2',
      firstName: 'Jane',
      lastName: 'Smith',
      classId: 'class_1',
      subjects: ['Mathematics'],
    },
    {
      _id: 'stu_3',
      firstName: 'Alice',
      lastName: 'Brown',
      classId: 'class_2',
      subjects: ['Science'],
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
      subject: 'Mathematics',
      question: 'What is 3 + 5?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
    },
    {
      id: 'q_3',
      classId: 'class_1',
      subject: 'English',
      question: 'What is a synonym for "happy"?',
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      correctAnswer: 'Joyful',
    },
    {
      id: 'q_4',
      classId: 'class_1',
      subject: 'English',
      question: 'What is the past tense of "run"?',
      options: ['Ran', 'Run', 'Running', 'Runs'],
      correctAnswer: 'Ran',
    },
    {
      id: 'q_5',
      classId: 'class_2',
      subject: 'Science',
      question: 'What gas do plants absorb during photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correctAnswer: 'Carbon Dioxide',
    },
    {
      id: 'q_6',
      classId: 'class_2',
      subject: 'Science',
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'O2', 'N2'],
      correctAnswer: 'H2O',
    },
  ],
  tests: [
    {
      id: 'test_1',
      classId: 'class_1',
      subject: 'Mathematics',
      questionIds: ['q_1', 'q_2'],
      duration: 300,
    },
    {
      id: 'test_2',
      classId: 'class_1',
      subject: 'English',
      questionIds: ['q_3', 'q_4'],
      duration: 300,
    },
    {
      id: 'test_3',
      classId: 'class_2',
      subject: 'Science',
      questionIds: ['q_5', 'q_6'],
      duration: 300,
    },
  ],
  testScores: [
    {
      id: 'score_1',
      testId: 'test_1',
      studentId: 'stu_1',
      score: 100,
      date: '2024-09-20',
      academicYearId: 'year_2',
      approvalStatus: 'pending',
      answers: { q_1: 'x = 2', q_2: '8' },
    },
    {
      id: 'score_2',
      testId: 'test_1',
      studentId: 'stu_2',
      score: 50,
      date: '2024-09-20',
      academicYearId: 'year_2',
      approvalStatus: 'approved',
      answers: { q_1: 'x = 1', q_2: '8' },
    },
    {
      id: 'score_3',
      testId: 'test_2',
      studentId: 'stu_1',
      score: 50,
      date: '2024-09-21',
      academicYearId: 'year_2',
      approvalStatus: 'rejected',
      answers: { q_3: 'Sad', q_4: 'Ran' },
    },
  ],
  examScores: [
    {
      id: 'exam_1',
      studentId: 'stu_1',
      subject: 'Mathematics',
      score: 85,
      academicYearId: 'year_2',
      term: 'First Term',
    },
    {
      id: 'exam_2',
      studentId: 'stu_1',
      subject: 'English',
      score: '90',
      academicYearId: 'year_2',
      term: 'First Term',
    },
    {
      id: 'exam_3',
      studentId: 'stu_2',
      subject: 'Mathematics',
      score: 80,
      academicYearId: 'year_2',
      term: 'First Term',
    },
    {
      id: 'exam_4',
      studentId: 'stu_1',
      subject: 'Mathematics',
      score: 80,
      academicYearId: 'year_1',
      term: 'First Term',
    },
  ],
};

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('year_2'); // Default to 2024–2025
  const [selectedClass, setSelectedClass] = useState('');
  const [viewTestModalOpen, setViewTestModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testScores, setTestScores] = useState(dummyData.testScores);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Get classes for the selected academic year
  const classes = dummyData.classes.filter((cls) => cls.academicYearId === selectedAcademicYear);

  // Get tests and subjects for the selected class
  const tests = selectedClass
    ? dummyData.tests.filter((test) => test.classId === selectedClass)
    : dummyData.tests.filter((test) =>
        classes.some((cls) => cls._id === test.classId)
      );
  const subjects = [...new Set(tests.map((test) => test.subject))];

  // Table data for classes and subjects
  const classTableData = classes.map((cls, index) => ({
    id: index + 1,
    className: cls.displayName,
    subjects: dummyData.tests
      .filter((test) => test.classId === cls._id)
      .map((test) => test.subject),
    tests: dummyData.tests.filter((test) => test.classId === cls._id),
  }));

  // Handle test approval/rejection
  const handleUpdateApproval = (scoreId, status) => {
    const updatedScores = testScores.map((score) =>
      score.id === scoreId ? { ...score, approvalStatus: status } : score
    );
    setTestScores(updatedScores);
    setMessage(`Test score ${status} successfully!`);
    setMessageModalOpen(true);
  };

  // Table columns for classes
  const classColumns = [
    { id: 'id', label: 'ID', flex: 0.5 },
    { id: 'className', label: 'Class', flex: 2 },
    {
      id: 'subjects',
      label: 'Subjects',
      flex: 2,
      renderCell: (row) => (
        <Typography>{row.subjects.join(', ') || 'No subjects'}</Typography>
      ),
    },
    {
      id: 'tests',
      label: 'Tests',
      flex: 1,
      renderCell: (row) => (
        <Typography>{row.tests.length} test(s)</Typography>
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
            setSelectedClass(row.tests[0]?.classId || '');
            setViewTestModalOpen(true);
            setSelectedTest(null);
          }}
          disabled={row.tests.length === 0}
        >
          View Tests
        </Button>
      ),
    },
  ];

  // Get records breakdown by academic year
  const getRecordsBreakdown = (yearId) => {
    return classes
      .filter((cls) => cls.academicYearId === yearId)
      .map((cls) => {
        const classTests = dummyData.tests.filter((test) => test.classId === cls._id);
        const classTestScores = testScores.filter((score) =>
          classTests.some((test) => test.id === score.testId)
        );
        const classExamScores = dummyData.examScores.filter((score) =>
          dummyData.students.some(
            (student) => student.classId === cls._id && student._id === score.studentId
          )
        );

        return {
          className: cls.displayName,
          subjects: [...new Set(classTests.map((test) => test.subject))],
          testScores: classTestScores.map((score) => {
            const student = dummyData.students.find((s) => s._id === score.studentId);
            const test = dummyData.tests.find((t) => t.id === score.testId);
            return {
              studentName: `${student?.firstName} ${student?.lastName}`,
              subject: test?.subject,
              score: score.score,
              date: new Date(score.date).toLocaleDateString(),
              approvalStatus: score.approvalStatus,
            };
          }),
          examScores: classExamScores.map((score) => {
            const student = dummyData.students.find((s) => s._id === score.studentId);
            return {
              studentName: `${student?.firstName} ${student?.lastName}`,
              subject: score.subject,
              score: score.score,
              term: score.term,
            };
          }),
        };
      });
  };

  return (
    <Box py="20px">
      <Header title="ADMIN TESTS & EXAMS" subtitle="Manage Test Approvals and View Records" />
      <Box mb="20px">
        {/* Academic Year Selector */}
        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel id="academic-year-select-label">Academic Year</InputLabel>
          <Select
            labelId="academic-year-select-label"
            value={selectedAcademicYear}
            label="Academic Year"
            onChange={(e) => {
              setSelectedAcademicYear(e.target.value);
              setSelectedClass('');
            }}
          >
            {dummyData.academicYears.map((year) => (
              <MenuItem key={year._id} value={year._id}>
                {year.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Classes Table */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Classes and Tests
        </Typography>
        {classTableData.length > 0 ? (
          <TableComponent
            columns={classColumns}
            tableHeader={`Classes for ${dummyData.academicYears.find((y) => y._id === selectedAcademicYear)?.name}`}
            data={classTableData}
            page={0}
            rowsPerPage={5}
            sortBy="className"
            sortDirection="asc"
            hiddenColumnsSmallScreen={['subjects', 'tests']}
          />
        ) : (
          <Typography>No classes available.</Typography>
        )}

        {/* Records Breakdown */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Records Breakdown
        </Typography>
        {dummyData.academicYears.map((year) => (
          <CustomAccordion
            key={year._id}
            title={year.name}
            details={
              <Box>
                {getRecordsBreakdown(year._id).map((classData, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{classData.className}</Typography>
                    <Typography variant="body1">Subjects: {classData.subjects.join(', ') || 'None'}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Test Scores:
                    </Typography>
                    {classData.testScores.length > 0 ? (
                      <ul>
                        {classData.testScores.map((score, sIndex) => (
                          <li key={sIndex}>
                            <Typography variant="body2">
                              {score.studentName}: {score.subject} - {score.score}% ({score.date}, {score.approvalStatus})
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2">No test scores available.</Typography>
                    )}
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Exam Scores:
                    </Typography>
                    {classData.examScores.length > 0 ? (
                      <ul>
                        {classData.examScores.map((score, sIndex) => (
                          <li key={sIndex}>
                            <Typography variant="body2">
                              {score.studentName}: {score.subject} - {score.score}% ({score.term})
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2">No exam scores available.</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            }
            defaultExpanded={year._id === selectedAcademicYear}
          />
        ))}
      </Box>

      {/* View Test Modal */}
      <Dialog
        open={viewTestModalOpen}
        onClose={() => {
          setViewTestModalOpen(false);
          setSelectedTest(null);
        }}
      >
        <DialogTitle>Test Details</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="16px">
            {/* Subject Selector for Tests */}
            <FormControl fullWidth>
              <InputLabel id="subject-select-label">Subject</InputLabel>
              <Select
                labelId="subject-select-label"
                value={selectedTest?.subject || ''}
                label="Subject"
                onChange={(e) => {
                  const test = tests.find((t) => t.subject === e.target.value && t.classId === selectedClass);
                  setSelectedTest(test || null);
                }}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedTest && (
              <>
                <Typography variant="h6">{selectedTest.subject} Test</Typography>
                <Typography variant="body1">
                  Class: {dummyData.classes.find((c) => c._id === selectedTest.classId)?.displayName}
                </Typography>
                <Typography variant="body1">Duration: {selectedTest.duration / 60} minutes</Typography>
                <Typography variant="body2">Questions:</Typography>
                {dummyData.testQuestions
                  .filter((q) => selectedTest.questionIds.includes(q.id))
                  .map((question, index) => (
                    <Box key={question.id} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        {index + 1}. {question.question}
                      </Typography>
                      <Typography variant="caption">
                        Options: {question.options.join(', ')}
                      </Typography>
                      <Typography variant="caption" color={colors.greenAccent[500]}>
                        Correct: {question.correctAnswer}
                      </Typography>
                    </Box>
                  ))}
                <Typography variant="body2">Submissions:</Typography>
                {testScores
                  .filter((score) => score.testId === selectedTest.id)
                  .map((score) => {
                    const student = dummyData.students.find((s) => s._id === score.studentId);
                    return (
                      <CustomAccordion
                        key={score.id}
                        title={`${student?.firstName} ${student?.lastName} (${score.score}%, ${score.approvalStatus})`}
                        details={
                          <Box>
                            {Object.entries(score.answers).map(([qId, answer]) => {
                              const question = dummyData.testQuestions.find((q) => q.id === qId);
                              return (
                                <Box key={qId} sx={{ mb: 1 }}>
                                  <Typography variant="body2">
                                    {question?.question}: {answer}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color={
                                      answer === question?.correctAnswer
                                        ? colors.greenAccent[500]
                                        : colors.redAccent[500]
                                    }
                                  >
                                    {answer === question?.correctAnswer ? 'Correct' : 'Incorrect'}
                                  </Typography>
                                </Box>
                              );
                            })}
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUpdateApproval(score.id, 'approved')}
                                disabled={score.approvalStatus !== 'pending'}
                                sx={{ mr: 1 }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleUpdateApproval(score.id, 'rejected')}
                                disabled={score.approvalStatus !== 'pending'}
                              >
                                Reject
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    );
                  })}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setViewTestModalOpen(false);
              setSelectedTest(null);
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
        title="Test Approval"
        message={message}
      />
    </Box>
  );
};

export default Admin;
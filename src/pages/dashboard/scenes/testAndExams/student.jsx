import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
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
      duration: 300, // 5 minutes in seconds
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
      score: 100, // 2/2 correct
      date: '2024-09-20',
      academicYearId: 'year_2',
    },
    {
      id: 'score_2',
      testId: 'test_2',
      studentId: 'stu_1',
      score: 50, // 1/2 correct
      date: '2024-09-21',
      academicYearId: 'year_2',
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
      score: 90,
      academicYearId: 'year_2',
      term: 'First Term',
    },
    {
      id: 'exam_3',
      studentId: 'stu_1',
      subject: 'Mathematics',
      score: 80,
      academicYearId: 'year_1',
      term: 'First Term',
    },
  ],
};

const Student = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const studentId = 'stu_1'; // Logged-in student (John Doe)
  const student = dummyData.students.find((s) => s._id === studentId);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('year_2'); // Default to 2024–2025
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [testScores, setTestScores] = useState(dummyData.testScores);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Timer effect
  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !testSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, testSubmitted]);

  // Get subjects and tests for the student
  const studentClass = dummyData.classes.find((c) => c.students.includes(studentId));
  const availableTests = dummyData.tests.filter(
    (test) => test.classId === studentClass?._id && student.subjects.includes(test.subject)
  );

  // Get scores breakdown by academic year
  const getScoresBreakdown = (yearId) => {
    const yearTests = dummyData.tests.filter(
      (test) => test.classId === studentClass?._id && student.subjects.includes(test.subject)
    );
    const yearTestScores = testScores.filter(
      (score) => score.studentId === studentId && score.academicYearId === yearId
    );
    const yearExamScores = dummyData.examScores.filter(
      (score) => score.studentId === studentId && score.academicYearId === yearId
    );

    return student.subjects.map((subject) => {
      const subjectTests = yearTests.filter((test) => test.subject === subject);
      const subjectTestScores = yearTestScores.filter((score) =>
        subjectTests.some((test) => test.id === score.testId)
      );
      const subjectExamScores = yearExamScores.filter((score) => score.subject === subject);
      return {
        subject,
        testScores: subjectTestScores.map((score) => ({
          testId: score.testId,
          score: score.score,
          date: new Date(score.date).toLocaleDateString(),
        })),
        examScore: subjectExamScores[0]?.score || 'N/A',
        examTerm: subjectExamScores[0]?.term || 'N/A',
      };
    });
  };

  // Handle test start
  const handleStartTest = (test) => {
    setSelectedTest(test);
    setTimeLeft(test.duration);
    setAnswers({});
    setTestStarted(false);
    setTestSubmitted(false);
    setTestScore(null);
    setTestModalOpen(true);
  };

  // Handle answer selection
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Handle test submission
  const handleSubmitTest = () => {
    if (!testStarted || testSubmitted) return;
    let correct = 0;
    const questions = dummyData.testQuestions.filter((q) => selectedTest.questionIds.includes(q.id));
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct += 1;
    });
    const score = (correct / questions.length) * 100;
    setTestScore(score);
    setTestSubmitted(true);
    setTestStarted(false);

    // Save score
    const newScore = {
      id: `score_${testScores.length + 1}`,
      testId: selectedTest.id,
      studentId,
      score,
      date: new Date().toISOString().split('T')[0],
      academicYearId: selectedAcademicYear,
    };
    setTestScores([...testScores, newScore]);
    setMessage(`Test submitted! Your score: ${score}%`);
    setMessageModalOpen(true);
  };

  // Table columns for subjects
  const subjectColumns = [
    { id: 'subject', label: 'Subject', flex: 2 },
    {
      id: 'tests',
      label: 'Available Tests',
      flex: 2,
      renderCell: (row) => (
        <Typography>
          {row.tests.length > 0
            ? `${row.tests.length} test(s) available`
            : 'No tests available'}
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
          onClick={() => handleStartTest(row.tests[0])}
          disabled={row.tests.length === 0 || testScores.some((s) => s.testId === row.tests[0]?.id)}
        >
          Take Test
        </Button>
      ),
    },
  ];

  // Table data for subjects
  const subjectTableData = student.subjects.map((subject, index) => ({
    id: index + 1,
    subject,
    tests: availableTests.filter((test) => test.subject === subject),
  }));

  return (
    <Box py="20px">
      <Header title="STUDENT TESTS & EXAMS" subtitle="Take Tests and View Scores" />
      <Box mb="20px">
        {/* Academic Year Selector */}
        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel id="academic-year-select-label">Academic Year</InputLabel>
          <Select
            labelId="academic-year-select-label"
            value={selectedAcademicYear}
            label="Academic Year"
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
          >
            {dummyData.academicYears.map((year) => (
              <MenuItem key={year._id} value={year._id}>
                {year.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subjects Table */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Subjects and Tests
        </Typography>
        {subjectTableData.length > 0 ? (
          <TableComponent
            columns={subjectColumns}
            tableHeader={`Subjects for ${dummyData.academicYears.find((y) => y._id === selectedAcademicYear)?.name}`}
            data={subjectTableData}
            page={0}
            rowsPerPage={5}
            sortBy="subject"
            sortDirection="asc"
            hiddenColumnsSmallScreen={['tests']}
          />
        ) : (
          <Typography>No subjects assigned.</Typography>
        )}

        {/* Scores Breakdown */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Scores Breakdown
        </Typography>
        {dummyData.academicYears.map((year) => (
          <CustomAccordion
            key={year._id}
            title={year.name}
            details={
              <Box>
                {getScoresBreakdown(year._id).map((subjectData, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{subjectData.subject}</Typography>
                    <Typography variant="body1">Test Scores:</Typography>
                    {subjectData.testScores.length > 0 ? (
                      <ul>
                        {subjectData.testScores.map((score, sIndex) => (
                          <li key={sIndex}>
                            <Typography variant="body2">
                              Test {sIndex + 1}: {score.score}% ({score.date})
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2">No test scores available.</Typography>
                    )}
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Exam Score: {subjectData.examScore} {subjectData.examScore !== 'N/A' ? `(${subjectData.examTerm})` : ''}
                    </Typography>
                  </Box>
                ))}
              </Box>
            }
            defaultExpanded={year._id === selectedAcademicYear}
          />
        ))}
      </Box>

      {/* CBT Modal */}
      <Dialog
        open={testModalOpen}
        onClose={() => {
          setTestModalOpen(false);
          setSelectedTest(null);
          setAnswers({});
          setTimeLeft(0);
          setTestStarted(false);
          setTestSubmitted(false);
          setTestScore(null);
        }}
      >
        <DialogTitle>
          {selectedTest?.subject} Test
          {testStarted && !testSubmitted && (
            <Typography variant="body2" display="inline" sx={{ ml: 2 }}>
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedTest && !testSubmitted && (
            <Box display="flex" flexDirection="column" gap="16px">
              {dummyData.testQuestions
                .filter((q) => selectedTest.questionIds.includes(q.id))
                .map((question) => (
                  <Box key={question.id}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {question.question}
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      >
                        {question.options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={option}
                            disabled={testSubmitted}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
              {!testStarted && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTestStarted(true)}
                >
                  Start Test
                </Button>
              )}
            </Box>
          )}
          {testSubmitted && (
            <Box>
              <Typography variant="h6">Test Submitted!</Typography>
              <Typography variant="body1">Your Score: {testScore}%</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {testStarted && !testSubmitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitTest}
              disabled={Object.keys(answers).length < selectedTest?.questionIds.length}
            >
              Submit Test
            </Button>
          )}
          <Button
            onClick={() => {
              setTestModalOpen(false);
              setSelectedTest(null);
              setAnswers({});
              setTimeLeft(0);
              setTestStarted(false);
              setTestSubmitted(false);
              setTestScore(null);
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
        title="Test Result"
        message={message}
      />
    </Box>
  );
};

export default Student;
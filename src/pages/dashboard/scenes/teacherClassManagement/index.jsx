import React, { useState } from 'react';
import { Box, useTheme, Tabs, Tab, Typography, LinearProgress, Button } from '@mui/material';
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
      id={`academic-year-tabpanel-${index}`}
      aria-labelledby={`academic-year-tab-${index}`}
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

// Dummy data (ensure this is correctly defined)
const dummyData = {
  academicYears: [
    { _id: 'year_1', name: '2023–2024' },
    { _id: 'year_2', name: '2024–2025' },
  ],
  classes: [
    {
      _id: 'class_1',
      academicYearId: 'year_1',
      section: 'Primary',
      displayName: 'Primary 1A',
      students: ['stu_1', 'stu_2'],
    },
    {
      _id: 'class_2',
      academicYearId: 'year_2',
      section: 'Secondary',
      displayName: 'Secondary 1B',
      students: ['stu_3'],
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
};

const TeacherClassManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  
  // Safeguard for academicYears
  const academicYears = Array.isArray(dummyData.academicYears) ? dummyData.academicYears : [];
  
  // Initialize tabState with a fallback
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
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Debug runtime value (optional, remove after debugging)
  console.log('dummyData.academicYears:', dummyData.academicYears);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Open student details modal
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setStudentModalOpen(true);
  };

  // Open progress modal
  const openProgressModal = (student) => {
    setSelectedStudent(student);
    setProgressModalOpen(true);
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

  // Table columns
  const columns = [
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
            View Progress
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Header
        title="Teacher Class Management"
        subtitle="View your students and their subject progress"
      />

      <Box sx={{ mt: 3, mb: 3 }}>
        {academicYears.length > 0 ? (
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
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
              <TabPanel key={year._id} value={tabValue} index={index}>
                <TableComponent
                  columns={columns}
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
    </Box>
  );
};

export default withDashboardWrapper(TeacherClassManagement);
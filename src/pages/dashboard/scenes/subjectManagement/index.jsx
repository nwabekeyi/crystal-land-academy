import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  Tabs,
  Tab,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useSubjectManagement from './useSubjectManagement';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import Loader from '../../../../utils/loader';
import ActionButton from '../../components/actionButton';
import Modal from '../../components/modal';
import { FaPlus, FaTrash } from 'react-icons/fa';

// Custom TabPanel for accessibility
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

const SubjectManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    tableProps,
    modalOpen,
    setModalOpen,
    modalMode,
    formData,
    handleFormChange,
    handleClassLevelChange,
    addClassLevel,
    removeClassLevel,
    handleSubmit,
    error,
    loadingSubjects,
    loadingSubmit,
    openModal,
    academicYears,
    classLevels,
    selectedSubject,
    deleteConfirmOpen,
    subjectToDelete,
    handleDelete,
    closeDeleteConfirm,
    classLevelsModalOpen,
    setClassLevelsModalOpen,
    getTeachersForClassLevel,
  } = useSubjectManagement();

  const [academicYearTab, setAcademicYearTab] = useState(0);
  const [classLevelTab, setClassLevelTab] = useState({});
  const [subclassTab, setSubclassTab] = useState({});
  const [tabState, setTabState] = useState(
    academicYears.reduce(
      (acc, year) => ({
        ...acc,
        [year._id]: classLevels.reduce(
          (classAcc, classLevel) => ({
            ...classAcc,
            [classLevel._id]: {
              selectedSubclass: 0,
              page: 0,
              rowsPerPage: 5,
              sortBy: 'name',
              sortDirection: 'asc',
            },
          }),
          {}
        ),
      }),
      {}
    )
  );

  // Update tabState when academicYears or classLevels change
  useEffect(() => {
    setTabState(prev => {
      const newState = academicYears.reduce(
        (acc, year) => ({
          ...acc,
          [year._id]: classLevels.reduce(
            (classAcc, classLevel) => ({
              ...classAcc,
              [classLevel._id]:
                prev[year._id]?.[classLevel._id] || {
                  selectedSubclass: 0,
                  page: 0,
                  rowsPerPage: 5,
                  sortBy: 'name',
                  sortDirection: 'asc',
                },
            }),
            {}
          ),
        }),
        {}
      );
      return newState;
    });
    setClassLevelTab(prev =>
      academicYears.reduce(
        (acc, year) => ({
          ...acc,
          [year._id]: prev[year._id] || 0,
        }),
        {}
      )
    );
    setSubclassTab(prev =>
      academicYears.reduce(
        (acc, year) => ({
          ...acc,
          [year._id]: classLevels.reduce(
            (classAcc, classLevel) => ({
              ...classAcc,
              [classLevel._id]: prev[year._id]?.[classLevel._id] || 0,
            }),
            {}
          ),
        }),
        {}
      )
    );
  }, [academicYears, classLevels]);

  // Handle academic year tab change
  const handleAcademicYearTabChange = (event, newValue) => {
    setAcademicYearTab(newValue);
  };

  // Handle class level tab change
  const handleClassLevelTabChange = (yearId, newValue) => {
    setClassLevelTab(prev => ({
      ...prev,
      [yearId]: newValue,
    }));
    setSubclassTab(prev => ({
      ...prev,
      [yearId]: {
        ...prev[yearId],
        [classLevels[newValue]._id]: 0,
      },
    }));
  };

  // Handle subclass tab change
  const handleSubclassTabChange = (yearId, classLevelId, newValue) => {
    setSubclassTab(prev => ({
      ...prev,
      [yearId]: {
        ...prev[yearId],
        [classLevelId]: newValue,
      },
    }));
  };

  // Handle pagination changes
  const handlePageChange = (yearId, classLevelId, newPage) => {
    setTabState(prev => ({
      ...prev,
      [yearId]: {
        ...prev[yearId],
        [classLevelId]: { ...prev[yearId][classLevelId], page: newPage },
      },
    }));
  };

  const handleRowsPerPageChange = (yearId, classLevelId, event) => {
    setTabState(prev => ({
      ...prev,
      [yearId]: {
        ...prev[yearId],
        [classLevelId]: {
          ...prev[yearId][classLevelId],
          page: 0,
          rowsPerPage: parseInt(event.target.value, 10),
        },
      },
    }));
  };

  // Handle sorting
  const handleSortChange = (yearId, classLevelId, columnId) => {
    setTabState(prev => {
      const current = prev[yearId][classLevelId];
      const newSortDirection =
        current.sortBy === columnId && current.sortDirection === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        [yearId]: {
          ...prev[yearId],
          [classLevelId]: {
            ...current,
            sortBy: columnId,
            sortDirection: newSortDirection,
          },
        },
      };
    });
  };

  // Get available subclasses for a classLevel
  const getSubclassesForClassLevel = (classLevelId) => {
    const classLevel = classLevels.find(cl => cl._id === classLevelId);
    return classLevel?.subclasses?.map(sub => sub.letter) || [];
  };

  // Generate table data for a specific academic year, class level, and subclass
  const getTableDataForSubclass = (yearId, classLevelId, subclassIndex) => {
    const { page, rowsPerPage, sortBy, sortDirection } =
      tabState[yearId]?.[classLevelId] || {
        page: 0,
        rowsPerPage: 5,
        sortBy: 'name',
        sortDirection: 'asc',
      };
    const subjectsData = tableProps.subjects[yearId] || [];
    const classLevel = classLevels.find(cl => cl._id === classLevelId);
    const subclassLetter = getSubclassesForClassLevel(classLevelId)[subclassIndex];

    // Filter subjects by classLevel and subclass
    const filteredData = subjectsData.filter(subject =>
      subject.classLevelSubclasses.some(
        cls =>
          cls.classLevel?._id === classLevelId && cls.subclassLetter === subclassLetter
      )
    );

    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      if (sortBy === 'displayName') {
        aValue = a.displayName || '';
        bValue = b.displayName || '';
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = page * rowsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    // Assign independent S/N
    const result = paginatedData.map((row, index) => ({
      ...row,
      sn: startIndex + index + 1,
    }));

    return result;
  };

  return (
    <Box>
      <Header title="Subject Management" subtitle="Manage subjects and their details" />

      {/* Main content */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <ActionButton
          icon={<FaPlus />}
          content="Add Subject"
          onClick={() => openModal('create')}
          sx={{ mb: 2 }}
        />

        {loadingSubjects ? (
          <Loader />
        ) : (
          <Box
            height="75vh"
            sx={{
              '& .MuiDataGrid-root': { border: 'none' },
              '& .MuiDataGrid-cell': { borderBottom: 'none' },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: colors.blueAccent[700],
                borderBottom: 'none',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: colors.primary[400],
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: 'none',
                backgroundColor: colors.blueAccent[700],
              },
              '& .MuiCheckbox-root': {
                color: `${colors.blueAccent[200]} !important`,
              },
            }}
          >
            {academicYears.length > 0 ? (
              <>
                {/* Academic Year Tabs */}
                <Tabs
                  value={academicYearTab}
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
                  <TabPanel key={year._id} value={academicYearTab} index={index}>
                    {classLevels.length > 0 ? (
                      <>
                        {/* Class Level Tabs */}
                        <Tabs
                          value={classLevelTab[year._id] || 0}
                          onChange={(e, newValue) => handleClassLevelTabChange(year._id, newValue)}
                          aria-label="class level tabs"
                          sx={{
                            backgroundColor: colors.primary[400],
                            '& .MuiTabs-indicator': {
                              backgroundColor: colors.blueAccent[700],
                            },
                            mt: 2,
                          }}
                        >
                          {classLevels.map((classLevel, classIndex) => (
                            <Tab
                              key={classLevel._id}
                              label={classLevel.name}
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
                        {classLevels.map((classLevel, classIndex) => (
                          <TabPanel
                            key={classLevel._id}
                            value={classLevelTab[year._id] || 0}
                            index={classIndex}
                          >
                            {getSubclassesForClassLevel(classLevel._id).length > 0 ? (
                              <>
                                {/* Subclass Tabs */}
                                <Tabs
                                  value={subclassTab[year._id]?.[classLevel._id] || 0}
                                  onChange={(e, newValue) =>
                                    handleSubclassTabChange(year._id, classLevel._id, newValue)
                                  }
                                  aria-label="subclass tabs"
                                  sx={{
                                    backgroundColor: colors.primary[400],
                                    '& .MuiTabs-indicator': {
                                      backgroundColor: colors.blueAccent[700],
                                    },
                                    mt: 2,
                                  }}
                                >
                                  {getSubclassesForClassLevel(classLevel._id).map((letter, subIndex) => (
                                    <Tab
                                      key={letter}
                                      label={`Subclass ${letter}`}
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
                                {getSubclassesForClassLevel(classLevel._id).map((letter, subIndex) => (
                                  <TabPanel
                                    key={letter}
                                    value={subclassTab[year._id]?.[classLevel._id] || 0}
                                    index={subIndex}
                                  >
                                    <TableComponent
                                      {...tableProps}
                                      data={getTableDataForSubclass(year._id, classLevel._id, subIndex)}
                                      tableHeader={`Subjects for ${year.name}, ${classLevel.name}, Subclass ${letter}`}
                                      page={tabState[year._id]?.[classLevel._id]?.page || 0}
                                      rowsPerPage={tabState[year._id]?.[classLevel._id]?.rowsPerPage || 5}
                                      sortBy={tabState[year._id]?.[classLevel._id]?.sortBy || 'name'}
                                      sortDirection={
                                        tabState[year._id]?.[classLevel._id]?.sortDirection || 'asc'
                                      }
                                      onSortChange={columnId =>
                                        handleSortChange(year._id, classLevel._id, columnId)
                                      }
                                      onPageChange={(event, newPage) =>
                                        handlePageChange(year._id, classLevel._id, newPage)
                                      }
                                      onRowsPerPageChange={event =>
                                        handleRowsPerPageChange(year._id, classLevel._id, event)
                                      }
                                    />
                                  </TabPanel>
                                ))}
                              </>
                            ) : (
                              <Typography>No subclasses available for {classLevel.name}</Typography>
                            )}
                          </TabPanel>
                        ))}
                      </>
                    ) : (
                      <Typography>No class levels available</Typography>
                    )}
                  </TabPanel>
                ))}
              </>
            ) : (
              <Typography>No academic years available</Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Subject Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Create Subject' : modalMode === 'edit' ? 'Edit Subject' : 'View Subject'}
        onConfirm={modalMode !== 'view' ? handleSubmit : null}
        confirmMessage={modalMode === 'create' ? 'Create' : 'Save'}
        styleProps={{ padding: '20px' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Subject Name"
            name="name"
            value={formData.name || ''}
            onChange={handleFormChange}
            required
            fullWidth
            disabled={modalMode === 'view'}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleFormChange}
            multiline
            rows={4}
            fullWidth
            disabled={modalMode === 'view'}
          />
          <TextField
            select
            label="Academic Year"
            name="academicYear"
            value={formData.academicYear || ''}
            onChange={handleFormChange}
            required
            fullWidth
            disabled={modalMode === 'view'}
          >
            {academicYears.map(year => (
              <MenuItem key={year._id} value={year._id}>
                {year.name}
              </MenuItem>
            ))}
          </TextField>
          {modalMode !== 'view' && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={addClassLevel}
                  startIcon={<FaPlus />}
                  sx={{ backgroundColor: colors.blueAccent[700] }}
                >
                  Add Class Level and Subclass
                </Button>
              </Box>
              {formData.classLevelSubclasses.map((cls, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', gap: '16px', alignItems: 'center', mb: 2 }}
                >
                  <TextField
                    select
                    label={`Class Level ${index + 1}`}
                    value={cls.classLevel || ''}
                    onChange={e => handleClassLevelChange(index, 'classLevel', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  >
                    {classLevels.map(classLevel => (
                      <MenuItem key={classLevel._id} value={classLevel._id}>
                        {classLevel.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label={`Subclass ${index + 1}`}
                    value={cls.subclassLetter || ''}
                    onChange={e => handleClassLevelChange(index, 'subclassLetter', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    disabled={!cls.classLevel}
                  >
                    {getSubclassesForClassLevel(cls.classLevel).map(letter => (
                      <MenuItem key={letter} value={letter}>
                        {letter}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label={`Teachers for Class Level ${index + 1}`}
                    value={cls.teachers || []}
                    onChange={e => handleClassLevelChange(index, 'teachers', e.target.value)}
                    SelectProps={{
                      multiple: true,
                      renderValue: selected =>
                        selected.length > 0
                          ? selected
                              .map(id =>
                                getTeachersForClassLevel(cls.classLevel).find(t => t._id === id)?.name ||
                                'Unknown'
                              )
                              .join(', ')
                          : 'Select teachers',
                    }}
                    sx={{ flex: 1 }}
                    disabled={!cls.classLevel || !cls.subclassLetter}
                  >
                    {getTeachersForClassLevel(cls.classLevel).length > 0 ? (
                      getTeachersForClassLevel(cls.classLevel).map(teacher => (
                        <MenuItem key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No teachers available</MenuItem>
                    )}
                  </TextField>
                  <IconButton onClick={() => removeClassLevel(index)}>
                    <FaTrash />
                  </IconButton>
                </Box>
              ))}
            </>
          )}
          {modalMode === 'view' && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setClassLevelsModalOpen(true)}
                sx={{ backgroundColor: colors.blueAccent[700] }}
              >
                View Class Levels, Subclasses, and Teachers
              </Button>
            </Box>
          )}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>

      {/* Class Levels, Subclasses, and Teachers Modal */}
      <Modal
        open={classLevelsModalOpen}
        onClose={() => setClassLevelsModalOpen(false)}
        title="Class Levels, Subclasses, and Teachers for Subject"
        styleProps={{ padding: '20px' }}
      >
        <Box>
          {selectedSubject?.classLevelSubclasses?.length > 0 ? (
            selectedSubject.classLevelSubclasses.map((cls, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">
                  {classLevels.find(level => level._id === cls.classLevel?._id)?.name ||
                    'Unknown Class Level'}{' '}
                  - Subclass {cls.subclassLetter}
                </Typography>
                <Typography variant="subtitle1">Teachers:</Typography>
                {cls.teachers?.length > 0 ? (
                  cls.teachers.map(teacher => (
                    <Typography key={teacher._id || teacher} sx={{ ml: 2 }}>
                      - {teacher.name || getTeachersForClassLevel(cls.classLevel).find(t => t._id === (teacher._id || teacher))?.name || 'Unknown Teacher'}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ ml: 2 }}>No teachers assigned</Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography>No class levels or subclasses assigned</Typography>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        title="Delete Subject"
        onConfirm={handleDelete}
        confirmMessage="Delete"
        styleProps={{ padding: '20px' }}
      >
        <Box>
          <Typography>
            Are you sure you want to delete the subject "{subjectToDelete?.name || 'Unknown'}"? This action cannot be undone.
          </Typography>
          {loadingSubmit && <Loader />}
        </Box>
      </Modal>
    </Box>
  );
};

export default withDashboardWrapper(SubjectManagement);
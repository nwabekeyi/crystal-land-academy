import React, { useState, useEffect } from 'react';
import { Box, useTheme, Tabs, Tab, Typography, TextField, MenuItem, Button, IconButton } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useSubjectManagement from './useSubjectManagement';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import Loader from '../../../../utils/loader';
import ActionButton from '../../components/actionButton';
import Modal from '../../components/modal';
import ConfirmationModal from '../../components/confirmationModal';
import { FaPlus, FaTrash } from 'react-icons/fa';

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

const SubjectManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    tableProps,
    modalOpen,
    setModalOpen,
    modalMode,
    setModalMode,
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
    teachers,
    selectedSubject,
    deleteConfirmOpen,
    subjectToDelete,
    handleDelete,
    closeDeleteConfirm,
    classLevelsModalOpen,
    setClassLevelsModalOpen,
  } = useSubjectManagement();

  const [tabValue, setTabValue] = useState(0);
  const [tabState, setTabState] = useState(
    academicYears.reduce((acc, year) => ({
      ...acc,
      [year._id]: {
        page: 0,
        rowsPerPage: 5,
        sortBy: 'name',
        sortDirection: 'asc',
      },
    }), {})
  );

  // Update tabState when academicYears change
  useEffect(() => {
    setTabState(prev => {
      const newState = academicYears.reduce((acc, year) => ({
        ...acc,
        [year._id]: prev[year._id] || {
          page: 0,
          rowsPerPage: 5,
          sortBy: 'name',
          sortDirection: 'asc',
        },
      }), {});
      return newState;
    });
  }, [academicYears]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle pagination changes
  const handlePageChange = (yearId, newPage) => {
    setTabState(prev => ({
      ...prev,
      [yearId]: { ...prev[yearId], page: newPage },
    }));
  };

  const handleRowsPerPageChange = (yearId, event) => {
    setTabState(prev => ({
      ...prev,
      [yearId]: { ...prev[yearId], page: 0, rowsPerPage: parseInt(event.target.value, 10) },
    }));
  };

  // Handle sorting
  const handleSortChange = (yearId, columnId) => {
    setTabState(prev => {
      const current = prev[yearId];
      const newSortDirection = current.sortBy === columnId && current.sortDirection === 'asc' ? 'desc' : 'asc';
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

  // Generate table data with independent S/N
  const getTableDataForYear = (yearId) => {
    const { page, rowsPerPage, sortBy, sortDirection } = tabState[yearId] || {
      page: 0,
      rowsPerPage: 5,
      sortBy: 'name',
      sortDirection: 'asc',
    };
    const subjectsData = tableProps.subjects[yearId] || [];

    // Apply sorting
    const sortedData = [...subjectsData].sort((a, b) => {
      let aValue = a[sortBy] ?? '';
      let bValue = b[sortBy] ?? '';
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
                      {...tableProps}
                      data={getTableDataForYear(year._id)}
                      tableHeader={`Subjects for ${year.name}`}
                      page={tabState[year._id]?.page || 0}
                      rowsPerPage={tabState[year._id]?.rowsPerPage || 5}
                      sortBy={tabState[year._id]?.sortBy || 'name'}
                      sortDirection={tabState[year._id]?.sortDirection || 'asc'}
                      onSortChange={(columnId) => handleSortChange(year._id, columnId)}
                      onPageChange={(event, newPage) => handlePageChange(year._id, newPage)}
                      onRowsPerPageChange={(event) => handleRowsPerPageChange(year._id, event)}
                    />
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
        title={{
          create: 'Create Subject',
          edit: 'Edit Subject',
          view: 'View Subject',
        }[modalMode]}
        onConfirm={modalMode !== 'view' ? handleSubmit : null}
        confirmMessage={modalMode === 'create' ? 'Create' : 'Save'}
        styleProps={{ padding: '20px' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            fullWidth
            disabled={modalMode === 'view'}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
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
            value={formData.academicYear}
            onChange={handleFormChange}
            required
            fullWidth
            disabled={modalMode === 'view'}
          >
            {academicYears.map((year) => (
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
                  Add Class Level
                </Button>
              </Box>
              {formData.classLevels.map((cl, index) => (
                <Box key={index} sx={{ display: 'flex', gap: '16px', alignItems: 'center', mb: 2 }}>
                  <TextField
                    select
                    label={`Class Level ${index + 1}`}
                    value={cl.classLevel}
                    onChange={(e) => handleClassLevelChange(index, 'classLevel', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  >
                    {classLevels.map((classLevel) => (
                      <MenuItem key={classLevel._id} value={classLevel._id}>
                        {classLevel.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label={`Teachers for Class Level ${index + 1}`}
                    value={cl.teachers}
                    onChange={(e) => handleClassLevelChange(index, 'teachers', e.target.value)}
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) =>
                        selected
                          .map((id) => teachers.find(t => t._id === id)?.name || '')
                          .filter(Boolean)
                          .join(', '),
                    }}
                    sx={{ flex: 1 }}
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </MenuItem>
                    ))}
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
                View Class Levels and Teachers
              </Button>
            </Box>
          )}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>

      {/* Class Levels and Teachers Modal */}
      <Modal
        open={classLevelsModalOpen}
        onClose={() => setClassLevelsModalOpen(false)}
        title="Class Levels and Teachers for Subject"
        styleProps={{ padding: '20px' }}
      >
        <Box>
          {selectedSubject?.classLevels?.length > 0 ? (
            selectedSubject.classLevels.map((cl, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">
                  {classLevels.find(level => level._id === cl.classLevel?._id)?.name || 'Unknown Class Level'}
                </Typography>
                <Typography variant="subtitle1">Teachers:</Typography>
                {cl.teachers?.length > 0 ? (
                  cl.teachers.map((teacher) => (
                    <Typography key={teacher._id} sx={{ ml: 2 }}>
                      - {teacher.name}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ ml: 2 }}>No teachers assigned</Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography>No class levels assigned</Typography>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the subject "${subjectToDelete?.name}"? This action cannot be undone.`}
        isLoading={loadingSubmit}
      />
    </Box>
  );
};

export default withDashboardWrapper(SubjectManagement);
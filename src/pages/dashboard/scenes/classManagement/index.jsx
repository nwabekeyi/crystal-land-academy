import React, { useState, useEffect } from 'react';
import { Box, useTheme, Tabs, Tab, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useClassManagement from './useClassManagement';
import { selectAdminDataState } from '../../../../reduxStore/slices/adminDataSlice';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import Loader from '../../../../utils/loader';
import ActionButton from '../../components/actionButton';
import { ClassModal, StudentsModal, TeachersModal, TimetableModal, FeesModal } from './ClassmanagementModals';
import { FaPlus } from 'react-icons/fa';

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

const ClassManagement = () => {
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
    handleFeesChange,
    handleSubclassFeesChange,
    addTermFee,
    removeTermFee,
    addSubclassTermFee,
    removeSubclassTermFee,
    handleTimetableChange,
    addTimetableEntry,
    removeTimetableEntry,
    handleSubmit,
    error,
    loadingClasses,
    loadingSubmit,
    openModal,
    academicYears,
    selectedClass,
    deleteConfirmOpen,
    classToDelete,
    handleDelete,
    closeDeleteConfirm,
  } = useClassManagement();
  const { usersData } = useSelector(selectAdminDataState);

  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [teachersModalOpen, setTeachersModalOpen] = useState(false);
  const [timetableModalOpen, setTimetableModalOpen] = useState(false);
  const [feesModalOpen, setFeesModalOpen] = useState(false);
  const [timetableMode, setTimetableMode] = useState('view');
  const [feesViewMode, setFeesViewMode] = useState(true);
  const [selectedSubclass, setSelectedSubclass] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabState, setTabState] = useState(
    academicYears.reduce((acc, year) => ({
      ...acc,
      [year._id]: {
        page: 0,
        rowsPerPage: 5,
        sortBy: 'section',
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
          sortBy: 'section',
          sortDirection: 'asc',
        },
      }), {});
      return newState;
    });
  }, [academicYears]);

  // Get students and teachers for the selected class
  const students = selectedClass?.students
    ? usersData.students.filter(student => selectedClass.students.includes(student._id))
    : [];
  const teachers = selectedClass?.teachers
    ? usersData.teachers.filter(teacher => selectedClass.teachers.includes(teacher._id))
    : [];

  // Open timetable modal
  const openTimetableModal = (mode, subclass) => {
    setTimetableMode(mode);
    setSelectedSubclass(subclass);
    setTimetableModalOpen(true);
  };

  // Open fees modal
  const openFeesModal = () => {
    setFeesViewMode(true);
    setFeesModalOpen(true);
  };

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
      sortBy: 'section',
      sortDirection: 'asc',
    };
    const sections = tableProps.classLevels[yearId] || { Primary: [], Secondary: [] };

    console.log(`Data for year ${yearId}:`, sections);

    let primaryData = [...(sections.Primary || [])];
    let secondaryData = [...(sections.Secondary || [])];

    // Apply sorting within each section
    const sortSection = (data) => {
      if (!data.length) return data;
      return data.sort((a, b) => {
        let aValue = a[sortBy] ?? '';
        let bValue = b[sortBy] ?? '';
        if (sortBy === 'displayName') {
          aValue = a.displayName ?? '';
          bValue = b.displayName ?? '';
        } else if (sortBy === 'studentsCount') {
          aValue = a.students?.length ?? 0;
          bValue = b.students?.length ?? 0;
        } else if (sortBy === 'academicYear') {
          aValue = a.academicYear?.name ?? '';
          bValue = b.academicYear?.name ?? '';
        } else if (sortBy === 'section') {
          aValue = a.section?.toLowerCase() === 'primary' ? 0 : 1;
          bValue = b.section?.toLowerCase() === 'secondary' ? 1 : 0;
        }
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    };

    primaryData = sortSection(primaryData);
    secondaryData = sortSection(secondaryData);

    // Combine data
    let combinedData = [...primaryData, ...secondaryData];

    // Apply pagination
    const startIndex = page * rowsPerPage;
    const paginatedData = combinedData.slice(startIndex, startIndex + rowsPerPage);

    // Assign independent S/N
    let primarySnCounter = 1;
    let secondarySnCounter = 1;

    if (page > 0) {
      const primaryCountOnPreviousPages = primaryData.slice(0, startIndex).length;
      const secondaryCountOnPreviousPages = secondaryData.slice(0, startIndex).length;
      primarySnCounter = primaryCountOnPreviousPages + 1;
      secondarySnCounter = secondaryCountOnPreviousPages + 1;
    }

    const result = paginatedData.map((row) => {
      let sn;
      if (row.section?.toLowerCase() === 'primary') {
        sn = primarySnCounter++;
      } else if (row.section?.toLowerCase() === 'secondary') {
        sn = secondarySnCounter++;
      } else {
        sn = 0;
      }
      return { ...row, sn };
    });

    console.log(`Paginated data for year ${yearId}:`, result);
    return result;
  };

  return (
    <Box>
      <Header title="Class Management" subtitle="Manage class levels and their details" />

      <Box sx={{ mt: 3, mb: 3 }}>
        <ActionButton
          icon={<FaPlus />}
          content="Add Class"
          onClick={() => openModal('create')}
          sx={{ mb: 2 }}
        />

        {loadingClasses ? (
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
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            {academicYears.length > 0 ? (
              <>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="academic year tabs"
                  variant="scrollable"
                  scrollButtons="auto"
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
                        minWidth: 160, // Match UserManagement.js tab width
                        width: 160, // Fixed width to ensure consistency
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
                      classLevels={getTableDataForYear(year._id)}
                      tableHeader={`Classes for ${year.name}`}
                      page={tabState[year._id]?.page || 0}
                      rowsPerPage={tabState[year._id]?.rowsPerPage || 5}
                      sortBy={tabState[year._id]?.sortBy || 'section'}
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

      <ClassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={{
          create: 'Create Class Level',
          edit: 'Edit Class Level',
          view: 'View Class Level',
          delete: 'Delete Class Level',
        }[modalMode]}
        modalMode={modalMode}
        setModal={setModalMode}
        formData={formData}
        handleFormChange={handleFormChange}
        handleFeesChange={handleFeesChange}
        handleSubclassFeesChange={handleSubclassFeesChange}
        addTermFee={addTermFee}
        removeTermFee={removeTermFee}
        addSubclassTermFee={addSubclassTermFee}
        removeSubclassTermFee={removeSubclassTermFee}
        openTimetableModal={openTimetableModal}
        setStudentsModalOpen={setStudentsModalOpen}
        setTeachersModalOpen={setTeachersModalOpen}
        setFeesModalOpen={openFeesModal}
        handleSubmit={handleSubmit}
        error={error}
        loadingSubmit={loadingSubmit}
        academicYears={academicYears}
        colors={colors}
        theme={theme}
      />

      <StudentsModal
        open={studentsModalOpen}
        onClose={() => setStudentsModalOpen(false)}
        students={students}
        theme={theme}
      />

      <TeachersModal
        open={teachersModalOpen}
        onClose={() => setTeachersModalOpen(false)}
        teachers={teachers}
        theme={theme}
      />

      <TimetableModal
        open={timetableModalOpen}
        onClose={() => setTimetableModalOpen(false)}
        title={`${timetableMode === 'edit' ? 'Edit' : 'View'} Timetable for Subclass ${selectedSubclass?.letter}`}
        timetableMode={timetableMode}
        selectedSubclass={selectedSubclass}
        handleTimetableChange={handleTimetableChange}
        addTimetableEntry={addTimetableEntry}
        removeTimetableEntry={removeTimetableEntry}
        setTimetableMode={setTimetableMode}
        handleSubmit={handleSubmit}
        error={error}
        theme={theme}
      />

      <FeesModal
        open={feesModalOpen}
        onClose={() => setFeesModalOpen(false)}
        formData={formData}
        handleFeesChange={handleFeesChange}
        handleSubclassFeesChange={handleSubclassFeesChange}
        addTermFee={addTermFee}
        removeTermFee={removeTermFee}
        addSubclassTermFee={addSubclassTermFee}
        removeSubclassTermFee={removeSubclassTermFee}
        handleSubmit={handleSubmit}
        isViewMode={feesViewMode}
        setIsViewMode={setFeesViewMode}
        error={error}
        colors={colors}
        theme={theme}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography id="delete-confirm-dialog-description">
            Are you sure you want to delete the class <strong>{classToDelete?.name}</strong>? This action cannot be undone.
          </Typography>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withDashboardWrapper(ClassManagement);
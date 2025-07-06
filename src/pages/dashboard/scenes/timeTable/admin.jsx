// components/admin/AdminTimeTable.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { AddTimetableModal, EditTimetableModal, ConfirmationModal } from './Modals';
import ActionButton from '../../components/actionButton';
import EditIcon from '@mui/icons-material/Edit';
import CustomIconButton from '../../components/customIconButton';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading: timetableLoading, error: timetableError, callApi: fetchTimetables, data: timetableData } = useApi();
  const { loading: classLevelLoading, error: classLevelError, callApi: fetchClassLevels, data: classLevelData } = useApi();
  const { loading: subjectLoading, error: subjectError, callApi: fetchSubjects, data: subjectData } = useApi();
  const { loading: teacherLoading, error: teacherError, callApi: fetchTeachers, data: teacherData } = useApi();
  const { loading: createLoading, error: createError, callApi: createTimetable } = useApi();
  const { loading: updateLoading, error: updateError, callApi: updateTimetable } = useApi();

  const [selectedClassLevel, setSelectedClassLevel] = useState('');
  const [selectedSubclass, setSelectedSubclass] = useState('');
  const [timetables, setTimetables] = useState([]);
  const [sortBy, setSortBy] = useState('dayOfWeek');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    classLevel: '',
    subclassLetter: '',
    subject: '',
    teacher: '',
    dayOfWeek: '',
    startTime: '',
    numberOfPeriods: 1,
    location: '',
  });

  // Fetch initial data
  useEffect(() => {
    fetchClassLevels(endpoints.CLASS_LEVEL);
    fetchSubjects(endpoints.SUBJECT);
    fetchTeachers(endpoints.TEACHERS);
  }, []);

  // Fetch timetables when filters change
  useEffect(() => {
    if (selectedClassLevel && selectedSubclass) {
      fetchTimetables(`${endpoints.TIMETABLE}?classLevel=${selectedClassLevel}&subclassLetter=${selectedSubclass}`);
    }
  }, [selectedClassLevel, selectedSubclass]);

  // Update timetables state
  useEffect(() => {
    if (timetableData?.success) {
      setTimetables(timetableData.data.map((t, index) => ({ ...t, sn: index + 1 })));
    }
  }, [timetableData]);

  // Handle adding a new timetable
  const handleAddSchedule = async () => {
    const body = {
      ...newSchedule,
      numberOfPeriods: parseInt(newSchedule.numberOfPeriods, 10),
    };
    const response = await createTimetable(endpoints.TIMETABLE, 'POST', body);
    if (response?.success) {
      setTimetables([...timetables, { ...response.data, sn: timetables.length + 1 }]);
      setConfirmationMessage('Timetable added successfully');
      setAddModalOpen(false);
      setConfirmationModalOpen(true);
      setNewSchedule({
        classLevel: '',
        subclassLetter: '',
        subject: '',
        teacher: '',
        dayOfWeek: '',
        startTime: '',
        numberOfPeriods: 1,
        location: '',
      });
    } else {
      setConfirmationMessage(createError || 'Failed to add timetable');
      setConfirmationModalOpen(true);
    }
  };

  // Handle updating a timetable
  const handleUpdateSchedule = async () => {
    const body = {
      ...newSchedule,
      numberOfPeriods: parseInt(newSchedule.numberOfPeriods, 10),
    };
    const response = await updateTimetable(`${endpoints.TIMETABLE}/${selectedTimetable._id}`, 'PUT', body);
    if (response?.success) {
      setTimetables(timetables.map((t) => (t._id === selectedTimetable._id ? { ...response.data, sn: t.sn } : t)));
      setConfirmationMessage('Timetable updated successfully');
      setEditModalOpen(false);
      setConfirmationModalOpen(true);
      setNewSchedule({
        classLevel: '',
        subclassLetter: '',
        subject: '',
        teacher: '',
        dayOfWeek: '',
        startTime: '',
        numberOfPeriods: 1,
        location: '',
      });
      setSelectedTimetable(null);
    } else {
      setConfirmationMessage(updateError || 'Failed to update timetable');
      setConfirmationModalOpen(true);
    }
  };

  // Open edit modal
  const handleEditSchedule = (timetable) => {
    setSelectedTimetable(timetable);
    setNewSchedule({
      classLevel: timetable.classLevel._id,
      subclassLetter: timetable.subclassLetter,
      subject: timetable.subject._id,
      teacher: timetable.teacher._id,
      dayOfWeek: timetable.dayOfWeek,
      startTime: timetable.startTime,
      numberOfPeriods: timetable.numberOfPeriods,
      location: timetable.location,
    });
    setEditModalOpen(true);
  };

  // Table columns
  const columns = [
    { id: 'sn', label: 'S/N', flex: 0.5 },
    { id: 'dayOfWeek', label: 'Day', flex: 1, renderCell: (row) => <Typography>{row.dayOfWeek}</Typography> },
    { id: 'startTime', label: 'Start Time', flex: 1, renderCell: (row) => <Typography>{row.startTime}</Typography> },
    { id: 'endTime', label: 'End Time', flex: 1, renderCell: (row) => <Typography>{row.endTime}</Typography> },
    { id: 'numberOfPeriods', label: 'Periods', flex: 1, renderCell: (row) => <Typography>{row.numberOfPeriods}</Typography> },
    { id: 'subject', label: 'Subject', flex: 1, renderCell: (row) => <Typography>{row.subject?.name || 'N/A'}</Typography> },
    { id: 'teacher', label: 'Teacher', flex: 1, renderCell: (row) => <Typography>{row.teacher?.firstName} {row.teacher?.lastName}</Typography> },
    { id: 'location', label: 'Location', flex: 1, renderCell: (row) => <Typography>{row.location}</Typography> },
    {
      id: 'actions',
      label: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <CustomIconButton
          onClick={() => handleEditSchedule(row)}
          icon={<EditIcon />}
          title="Edit Timetable"
          sx={{ color: colors.blueAccent[500] }}
        />
      ),
    },
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableProps = {
    columns,
    tableHeader: `Timetable for ${selectedClassLevel ? classLevelData?.data.find(cl => cl._id === selectedClassLevel)?.name : 'N/A'} ${selectedSubclass || ''}`,
    data: timetables,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  };

  return (
    <Box py="20px">
      <Header title="ADMIN TIMETABLE" subtitle="Manage Class and Subclass Timetables" />
      <Box mb="20px" display="flex" gap="20px" alignItems="center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="class-level-select-label">Class Level</InputLabel>
          <Select
            labelId="class-level-select-label"
            value={selectedClassLevel}
            label="Class Level"
            onChange={(e) => {
              setSelectedClassLevel(e.target.value);
              setSelectedSubclass('');
              setPage(0);
            }}
          >
            {classLevelData?.data?.map((cl) => (
              <MenuItem key={cl._id} value={cl._id}>
                {cl.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="subclass-select-label">Subclass</InputLabel>
          <Select
            labelId="subclass-select-label"
            value={selectedSubclass}
            label="Subclass"
            onChange={(e) => {
              setSelectedSubclass(e.target.value);
              setPage(0);
            }}
            disabled={!selectedClassLevel}
          >
            {classLevelData?.data?.find(cl => cl._id === selectedClassLevel)?.subclasses.map((sub) => (
              <MenuItem key={sub.letter} value={sub.letter}>
                {sub.letter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ActionButton
          content="Add Timetable"
          onClick={() => setAddModalOpen(true)}
          disabled={!selectedClassLevel || !selectedSubclass}
        />
      </Box>
      <Box>
        {timetableLoading ? (
          <Typography>Loading...</Typography>
        ) : timetableError ? (
          <Typography color="error">{timetableError}</Typography>
        ) : timetables.length > 0 ? (
          <TableComponent {...tableProps} />
        ) : (
          <Typography>No timetable available for selected filters.</Typography>
        )}
      </Box>
      <AddTimetableModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setNewSchedule({
            classLevel: '',
            subclassLetter: '',
            subject: '',
            teacher: '',
            dayOfWeek: '',
            startTime: '',
            numberOfPeriods: 1,
            location: '',
          });
        }}
        onConfirm={handleAddSchedule}
        newSchedule={newSchedule}
        setNewSchedule={setNewSchedule}
        classLevelData={classLevelData}
        subjectData={subjectData}
        teacherData={teacherData}
        isLoading={createLoading}
      />
      <EditTimetableModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTimetable(null);
        }}
        onConfirm={handleUpdateSchedule}
        newSchedule={newSchedule}
        setNewSchedule={setNewSchedule}
        classLevelData={classLevelData}
        subjectData={subjectData}
        teacherData={teacherData}
        isLoading={updateLoading}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        title="Timetable Operation"
        message={confirmationMessage}
        isLoading={createLoading || updateLoading}
      />
    </Box>
  );
};

export default Admin;
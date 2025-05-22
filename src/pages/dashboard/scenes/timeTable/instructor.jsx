import React, { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';
import { tokens } from '../../theme';
import useApi from '../../../../hooks/useApi';
import { useSelector } from 'react-redux';
import { endpoints } from '../../../../utils/constants';
import ConfirmationModal from '../../components/confirmationModal';
import CustomIconButton from '../../components/customIconButton';
import EditIcon from '@mui/icons-material/Edit';
import ActionButton from '../../components/actionButton';
 import { AttendanceModal } from './Modals';
 import DeleteIcon from '@mui/icons-material/Delete';
 import VisibilityIcon from '@mui/icons-material/Visibility';


const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ date: '', course: '', time: '', location: '', topic: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [deleteConfirm, setDeleteConfrim] = useState(false);
  const [updateConfirm, setUpdateConfrim] = useState(false)
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  const [timeTableToMark, setTimeTableToMark] = useState('');
  const [openDetailsModal, setOpenDetailsModal] = useState(false); 
  const [isDone, setIsDone] = useState(false); 
  const [isPast, setIsPast] = useState(false); 

  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const postUrl = `${endpoints.TIMETABLE}/${cohortName}`;
console.log(cohortName);
  //handle confirm modal close
  const handleConfirmModalClose = () => {
    if(deleteConfirm === true){
      setDeleteConfrim(false);
    };

    if(updateConfirm === true){
      setUpdateConfrim(false);
    }
  };

  //open mark attendance modal
const openAttendance =  (timeTable)=> {
  setOpenAttendanceModal(true);
  setTimeTableToMark(timeTable);
}

  //close mark attendance modal
  const handleAttendanceModalClose =  (timeTableId)=> {
    setOpenAttendanceModal(false);
  }

  const { loading: postLoading, data: postData, error: postError, callApi: postCallApi } = useApi();
  const { loading: getLoading, error: getError, callApi: getCallApi } = useApi();
  const { loading: putLoading, data: putData, error: putError, callApi: putCallApi } = useApi();
  const { loading: deleteLoading, data: deleteData, error: deleteError, callApi: deleteCallApi } = useApi();
  const { loading: loadDone, data: doneData, error: doneError, callApi: doneApi } = useApi();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (postUrl) {
        const data = await getCallApi(postUrl, 'GET');
        setSchedules(data);
      }
    };

    fetchSchedules();
  }, []);

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'Invalid Date';
  
    const formattedDate = new Date(dateStr).toISOString().split('T')[0];
    const scheduleDateTime = new Date(`${formattedDate}T${timeStr}`);
  
    if (isNaN(scheduleDateTime)) {
      return 'Invalid Date';
    }
  
    return scheduleDateTime; // Return the Date object for comparison
  };
  

  const columns = [
    {
      id: 'date',
      label: 'Date',
      renderCell: (row) => formatDateTime(row.date, row.time).toLocaleDateString(), // Format date for display
    },
    { id: 'time', label: 'Time' },
    { id: 'location', label: 'Location' },
    { id: 'topic', label: 'Topic' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => {
        const scheduleDateTime = formatDateTime(row.date, row.time); // Get the scheduled date and time
        const currentDateTime = new Date(); // Get the current date and time
        
        const Past = scheduleDateTime <= currentDateTime  // Check if the scheduled time is in the past
        const done = row.done;
        setIsDone(done);
        setIsPast(Past);
        return (
          <Box sx={{px:0}}>
              < CustomIconButton
                onClick={() => handleEdit(row)}
                icon= {<EditIcon />}
              />
               <CustomIconButton onClick={() => handleViewDetails(row)} icon={<VisibilityIcon />} />
               <CustomIconButton onClick={() => handleDelete(row)} icon={<DeleteIcon />} />

          </Box>
        );
      },
    },
  ];


  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setFormData({ date: '', course: '', time: '', location: '', topic: '' });
    setEditingSchedule(null);
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setScheduleToDelete(null);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);

    // Set form data to existing values of the selected schedule
    setFormData({
      date: schedule.date || '',
      time: schedule.time || '',
      location: schedule.location || '',
      topic: schedule.topic || '',
      course: schedule.course || '',
    });

    handleOpenEditModal();
  };

  const handleUpdate = async () => {
    if (editingSchedule) {
      const updatedSchedule = {
        date: formData.date,
        time: formData.time,
        location: formData.location,
        topic: formData.topic,
        course: formData.course,
      };

      const response = await putCallApi(`${postUrl}/${editingSchedule.id}`, 'PUT', updatedSchedule);

      // If update is successful, update the schedules state
      if (response) {
        setSchedules((prevSchedules) =>
          prevSchedules.map((schedule) =>
            schedule.id === editingSchedule.id ? { ...schedule, ...updatedSchedule } : schedule
          )
        );
        setUpdateConfrim(true);

      }else{
        setUpdateConfrim(true);

      }

      handleCloseEditModal();
    }
  };

//mark as done
const markAsDone = async () => {
  if (editingSchedule) {
    const updatedSchedule = {
      cohortName,
      entryId: editingSchedule.id
    };

    const response = await doneApi(endpoints.MARK_TIMETABLE, 'PATCH', updatedSchedule);

    // If the API call is successful, update the frontend state (mark as done)
    if (response) {
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule.id === editingSchedule.id ? { ...schedule, done: true } : schedule
        )
      );
      setUpdateConfrim(true);
    } else {
      setUpdateConfrim(true);
    }

    handleCloseEditModal();
  }
};

console.log(doneData)
  const handleViewDetails = (schedule) => {
    setEditingSchedule(schedule);
    setOpenDetailsModal(true); // Open the details modal
  };

  const handleDelete = (schedule) => {
    setScheduleToDelete(schedule);
    handleOpenDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (editingSchedule) {
      const response = await deleteCallApi(`${postUrl}/${editingSchedule.id}`, 'DELETE');

      // If deletion is successful, remove the schedule from the state
      if (response) {
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) => schedule.id !== editingSchedule.id)
        );
      }else{
        setDeleteConfrim(true);
      }

      handleCloseDeleteModal();
      setDeleteConfrim(true);
    }
  };

  const handleSubmit = async () => {
    const newSchedule = {
      date: formData.date,
      time: formData.time,
      location: formData.location,
      topic: formData.topic,
      course: formData.course,
    };

    const response = await postCallApi(postUrl, 'POST', newSchedule);

    // If post is successful, add the new schedule to the state
    if (response) {
      setSchedules(response.timetable);
    }

    handleCloseEditModal();
  };

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
      <Header title="TIME TABLE" subtitle="Overview of Weekly Schedule" />

      <ActionButton 
        onClick={handleOpenEditModal}
        content= 'Add Schedule'
      />
      <TableComponent
        columns={columns}
        data={schedules}
        page={page}
        rowsPerPage={rowsPerPage}
        onSortChange={handleSortChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        hiddenColumnsSmallScreen={['topic', 'location']}

      />

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
        onConfirm={editingSchedule ? handleUpdate : handleSubmit}
        confirmMessage={editingSchedule ? 'Update' : 'Add'}
      >
        <TextField
          fullWidth
          name="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          sx={{ mb: '15px' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          name="time"
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          sx={{ mb: '15px' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          name="location"
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          sx={{ mb: '15px' }}
        />
        <TextField
          fullWidth
          name="topic"
          label="Topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          sx={{ mb: '15px' }}
        />
      </Modal>

            {/* Assignment Details Modal */}
        <Modal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        title="Assignment Details"
        noConfirm
      >
        <Box>
          <p>Topic: {editingSchedule?.topic}</p>
          <p>Date: {editingSchedule?.date}</p>
          <p>Time: {editingSchedule?.time}</p>
          <p>Location: {editingSchedule?.location}</p>
        </Box>
        <ActionButton 
                onClick={() => openAttendance(editingSchedule)}
                content=  'Mark Attendance'
              sx={{width: '120px'}}
            />

             <ActionButton 
              onClick={() => (markAsDone())}
              content= {isDone ? 'Schedule completed' : 'Mark as done'}
              sx={{width: '120px', mx: 1}}
              disable= {isDone}
            />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Delete Schedule"
        onConfirm={handleConfirmDelete}
        confirmMessage="Delete"
      >
        Are you sure you want to delete this schedule?
      </Modal>

      <ConfirmationModal
        open={deleteConfirm || updateConfirm}
        onClose={handleConfirmModalClose}
        title= {deleteConfirm ? "Delete Confirmation" : 'Update confirmation'}
        isLoading= {deleteConfirm ? deleteLoading : putLoading}
        message= {
          deleteConfirm ?
          "Time Table successfully deleted" :
          updateConfirm ? putError :
          deleteConfirm && deleteError ? "Could not update time table, something went wrong" :
          updateConfirm && putError ? "Could not update time table, something went wrong" :
           "something went wrong"
          }

      >
      </ConfirmationModal>

      {/* mark attendance modal */}
      <AttendanceModal 
        openAttendanceModal={openAttendanceModal}
        cohortName={userDetails.cohort}
        timeTable={timeTableToMark}
        handleAttendanceModalClose={handleAttendanceModalClose}
      />
    </Box>
  );
};

export default Instructor;

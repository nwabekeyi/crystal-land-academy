// components/timetable/TimetableModals.js
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import Modal from '../../components/modal';
import ConfirmationModal from '../../components/confirmationModal';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const AddTimetableModal = ({
  open,
  onClose,
  onConfirm,
  newSchedule,
  setNewSchedule,
  classLevelData,
  subjectData,
  teacherData,
  isLoading,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Timetable"
      onConfirm={onConfirm}
      confirmMessage="Add"
      styleProps={{ padding: '20px' }}
      noConfirm={isLoading}
    >
      <Box display="flex" flexDirection="column" gap="16px" mt="10px">
        <FormControl fullWidth>
          <InputLabel id="class-level-modal-label">Class Level</InputLabel>
          <Select
            labelId="class-level-modal-label"
            value={newSchedule.classLevel}
            label="Class Level"
            onChange={(e) => setNewSchedule({ ...newSchedule, classLevel: e.target.value, subclassLetter: '' })}
          >
            {classLevelData?.data?.map((cl) => (
              <MenuItem key={cl._id} value={cl._id}>
                {cl.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="subclass-modal-label">Subclass</InputLabel>
          <Select
            labelId="subclass-modal-label"
            value={newSchedule.subclassLetter}
            label="Subclass"
            onChange={(e) => setNewSchedule({ ...newSchedule, subclassLetter: e.target.value })}
            disabled={!newSchedule.classLevel}
          >
            {classLevelData?.data
              ?.find((cl) => cl._id === newSchedule.classLevel)
              ?.subclasses.map((sub) => (
                <MenuItem key={sub.letter} value={sub.letter}>
                  {sub.letter}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="subject-modal-label">Subject</InputLabel>
          <Select
            labelId="subject-modal-label"
            value={newSchedule.subject}
            label="Subject"
            onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
          >
            {subjectData?.data?.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="teacher-modal-label">Teacher</InputLabel>
          <Select
            labelId="teacher-modal-label"
            value={newSchedule.teacher}
            label="Teacher"
            onChange={(e) => setNewSchedule({ ...newSchedule, teacher: e.target.value })}
          >
            {teacherData?.data?.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.firstName} {t.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="day-modal-label">Day of Week</InputLabel>
          <Select
            labelId="day-modal-label"
            value={newSchedule.dayOfWeek}
            label="Day of Week"
            onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start Time (HH:MM)"
          value={newSchedule.startTime}
          onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
          fullWidth
        />
        <TextField
          label="Number of Periods"
          type="number"
          value={newSchedule.numberOfPeriods}
          onChange={(e) => setNewSchedule({ ...newSchedule, numberOfPeriods: e.target.value })}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Location"
          value={newSchedule.location}
          onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
          fullWidth
        />
      </Box>
    </Modal>
  );
};

const EditTimetableModal = ({
  open,
  onClose,
  onConfirm,
  newSchedule,
  setNewSchedule,
  classLevelData,
  subjectData,
  teacherData,
  isLoading,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Timetable"
      onConfirm={onConfirm}
      confirmMessage="Update"
      styleProps={{ padding: '20px' }}
      noConfirm={isLoading}
    >
      <Box display="flex" flexDirection="column" gap="16px" mt="10px">
        <FormControl fullWidth>
          <InputLabel id="class-level-modal-label">Class Level</InputLabel>
          <Select
            labelId="class-level-modal-label"
            value={newSchedule.classLevel}
            label="Class Level"
            onChange={(e) => setNewSchedule({ ...newSchedule, classLevel: e.target.value, subclassLetter: '' })}
          >
            {classLevelData?.data?.map((cl) => (
              <MenuItem key={cl._id} value={cl._id}>
                {cl.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="subclass-modal-label">Subclass</InputLabel>
          <Select
            labelId="subclass-modal-label"
            value={newSchedule.subclassLetter}
            label="Subclass"
            onChange={(e) => setNewSchedule({ ...newSchedule, subclassLetter: e.target.value })}
            disabled={!newSchedule.classLevel}
          >
            {classLevelData?.data
              ?.find((cl) => cl._id === newSchedule.classLevel)
              ?.subclasses.map((sub) => (
                <MenuItem key={sub.letter} value={sub.letter}>
                  {sub.letter}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="subject-modal-label">Subject</InputLabel>
          <Select
            labelId="subject-modal-label"
            value={newSchedule.subject}
            label="Subject"
            onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
          >
            {subjectData?.data?.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="teacher-modal-label">Teacher</InputLabel>
          <Select
            labelId="teacher-modal-label"
            value={newSchedule.teacher}
            label="Teacher"
            onChange={(e) => setNewSchedule({ ...newSchedule, teacher: e.target.value })}
          >
            {teacherData?.data?.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.firstName} {t.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="day-modal-label">Day of Week</InputLabel>
          <Select
            labelId="day-modal-label"
            value={newSchedule.dayOfWeek}
            label="Day of Week"
            onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start Time (HH:MM)"
          value={newSchedule.startTime}
          onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
          fullWidth
        />
        <TextField
          label="Number of Periods"
          type="number"
          value={newSchedule.numberOfPeriods}
          onChange={(e) => setNewSchedule({ ...newSchedule, numberOfPeriods: e.target.value })}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Location"
          value={newSchedule.location}
          onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
          fullWidth
        />
      </Box>
    </Modal>
  );
};

const AttendanceModal = ({
  open,
  onClose,
  onConfirm,
  attendanceChanges,
  handleAttendanceChange,
  studentData,
  isLoading,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mark Attendance"
      onConfirm={onConfirm}
      confirmMessage="Confirm"
      styleProps={{ padding: '20px' }}
      noConfirm={isLoading}
    >
      <Box display="flex" flexDirection="column" gap="16px" mt="10px">
        {studentData?.data?.map((student) => (
          <Box
            key={student._id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>
              {student.firstName} {student.lastName}
            </Typography>
            <FormControl sx={{ minWidth: 100 }}>
              <Select
                value={attendanceChanges[student._id] || 'Absent'}
                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Excused">Excused</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>
    </Modal>
  );
};

export { AddTimetableModal, EditTimetableModal, AttendanceModal, ConfirmationModal };
// src/components/ClassManagementModals.jsx
import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import Modal from '../../components/modal';
import CustomIconButton from '../../components/customIconButton';
import ActionButton from '../../components/actionButton';
import { FaPlus, FaEdit, FaCalendarAlt, FaEye } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';

export const ClassModal = ({
  open,
  onClose,
  title,
  modalMode,
  setModal,
  formData,
  handleFormChange,
  handleFeesChange,
  handleSubclassFeesChange,
  addTermFee,
  removeTermFee,
  addSubclassTermFee,
  removeSubclassTermFee,
  openTimetableModal,
  setStudentsModalOpen,
  setTeachersModalOpen,
  setFeesModalOpen,
  handleSubmit,
  error,
  loadingSubmit,
  academicYears,
  colors,
  theme,
}) => {
  const isViewMode = modalMode === 'view';
  const isDeleteMode = modalMode === 'delete';

  // Debug log to confirm props
  React.useEffect(() => {
    console.log('ClassModal props:', { modalMode, setModal: typeof setModal });
  }, [modalMode, setModal]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onConfirm={handleSubmit}
      confirmMessage={isDeleteMode ? 'Delete' : 'Save'}
      noConfirm={isViewMode}
      styleProps={{ padding: theme.spacing(3) }}
    >
      {isDeleteMode ? (
        <Typography>Are you sure you want to delete this class level?</Typography>
      ) : (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isViewMode && (
            <ActionButton
              icon={<FaEdit />}
              content="Edit"
              onClick={() => {
                if (typeof setModal === 'function') {
                  setModal('edit');
                } else {
                  console.error('setModal is not a function');
                }
              }}
              sx={{ alignSelf: 'flex-start', mb: 2 }}
            />
          )}
          <Select
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleFormChange}
            fullWidth
            disabled={isViewMode}
            required
          >
            <MenuItem value="Primary">Primary</MenuItem>
            <MenuItem value="Secondary">Secondary</MenuItem>
          </Select>
          <TextField
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            disabled={isViewMode}
            required
          />
          <Select
            label="Academic Year"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleFormChange}
            fullWidth
            disabled={isViewMode}
            required
          >
            {academicYears.map(year => (
              <MenuItem key={year._id} value={year._id}>
                {year.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            disabled={isViewMode}
            multiline
            rows={3}
          />
          <Typography variant="h6">Class Fees Per Term</Typography>
          {formData.feesPerTerm.map((fee, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Term Name"
                value={fee.termName}
                onChange={e => handleFeesChange(index, 'termName', e.target.value)}
                disabled={isViewMode}
                required
              />
              <TextField
                label="Amount"
                type="number"
                value={fee.amount}
                onChange={e => handleFeesChange(index, 'amount', parseFloat(e.target.value))}
                disabled={isViewMode}
                required
              />
              <TextField
                label="Description"
                value={fee.description}
                onChange={e => handleFeesChange(index, 'description', e.target.value)}
                disabled={isViewMode}
              />
              {!isViewMode && (
                <CustomIconButton
                  icon={<DeleteIcon />}
                  title="Remove Term Fee"
                  onClick={() => removeTermFee(index)}
                  disabled={formData.feesPerTerm.length === 1}
                />
              )}
            </Box>
          ))}
          {!isViewMode && (
            <CustomIconButton
              icon={<FaPlus />}
              title="Add Term Fee"
              onClick={addTermFee}
              sx={{ alignSelf: 'flex-start' }}
            />
          )}
          <Typography variant="h6">Subclasses</Typography>
          {formData.subclasses.map((subclass, subIndex) => (
            <Box key={subIndex} sx={{ border: `1px solid ${colors.grey[500]}`, p: 2, mb: 2 }}>
              <Typography variant="subtitle1">Subclass {subclass.letter}</Typography>
              <Typography variant="subtitle2">Fees Per Term</Typography>
              {subclass.feesPerTerm.map((fee, feeIndex) => (
                <Box key={feeIndex} sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                  <TextField
                    label="Term Name"
                    value={fee.termName}
                    onChange={e => handleSubclassFeesChange(subIndex, feeIndex, 'termName', e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={fee.amount}
                    onChange={e => handleSubclassFeesChange(subIndex, feeIndex, 'amount', parseFloat(e.target.value))}
                    disabled={isViewMode}
                    required
                  />
                  <TextField
                    label="Description"
                    value={fee.description}
                    onChange={e => handleSubclassFeesChange(subIndex, feeIndex, 'description', e.target.value)}
                    disabled={isViewMode}
                  />
                  {!isViewMode && (
                    <CustomIconButton
                      icon={<DeleteIcon />}
                      title="Remove Term Fee"
                      onClick={() => removeSubclassTermFee(subIndex, feeIndex)}
                      disabled={subclass.feesPerTerm.length === 1}
                    />
                  )}
                </Box>
              ))}
              {!isViewMode && (
                <CustomIconButton
                  icon={<FaPlus />}
                  title="Add Subclass Term Fee"
                  onClick={() => addSubclassTermFee(subIndex)}
                  sx={{ mt: 1 }}
                />
              )}
              <ActionButton
                icon={<FaCalendarAlt />}
                content="View Timetable"
                onClick={() => openTimetableModal('view', subclass)}
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          {isViewMode && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <ActionButton
                icon={<FaEye />}
                content="View Students"
                onClick={() => setStudentsModalOpen(true)}
                sx={{ mx: 0.5 }}
              />
              <ActionButton
                icon={<FaEye />}
                content="View Teachers"
                onClick={() => setTeachersModalOpen(true)}
                sx={{ mx: 0.5 }}
              />
              <ActionButton
                icon={<FaEye />}
                content="View Fees"
                onClick={() => setFeesModalOpen(true)}
                sx={{ mx: 0.5 }}
              />
            </Box>
          )}
          {error && <Typography color="error">{error}</Typography>}
          {loadingSubmit && <Typography>Processing...</Typography>}
        </Box>
      )}
    </Modal>
  );
};

// Other modals (StudentsModal, TeachersModal, TimetableModal, FeesModal) remain unchanged
export const StudentsModal = ({ open, onClose, students, theme }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Students"
    noConfirm
    styleProps={{ padding: theme.spacing(3) }}
  >
    {students.length > 0 ? (
      <List>
        {students.map(student => (
          <ListItem key={student._id}>
            <ListItemText
              primary={`${student.firstName} ${student.lastName}`}
              secondary={`Email: ${student.email}${student.phone ? ` | Phone: ${student.phone}` : ''}`}
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>No students assigned to this class.</Typography>
    )}
  </Modal>
);

export const TeachersModal = ({ open, onClose, teachers, theme }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Teachers"
    noConfirm
    styleProps={{ padding: theme.spacing(3) }}
  >
    {teachers.length > 0 ? (
      <List>
        {teachers.map(teacher => (
          <ListItem key={teacher._id}>
            <ListItemText
              primary={`${teacher.firstName} ${teacher.lastName}`}
              secondary={`Email: ${teacher.email}${teacher.phone ? ` | Phone: ${teacher.phone}` : ''}`}
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>No teachers assigned to this class.</Typography>
    )}
  </Modal>
);

export const TimetableModal = ({
  open,
  onClose,
  title,
  timetableMode,
  selectedSubclass,
  handleTimetableChange,
  addTimetableEntry,
  removeTimetableEntry,
  setTimetableMode,
  handleSubmit,
  error,
  theme,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    onConfirm={timetableMode === 'edit' ? handleSubmit : null}
    confirmMessage="Save"
    noConfirm={timetableMode === 'view'}
    styleProps={{ padding: theme.spacing(3) }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {timetableMode === 'view' && (
        <ActionButton
          icon={<FaEdit />}
          content="Edit Timetable"
          onClick={() => setTimetableMode('edit')}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        />
      )}
      {selectedSubclass?.timetables.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            label="Day"
            value={entry.day}
            onChange={e => handleTimetableChange(index, 'day', e.target.value, selectedSubclass.letter)}
            disabled={timetableMode === 'view'}
            required
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <MenuItem key={day} value={day}>{day}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Start Time"
            type="time"
            value={entry.startTime}
            onChange={e => handleTimetableChange(index, 'startTime', e.target.value, selectedSubclass.letter)}
            disabled={timetableMode === 'view'}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            type="time"
            value={entry.endTime}
            onChange={e => handleTimetableChange(index, 'endTime', e.target.value, selectedSubclass.letter)}
            disabled={timetableMode === 'view'}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Subject"
            value={entry.subject}
            onChange={e => handleTimetableChange(index, 'subject', e.target.value, selectedSubclass.letter)}
            disabled={timetableMode === 'view'}
            required
          />
          {timetableMode === 'edit' && (
            <CustomIconButton
              icon={<DeleteIcon />}
              title="Remove Timetable Entry"
              onClick={() => removeTimetableEntry(index, selectedSubclass.letter)}
              disabled={selectedSubclass.timetables.length === 1}
            />
          )}
        </Box>
      ))}
      {timetableMode === 'edit' && (
        <CustomIconButton
          icon={<FaPlus />}
          title="Add Timetable Entry"
          onClick={() => addTimetableEntry(selectedSubclass.letter)}
          sx={{ alignSelf: 'flex-start' }}
        />
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  </Modal>
);

export const FeesModal = ({
  open,
  onClose,
  formData,
  handleFeesChange,
  handleSubclassFeesChange,
  addTermFee,
  removeTermFee,
  addSubclassTermFee,
  removeSubclassTermFee,
  handleSubmit,
  isViewMode,
  setIsViewMode,
  error,
  colors,
  theme,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="View/Edit Fees"
    onConfirm={handleSubmit}
    confirmMessage="Save"
    noConfirm={isViewMode}
    styleProps={{ padding: theme.spacing(3) }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {isViewMode && (
        <ActionButton
          icon={<FaEdit />}
          content="Edit Fees"
          onClick={() => setIsViewMode(false)}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        />
      )}
      <Typography variant="h6">Class Fees Per Term</Typography>
      {formData.feesPerTerm.map((fee, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Term Name"
            value={fee.termName}
            onChange={e => handleFeesChange(index, 'termName', e.target.value)}
            disabled={isViewMode}
            required
          />
          <TextField
            label="Amount"
            type="number"
            value={fee.amount}
            onChange={e => handleFeesChange(index, 'amount', parseFloat(e.target.value))}
            disabled={isViewMode}
            required
          />
          <TextField
            label="Description"
            value={fee.description}
            onChange={e => handleFeesChange(index, 'description', e.target.value)}
            disabled={isViewMode}
          />
          {!isViewMode && (
            <CustomIconButton
              icon={<DeleteIcon />}
              title="Remove Term Fee"
              onClick={() => removeTermFee(index)}
              disabled={formData.feesPerTerm.length === 1}
            />
          )}
        </Box>
      ))}
      {!isViewMode && (
        <CustomIconButton
          icon={<FaPlus />}
          title="Add Term Fee"
          onClick={addTermFee}
          sx={{ alignSelf: 'flex-start' }}
        />
      )}
      {formData.subclasses.map((subclass, subIndex) => (
        <Box key={subIndex} sx={{ border: `1px solid ${colors.grey[500]}`, p: 2, mt: 2 }}>
          <Typography variant="subtitle1">Subclass {subclass.letter} Fees</Typography>
          {subclass.feesPerTerm.map((fee, feeIndex) => (
            <Box key={feeIndex} sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
              <TextField
                label="Term Name"
                value={fee.termName}
                onChange={e => handleSubclassFeesChange(subIndex, feeIndex, 'termName', e.target.value)}
                disabled={isViewMode}
                required
              />
              <TextField
                label="Amount"
                type="number"
                value={fee.amount}
                onChange={e => handleSubclassFeesChange(subIndex, feeIndex, 'amount', parseFloat(e.target.value))}
                disabled={isViewMode}
                required
              />
              <TextField
                label="Description"
                value={fee.description}
                onChange={e => handleSubclassFeesChange(subIndex, feeIndex, 'description', e.target.value)}
                disabled={isViewMode}
              />
              {!isViewMode && (
                <CustomIconButton
                  icon={<DeleteIcon />}
                  title="Remove Term Fee"
                  onClick={() => removeSubclassTermFee(subIndex, feeIndex)}
                  disabled={subclass.feesPerTerm.length === 1}
                />
              )}
            </Box>
          ))}
          {!isViewMode && (
            <CustomIconButton
              icon={<FaPlus />}
              title="Add Subclass Term Fee"
              onClick={() => addSubclassTermFee(subIndex)}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      ))}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  </Modal>
);
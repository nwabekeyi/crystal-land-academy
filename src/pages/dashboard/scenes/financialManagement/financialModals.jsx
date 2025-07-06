import React, { useState } from 'react';
import { Typography, TextField, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';
import Modal from '../../components/modal';

export const EditModal = ({ open, onClose, onSave, record, title = "Edit Record" }) => {
  const [formData, setFormData] = useState(record || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onConfirm={handleSubmit}
      confirmMessage="Save"
      styleProps={{ padding: '20px' }}
    >
      <Typography>ID: {record?.id || 'N/A'}</Typography>
      <TextField
        label={record?.category ? 'Category' : 'Source'}
        name={record?.category ? 'category' : 'source'}
        value={formData.category || formData.source || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Amount"
        name="amount"
        value={formData.amount || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        label="Date"
        name="date"
        value={formData.date || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="date"
      />
      {formData.description !== undefined && (
        <TextField
          label="Description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      )}
    </Modal>
  );
};

export const PayFeesModal = ({ open, onClose, onSave, record, students = [], classLevels = [], terms = [], academicYears = [] }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    classLevelId: '',
    class: '',
    termId: '',
    termName: '',
    academicYearId: '',
    academicYear: '',
    amountPaid: '',
    datePaid: '',
    method: '',
    reference: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pay Student Fees"
      onConfirm={handleSubmit}
      confirmMessage="Save Payment"
      styleProps={{ padding: '20px' }}
    >
      <TextField
        label="Student"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
        SelectProps={{ native: true }}
        required
      >
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student._id} value={student._id}>
            {`${student.firstName} ${student.lastName}`}
          </option>
        ))}
      </TextField>
      <TextField
        label="Class"
        name="classLevelId"
        value={formData.classLevelId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
        SelectProps={{ native: true }}
        required
      >
        <option value="">Select Class</option>
        {classLevels.map((classLevel) => (
          <option key={classLevel._id} value={classLevel._id}>
            {classLevel.name}
          </option>
        ))}
      </TextField>
      <TextField
        label="Term"
        name="termId"
        value={formData.termId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
        SelectProps={{ native: true }}
        required
      >
        <option value="">Select Term</option>
        {terms.map((term) => (
          <option key={term._id} value={term._id}>
            {term.name}
          </option>
        ))}
      </TextField>
      <TextField
        label="Academic Year"
        name="academicYearId"
        value={formData.academicYearId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
        SelectProps={{ native: true }}
        required
      >
        <option value="">Select Academic Year</option>
        {academicYears.map((year) => (
          <option key={year._id} value={year._id}>
            {year.name}
          </option>
        ))}
      </TextField>
      <TextField
        label="Amount Paid"
        name="amountPaid"
        value={formData.amountPaid}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
      />
      <TextField
        label="Date Paid"
        name="datePaid"
        value={formData.datePaid}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="date"
        required
      />
      <TextField
        label="Payment Method"
        name="method"
        value={formData.method}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
        SelectProps={{ native: true }}
      >
        <option value="">Select Method</option>
        <option value="Cash">Cash</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Cheque">Cheque</option>
      </TextField>
      <TextField
        label="Reference"
        name="reference"
        value={formData.reference}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Modal>
  );
};

export const AddRevenueModal = ({ open, onClose, onSave, record, title = "Add Revenue" }) => {
  const [formData, setFormData] = useState(record || { source: '', amount: '', date: '', description: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onConfirm={handleSubmit}
      confirmMessage="Save Revenue"
      styleProps={{ padding: '20px' }}
    >
      <TextField
        label="Source"
        name="source"
        value={formData.source}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Amount"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
      />
      <TextField
        label="Date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="date"
        required
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Modal>
  );
};

export const DeleteModal = ({ open, onClose, onConfirm, record }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      onConfirm={onConfirm}
      confirmMessage="Delete"
      styleProps={{ padding: '20px' }}
    >
      <Typography>
        Are you sure you want to delete this record? {record?.id && `ID: ${record.id}`}
      </Typography>
    </Modal>
  );
};

export const ViewDetailsModal = ({ open, onClose, record }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Details"
      noConfirm
      styleProps={{ padding: '20px' }}
    >
      <Typography>Student Name: {record?.studentName || 'N/A'}</Typography>
      <Typography>Class/Source/Category: {record?.class || record?.source || record?.category || 'N/A'}</Typography>
      {record?.termName && <Typography>Term: {record.termName || 'N/A'}</Typography>}
      <Typography>
        Amount/Fees Paid: {typeof (record?.feesPaid || record?.amount) === 'number'
          ? `₦${(record?.feesPaid || record?.amount).toLocaleString()}`
          : 'N/A'}
      </Typography>
      <Typography>Date: {record?.date || 'N/A'}</Typography>
      {record?.academicYear && <Typography>Academic Year: {record.academicYear || 'N/A'}</Typography>}
      {record?.method && <Typography>Payment Method: {record.method || 'N/A'}</Typography>}
      {record?.reference && <Typography>Reference: {record.reference || 'N/A'}</Typography>}
      {record?.description && <Typography>Description: {record.description || 'N/A'}</Typography>}
    </Modal>
  );
};

export const ActionButtons = ({ onEdit, onDelete, onView, onPayFees, record, isPayment }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {!isPayment && (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(record)}
            sx={{ textTransform: 'none' }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(record)}
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </>
      )}
      <Button
        variant="contained"
        color="info"
        size="small"
        startIcon={<VisibilityIcon />}
        onClick={() => onView(record)}
        sx={{ textTransform: 'none' }}
      >
        View
      </Button>
    </div>
  );
};
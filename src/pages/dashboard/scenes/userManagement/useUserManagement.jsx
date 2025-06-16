import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Typography } from '@mui/material';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { deleteUser } from '../../../../reduxStore/slices/adminDataSlice';

const useUserManagement = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.adminData.usersData || {});
  const { students = [], teachers = [], admins = [] } = usersData; // Default to empty arrays

  // Debug: Log students data to verify studentId
  console.log('Teachers data:', teachers);

  const findUserInStore = (id, role) => {
    if (role === 'student') {
      return students.find((student) => student.studentId === id);
    } else if (role === 'teacher') {
      return teachers.find((teacher) => teacher.teacherId === id);
    } else if (role === 'admin') {
      return admins.find((admin) => admin._id === id);
    }
    return null;
  };

  const [selectedRole, setSelectedRole] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserDetailsState, setEditUserDetailsState] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [viewUserDetails, setViewUserDetails] = useState(false);
  const { callApi: callDeleteApi, loading: deleteLoading, data: deleteData, error: deleteError } = useApi();
  const { callApi: callUpdateApi, loading: updateLoading, error: updateError } = useApi();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rerender, setRerender] = useState(false);

  // Role select
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSignUpDialogOpen(true);
  };

  useEffect(() => {
    setRerender(!rerender);
  }, [editDialogOpen, signUpDialogOpen]);

  // Sort table columns
  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open delete confirmation modal
  const handleDeleteOpen = (user) => {
    const foundUser = findUserInStore(user.id, user.role);
    if (foundUser) {
      sessionStorage.setItem('selectedUser', JSON.stringify({ ...foundUser, role: user.role }));
      setEditUserDetailsState(foundUser);
      setOpenDeleteModal(true);
    }
  };

  // Open edit user dialog
  const handleEdit = (user) => {
    const foundUser = findUserInStore(user.id, user.role);
    if (foundUser) {
      sessionStorage.setItem('selectedUser', JSON.stringify({ ...foundUser, role: user.role }));
      setEditUserDetailsState(foundUser);
      setEditDialogOpen(true);
    }
  };

  // Close confirmation modal
  const handleConfirmationModalClose = () => {
    setConfirmModalOpen(false);
  };

  const handleDelete = async () => {
    const selectedUserInStore = JSON.parse(sessionStorage.getItem('selectedUser'));
    if (!selectedUserInStore) return;

    try {
      const body = {
        id: selectedUserInStore.studentId || selectedUserInStore.teacherId || selectedUserInStore._id,
        role: selectedUserInStore.role,
      };

      await callDeleteApi(endpoints.USER, 'DELETE', body);

      if (deleteData) {
        dispatch(deleteUser({ id: body.id, role: body.role }));
        sessionStorage.removeItem('selectedUser');
        sessionStorage.setItem('confirmModal', 'true');
        setOpenDeleteModal(false);
        setSelectedUser(null);
        setRerender(!rerender);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      sessionStorage.setItem('confirmModal', 'true');
      setRerender(!rerender);
    }
  };

  const columns = [
    { id: 'sn', label: 'S/N', width: 90 },
    {
      id: 'id',
      label: 'ID',
      width: 100,
      renderCell: (row) => (
        <Typography>
          {row.role === 'student'
            ? String(row.id) // Force string to prevent date parsing
            : row.role === 'teacher'
            ? String(row.id)
            : String(row.id)}
        </Typography>
      ),
    },
    { id: 'name', label: 'Name', flex: 1 },
    { id: 'email', label: 'Email', flex: 1 },
    {
      id: 'details',
      label: 'Details',
      flex: 1,
      renderCell: (row) =>
        row.role === 'student'
          ? `${row.classLevel || 'N/A'} (${row.boardingStatus || 'N/A'})`
          : row.role === 'teacher'
          ? row.subject || 'N/A'
          : 'Admin',
    },
    { id: 'createdAt', label: 'Registered Date', flex: 1 },
    {
      id: 'actions',
      label: 'Actions',
      width: 200,
      renderCell: (row) => (
        <div style={{ display: 'flex' }}>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteOpen(row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => { setSelectedUser(row); setViewUserDetails(true); }}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const studentData = Array.isArray(students)
    ? students.map((user, index) => {
        console.log('Student:', user); // Debug each student object
        return {
          id: user.studentId ?? 'N/A',
          sn: index + 1,
          role: 'student',
          name: `${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`,
          email: user.email || 'N/A',
          classLevel: user.currentClassLevel
            ? `${user.currentClassLevel.className} ${user.currentClassLevel.subclass}`
            : 'N/A',
          boardingStatus: user.boardingStatus || 'N/A',
          createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        };
      }).sort((a, b) => a.sn - b.sn)
    : [];

  const teacherData = Array.isArray(teachers)
    ? teachers.map((user, index) => ({
        id: user.teacherId || 'N/A',
        sn: index + 1,
        role: 'teacher',
        name: `${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`,
        email: user.email || 'N/A',
        subject: user.subject?.name || 'N/A', // Assuming subject is populated
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      })).sort((a, b) => a.sn - b.sn)
    : [];

  const adminData = Array.isArray(admins)
    ? admins.map((user, index) => ({
        id: user._id || 'N/A',
        sn: index + 1,
        role: 'admin',
        name: `${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`,
        email: user.email || 'N/A',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      })).sort((a, b) => a.sn - b.sn)
    : [];

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
    setPage(0); // Reset page when switching tabs
  };

  return {
    studentData,
    teacherData,
    adminData,
    selectedRole,
    setSelectedRole,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    selectedUser,
    setSelectedUser,
    editUserDetailsState,
    openDeleteModal,
    setOpenDeleteModal,
    editDialogOpen,
    setEditDialogOpen,
    signUpDialogOpen,
    setSignUpDialogOpen,
    viewUserDetails,
    setViewUserDetails,
    confirmModalOpen,
    setConfirmModalOpen,
    handleRoleSelect,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEdit,
    handleDelete,
    handleConfirmationModalClose,
    columns,
    tabIndex,
    handleTabChange,
    loading: deleteLoading || updateLoading,
    deleteError,
    updateError,
    rerender,
  };
};

export default useUserManagement;
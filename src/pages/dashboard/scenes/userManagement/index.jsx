import React, { useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpTeacher, SignUpAdmin } from '../../../signUp';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useUserManagement from './useUserManagement';
import ScrollDialog from '../../components/scrollDialog';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import { DeleteModal, EditFormModal } from './modals';

const UserManagement = () => {
  const {
    selectedUser,
    editDialogOpen,
    studentData,
    teacherData,
    adminData,
    selectedRole,
    setSelectedRole,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    setEditDialogOpen,
    signUpDialogOpen,
    setSignUpDialogOpen,
    handleRoleSelect,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEdit,
    columns,
    tabIndex,
    handleTabChange,
    viewUserDetails,
    setViewUserDetails,
    openDeleteModal,
    setOpenDeleteModal,
    rerender,
  } = useUserManagement();

  useEffect(() => {
    if (selectedUser) {
      setViewUserDetails(true);
    }
  }, [selectedUser]);

  return (
    <Box>
      <Header title='User Management' subtitle='Manage users' />

      <Dropdown
        label='Add Users'
        options={[
          { value: 'student', label: 'Student' },
          { value: 'teacher', label: 'Teacher' },
          { value: 'admin', label: 'Admin' },
        ]}
        onSelect={handleRoleSelect}
      />

      <Box mt={2}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label='Students' />
          <Tab label='Teachers' />
          <Tab label='Admins' />
        </Tabs>
      </Box>

      {/* Tab Content for Students */}
      {tabIndex === 0 && (
        <Box m='20px 0 0 0' height='75vh'>
          <TableComponent
            columns={columns}
            tableHeader='Student Management'
            data={studentData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('student')}
            hiddenColumnsSmallScreen={['email', 'createdAt']}
            hiddenColumnsTabScreen={['createdAt', 'details']}
          />
        </Box>
      )}

      {/* Tab Content for Teachers */}
      {tabIndex === 1 && (
        <Box m='20px 0 0 0' height='75vh'>
          <TableComponent
            columns={columns}
            tableHeader='Teacher Management'
            data={teacherData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('teacher')}
            hiddenColumnsSmallScreen={['email', 'createdAt']}
            hiddenColumnsTabScreen={['createdAt', 'details']}
          />
        </Box>
      )}

      {/* Tab Content for Admins */}
      {tabIndex === 2 && (
        <Box m='20px 0 0 0' height='75vh'>
          <TableComponent
            columns={columns}
            tableHeader='Admin Management'
            data={adminData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('admin')}
            hiddenColumnsSmallScreen={['email', 'createdAt']}
            hiddenColumnsTabScreen={['createdAt', 'details']}
          />
        </Box>
      )}

      {/* User Details View */}
      {viewUserDetails && selectedUser && (
        <ScrollDialog
          buttonLabel='View User Details'
          dialogTitle='User Details'
          dialogContent={
            <>
              <Typography>ID: {selectedUser.id}</Typography>
              <Typography>Name: {`${selectedUser.name}`}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              {selectedUser.role === 'student' && (
                <>
                  <Typography>Class: {selectedUser.classLevel}</Typography>
                  <Typography>Boarding Status: {selectedUser.boardingStatus}</Typography>
                </>
              )}
              {selectedUser.role === 'teacher' && (
                <Typography>Subject: {selectedUser.subject}</Typography>
              )}
              <Typography>Role: {selectedUser.role}</Typography>
              <Typography>Registered Date: {selectedUser.createdAt}</Typography>
            </>
          }
          scrollType='paper'
          actionText1='Close'
          actionText2='Edit'
          open={viewUserDetails}
          onClose={() => setViewUserDetails(false)}
          onAction2={() => handleEdit(selectedUser)}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />

      {/* Edit User Form */}
      <EditFormModal
        selectedRole={selectedRole}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        handleEdit={handleEdit}
        rerender={rerender}
      />

      {/* Sign Up User Dialog */}
      <ScrollDialog
        buttonLabel='Sign Up'
        dialogTitle='Sign Up User'
        dialogContent={
          selectedRole === 'student' ? (
            <SignUpStudent />
          ) : selectedRole === 'teacher' ? (
            <SignUpTeacher />
          ) : selectedRole === 'admin' ? (
            <SignUpAdmin />
          ) : null
        }
        scrollType='body'
        actionText1='Cancel'
        actionText2='Confirm'
        open={signUpDialogOpen}
        onClose={() => setSignUpDialogOpen(false)}
      />
    </Box>
  );
};

export default withDashboardWrapper(UserManagement);
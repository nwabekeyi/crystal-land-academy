import React, { useEffect } from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpTeacher, SignUpAdmin } from '../../../signUp';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useUserManagement from './useUserManagement';
import ScrollDialog from '../../components/scrollDialog';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import { DeleteModal, EditFormModal, WithdrawModal } from './modals';

const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    selectedUser,
    editDialogOpen,
    studentData,
    withdrawnStudentData,
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
    withdrawModalOpen,
    setWithdrawModalOpen,
    handleWithdraw,
    handleWithdrawOpen,
    handleWithdrawClose,
    editUserDetailsState,
    rerender,
    studentSections,
    selectedStudentSection,
    setSelectedStudentSection,
  } = useUserManagement();

  useEffect(() => {
    if (selectedUser) {
      setViewUserDetails(true);
    }
  }, [selectedUser, setViewUserDetails]);

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
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="user role tabs"
          sx={{
            backgroundColor: colors.primary[400],
            '& .MuiTabs-indicator': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <Tab
            label='Students'
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
          <Tab
            label='Withdrawn Students'
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
          <Tab
            label='Teachers'
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
          <Tab
            label='Admins'
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
        </Tabs>
      </Box>

      {/* Tab Content for Students */}
      {tabIndex === 0 && (
        <Box m='20px 0 0 0' height='75vh'>
          <Tabs
            value={selectedStudentSection}
            onChange={(event, newValue) => setSelectedStudentSection(newValue)}
            aria-label="student section tabs"
            sx={{
              backgroundColor: colors.primary[400],
              '& .MuiTabs-indicator': {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            {studentSections.map((section) => (
              <Tab
                key={section}
                label={section}
                value={section}
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

      {/* Tab Content for Withdrawn Students */}
      {tabIndex === 1 && (
        <Box m='20px 0 0 0' height='75vh'>
          <Tabs
            value={selectedStudentSection}
            onChange={(event, newValue) => setSelectedStudentSection(newValue)}
            aria-label="withdrawn student section tabs"
            sx={{
              backgroundColor: colors.primary[400],
              '& .MuiTabs-indicator': {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            {studentSections.map((section) => (
              <Tab
                key={section}
                label={section}
                value={section}
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
          <TableComponent
            columns={columns}
            tableHeader='Withdrawn Student Management'
            data={withdrawnStudentData}
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
      {tabIndex === 2 && (
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
      {tabIndex === 3 && (
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
                  <Typography>Withdrawn: {selectedUser.isWithdrawn ? 'Yes' : 'No'}</Typography>
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
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        open={withdrawModalOpen}
        onClose={handleWithdrawClose}
        onConfirm={handleWithdraw}
        userName={editUserDetailsState ? `${editUserDetailsState.firstName} ${editUserDetailsState.lastName}` : ''}
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
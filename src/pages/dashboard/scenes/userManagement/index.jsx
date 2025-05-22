import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography, Tabs, Tab } from "@mui/material";
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpInstructor, SignUpAdmin } from '../../../signUp';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from "../../../../components/table";
import useUserManagement from './useUserManagement';
import ScrollDialog from '../../components/scrollDialog'; // Importing the ScrollDialog component
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import { DeleteModal, EditFormModal} from './modals';

const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    instructors,
    studentData,
    instructorData,
    selectedRole,
    setSelectedRole,
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    selectedUser,
    setConfirmDialogOpen,
    editDialogOpen,
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
     rerender
  } = useUserManagement();

  // Ensure the dialogs open when the selectedUser is set
  useEffect(() => {
    if (selectedUser) {
      setViewUserDetails(true); // If there's a selected user, open the dialog.
    }
  }, [selectedUser]);

  return (
    <Box>
      <Header title="User Management" subtitle="Manage users" />

      <Dropdown
        label="Add Users"
        options={[
          { value: "student", label: "Student" },
          { value: "instructor", label: "Instructor" },
          { value: "admin", label: "Admin" },
        ]}
        onSelect={handleRoleSelect}
      />

      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Students" />
          <Tab label="Instructors" />
          <Tab label="Offline Students" />
        </Tabs>
      </Box>

      {/* Tab Content for Students */}
      {tabIndex === 0 && (
        <Box m="20px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="User Management"
            data={studentData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('student')}
            hiddenColumnsSmallScreen={[ 'phoneNumber', 'registeredDate', 'userId']}
            hiddenColumnsTabScreen={[ 'registeredDate', 'program', 'userId']}

            />
        </Box>
      )}

      {/* Tab Content for Instructors */}
      {tabIndex === 1 && (
        <Box m="20px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="User Management"
            data={instructorData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={() => setSelectedRole('instructor')}
            hiddenColumnsSmallScreen={[ 'phoneNumber', 'registeredDate', 'userId']}
            hiddenColumnsTabScreen={[ 'registeredDate',  'userId']}
          />
        </Box>
      )}

      {/* Tab Content for Offline Students */}
      {tabIndex === 2 && (
        <TableComponent
          columns={columns}
          tableHeader="User Management"
          data={formattedOfflineStudents}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}

      {/* User Details View */}
      {viewUserDetails && (
        <ScrollDialog
          buttonLabel="View User Details"
          dialogTitle="User Details"
          dialogContent={
            <>
              <Typography>User ID: {selectedUser.userId}</Typography>
              <Typography>Name: {`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Phone Number: {selectedUser.phoneNumber}</Typography>
              <Typography>Role: {selectedUser.role}</Typography>
              <Typography>Program: {selectedUser.program}</Typography>
              <Typography>Registered Date: {selectedUser.createdAt || "N/A"}</Typography>
            </>
          }
          scrollType="paper"
          actionText1="Close"
          actionText2="Edit"
          open={viewUserDetails}
          onClose={() => setViewUserDetails(false)}
        />
      )}

      {/* delete modal */}
      <DeleteModal 
        open={openDeleteModal} 
        onClose={() => setOpenDeleteModal(false) }
         />

      {/* Edit User Form */}
      <EditFormModal
        selectedRole={selectedRole}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        handleEdit={handleEdit}
        rerender= {rerender}
      />

      {/* Sign Up User Dialog */}
      <ScrollDialog
        buttonLabel="Sign Up"
        dialogTitle="Sign Up User"
        dialogContent={
          selectedRole === "student" ? (
            <SignUpStudent />
          ) : selectedRole === "instructor" ? (
            <SignUpInstructor />
          ) : (
            <SignUpAdmin />
          )
        }
        scrollType="body"
        actionText1="Cancel"
        actionText2="Confirm"
        open={signUpDialogOpen}
        onClose={() => setSignUpDialogOpen(false)}
      />
    </Box>
  );
};

export default withDashboardWrapper(UserManagement);

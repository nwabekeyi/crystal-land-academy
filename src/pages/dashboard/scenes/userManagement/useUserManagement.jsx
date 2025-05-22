import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector,  useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton,Typography} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { deleteUser } from '../../../../reduxStore/slices/adminDataSlice'; 

const useUserManagement = () => {
  const students = useSelector((state) => state.adminData.usersData.students);
  const instructors = useSelector((state) => state.adminData.usersData.instructors);
  const admins = useSelector((state) => state.adminData.usersData.admins);

  const findUserInStore = (userId) => {
    let user = {};
    if(userId.startsWith('instructor')){
      user = instructors.find(instructor => userId === instructor.instructorId)
    }else if(userId.startsWith( 'student')){
      user = students.find(student => userId === student.studentId);
    }else{
      user = admins.find(admin => userId === admin.userId)

    }
    return user
  };


  const [selectedRole, setSelectedRole] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserDetailsState, setEditUserDetailsState] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [offlineStudents, setOfflineStudents] = useState([]);
  const [viewUserDetails, setViewUserDetails] = useState(false);
  const {callApi: callDeleteApi, loading: deleteLoading, data: deleteData, error: deleteError} = useApi();
  const {callApi: callUpdateApi, loading: updateLoading, data: updateData, error: updaterror} = useApi();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rerender, setRerender]= useState(false);
//role selesct
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSignUpDialogOpen(true);
  };
  useEffect(() => {
    setRerender(!rerender);
  }, [editDialogOpen, signUpDialogOpen]);


  //sort table columns change
  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //open delete confirmation modal
  const handleDeleteOpen = (user) => {
    const foundUser = findUserInStore(user.userId);

    sessionStorage.setItem('selectedUser', JSON.stringify(foundUser))
    setEditUserDetailsState(foundUser);

    setOpenDeleteModal(true);
    console.log(openDeleteModal)
  };


  //open edit user dialog
  const handleEdit = (user) => {
    console.log(user)
    const foundUser = findUserInStore(user.userId);

    sessionStorage.setItem('selectedUser', JSON.stringify(foundUser))
    setEditUserDetailsState(foundUser);

    setProfileImageUrl(user.profilePictureUrl || "");
    setEditDialogOpen(true);

    setSelectedProgram(user.program);

    // const filteredInstructors = userData.filter(
    //   (instructor) =>
    //     instructor.role === "instructor" &&
    //     Array.isArray(instructor.programsAssigned) &&
    //     instructor.programsAssigned.includes(user.program)
    // );

  };

  const handleProgramChange = (program) => {
    setSelectedProgram(program);
  };

  //close confirmation modals
  const handleConfirmationModalClose = () => {
    setConfirmModalOpen(false)
  }


 const handleDelete = async () => {
  // Trigger a rerender before any operation
  const selectedUserInStore = await JSON.parse(sessionStorage.getItem('selectedUser'));
  if (!selectedUserInStore) return;
  try {
      console.log(selectedUserInStore);
    const body = {
      userId: selectedUserInStore.userId,
      role: selectedUserInStore.role,
      courseName: selectedUserInStore.program,
      cohortName: selectedUserInStore.cohort,
    };

    await callDeleteApi(endpoints.USER, "DELETE", body);

    if (deleteData) {
     // Dispatch the deleteUser action to update the Redux store
     dispatch(deleteUser(selectedUserInStore.userId, selectedUserInStore.role));

      sessionStorage.removeItem('selectedUser');
      sessionStorage.setItem('confrimModal', true)
      setOpenDeleteModal(false);
      setSelectedUser(null);
      setRerender(!rerender);
    } else {
      sessionStorage.setItem('confrimModal', true);
      setRerender(!rerender);

    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
 
};

  const columns = [
    { id: "sn", label: "S/N", width: 90 },
    {
      id: "userId",
      label: "User ID",
      width: 100,
      renderCell: (row) => (
        <Typography
          sx={{
            width: "100px", // Adjust the width according to your requirement
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >{`${row.userId}`}</Typography>
      ),
    },
    { id: "name", label: "Name", flex: 1 },
    { id: "phoneNumber", label: "Phone Number", flex: 1 },
    { id: "program", label: "Program", width: 150 },
    { id: "registeredDate", label: "Registered Date", flex: 1 },
    {
      id: "actions",
      label: "Actions",
      width: 200, // Increase the width to fit the new icon
      renderCell: (row) => (
            <div className="action-buttons" style={{ display: 'flex' }}>
              <IconButton
                onClick={() => {
                  handleEdit(row);
                }}
                sx={{
                  fontSize: {
                    xs: '12px',  // Extra small screens (phones)
                    sm: '12px',  // Small screens (tablets)
                    md: '18px',  // Medium screens (desktops)
                    lg: '18px',  // Large screens
                    xl: '18px',  // Extra large screens
                  },
                }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
        
              <IconButton
                onClick={() => {
                  handleDeleteOpen(row);
                }}
                sx={{
                  fontSize: {
                    xs: '12px',  // Extra small screens (phones)
                    sm: '12px',  // Small screens (tablets)
                    md: '18px',  // Medium screens (desktops)
                    lg: '18px',  // Large screens
                    xl: '18px',  // Extra large screens
                  },
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
        
              <IconButton
                onClick={() => {
                  setSelectedUser(row);
                  setViewUserDetails(true);
                }}
                sx={{
                  fontSize: {
                    xs: '12px',  // Extra small screens (phones)
                    sm: '12px',  // Small screens (tablets)
                    md: '18px',  // Medium screens (desktops)
                    lg: '18px',  // Large screens
                    xl: '18px',  // Extra large screens
                  },
                }}
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
            </div>
      
      ),
    },
  ];

  const studentData = students
    .map((user, index) => ({
      id: user.userId,
      sn: index + 1,
      userId:
        user.role === "student"
          ? `${user.studentId}` || "N/A"
          : user.role === "instructor"
          ? user.instructorId || "N/A"
          : user.userId || "N/A",
      name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
      phoneNumber: user.phoneNumber || "N/A",
      program: user.program || "N/A",
      registeredDate: user.createdAt || "N/A",
    }))
    .sort((a, b) => a.sn - b.sn); // Sorting by S/N in ascending order<

    const instructorData = instructors
    .map((user, index) => ({
      id: user.userId,
      sn: index + 1,
      userId:
        user.role === "student"
          ? `${user.studentId}` || "N/A"
          : user.role === "instructor"
          ? user.instructorId || "N/A"
          : user.userId || "N/A",
      name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
      phoneNumber: user.phoneNumber || "N/A",
      program: user.program || "N/A",
      registeredDate: user.createdAt || "N/A",
    }))
    .sort((a, b) => a.sn - b.sn); // Sorting by S/N in ascending order
  
  
  //formattted offline student data
  // const formattedOfflineStudents = offlineStudents
  //   .map((user, index) => ({
  //     id: user.userId,
  //     sn: index + 1,
  //     role: user.role,
  //     userId: user.studentId,
  //     name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
  //     phoneNumber: user.phoneNumber || "N/A",
  //     program: user.program || "N/A",
  //     registeredDate: user.createdAt || "N/A",
  //   }))
  //   .sort((a, b) => a.sn - b.sn); // Sorting by S/N in ascending order

  // const getUniqueProgramsAssigned = () => {
  //   const assignedPrograms = [];
  //   userData.forEach((user) => {
  //     if (user.role === "instructor" && Array.isArray(user.programsAssigned)) {
  //       assignedPrograms.push(...user.programsAssigned);
  //     }
  //   });
  //   return [...new Set(assignedPrograms)];
  // };

  // const programsAssignedOptions = getUniqueProgramsAssigned();

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return {
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
    setSelectedUser,
    editUserDetailsState,
    setEditUserDetailsState,
    openDeleteModal,
    setOpenDeleteModal,
    editDialogOpen,
    setEditDialogOpen,
    signUpDialogOpen,
    setSignUpDialogOpen,
    profileImage,
    setProfileImage,
    profileImageUrl,
    setProfileImageUrl,
    selectedInstructor,
    setSelectedInstructor,
    selectedProgram,
    setSelectedProgram,
    offlineStudents,
    setOfflineStudents,
    handleRoleSelect,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEdit,
    handleProgramChange,
    handleDelete,
    // programsAssignedOptions,
    columns,
    tabIndex,
    handleTabChange,
    instructors,
    viewUserDetails,
    setViewUserDetails,
    confirmModalOpen,
    deleteData,
    loading: deleteLoading || updateLoading,
    handleConfirmationModalClose,
    setConfirmModalOpen,
    rerender,
    deleteError
  };
};

export default useUserManagement;

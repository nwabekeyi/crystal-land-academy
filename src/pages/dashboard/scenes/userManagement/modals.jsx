import {
    Box,
  } from "@mui/material";
  import SignUpForm from "../../../../components/signUp";
  import ScrollDialog from "../../components/scrollDialog";
  import ConfirmationModal from "../../components/confirmationModal";
  import Modal from "../../components/modal";
  import useUserManagement from "./useUserManagement";
  import { useState, useEffect } from "react";
  import useSignUp from "../../../../components/signUp/useSignUp";

const EditFormModal =  ({
    selectedRole,
    editDialogOpen,
    setEditDialogOpen,
    handleEdit,
  }) => {
  const [selectedUser, setSelectedUser] = useState(null);




  useEffect(() => {
    const isConifrm = sessionStorage.getItem("selectedUser");
    if(isConifrm){
      const user = JSON.parse(isConifrm);
      console.log(user)
      setSelectedUser(user);
      console.log(selectedUser)
    }
  }, []);

    return(
        <Box>
            <ScrollDialog
        buttonLabel="Edit User"
        dialogTitle="Edit User"
        dialogContent={
          selectedUser && (
            <SignUpForm role={selectedRole} selectedUser={selectedUser._id} />
          )
        }
        scrollType="body"
        actionText1="Cancel"
        actionText2="Confirm"
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={handleEdit}
      />
        </Box>
    )
  }

  const DeleteModal = ({
    open,
    onClose
  }) => {
    const { handleDelete, loading, deleteData, rerender, deleteError } = useUserManagement();
    const [confirmModal, setConfirmModal] = useState(false);

    useEffect(() => {
      const isConifrm = sessionStorage.getItem("confrimModal");
      if(isConifrm){
        setConfirmModal(isConifrm);
        console.log(confirmModal)
      }
    }, [rerender]);

    const handleConfirmModalClose =() => {
      setConfirmModal(false);
      sessionStorage.removeItem("confrimModal");
    }

    return (
      <>
        <Modal
          open={open}  // Use the destructured `open` prop
          onClose={onClose}  // This assumes `onClose` was passed as part of `open`, ensure this is correct
          title="Confirm delete"
          onConfirm={handleDelete}
        >
          <p>
            Confirm deletion of user.{' '}
            <span style={{ color: '#EB433D', fontWeight: '900', fontSize: 'large' }}>
              Kindly note that this cannot be reversed
            </span>
          </p>
        </Modal>
  
        {/* Confirmation modal for success or error */}
        <ConfirmationModal
          open={confirmModal && confirmModal}  // Use the destructured `confirmModal` prop
          isLoading={loading}
          onClose={handleConfirmModalClose}
          title="Delete confirmation"
          message={
            deleteData ? 'User successfully deleted' : deleteError
          }
        />
      </>
    );
  };
  

  export {EditFormModal, DeleteModal}
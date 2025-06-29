import {
  Box,
  Typography,
} from "@mui/material";
import SignUpForm from "../../../../components/signUp";
import ScrollDialog from "../../components/scrollDialog";
import Modal from "../../components/modal";
import useUserManagement from "./useUserManagement";
import { useState, useEffect } from "react";

const EditFormModal = ({
  selectedRole,
  editDialogOpen,
  setEditDialogOpen,
  handleEdit,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const isConfirm = sessionStorage.getItem("selectedUser");
    if (isConfirm) {
      const user = JSON.parse(isConfirm);
      console.log(user);
      setSelectedUser(user);
    }
  }, []);

  return (
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
  );
};

const DeleteModal = ({ open, onClose }) => {
  const { handleDelete, loading, deleteData, rerender, deleteError } =
    useUserManagement();
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    const isConfirm = sessionStorage.getItem("confirmModal");
    if (isConfirm) {
      setConfirmModal(isConfirm);
    }
  }, [rerender]);

  const handleConfirmModalClose = () => {
    setConfirmModal(false);
    sessionStorage.removeItem("confirmModal");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
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

      <Modal
        open={confirmModal && confirmModal}
        onClose={handleConfirmModalClose}
        title="Delete Confirmation"
        onConfirm={handleConfirmModalClose}
      >
        <p>{deleteData ? 'User successfully deleted' : deleteError}</p>
      </Modal>
    </>
  );
};

const WithdrawModal = ({ open, onClose, onConfirm, userName }) => {
  const { withdrawLoading, withdrawError, withdrawData, rerender } = useUserManagement();
  const [resultModalOpen, setResultModalOpen] = useState(false);

  useEffect(() => {
    const isConfirm = sessionStorage.getItem("confirmWithdrawModal");
    if (isConfirm) {
      setResultModalOpen(isConfirm);
    }
  }, [rerender]);

  const handleResultModalClose = () => {
    setResultModalOpen(false);
    sessionStorage.removeItem("confirmWithdrawModal");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Confirm Student Withdrawal"
        onConfirm={() => {
          onConfirm();
          sessionStorage.setItem("confirmWithdrawModal", "true");
        }}
      >
        <p>
          Are you sure you want to withdraw <strong>{userName}</strong>?{' '}
          <span style={{ color: '#EB433D', fontWeight: '900', fontSize: 'large' }}>
            This action will mark the student as withdrawn and remove them from their class and academic year.
          </span>
        </p>
      </Modal>

      <Modal
        open={resultModalOpen && resultModalOpen}
        onClose={handleResultModalClose}
        title="Withdraw Confirmation"
        onConfirm={handleResultModalClose}
      >
        <p>{withdrawData ? 'Student successfully withdrawn' : withdrawError || 'An error occurred'}</p>
      </Modal>
    </>
  );
};

export { EditFormModal, DeleteModal, WithdrawModal };
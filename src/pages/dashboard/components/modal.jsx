import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../theme';

// Slide transition function
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
  open,
  onClose,
  title,
  children,
  styleProps,
  onConfirm,
  confirmText = "Confirm", // Changed from confirmMessage to align with SchoolActivities
  onCancel,
  cancelText = "Cancel",
  showCancel = true,
  noConfirm = false,
  transition = Transition,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { backgroundColor, color, padding, overflowY, ...customStyles } = styleProps || {};

  // Handle confirm button action
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  // Handle cancel button action
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose(); // Fallback to onClose if no onCancel provided
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={transition}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: theme.palette.mode === 'dark' ? '#141B2D' : "#fff",
          color: color || theme.palette.text.primary,
          padding: padding || theme.spacing(2),
          overflowY: overflowY || 'visible',
          borderRadius: '12px',
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5)`,
          ...customStyles,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.3em' }}>
        {title}
        <IconButton onClick={onClose} sx={{ color: colors.primary[100] }} title="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
      
      <DialogActions>
        {showCancel && (
          <Button
            onClick={handleCancel}
            sx={{
              fontWeight: '700',
              fontSize: '1em',
              color: theme.palette.mode === 'light' ? colors.grey[500] : colors.redAccent[500],
              border: `2px solid ${theme.palette.mode === 'light' ? 'none' : colors.redAccent[500]}`,
              borderRadius: '8px',
              padding: theme.spacing(1, 3),
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? colors.redAccent[200] : colors.redAccent[500],
                color: 'white',
              },
              boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {cancelText}
          </Button>
        )}
        {!noConfirm && (
          <Button
            onClick={handleConfirm}
            sx={{
              fontWeight: '700',
              fontSize: '1em',
              color: theme.palette.mode === 'light' ? colors.grey[500] : colors.greenAccent[500],
              border: `2px solid ${theme.palette.mode === 'light' ? 'none' : colors.greenAccent[500]}`,
              borderRadius: '8px',
              padding: theme.spacing(1, 3),
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? colors.blueAccent[200] : colors.greenAccent[500],
                color: 'white',
              },
              boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
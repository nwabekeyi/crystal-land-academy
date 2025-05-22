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
  confirmMessage,
  noConfirm,
  transition = Transition, // Default transition is Slide
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={transition} // Apply transition (Slide by default)
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: theme.palette.mode === 'dark' ? '#141B2D' : "#fff",
          color: color || theme.palette.text.primary,
          padding: padding || theme.spacing(2), // Ensure sufficient padding
          overflowY: overflowY || 'visible',
          borderRadius: '12px', // Add rounded borders
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5)`, // Add box shadow
          ...customStyles,
        },
      }}
    >
      {/* Title with close button */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:'1.3em' }}>
        {title}
        <IconButton onClick={onClose} sx={{ color: colors.primary[100] }} title="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
      
      <DialogActions>
        {/* No need for a cancel button text, using X icon */}
        {!noConfirm && (
          <Button
            onClick={handleConfirm}
            sx={{
              fontWeight: '700',
              fontSize: '1em',
              color: theme.palette.mode === 'light'
              ?  colors.grey[500] 
              : colors.greenAccent[500],
              border: `2px solid ${theme.palette.mode === 'light'
                ?  'none'
                : colors.greenAccent[500]}`,
              borderRadius: '8px',
              padding: theme.spacing(1, 3),
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                ?  colors.blueAccent[200] 
                : colors.greenAccent[500],
                color: 'white',
              },

              boxShadow:'0px 0px 4px rgba(0, 0, 0, 0.5)' // Lighter shadow for light mode
            }}
          >
            {confirmMessage || 'Confirm'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;

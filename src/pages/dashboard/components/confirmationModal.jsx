import { CircularProgress, Typography, Box} from '@mui/material';
import Modal from './modal';



const ConfirmationModal = ({ isLoading, message, open, onClose, title}) => {
  return (
    <Modal open={open} onClose={onClose} title={title} noConfirm>

        {
            isLoading ? <Box sx={{
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%'
            }}> <CircularProgress /> </Box>:
            <Typography>
            {message}
          </Typography>
        }
   
  </Modal>
  );
};

export default ConfirmationModal

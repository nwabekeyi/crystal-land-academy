import { Box, Button, TextField, Typography, Alert, MenuItem, FormControl, InputLabel, Select, CircularProgress, Modal, Backdrop, Fade, useTheme  } from '@mui/material';
import useSignUp from './useSignUp';
import ConfirmationModal from "../../pages/dashboard/components/confirmationModal";
import { tokens } from '../../pages/dashboard/theme';
import Loader from '../../utils/loader';
import ActionButton from '../../pages/dashboard/components/actionButton';

const SignUpForm = ({ role, offline, selectedUser }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {
        roleFields,
        error,
        loadingCohorts,
        handleProgramChange,
        handleCohortChange,
        handleChange,
        handleSubmit,
        formData,
        formRef,
        assignedInstructor,
        modalOpen,
        modalMessage,
        setModalOpen,
        loading
    } = useSignUp({ offline, role, selectedUser });


    const handleCloseModal = () => {
        setModalOpen(false);
    };

    if(loading) {
    return <div>
        <Loader />
        </div> 
    }else{
         return (
          <Box>
            <Typography variant="h4">
                Sign Up ({role.charAt(0).toUpperCase() + role.slice(1)})
            </Typography>
            <form onSubmit={handleSubmit} ref={formRef}>
                {roleFields[role].map((field) => (
                    <Box key={field.name} mb={2}>
                        {field.name === 'assignedInstructor' ? (
                            <TextField
                                label={field.label}
                                name={field.name}
                                value={assignedInstructor}
                                disabled
                                fullWidth
                            />
                        ) : field.name === 'cohort' ? (
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={formData[field.name]}
                                    onChange={handleCohortChange}
                                    required={field.required}
                                >
                                    {loadingCohorts ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={24} />
                                        </MenuItem>
                                    ) : (
                                        field.options && field.options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        ) : field.type === 'select' ? (
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={formData[field.name]}
                                    onChange={handleProgramChange}
                                    required={field.required}
                                >
                                    {field.options && field.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : field.type === 'file' ? (
                            <Box mb={2}>
                                <input
                                    type="file"
                                    name={field.name}
                                    id={field.name}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={{ display: 'block', width: '100%' }}
                                />
                            </Box>
                        ) : (
                            <TextField
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                fullWidth
                            />
                        )}
                    </Box>
                ))}
                {error && <Alert severity="error">{error}</Alert>}
                <ActionButton 
                content= {selectedUser ? 'Update' : 'Sign Up'} 
                submit />
                    
            </form>

            {/* Modal */}
            <ConfirmationModal
                open={modalOpen}
                message= {modalMessage}
                title= 'User registration confrimation'
                onClose={handleCloseModal}

               />

        </Box>
    );
}
};

export default SignUpForm;

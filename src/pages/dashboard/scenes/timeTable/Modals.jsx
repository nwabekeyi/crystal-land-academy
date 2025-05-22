import { useState, useEffect } from 'react';
import Modal from '../../components/modal';
import useApi from '../../../../hooks/useApi';
import Loader from '../../../../utils/loader';
import { endpoints } from '../../../../utils/constants';
import { Box, Typography, Button, Avatar } from '@mui/material';
import ConfirmationModal from '../../components/confirmationModal';

const AttendanceModal = ({
  openAttendanceModal,
  handleAttendanceModalClose,
  timeTable,
  cohortName
}) => {
  const [students, setStudents] = useState([]);
  const [confirmation, setConfirmation] = useState(false)

  const { loading: studentLoading, error: studentError, callApi: getStudents } = useApi();
  const { loading: submitLoading, error: submitError, callApi: markAttendance, data } = useApi();

  useEffect(() => {
    const fetchStudents = async () => {
      const studentData = await getStudents(`${endpoints.COHORT}/students/${cohortName}`);
      if (studentData && studentData.students) {
        setStudents(studentData.students);
        setConfirmation(true);
      }else{
        setConfirmation(true);
      }
    };
    fetchStudents();
  }, [cohortName]);

  //close confrimation modal
  const handleConfirmModalClose = () => {
    setConfirmation(false);

  }

  const handleMarkAttendance = async (studentId) => {
    const body = { 
      studentId, 
      cohortName, 
      timeTableId: timeTable.id // Ensure timeTableId is passed correctly
    };
    await markAttendance(endpoints.MARK_ATTENDANCE, 'PATCH', body);
  };

  // Function to check if attendance is already marked for the student
  const isAttendanceMarked = (studentId) => {
    return timeTable?.attendance?.includes(studentId); // Check if studentId is in the attendance array
  };

  return (
    <Modal
      open={openAttendanceModal}
      onClose={handleAttendanceModalClose}
      title="Mark Attendance"
      noConfirm
      confirmMessage="Attendance"
    >
      {studentLoading ? (
        <Loader />
      ) : (
        students.map((student) => (
          <Box
            key={student.userId}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            p={2}
            borderRadius="4px"
            border="1px solid #ccc"
          >
            <Box display="flex" alignItems="center">
              <Avatar
                src={student.profilePicture}  // Assuming student object contains a profilePicture field
                alt={student.firstName}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Typography variant="h6">{student.firstName} {student.lastName}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleMarkAttendance(student.userId)}
              disabled={isAttendanceMarked(student.userId) || submitLoading} // Disable if already marked
            >
              {isAttendanceMarked(student.userId) ? 'Attendance Marked' : (submitLoading ? 'Marking...' : 'Mark Attendance')}
            </Button>
          </Box>
        ))
      )}

    <ConfirmationModal
        open={confirmation}
        onClose={handleConfirmModalClose}
        title= 'Confirmation marked attendance'
        isLoading= {submitLoading}
        message= {data.message }

      >
        
      </ConfirmationModal>
      {studentError && <Typography color="error">{studentError}</Typography>}
    </Modal>
  );
};

export {
  AttendanceModal
};

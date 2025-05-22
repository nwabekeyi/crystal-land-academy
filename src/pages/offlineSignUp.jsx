import SignUpForm from "../components/signUp";
import {
  Box
  
} from "@mui/material";



const OfflineSignUp = () => {
   

    return (
      <Box sx={{backgroundColor:'#fff', padding: '10Vw'}}>
        <SignUpForm offline role="student" />
      </Box>
    );
};

export default OfflineSignUp;
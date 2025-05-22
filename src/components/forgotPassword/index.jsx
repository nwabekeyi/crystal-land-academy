import { useState, useEffect } from "react";
import { TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../components/loadingButton"; 
import useApi from "../../hooks/useApi"; 
import Footer from '../../pages/homePage/components/Footer';
import NavBar from '../../pages/homePage/components/Header';
import { endpoints } from '../../utils/constants';
import BackgroundWithHOme from "../backgroundWithHome";

const SmapleComponent = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [linkSent, setLinkSent] = useState(false); // Track reset link status
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0); // Countdown timer state
  const { data, loading, error: apiError, callApi } = useApi();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    let timer;
    if (linkSent && countdown > 0) {
      // Start the countdown if linkSent is true
      timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          if (newCountdown <= 0) {
            setLinkSent(false); // Enable the button after countdown ends
          }
          return newCountdown;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Clear the interval when component unmounts or countdown finishes
  }, [linkSent, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      return setMessage("Please enter your email");
    }

    const response = await callApi(endpoints.PASSWORD_LINK, "POST", { email });

    if (response && response.message && response.message === 'Password reset link sent successfully') {
      setMessage("Password reset link sent. Kindly check your email!");
      setEmail('');
      setLinkSent(true);
      setCountdown(60); // Set countdown to 60 seconds
    } else {
      setError("Password link not sent, something went wrong or you can check if your email is correctly inputted");
    }
  };

  return (
    <Box>
      <NavBar />
      <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "30px",
    mx: { xs: 4, sm: 4, md: 0 }, // mx of 4 on extra-small and small devices (phone and tablet), no margin on medium and larger screens
  }}
>

        <Box
          sx={{
            p: 3,
            textAlign: "start",
            backgroundColor: "white",
            boxShadow: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" color="#000" gutterBottom>
            Forgot your password?
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Enter your email and we will send you a password reset link.
          </Typography>

          {message && <Alert severity="success">{message}</Alert>}
          {apiError && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              isLoading={loading}
              disabled={linkSent} // Disable button when linkSent is true
              sx={{
                filter: linkSent ? "blur(0.1px)" : "none", // Apply blur effect when linkSent is true
                cursor: linkSent ? "not-allowed" : "pointer",
              }}
            >
              {linkSent ? "Reset Link Sent" : "Request Reset Link"}
            </LoadingButton>
          </form>

          {/* Display countdown only when linkSent is true */}
          {linkSent && countdown > 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: "center" }}>
              You can resend the link in {countdown} seconds.
            </Typography>
          )}

          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
            onClick={() => navigate("/signin")}
          >
            Back to Login
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

const ForgotPassword = BackgroundWithHOme(SmapleComponent);

export default ForgotPassword;
